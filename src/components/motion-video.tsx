import Image from "next/image";

/**
 * Looping decorative video over its poster. `src` is the path without extension
 * (`/motion/puer-cake` → .webm, .mp4 and -poster.jpg). The poster shows while the
 * video loads and for reduced-motion users. The parent must be positioned.
 */
export function MotionVideo({
  src,
  sizes,
  preload,
  className = "",
}: {
  src: string;
  sizes: string;
  preload?: boolean;
  className?: string;
}) {
  return (
    <>
      <Image
        src={`${src}-poster.jpg`}
        alt=""
        fill
        preload={preload}
        sizes={sizes}
        className={`object-cover ${className}`}
      />
      <video
        autoPlay
        muted
        loop
        playsInline
        aria-hidden
        className={`absolute inset-0 size-full object-cover motion-reduce:hidden ${className}`}
      >
        <source src={`${src}.webm`} type="video/webm" />
        <source src={`${src}.mp4`} type="video/mp4" />
      </video>
    </>
  );
}
