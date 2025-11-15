import { Payment, User } from "@/types";
import Image from "next/image";
import React from "react";
import paymentsImage from "../../../public/payment.png";
import { formatPLNFromCents } from "@/lib/utils";
export default function PaymentSettings({
  user,
  setProfileEditOpen,
  setPricingOpen,
}: {
  user: User;
  setProfileEditOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setPricingOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <div
      className={`${
        user?.payments?.length > 0 ? "" : "h-[50vh]"
      } w-full flex justify-center items-center bg-gray-200 rounded-md`}
    >
      {user?.payments?.length > 0 ? (
        <div className="space-y-4 w-full p-6">
          {user.payments.map((payment: Payment, index: number) => (
            <div
              key={index}
              className="w-full flex justify-between items-start p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-sm"
            >
              <div>
                <p className="text-lg font-medium text-gray-800">
                  Suma: {formatPLNFromCents(payment.amount)}zł
                </p>
                <p className="text-sm text-gray-600">
                  Data: {new Date(payment.date).toLocaleDateString()}
                </p>
              </div>
              <span
                className={`px-3 py-1 text-sm font-medium rounded-full ${
                  payment.result === "paid"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {payment.result === "paid" ? "Opłacone" : "Nieopłacone"}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center flex flex-col items-center justify-center py-10">
          <Image
            src={paymentsImage}
            alt="Obraz płatności"
            className="w-[100px] mb-3 opacity-30"
          />
          <p className="text-lg font-medium text-gray-500 italic">
            Brak nadchodzących płatności.
          </p>
          <p className="text-sm text-gray-500 italic">
            Wszystkie informacje o płatnościach pojawią się tutaj.
          </p>
          <button
            onClick={() => {
              setProfileEditOpen(false);
              setPricingOpen(true);
            }}
            className="pb-8 relative flex flex-col mt-4 rounded-md px-4 py-2 bg-red-500 duration-150 hover:bg-red-600 text-white font-bold"
          >
            Naily Premium
            <div className="mx-auto flex flex-row items-end absolute bottom-0 left-1/2 -translate-x-1/2 rounded-t-md bg-red-600 text-white p-1 px-2">
              <span className="font-light text-sm block text-gray-200">
                100zł
              </span>
              <span className="block font-light text-sm text-gray-200">
                /miesiąc
              </span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
