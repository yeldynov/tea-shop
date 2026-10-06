import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ArticleCard } from "@/components/article-card";
import { SectionHeading } from "@/components/section-heading";
import { articles, formatDate, getArticle } from "@/lib/journal";

// Articles are static; unknown slugs 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/journal/[slug]">): Promise<Metadata> {
  const article = getArticle((await params).slug);
  if (!article) return {};

  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      type: "article",
      title: article.title,
      description: article.excerpt,
      publishedTime: article.published,
      images: [article.image.src],
    },
  };
}

export default async function ArticlePage({ params }: PageProps<"/journal/[slug]">) {
  const article = getArticle((await params).slug);
  if (!article) notFound();

  const more = articles.filter((a) => a.slug !== article.slug).slice(0, 3);

  return (
    <>
      <article className="pt-6 lg:pt-8">
        <div className="container-page">
          <nav aria-label="Breadcrumb" className="mb-10 lg:mb-14">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-ink-faint">
              <li>
                <Link href="/" className="link-quiet">
                  Home
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link href="/journal" className="link-quiet">
                  Journal
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li aria-current="page" className="text-ink">
                {article.title}
              </li>
            </ol>
          </nav>
        </div>

        <header className="container-prose mb-10 flex flex-col items-center gap-5 text-center md:mb-14">
          <span className="badge-soft">{article.kicker}</span>
          <h1 className="text-display-lg">{article.title}</h1>
          <p className="lead">{article.excerpt}</p>
          <p className="text-sm text-ink-faint">
            <time dateTime={article.published}>{formatDate(article.published)}</time> ·{" "}
            {article.readTime}
          </p>
        </header>

        <div className="container-wide">
          <div className="relative aspect-video overflow-hidden rounded-card bg-mist md:aspect-21/9 md:rounded-panel">
            <Image
              src={article.image.src}
              alt={article.image.alt}
              fill
              preload
              sizes="100vw"
              className="object-cover"
            />
          </div>
        </div>

        <div className="container-prose section-sm">
          <div className="prose-tea">{article.body}</div>
        </div>
      </article>

      <section className="container-page border-t pt-section-sm pb-section">
        <SectionHeading
          eyebrow="Keep reading"
          title="More from the journal"
          href="/journal"
          cta="All stories"
        />
        <ul className="grid-cards">
          {more.map((a) => (
            <li key={a.slug}>
              <ArticleCard article={a} />
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
