import { renderMarkdown } from "@/utils/parseMarkdown";
import type { FaqItem } from "@/types";

export default function FAQ({
  items,
  className,
}: {
  items: FaqItem[];
  className?: string;
}) {
  if (!Array.isArray(items) || items.length === 0) return null;
  return (
    <section className={className}>
      <h2 className="text-2xl font-semibold mb-4">Najczęstsze pytania (FAQ)</h2>
      <div className="space-y-3">
        {items.map((item, idx) => (
          <details
            key={idx}
            className="group border border-neutral-200 rounded-lg p-4 bg-white"
          >
            <summary className="cursor-pointer list-none font-medium text-neutral-800 flex items-center justify-between">
              <span>{item.question}</span>
              <span className="ml-3 text-neutral-500 group-open:rotate-180 transition-transform">
                ▾
              </span>
            </summary>
            <div
              className="mt-3 prose max-w-none text-neutral-800"
              dangerouslySetInnerHTML={renderMarkdown(item.answer || "")}
            />
          </details>
        ))}
      </div>
    </section>
  );
}
