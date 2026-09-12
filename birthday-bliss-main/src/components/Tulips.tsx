import type { CSSProperties } from "react";

type TulipProps = {
  className?: string;
  bloom?: string;
  stem?: string;
  style?: CSSProperties;
};

/** Cute hand-drawn style tulip used as decorative artwork. Purely ornamental. */
export function Tulip({ className, bloom = "currentColor", stem = "currentColor", style }: TulipProps) {
  return (
    <svg viewBox="0 0 64 96" className={className} style={style} aria-hidden="true" focusable="false">
      <path
        d="M32 6c4 0 7 5 8 10 2-4 6-7 9-6 3 1 3 6 2 11-1 7-6 16-13 20-1 1-2 1-3 0-7-4-12-13-13-20-1-5-1-10 2-11 3-1 7 2 9 6 1-5 4-10 8-10Z"
        fill={bloom}
      />
      <path
        d="M32 40c1 0 2 1 2 2v48c0 1-1 2-2 2s-2-1-2-2V42c0-1 1-2 2-2Z"
        fill={stem}
      />
      <path
        d="M30 62c-6-6-14-8-19-6 1 8 8 15 16 15 2 0 3-1 3-3v-6ZM34 72c5-7 13-10 18-8-1 8-8 15-16 15-2 0-3-1-2-3v-4Z"
        fill={stem}
        opacity="0.85"
      />
    </svg>
  );
}

/** Soft tulip garden band, used along page borders. */
export function TulipBorder({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none flex select-none items-end justify-center gap-3 opacity-70 ${className}`}
    >
      {Array.from({ length: 9 }).map((_, i) => (
        <Tulip
          key={i}
          className="h-10 w-7 animate-sway sm:h-14 sm:w-9"
          bloom={i % 2 === 0 ? "var(--tulip-purple)" : "var(--tulip-blue)"}
          stem="var(--tulip-stem)"
          {...{ style: { animationDelay: `${i * 0.25}s` } }}
        />
      ))}
    </div>
  );
}

/** Decorative floating tulips scattered in a page corner. */
export function TulipCorner({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute select-none ${className}`}>
      <Tulip className="h-24 w-16 animate-float opacity-30" bloom="var(--tulip-purple)" stem="var(--tulip-stem)" />
    </div>
  );
}
