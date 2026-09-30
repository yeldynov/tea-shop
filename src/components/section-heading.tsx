import Link from "next/link";

export function SectionHeading({
  eyebrow,
  title,
  href,
  cta,
}: {
  eyebrow: string;
  title: string;
  href?: string;
  cta?: string;
}) {
  return (
    <div className="mb-10 flex flex-col gap-4 md:mb-14 md:flex-row md:items-end md:justify-between">
      <div className="flex flex-col gap-3">
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
      </div>
      {href && cta && (
        <Link href={href} className="link-arrow">
          {cta} <span aria-hidden>→</span>
        </Link>
      )}
    </div>
  );
}
