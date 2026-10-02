type Faq = {
  question: string;
  answer: string;
};

type FaqSectionProps = {
  title?: string;
  eyebrow?: string;
  faqs: readonly Faq[];
};

export function FaqSection({
  title = "Întrebări frecvente",
  eyebrow = "FAQ",
  faqs,
}: FaqSectionProps) {
  return (
    <section
      id="faq"
      className="border-t border-stone/15 bg-white py-16 sm:py-24"
      aria-labelledby="faq-heading"
    >
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-moss">
          {eyebrow}
        </p>
        <h2
          id="faq-heading"
          className="mt-3 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl"
        >
          {title}
        </h2>
        <dl className="mt-10 space-y-6">
          {faqs.map((faq) => (
            <div
              key={faq.question}
              className="border-b border-stone/15 pb-6 last:border-0 last:pb-0"
            >
              <dt className="font-display text-lg font-bold text-ink sm:text-xl">
                {faq.question}
              </dt>
              <dd className="mt-3 text-base leading-relaxed text-stone">
                {faq.answer}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
