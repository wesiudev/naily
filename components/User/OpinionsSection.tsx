"use client";
import { useEffect, useMemo, useState } from "react";
import {
  addUserOpinion,
  setUserOpinionReply,
  subscribeToUserOpinions,
  auth,
} from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { FaStar } from "react-icons/fa";

type Opinion = {
  id: string;
  rating: number;
  text: string;
  isAnonymous?: boolean;
  authorName?: string | null;
  createdAt?: any;
  reply?: { text: string; createdAt?: any } | null;
};

export default function OpinionsSection({
  profileUid,
}: {
  profileUid: string;
}) {
  const [opinions, setOpinions] = useState<Opinion[]>([]);
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [authorName, setAuthorName] = useState("");
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    if (!profileUid) return;
    const unsub = subscribeToUserOpinions(profileUid, setOpinions);
    return () => unsub();
  }, [profileUid]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setIsOwner(Boolean(u?.uid && u.uid === profileUid));
    });
    return () => unsub();
  }, [profileUid]);

  async function submitOpinion() {
    if (!profileUid || !text.trim()) return;
    await addUserOpinion(profileUid, {
      rating,
      text: text.trim(),
      isAnonymous,
      authorName: isAnonymous ? null : authorName || null,
    });
    setText("");
    setAuthorName("");
    setRating(5);
    setIsAnonymous(true);
  }

  async function submitReply(opinionId: string, replyText: string) {
    if (!profileUid || !isOwner || !replyText.trim()) return;
    await setUserOpinionReply(profileUid, opinionId, {
      text: replyText.trim(),
    });
  }

  const average = useMemo(() => {
    if (!opinions.length) return 0;
    const sum = opinions.reduce((s, o) => s + (Number(o.rating) || 0), 0);
    return Math.round((sum / opinions.length) * 10) / 10;
  }, [opinions]);

  return (
    <div className="bg-white rounded-xl p-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-zinc-800 font-baloo">
          Opinie
        </h2>
        <div className="flex items-center gap-2 text-sm text-neutral-700">
          <div className="flex items-center text-yellow-500">
            {Array.from({ length: 5 }).map((_, i) => (
              <FaStar
                key={i}
                className={i < Math.round(average) ? "" : "opacity-30"}
              />
            ))}
          </div>
          <span>
            {average}/5 • {opinions.length} opinii
          </span>
        </div>
      </div>

      {/* Create opinion */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm text-neutral-700">Twoja ocena:</span>
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <button
                key={i}
                onClick={() => setRating(i + 1)}
                className="text-yellow-500"
                aria-label={`Oceń na ${i + 1}`}
              >
                <FaStar className={i < rating ? "" : "opacity-30"} />
              </button>
            ))}
          </div>
        </div>
        <textarea
          className="w-full border border-neutral-300 rounded-md p-2 text-sm mb-2"
          rows={3}
          placeholder="Napisz swoją opinię…"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="flex items-center justify-between gap-2">
          <label className="flex items-center gap-2 text-sm text-neutral-700">
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
            />
            Anonimowo
          </label>
          {!isAnonymous && (
            <input
              className="border border-neutral-300 rounded-md px-2 py-1 text-sm"
              placeholder="Twoje imię i nazwisko (opcjonalnie)"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
            />
          )}
          <button
            onClick={submitOpinion}
            className="ml-auto px-3 py-1.5 rounded-md bg-primary-600 text-white text-sm"
          >
            Dodaj opinię
          </button>
        </div>
      </div>

      {/* Opinions list */}
      <div className="space-y-4">
        {opinions.map((o) => (
          <OpinionItem
            key={o.id}
            opinion={o}
            canReply={isOwner}
            onReply={(t) => submitReply(o.id, t)}
          />
        ))}
        {!opinions.length && (
          <p className="text-sm text-neutral-600">
            Brak opinii. Bądź pierwszą osobą, która doda opinię.
          </p>
        )}
      </div>
    </div>
  );
}

function OpinionItem({
  opinion,
  canReply,
  onReply,
}: {
  opinion: Opinion;
  canReply: boolean;
  onReply: (text: string) => void;
}) {
  const [reply, setReply] = useState("");
  return (
    <div className="border border-neutral-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="flex text-yellow-500">
            {Array.from({ length: 5 }).map((_, i) => (
              <FaStar
                key={i}
                className={
                  i < (Number(opinion.rating) || 0) ? "" : "opacity-30"
                }
              />
            ))}
          </div>
          <span className="text-sm text-neutral-700">
            {opinion.isAnonymous
              ? "Anonimowo"
              : opinion.authorName || "Użytkownik"}
          </span>
        </div>
      </div>
      <p className="text-sm text-neutral-800 mb-3 whitespace-pre-line">
        {opinion.text}
      </p>
      {opinion.reply ? (
        <div className="mt-3 border-l-2 border-primary-200 pl-3">
          <p className="text-xs text-neutral-500 mb-1">Odpowiedź właściciela</p>
          <p className="text-sm text-neutral-800 whitespace-pre-line">
            {opinion.reply.text}
          </p>
        </div>
      ) : (
        canReply && (
          <div className="mt-2 flex items-center gap-2">
            <input
              className="border border-neutral-300 rounded-md px-2 py-1 text-sm flex-1"
              placeholder="Napisz odpowiedź"
              value={reply}
              onChange={(e) => setReply(e.target.value)}
            />
            <button
              onClick={() => {
                if (reply.trim()) onReply(reply);
                setReply("");
              }}
              className="px-3 py-1.5 rounded-md bg-neutral-800 text-white text-sm"
            >
              Odpowiedz
            </button>
          </div>
        )
      )}
    </div>
  );
}
