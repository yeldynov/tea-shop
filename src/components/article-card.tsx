import Image from "next/image";
import Link from "next/link";

import type { Article } from "@/lib/journal";

export function ArticleCard({ article, excerpt }: { article: Article; excerpt?: boolean }) {
  return (
    <article className="group relative flex flex-col gap-4">
      <div className="relative aspect-4/3 overflow-hidden rounded-lg bg-mist">
        <Image
          src={article.image.src}
          alt={article.image.alt}
          fill
          sizes="(min-width: 64rem) 30vw, (min-width: 40rem) 45vw, 100vw"
          className="object-cover transition-transform duration-700 ease-out-soft group-hover:scale-104"
        />
      </div>
      <div className="flex items-center gap-3">
        <span className="badge-soft">{article.kicker}</span>
        <span className="text-sm text-ink-faint">{article.readTime}</span>
      </div>
      <h3 className="text-display-sm">
        <Link href={`/journal/${article.slug}`} className="after:absolute after:inset-0">
          {article.title}
        </Link>
      </h3>
      {excerpt && <p>{article.excerpt}</p>}
    </article>
  );
}
