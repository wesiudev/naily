"use client";
import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { createInvite, listInvites, updateInvite } from "@/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function AdminInvitesPage() {
  const [quantity, setQuantity] = useState<number>(10);
  const [generated, setGenerated] = useState<string[]>([]);
  const [invites, setInvites] = useState<any[]>([]);
  const [batchName, setBatchName] = useState<string>("");
  const [aliasPrefix, setAliasPrefix] = useState<string>("");

  async function generate() {
    const links: string[] = [];
    const batchId = uuidv4();
    for (let i = 0; i < quantity; i++) {
      const id = uuidv4();
      const alias = aliasPrefix ? `${aliasPrefix}-${i + 1}` : null;
      await createInvite(id, {
        type: "manicure-pricing",
        batchId,
        batchName: batchName || null,
        alias,
      });
      const slug = alias || id;
      links.push(`${process.env.NEXT_PUBLIC_URL ?? ""}/invite/${slug}`);
    }
    setGenerated(links);
    await refresh();
  }

  async function refresh() {
    const all = await listInvites();
    setInvites(all.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0)));
  }

  async function saveName(id: string, name: string) {
    await updateInvite(id, { name });
    await refresh();
  }

  async function setStatus(id: string, status: string) {
    await updateInvite(id, { status });
    await refresh();
  }

  useEffect(() => {
    refresh();
  }, []);

  return (
    <div className="container-professional py-6">
      <Card>
        <CardHeader>
          <CardTitle>Zaproszenia dla profesjonalistów (manicure)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Zaproszenia służą do rejestracji i stworzenia darmowego cennika
            manicure.
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 items-end">
            <div>
              <label className="text-xs text-muted-foreground">Liczba</label>
              <Input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value || "0"))}
                className=""
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">
                Nazwa serii (opcjonalnie)
              </label>
              <Input
                value={batchName}
                onChange={(e) => setBatchName(e.target.value)}
                placeholder="np. Sierpień-Influencerzy"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">
                Alias prefix (opcjonalnie)
              </label>
              <Input
                value={aliasPrefix}
                onChange={(e) =>
                  setAliasPrefix(e.target.value.replace(/\s+/g, "-"))
                }
                placeholder="np. sierpien"
              />
              <div className="text-[10px] text-muted-foreground mt-1">
                {"Link będzie miał postać: /invite/{alias}-{nr}"}
              </div>
            </div>
            <div>
              <Button onClick={generate} className="w-full">
                Wygeneruj
              </Button>
            </div>
          </div>
          {generated.length > 0 && (
            <div className="space-y-2">
              {generated.map((l) => (
                <div
                  key={l}
                  className="flex items-center justify-between p-2 rounded border"
                >
                  <span className="truncate mr-3">{l}</span>
                  <Badge
                    onClick={() => navigator.clipboard.writeText(l)}
                    className="cursor-pointer"
                  >
                    Kopiuj
                  </Badge>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6">
            <div className="font-semibold mb-2">Wszystkie zaproszenia</div>
            <div className="space-y-2">
              {invites.map((inv) => (
                <div
                  key={inv.id}
                  className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 p-2 border rounded"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-sm truncate">{`${
                      process.env.NEXT_PUBLIC_URL ?? ""
                    }/invite/${inv.alias || inv.id}`}</div>
                    <div className="text-xs text-muted-foreground">
                      status: {inv.status ?? "pending"} • utworzone:{" "}
                      {inv.createdAt
                        ? new Date(inv.createdAt).toLocaleString()
                        : "-"}
                      {inv.batchName && ` • seria: ${inv.batchName}`}
                      {inv.usedBy && `(użyte przez ${inv.usedBy})`}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      className="border rounded px-2 py-1 text-sm"
                      placeholder="Imię i nazwisko"
                      defaultValue={inv.name ?? ""}
                      onBlur={(e) => saveName(inv.id, e.target.value)}
                    />
                    <input
                      className="border rounded px-2 py-1 text-sm"
                      placeholder="Alias linku (opcjonalnie)"
                      defaultValue={inv.alias ?? ""}
                      onBlur={(e) =>
                        updateInvite(inv.id, { alias: e.target.value || null })
                      }
                    />
                    <Badge
                      className="cursor-pointer"
                      onClick={() =>
                        navigator.clipboard.writeText(
                          `${process.env.NEXT_PUBLIC_URL ?? ""}/invite/${
                            inv.alias || inv.id
                          }`
                        )
                      }
                    >
                      Kopiuj
                    </Badge>
                    {inv.status !== "used" && (
                      <Badge
                        className="cursor-pointer"
                        onClick={() => setStatus(inv.id, "used")}
                      >
                        Oznacz jako użyte
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
