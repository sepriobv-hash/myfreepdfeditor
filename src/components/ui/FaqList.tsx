import { ChevronDown } from "lucide-react";

export function FaqList({ faqs }: { faqs: { question: string; answer: string }[] }) {
  return (
    <div className="divide-y divide-line border-y border-line">
      {faqs.map(({ question, answer }) => (
        <details key={question} className="group">
          <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 py-3.5 font-medium [&::-webkit-details-marker]:hidden">
            {question}
            <ChevronDown aria-hidden="true" className="size-4 shrink-0 text-muted group-open:rotate-180" />
          </summary>
          <p className="max-w-[65ch] pb-4 text-sm leading-6 text-muted">{answer}</p>
        </details>
      ))}
    </div>
  );
}
