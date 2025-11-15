"use client";
import { FaFacebookF, FaInstagram, FaLink } from "react-icons/fa";
import { useState } from "react";

export default function ShareButtons({
  url,
  title,
}: {
  url: string;
  title?: string;
}) {
  const [copied, setCopied] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title || "");

  const shareOnFacebook = () => {
    const fb = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`;
    window.open(fb, "_blank", "noopener,noreferrer");
  };

  const shareOnInstagram = async () => {
    // Instagram does not support classic web share links; try Web Share API first
    if (navigator.share) {
      try {
        await navigator.share({ url, title });
        return;
      } catch {
        // fallthrough to copy
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      // Best-effort: open Instagram homepage; users can paste the link in bio/story/messages
      window.open(
        "https://www.instagram.com/",
        "_blank",
        "noopener,noreferrer"
      );
    } catch {
      // noop
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className="flex items-center gap-2 w-full flex-wrap">
      <button
        onClick={copyLink}
        className="px-3 py-2 rounded-md bg-neutral-200 text-neutral-800 text-sm flex items-center gap-2 hover:bg-neutral-300"
        aria-label="Kopiuj link"
      >
        <FaLink /> {copied ? "Skopiowano" : "Kopiuj"}
      </button>
      <button
        onClick={shareOnFacebook}
        className="px-3 py-2 rounded-md bg-[#1877F2] text-white text-sm flex items-center gap-2 hover:opacity-90"
        aria-label="Udostępnij na Facebooku"
      >
        <FaFacebookF /> Facebook
      </button>
      <button
        onClick={shareOnInstagram}
        className="px-3 py-2 rounded-md bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-white text-sm flex items-center gap-2 hover:opacity-90"
        aria-label="Udostępnij na Instagramie"
      >
        <FaInstagram /> Instagram
      </button>
    </div>
  );
}
