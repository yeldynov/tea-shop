import Image from 'next/image'
import Link from 'next/link'

import { merchandising } from '@/lib/catalog'
import { getProduct } from '@/lib/catalog-queries'

export async function Hero() {
  const featured = await getProduct(merchandising.newArrival)

  return (
    <section className='container-wide pt-3 md:pt-4'>
      <div className='relative isolate flex min-h-[max(34rem,min(calc(100svh-9rem),54rem))] items-end overflow-hidden rounded-card md:rounded-panel'>
        {/* Poster stays underneath: shown while the video loads and for reduced-motion users. */}
        <Image
          src='/hero/tea-mountains-autumn-poster.jpg'
          alt=''
          fill
          preload
          sizes='100vw'
          className='-z-20 object-cover'
        />
        {/* 15s seamless loop, rendered from scratch in the design-system palette. */}
        <video
          autoPlay
          muted
          loop
          playsInline
          aria-hidden
          className='absolute inset-0 -z-20 size-full object-cover motion-reduce:hidden'
        >
          <source src='/hero/tea-mountains-autumn.webm' type='video/webm' />
          <source src='/hero/tea-mountains-autumn.mp4' type='video/mp4' />
        </video>
        <div className='absolute inset-0 -z-10 bg-linear-to-t from-ink/85 via-ink/35 to-ink/10' />
        <div className='absolute inset-0 -z-10 bg-linear-to-r from-ink/45 to-transparent to-70%' />

        <div className='flex w-full flex-col gap-10 p-6 sm:p-10 lg:flex-row lg:items-end lg:justify-between lg:p-14'>
          <div className='flex max-w-3xl flex-col gap-5 text-cream'>
            <p className='eyebrow text-cream/90'>Yunnan · Fujian · Zhejiang</p>
            <h1 className='heading-hero text-cream'>
              Every leaf remembers its mountain
            </h1>
            <p className='lead max-w-xl text-cream/85'>
              Aged pu’er, Wuyi rock oolong and rare hong cha, bought directly
              from the families who grow them.
            </p>
            <div className='mt-3 flex flex-wrap gap-3'>
              <Link
                href='/shop'
                className='btn btn-lg bg-cream text-ink hover:bg-yuzu'
              >
                Shop all tea
              </Link>
              <Link href='/collections/puer' className='btn-glass btn-lg'>
                Explore pu’er
              </Link>
            </div>
          </div>

          {/* Small floating product note — a playful counterpoint to the big type. */}
          {featured && (
            <Link
              href={`/products/${featured.slug}`}
              className='group hidden w-72 shrink-0 items-center gap-4 rounded-card bg-cream/90 p-3 pr-5 text-ink shadow-lift backdrop-blur-md transition-colors hover:bg-cream lg:flex'
            >
              <div className='relative size-20 shrink-0 overflow-hidden rounded-lg bg-mist'>
                <Image
                  src={featured.image.src}
                  alt=''
                  fill
                  sizes='80px'
                  className='object-cover'
                />
              </div>
              <div className='flex flex-col gap-1'>
                <span className='label text-matcha'>Just landed</span>
                <span className='font-display text-xl leading-tight'>
                  {featured.name}
                </span>
                <span className='text-sm text-ink-soft'>{featured.origin}</span>
              </div>
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}
