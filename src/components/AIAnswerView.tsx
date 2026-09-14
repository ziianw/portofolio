import { CornerDownRight } from "lucide-react";
import { formatBold } from "@/lib/utils";
import type { AIAnswer } from "@/lib/local-ai";

interface Props {
  answer: AIAnswer;
  /** Dipanggil saat user mengklik chip pertanyaan lanjutan */
  onChip?: (question: string) => void;
  /** Nonaktifkan chip saat AI masih "mengetik" */
  chipsDisabled?: boolean;
}

/**
 * Merender jawaban AI dalam bentuk KOTAK-KOTAK:
 * - `lead`   → satu balon pembuka, maksimal 2 baris
 * - `boxes`  → tiap kotak jadi kartu terpisah dengan judul + poin-poin
 * - `chips`  → tombol pertanyaan lanjutan supaya user menggali per bagian,
 *              bukan disuguhi seluruh data sekaligus
 */
export default function AIAnswerView({ answer, onChip, chipsDisabled }: Props) {
  const hasBoxes = !!answer.boxes?.length;
  // Jaga-jaga: hindari chip kembar walau data sumbernya duplikat.
  const chips = Array.from(new Set(answer.chips ?? []));

  return (
    <div className={`min-w-0 ${hasBoxes ? "w-full" : "max-w-[85%]"}`}>
      {/* ── Pembuka ── */}
      {answer.lead && (
        <div
          className={`glass rounded-2xl rounded-tl-md px-4 py-2.5 text-sm leading-relaxed ${
            hasBoxes ? "mb-2.5" : ""
          }`}
          dangerouslySetInnerHTML={{ __html: formatBold(answer.lead) }}
        />
      )}

      {/* ── Kotak-kotak isi ── */}
      {hasBoxes && (
        <div className="space-y-2">
          {answer.boxes!.map((box, boxIdx) => (
            <div
              key={boxIdx}
              className="rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-3"
            >
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-primary">
                {box.title}
              </p>
              <ul className="space-y-1.5">
                {box.items.map((item, itemIdx) => (
                  <li key={itemIdx} className="flex gap-2">
                    <span className="mt-[3px] shrink-0 text-[10px] leading-none text-primary/60">
                      ▸
                    </span>
                    <span
                      className="text-[13px] leading-relaxed text-foreground/85"
                      dangerouslySetInnerHTML={{ __html: formatBold(item) }}
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* ── Chip pertanyaan lanjutan ── */}
      {!!chips.length && onChip && (
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {chips.map((chip, chipIdx) => (
            <button
              key={chipIdx}
              type="button"
              onClick={() => onChip(chip)}
              disabled={chipsDisabled}
              className="inline-flex items-center gap-1 rounded-lg border border-primary/25 bg-primary/10 px-2.5 py-1.5 text-[11px] leading-tight text-left text-foreground/80 transition hover:border-primary/50 hover:bg-primary/20 hover:text-foreground active:scale-95 disabled:opacity-40"
            >
              <CornerDownRight className="h-3 w-3 shrink-0 text-primary/70" />
              {chip}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
