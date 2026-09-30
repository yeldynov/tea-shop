import Image from "next/image";

import type { Photo } from "@/lib/catalog";

/**
 * Phones & tablets: a swipe row of portrait images.
 * Desktop: the lead image full width, the rest two-up beneath it (an odd one out spans both).
 */
export function ProductGallery({ images, name }: { images: Photo[]; name: string }) {
  const [lead, ...rest] = images;
  const lastSpans = rest.length % 2 === 1;

  return (
    <>
      <ul
        aria-label={`${name} images`}
        className="rail -mx-gutter scroll-px-gutter px-gutter [--rail-item:86%] sm:[--rail-item:60%] lg:hidden"
      >
        {images.map((image, i) => (
          <li key={image.src} className="relative aspect-4/5 overflow-hidden rounded-card bg-mist">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(min-width: 40rem) 60vw, 86vw"
              loading={i === 0 ? "eager" : "lazy"}
              className="object-cover"
            />
          </li>
        ))}
      </ul>

      <ul aria-label={`${name} images`} className="hidden gap-grid lg:grid lg:grid-cols-2">
        <li className="relative col-span-2 aspect-4/5 overflow-hidden rounded-card bg-mist">
          <Image
            src={lead.src}
            alt={lead.alt}
            fill
            sizes="58vw"
            loading="eager"
            className="object-cover"
          />
        </li>
        {rest.map((image, i) => {
          const spans = lastSpans && i === rest.length - 1;
          return (
            <li
              key={image.src}
              className={`relative overflow-hidden rounded-card bg-mist ${
                spans ? "col-span-2 aspect-3/2" : "aspect-4/5"
              }`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes={spans ? "58vw" : "29vw"}
                className="object-cover"
              />
            </li>
          );
        })}
      </ul>
    </>
  );
}
