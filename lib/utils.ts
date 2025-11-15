import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function randId(length: number, chars: string) {
  let result = "";
  const charactersLength = chars.length;
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

// Formats an integer amount of grosze (cents) into a Polish złoty string
// Example: 4999 -> "49,99"
export function formatPLNFromCents(cents: number): string {
  if (typeof cents !== "number" || isNaN(cents)) return "0,00";
  const value = cents / 100;
  return value.toLocaleString("pl-PL", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
