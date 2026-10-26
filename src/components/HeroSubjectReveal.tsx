import { useCallback, useEffect, useState } from "react";
import type { KeyboardEvent } from "react";
import { useTranslation } from "react-i18next";
import { isAvifSource, webpFallbackSource } from "@/lib/media";
import "@/styles/hero-subject.css";

const DEFAULT_BASE_IMAGE = "/milo1_nobg.avif";
const DEFAULT_SUBJECT_IMAGE = "/atreus1_nobg.avif";
const DEFAULT_STUDY_IMAGE = "/atreusx_nobg.avif";

/**
 * The study is warmed on the first idle moment after mount, so a reveal never
 * opens onto an empty layer, but it still stays out of first paint. Browsers
 * without `requestIdleCallback` get this short timer instead.
 */
const IDLE_FALLBACK_MS = 120;

/**
 * Deadline for the idle warm-up: a busy page can defer `requestIdleCallback`
 * indefinitely, and the reveal holds its reactions until the study has painted,
 * so an unbounded wait would leave the object inert.
 */
const IDLE_DEADLINE_MS = 2000;

/** Caption of the cell, in the voice a helmet cell uses: name and season. */
const SUBJECT_NAME = "Atreus";
const SUBJECT_YEAR = String(new Date().getFullYear());

const ACTIVATION_KEYS = ["Enter", " ", "Spacebar"];

/**
 * The AVIF failure contract shared by both hero media layers: a failed
 * `<source>` is dropped from the DOM so the browser re-selects the WebP copy
 * instead of leaving a blank layer.
 */
function useAvifFallback() {
  const [failedAvifSources, setFailedAvifSources] = useState<string[]>([]);

  const avifIsUsable = (source: string): boolean =>
    isAvifSource(source) && !failedAvifSources.includes(source);

  const dropFailedAvif = useCallback((source: string) => {
    setFailedAvifSources((current) =>
      current.includes(source) ? current : [...current, source],
    );
  }, []);

  return { avifIsUsable, dropFailedAvif };
}

export interface HeroSubjectBackdropProps {
  baseImage?: string;
}

/**
 * Host layer of the home hero: the dog that carries the scene.
 *
 * It is a full-bleed, decorative and inert layer, so it lives outside the
 * overlay's stacked layout and inside its own `VisualErrorBoundary`. The
 * `data-hero-media` hook marks the layer for the hero layout assertions.
 */
export function HeroSubjectBackdrop({ baseImage = DEFAULT_BASE_IMAGE }: HeroSubjectBackdropProps) {
  const { avifIsUsable, dropFailedAvif } = useAvifFallback();

  return (
    <div data-hero-media className="absolute inset-0 overflow-hidden">
      <picture className="absolute inset-0 block">
        {avifIsUsable(baseImage) && <source type="image/avif" srcSet={baseImage} />}
        <img
          src={webpFallbackSource(baseImage)}
          onError={() => dropFailedAvif(baseImage)}
          alt=""
          aria-hidden="true"
          draggable={false}
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover object-[center_5%] pointer-events-none select-none"
        />
      </picture>
    </div>
  );
}

export interface HeroSubjectObjectProps {
  subjectImage?: string;
  studyImage?: string;
}

/**
 * Interactive object of the home hero: the cat that reveals its own pencil
 * study through a real `<button>`.
 *
 * The overlay owns the stacked layout and hands this object a slot, so the
 * object fills whatever height layout gave it (`height: 100%`) and never sizes
 * itself from a neighbouring block. On `md+` it leaves that flow and is anchored
 * to the right edge of the hero.
 *
 * The reveal is state, not motion: hover, focus, Enter/Space and tap all flip
 * `data-revealed`, and the four coordinated reactions live in
 * `styles/hero-subject.css`. The visuals are additionally held at their rest
 * values until the study image has painted, so the first reveal never opens
 * onto an empty layer. No animation frame is ever requested here.
 */
export function HeroSubjectObject({
  subjectImage = DEFAULT_SUBJECT_IMAGE,
  studyImage = DEFAULT_STUDY_IMAGE,
}: HeroSubjectObjectProps) {
  const { t } = useTranslation();
  const label = t("home.hero.subject_label");
  const { avifIsUsable, dropFailedAvif } = useAvifFallback();

  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [pinned, setPinned] = useState(false);
  // Mounted on the first idle moment, never on first paint: the study is the
  // heaviest layer of the composition, so it is warmed after the hero is up.
  const [studyMounted, setStudyMounted] = useState(false);
  // The study has painted, which is what the reveal visuals wait for.
  const [studyReady, setStudyReady] = useState(false);

  const revealed = hovered || focused || pinned;

  useEffect(() => {
    if (typeof window.requestIdleCallback === "function") {
      const handle = window.requestIdleCallback(() => setStudyMounted(true), {
        timeout: IDLE_DEADLINE_MS,
      });

      return () => window.cancelIdleCallback?.(handle);
    }

    const timer = setTimeout(() => setStudyMounted(true), IDLE_FALLBACK_MS);

    return () => clearTimeout(timer);
  }, []);

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (!ACTIVATION_KEYS.includes(event.key)) return;

    // The button would otherwise also synthesize a click, toggling twice.
    event.preventDefault();
    setPinned((current) => !current);
  };

  return (
    <button
      type="button"
      data-subject-reveal
      data-revealed={revealed ? "true" : "false"}
      data-study-ready={studyReady ? "true" : "false"}
      aria-pressed={pinned}
      aria-label={label}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onClick={() => setPinned((current) => !current)}
      onKeyDown={handleKeyDown}
      className="subject-object pointer-events-auto relative mx-auto block aspect-[1448/1637] w-auto cursor-pointer border-0 bg-transparent p-0 md:absolute md:right-[4vw] md:bottom-[6vh] md:mx-0 md:w-auto"
    >
      {/* The object sits inside the cell with air around it: the frame is the
          cell, not a card around the picture. */}
      <span aria-hidden="true" className="absolute inset-[12%] block overflow-hidden">
        {/* Subject base: the cat photo, which breathes a little when revealed. */}
        <span className="subject-base absolute inset-0 block">
          <picture className="absolute inset-0 block">
            {avifIsUsable(subjectImage) && (
              <source type="image/avif" srcSet={subjectImage} />
            )}
            <img
              src={webpFallbackSource(subjectImage)}
              onError={() => dropFailedAvif(subjectImage)}
              alt=""
              aria-hidden="true"
              draggable={false}
              decoding="async"
              className="absolute inset-0 h-full w-full object-contain object-center pointer-events-none select-none"
            />
          </picture>
        </span>

        {/* Reveal layer: the same cat as a pencil study, clipped in from the top. */}
        <span
          className="subject-reveal-img absolute inset-0 block overflow-hidden pointer-events-none"
        >
          {studyMounted && (
            <picture className="absolute inset-0 block">
              {avifIsUsable(studyImage) && <source type="image/avif" srcSet={studyImage} />}
              <img
                src={webpFallbackSource(studyImage)}
                onLoad={() => setStudyReady(true)}
                onError={() => {
                  // The first failure drops the AVIF source so the browser selects
                  // the WebP copy instead of leaving the reveal empty.
                  if (avifIsUsable(studyImage)) {
                    setStudyReady(false);
                    dropFailedAvif(studyImage);
                    return;
                  }

                  // Nothing left to try: release the hold so the object still
                  // answers instead of staying inert for the session.
                  setStudyReady(true);
                }}
                alt=""
                aria-hidden="true"
                draggable={false}
                decoding="async"
                className="absolute inset-0 h-full w-full object-contain object-center select-none"
              />
            </picture>
          )}
        </span>
      </span>

      {/* Cell frame: a hairline, which is the only chrome the cell carries. */}
      <span
        aria-hidden="true"
        className="subject-frame pointer-events-none absolute inset-0 block border border-solid"
      />

      {/* Caption inside the cell, the way a helmet cell names its paint and year.
          Decorative: the button already carries the accessible name. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-3 right-3 flex items-baseline gap-2 font-['Outfit'] text-[10px] font-semibold uppercase tracking-[0.16em]"
      >
        <span className="text-[#1a1a1a]/70 dark:text-white/80">{SUBJECT_NAME}</span>
        <span className="text-[#b5a800]">{SUBJECT_YEAR}</span>
      </span>
    </button>
  );
}
