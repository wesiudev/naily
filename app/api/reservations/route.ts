import { NextRequest, NextResponse } from "next/server";
import { addDocument, getDocuments, addUserNotification } from "@/firebase";
import { randomUUID } from "crypto";

type CreateReservationBody = {
  specialistUid?: string;
  specialistName?: string;
  serviceName?: string;
  customerPhone: string;
  sourceSlug?: string;
  preferredDate?: string;
  preferredTime?: string;
  notes?: string;
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const specialistUid = searchParams.get("specialistUid");
    const phone = searchParams.get("phone");

    const all = (await getDocuments("reservations")) as any[];
    const filtered = all.filter((r) => {
      const bySpec = specialistUid ? r.specialistUid === specialistUid : true;
      const byPhone = phone ? r.customerPhone === phone : true;
      return bySpec && byPhone;
    });
    // newest first
    filtered.sort((a: any, b: any) => (a.createdAt < b.createdAt ? 1 : -1));
    return NextResponse.json(filtered);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as CreateReservationBody;
    if (!body?.customerPhone) {
      return NextResponse.json(
        { error: "Missing customerPhone" },
        { status: 400 }
      );
    }
    if (!body.specialistUid && !body.specialistName) {
      return NextResponse.json(
        { error: "Provide specialistUid or specialistName" },
        { status: 400 }
      );
    }

    const id = `res_${randomUUID()}`;
    const reservation = {
      id,
      specialistUid: body.specialistUid,
      specialistName: body.specialistName,
      serviceName: body.serviceName || "Konsultacja",
      customerPhone: body.customerPhone,
      sourceSlug: body.sourceSlug,
      preferredDate: body.preferredDate || null,
      preferredTime: body.preferredTime || null,
      notes: body.notes || null,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    await addDocument("reservations", id, reservation);

    // Create notification for the specialist
    if (body.specialistUid) {
      try {
        const serviceDisplayName = body.serviceName || "Konsultacja";
        const dateTimeInfo = body.preferredDate 
          ? ` na ${body.preferredDate}${body.preferredTime ? ` o ${body.preferredTime}` : ""}`
          : "";
        
        await addUserNotification(body.specialistUid, {
          type: "reservation_request",
          title: "Zatwierdź rezerwację",
          message: `${serviceDisplayName}${dateTimeInfo} - ${body.customerPhone}`,
          reservationId: id,
          isRead: false,
          isDeleted: false,
          createdAt: new Date().toISOString(),
        });
      } catch (notificationError) {
        console.error("Error creating notification:", notificationError);
        // Don't fail the reservation creation if notification fails
      }
    }

    return NextResponse.json({ id }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
