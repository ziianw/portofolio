import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Converts **text** markdown to HTML with <strong> tags.
 * Safe untuk digunakan dengan dangerouslySetInnerHTML karena kita kontrol kontennya.
 */
export function formatBold(text: string): string {
  return text.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold">$1</strong>');
}
