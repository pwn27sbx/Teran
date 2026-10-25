import { useCallback, useState } from "react";
import type { KeyboardEvent } from "react";
import { useTranslation } from "react-i18next";
import "@/styles/hero-subject.css";

const DEFAULT_BASE_IMAGE = "/milo1_nobg.avif";
const DEFAULT_SUBJECT_IMAGE = "/atreus1_nobg.avif";
const DEFAULT_STUDY_IMAGE = "/atreusx_nobg.avif";

const AVIF_EXTENSION = /\.avif(\?|#|$)/i;

const isAvifSource = (source: string): boolean => AVIF_EXTENSION.test(source);

/**
 * Every hero asset ships as AVIF with the original WebP kept as the runtime
 * fallback, so the fallback path is derived from the primary one.
 */
const webpFallbackSource = (source: string): string =>
  isAvifSource(source) ? source.replace(AVIF_EXTENSION, ".webp$1") : source;

const ACTIVATION_KEYS = ["Enter", " ", "Spacebar"];

export interface HeroSubjectRevealProps {
  baseImage?: string;
  subjectImage?: string;
  studyImage?: string;
}

/**
 * Media layer of the home hero.
 *
 * The dog hosts the scene and the cat is an interactive object that reveals its
 * own pencil study. Every asset is a `<picture>` with an AVIF source and a WebP
 * `<img>` fallback; one failed AVIF request drops its source so the browser
 * selects the WebP copy instead of leaving a blank layer.
 *
 * The reveal is state, not motion: hover, keyboard focus, Enter/Space and tap
 * all flip `data-revealed`, and the four coordinated reactions live in
 * `styles/hero-subject.css`. No animation frame is ever requested here.
 *
 * Rendered inside `VisualErrorBoundary`, so the copy layer (`HeroOverlay`)
 * stays outside it and survives any media failure.
 */
export default function HeroSubjectReveal({
  baseImage = DEFAULT_BASE_IMAGE,
  subjectImage = DEFAULT_SUBJECT_IMAGE,
  studyImage = DEFAULT_STUDY_IMAGE,
}: HeroSubjectRevealProps) {
  const { t } = useTranslation();
  const label = t("home.hero.subject_label");

  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [pinned, setPinned] = useState(false);
  // The study is the heaviest layer of the composition, so it is mounted on the
  // first reveal intent instead of being part of first paint.
  const [studyRequested, setStudyRequested] = useState(false);
  const [failedAvifSources, setFailedAvifSources] = useState<string[]>([]);

  const revealed = hovered || focused || pinned;

  const avifIsUsable = (source: string): boolean =>
    isAvifSource(source) && !failedAvifSources.includes(source);

  const dropFailedAvif = useCallback((source: string) => {
    setFailedAvifSources((current) =>
      current.includes(source) ? current : [...current, source],
    );
  }, []);

  const requestStudy = useCallback(() => {
    setStudyRequested(true);
  }, []);

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (!ACTIVATION_KEYS.includes(event.key)) return;

    // The button would otherwise also synthesize a click, toggling twice.
    event.preventDefault();
    requestStudy();
    setPinned((current) => !current);
  };

  return (
    <div data-hero-media className="absolute inset-0 overflow-hidden">
      {/* Host layer: the dog carries the scene, so it is decorative and inert. */}
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

      {/* Interactive object: a real button, anchored right/bottom on md+ and
          centered above the copy block in the mobile stacked layout. */}
      <button
        type="button"
        data-subject-reveal
        data-revealed={revealed ? "true" : "false"}
        aria-pressed={pinned}
        aria-label={label}
        onMouseEnter={() => {
          requestStudy();
          setHovered(true);
        }}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => {
          requestStudy();
          setFocused(true);
        }}
        onBlur={() => setFocused(false)}
        onClick={() => {
          requestStudy();
          setPinned((current) => !current);
        }}
        onKeyDown={handleKeyDown}
        className="relative mx-auto mt-[12vh] block aspect-square w-[72vw] max-w-[340px] cursor-pointer rounded-[24px] bg-transparent p-0 md:absolute md:right-0 md:bottom-0 md:mx-0 md:mt-0 md:w-[42vw] md:max-w-none"
      >
        {/* Subject base: the cat photo, which breathes a little when revealed. */}
        <span aria-hidden="true" className="subject-base absolute inset-0 block">
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
              className="absolute inset-0 h-full w-full object-contain object-bottom pointer-events-none select-none"
            />
          </picture>
        </span>

        {/* Reveal layer: the same cat as a pencil study, clipped in from the top. */}
        <span
          aria-hidden="true"
          className="subject-reveal-img absolute inset-0 block overflow-hidden pointer-events-none"
        >
          {studyRequested && (
            <picture className="absolute inset-0 block">
              {avifIsUsable(studyImage) && <source type="image/avif" srcSet={studyImage} />}
              <img
                src={webpFallbackSource(studyImage)}
                onError={() => dropFailedAvif(studyImage)}
                alt=""
                aria-hidden="true"
                draggable={false}
                decoding="async"
                className="absolute inset-0 h-full w-full object-contain object-bottom select-none"
              />
            </picture>
          )}
        </span>

        {/* Frame: the outline that appears with the study. */}
        <span
          aria-hidden="true"
          className="subject-frame absolute inset-0 block rounded-[24px] border-2 border-[#f0ee07] pointer-events-none"
        />

        {/* Label: the only affordance text, colored by the reveal token. */}
        <span className="subject-label pointer-events-none absolute inset-x-0 bottom-0 block text-center font-['Outfit'] text-[11px] font-bold tracking-[0.18em] uppercase">
          {label}
        </span>
      </button>
    </div>
  );
}
