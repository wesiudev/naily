"use client";

export default function JoinNowButton() {
  const go = () => {
    if (typeof window !== "undefined") {
      window.location.href = "/kreator-profilu";
    }
  };
  return (
    <button
      onClick={go}
      className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 transform group/btn"
    >
      <span className="flex items-center justify-center gap-2">
        Wypróbuj za darmo
      </span>
    </button>
  );
}
