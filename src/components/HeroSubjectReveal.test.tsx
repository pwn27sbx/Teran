import { readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { createElement } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter } from 'react-router-dom';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import i18n from '@/i18n';
import Home from '@/pages/Home';
import { HeroSubjectBackdrop, HeroSubjectObject } from './HeroSubjectReveal';

/**
 * Lets one suite force a media failure without touching the media layer: the
 * boundaries in `Home` are what must keep the copy alive.
 */
const mediaFailure = vi.hoisted(() => ({ backdrop: false, object: false }));

vi.mock('./HeroSubjectReveal', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./HeroSubjectReveal')>();

  return {
    ...actual,
    HeroSubjectBackdrop: function FailableHeroSubjectBackdrop(
      props: Parameters<typeof actual.HeroSubjectBackdrop>[0],
    ) {
      if (mediaFailure.backdrop) {
        throw new Error('hero backdrop failed');
      }

      return createElement(actual.HeroSubjectBackdrop, props);
    },
    HeroSubjectObject: function FailableHeroSubjectObject(
      props: Parameters<typeof actual.HeroSubjectObject>[0],
    ) {
      if (mediaFailure.object) {
        throw new Error('hero subject failed');
      }

      return createElement(actual.HeroSubjectObject, props);
    },
  };
});

/**
 * The hero reveal is a CSS state machine: one interaction, four coordinated
 * reactions and one token pair. The DOM alone cannot pin that, so this suite
 * reads the dedicated stylesheet as text and asserts its contract.
 */
const STYLE_PATH = path.resolve(process.cwd(), 'src/styles/hero-subject.css');

interface CssRule {
  selector: string;
  declarations: string[];
}

const REVEALED = '[data-subject-reveal][data-revealed="true"]';
const STUDY_PENDING = '[data-subject-reveal][data-study-ready="false"]';

const EASE_TOKEN = '--ease-brand: cubic-bezier(0.65, 0.05, 0, 1)';
const DURATION_TOKEN = '--dur-brand: 0.75s';
const BRAND_TRANSITION = 'var(--dur-brand) var(--ease-brand)';

const REST_STATE = [
  { part: '.subject-reveal-img', property: 'clip-path', value: 'ellipse(0% 0% at 50% 0%)' },
  { part: '.subject-base', property: 'transform', value: 'scale(1)' },
  { part: '.subject-frame', property: 'opacity', value: '0' },
  { part: '.subject-label', property: 'color', value: '#0277ab' },
];

const REVEALED_STATE = [
  { part: '.subject-reveal-img', declaration: 'clip-path: ellipse(100% 120% at 50% 0%)' },
  { part: '.subject-base', declaration: 'transform: scale(1.04)' },
  { part: '.subject-frame', declaration: 'opacity: 1' },
  { part: '.subject-label', declaration: 'color: #f0ee07' },
];

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

function readStyleSheet(): string {
  return readFileSync(STYLE_PATH, 'utf8');
}

function normalize(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

function stripComments(css: string): string {
  return css.replace(/\/\*[\s\S]*?\*\//g, '');
}

/** Index of the `}` that closes the block opened at `openBrace`. */
function closingBrace(css: string, openBrace: number): number {
  let depth = 0;

  for (let index = openBrace; index < css.length; index += 1) {
    if (css[index] === '{') depth += 1;
    if (css[index] === '}') {
      depth -= 1;
      if (depth === 0) return index;
    }
  }

  throw new Error('Unbalanced braces in hero-subject.css');
}

/** Bodies of every `@media (<query>)` block in the sheet. */
function mediaBodies(css: string, query: string): string[] {
  const bodies: string[] = [];
  const marker = `@media ${query}`;
  let index = css.indexOf(marker);

  while (index !== -1) {
    const openBrace = css.indexOf('{', index);
    const end = closingBrace(css, openBrace);
    bodies.push(css.slice(openBrace + 1, end));
    index = css.indexOf(marker, end);
  }

  return bodies;
}

function withoutMediaBlocks(css: string): string {
  let result = css;
  let index = result.indexOf('@media');

  while (index !== -1) {
    const openBrace = result.indexOf('{', index);
    const end = closingBrace(result, openBrace);
    result = `${result.slice(0, index)}${result.slice(end + 1)}`;
    index = result.indexOf('@media');
  }

  return result;
}

/** Parses flat rules; media blocks are stripped by the caller. */
function parseRules(css: string): CssRule[] {
  const rules: CssRule[] = [];
  const pattern = /([^{}]+)\{([^{}]*)\}/g;
  let match = pattern.exec(css);

  while (match !== null) {
    rules.push({
      selector: normalize(match[1]),
      declarations: match[2]
        .split(';')
        .map(normalize)
        .filter((declaration) => declaration.length > 0),
    });
    match = pattern.exec(css);
  }

  return rules;
}

function styleSheetRules(): CssRule[] {
  return parseRules(withoutMediaBlocks(stripComments(readStyleSheet())));
}

function selectorsOf(rule: CssRule): string[] {
  return rule.selector.split(',').map(normalize);
}

describe('hero subject reveal styles', () => {
  it('declares the single brand easing and duration token pair', () => {
    const root = styleSheetRules().filter((rule) => rule.selector === ':root');

    expect(root).toHaveLength(1);
    expect(root[0].declarations).toContain(EASE_TOKEN);
    expect(root[0].declarations).toContain(DURATION_TOKEN);
  });

  it('pins the rest state and transitions every part with the shared tokens', () => {
    const rules = styleSheetRules();

    for (const { part, property, value } of REST_STATE) {
      const rule = rules.filter((candidate) => candidate.selector === part);

      expect(rule, `missing rest-state rule for ${part}`).toHaveLength(1);
      expect(rule[0].declarations).toContain(`${property}: ${value}`);
      expect(rule[0].declarations).toContain(`transition: ${property} ${BRAND_TRANSITION}`);
    }
  });

  it('pins exactly the four revealed-state declarations and nothing else', () => {
    const revealed = styleSheetRules().filter((rule) => rule.selector.startsWith(REVEALED));

    expect(revealed.map((rule) => rule.selector)).toEqual(
      REVEALED_STATE.map(({ part }) => `${REVEALED} ${part}`),
    );
    expect(revealed.map((rule) => rule.declarations)).toEqual(
      REVEALED_STATE.map(({ declaration }) => [declaration]),
    );
  });

  it('sizes the object from the slot the overlay gives it', () => {
    const sheet = stripComments(readStyleSheet());

    // The overlay owns the stacked layout: the object fills its slot, so its
    // mobile height is allocated by layout instead of being computed from the
    // height of the blocks around it.
    expect(sheet).not.toContain('--hero-mobile-lockup');
    expect(sheet).not.toContain('--hero-mobile-copy');
    expect(sheet).not.toContain('--hero-mobile-breath');
    expect(sheet).not.toContain('calc(100vh');

    const object = styleSheetRules().filter((rule) => rule.selector === '.subject-object');

    expect(object).toHaveLength(1);
    // The slot caps the width too, so a very tall viewport cannot push the
    // frame out of the hero.
    expect(object[0].declarations).toEqual(['height: 100%', 'max-width: 100%']);
  });

  it('keeps the desktop placement on md and up', () => {
    const desktop = mediaBodies(stripComments(readStyleSheet()), '(min-width: 768px)');

    expect(desktop).toHaveLength(1);
    expect(parseRules(desktop[0])).toEqual([
      { selector: '.subject-object', declarations: ['height: 64vh'] },
    ]);
  });

  it('hides the object on a short stacked viewport as a viewport query only', () => {
    const sheet = stripComments(readStyleSheet());
    const shortViewport = mediaBodies(sheet, '(max-width: 767px) and (max-height: 719px)');

    // A short viewport leaves no band between the lockup and the copy, so the
    // interaction is absent there instead of overlapping or shrinking to a speck.
    expect(shortViewport).toHaveLength(1);
    expect(parseRules(shortViewport[0])).toEqual([
      { selector: '.subject-object', declarations: ['display: none'] },
    ]);
  });

  it('keeps the four reactions at rest until the study image is ready', () => {
    const rules = styleSheetRules().filter((rule) => rule.selector.startsWith(STUDY_PENDING));

    // S14: the state attribute may flip first, the visuals wait for the content.
    expect(rules.map((rule) => rule.selector)).toEqual(
      REST_STATE.map(({ part }) => `${STUDY_PENDING} ${part}`),
    );
    expect(rules.map((rule) => rule.declarations)).toEqual(
      REST_STATE.map(({ property, value }) => [`${property}: ${value}`]),
    );

    // Equal specificity with the revealed rules, so this block has to stay last.
    const flat = withoutMediaBlocks(stripComments(readStyleSheet()));

    expect(flat.indexOf(STUDY_PENDING)).toBeGreaterThan(flat.lastIndexOf(REVEALED));
  });

  it('keeps the revealed state under reduced motion and only drops the transition', () => {
    const bodies = mediaBodies(stripComments(readStyleSheet()), REDUCED_MOTION);

    expect(bodies).toHaveLength(1);

    const reducedRules = parseRules(bodies[0]);
    // The state is never suppressed: the only declaration is `transition: none`.
    expect(reducedRules.flatMap((rule) => rule.declarations)).toEqual(['transition: none']);
    expect(reducedRules.flatMap(selectorsOf).sort()).toEqual(
      REST_STATE.map(({ part }) => part).sort(),
    );
  });
});

const BASE_AVIF = '/milo1_nobg.avif';
const BASE_WEBP = '/milo1_nobg.webp';
const SUBJECT_AVIF = '/atreus1_nobg.avif';
const SUBJECT_WEBP = '/atreus1_nobg.webp';
const STUDY_AVIF = '/atreusx_nobg.avif';
const STUDY_WEBP = '/atreusx_nobg.webp';

const ES_SUBJECT_LABEL = 'Ver el estudio';
const EN_SUBJECT_LABEL = 'See the study';

const REVEAL_HOOKS = ['.subject-reveal-img', '.subject-base', '.subject-frame', '.subject-label'];

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

type BackdropProps = React.ComponentProps<typeof HeroSubjectBackdrop>;
type ObjectProps = React.ComponentProps<typeof HeroSubjectObject>;

/**
 * The study mounts on the first idle moment after mount (S14). jsdom has no
 * `requestIdleCallback`, so this stub makes that moment explicit instead of
 * racing the component's timer fallback.
 */
let idleCallbacks: { flush: () => void; pending: () => number };

function stubIdleCallbacks(): void {
  const pending: Array<() => void> = [];

  vi.stubGlobal('requestIdleCallback', (callback: () => void) => {
    pending.push(callback);
    return pending.length;
  });
  vi.stubGlobal('cancelIdleCallback', () => undefined);

  idleCallbacks = {
    flush() {
      act(() => {
        for (const callback of pending.splice(0)) callback();
      });
    },
    pending: () => pending.length,
  };
}

function classesOf(element: Element | null): string[] {
  return (element?.getAttribute('class') ?? '').split(/\s+/).filter(Boolean);
}

function renderBackdrop(props: Partial<BackdropProps> = {}) {
  return render(<HeroSubjectBackdrop {...props} />);
}

function renderObject(props: Partial<ObjectProps> = {}) {
  return render(<HeroSubjectObject {...props} />);
}

function renderHeroMedia(props: Partial<BackdropProps & ObjectProps> = {}) {
  return render(
    <>
      <HeroSubjectBackdrop baseImage={props.baseImage} />
      <HeroSubjectObject subjectImage={props.subjectImage} studyImage={props.studyImage} />
    </>,
  );
}

function subjectButton(label: string = ES_SUBJECT_LABEL): HTMLElement {
  return screen.getByRole('button', { name: label });
}

/** The `<picture>` element whose WebP fallback is `webpSource`. */
function pictureFor(container: HTMLElement, webpSource: string): HTMLPictureElement {
  const picture = Array.from(container.querySelectorAll('picture')).find(
    (candidate) => candidate.querySelector('img')?.getAttribute('src') === webpSource,
  );

  if (!picture) throw new Error(`No <picture> serves the fallback ${webpSource}`);

  return picture;
}

function studyImage(container: HTMLElement): HTMLImageElement {
  const image = container.querySelector<HTMLImageElement>(`img[src="${STUDY_WEBP}"]`);

  if (!image) throw new Error('The study layer is not mounted');

  return image;
}

/** Renders the object with its study mounted and painted, ready to interact. */
function renderPaintedObject(props: Partial<ObjectProps> = {}) {
  const view = renderObject(props);

  idleCallbacks.flush();
  fireEvent.load(studyImage(view.container));

  return view;
}

/**
 * Pins the reduced-motion preference. jsdom has no `window.matchMedia`, so the
 * media query must be injected the same way `HeroOverlay.test.tsx` does it.
 */
function stubReducedMotionPreference(prefersReducedMotion: boolean): void {
  vi.stubGlobal(
    'matchMedia',
    vi.fn((query: string) => {
      const matches = prefersReducedMotion && query === REDUCED_MOTION_QUERY;

      return {
        matches,
        media: query,
        onchange: null,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        addListener: () => undefined,
        removeListener: () => undefined,
        dispatchEvent: () => false,
      } as MediaQueryList;
    }),
  );
}

describe('HeroSubjectBackdrop', () => {
  beforeEach(async () => {
    // The shipped LanguageDetector reads localStorage/navigator, so the language
    // must be pinned explicitly to keep this suite order-independent.
    await i18n.changeLanguage('es');
  });

  afterEach(async () => {
    cleanup();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    await i18n.changeLanguage('es');
  });

  it('renders the dog as the full-bleed host layer', () => {
    const { container } = renderBackdrop();
    const host = pictureFor(container, BASE_WEBP);
    const image = host.querySelector('img');

    expect(host.querySelector('source')?.getAttribute('srcset')).toBe(BASE_AVIF);
    expect(image?.getAttribute('alt')).toBe('');
    expect(image?.getAttribute('aria-hidden')).toBe('true');
    expect(image?.getAttribute('fetchpriority')).toBe('high');
    expect(image?.getAttribute('decoding')).toBe('async');
    expect(classesOf(image)).toEqual(
      expect.arrayContaining([
        'absolute',
        'inset-0',
        'h-full',
        'w-full',
        'object-cover',
        'object-[center_5%]',
        'pointer-events-none',
      ]),
    );
  });

  it('stays a decorative layer outside the stacked flow', () => {
    const { container } = renderBackdrop();
    const layer = container.querySelector('[data-hero-media]');

    expect(classesOf(layer)).toEqual(
      expect.arrayContaining(['absolute', 'inset-0', 'overflow-hidden']),
    );
    // Only the interactive object is a button; the host is inert.
    expect(container.querySelector('button')).toBeNull();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });
});

describe('hero subject reveal', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('es');
    stubIdleCallbacks();
  });

  afterEach(async () => {
    cleanup();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    await i18n.changeLanguage('es');
  });

  describe('AVIF failure fallback', () => {
    it('serves every first-paint hero image as AVIF with its WebP fallback', () => {
      const { container } = renderHeroMedia();
      const base = pictureFor(container, BASE_WEBP);
      const subject = pictureFor(container, SUBJECT_WEBP);

      expect(base.querySelector('source')?.getAttribute('type')).toBe('image/avif');
      expect(base.querySelector('source')?.getAttribute('srcset')).toBe(BASE_AVIF);
      expect(subject.querySelector('source')?.getAttribute('type')).toBe('image/avif');
      expect(subject.querySelector('source')?.getAttribute('srcset')).toBe(SUBJECT_AVIF);
    });

    it('mounts the study as AVIF with its WebP fallback once it is warmed', () => {
      const { container } = renderHeroMedia();

      idleCallbacks.flush();

      const study = pictureFor(container, STUDY_WEBP);

      expect(study.querySelector('source')?.getAttribute('type')).toBe('image/avif');
      expect(study.querySelector('source')?.getAttribute('srcset')).toBe(STUDY_AVIF);
    });

    it('drops the AVIF source when the request fails so the WebP copy is selected', () => {
      const { container } = renderHeroMedia();

      idleCallbacks.flush();

      const pictures = Array.from(container.querySelectorAll('picture'));

      expect(pictures).toHaveLength(3);

      for (const picture of pictures) {
        const image = picture.querySelector('img') as HTMLImageElement;
        const fallback = image.getAttribute('src') ?? '';

        expect(picture.querySelector('source'), `${fallback} has no AVIF source`).not.toBeNull();

        fireEvent.error(image);

        // A failed AVIF request is not rescued by source selection: without this
        // removal the hero layer stays blank instead of showing the WebP copy.
        expect(picture.querySelector('source')).toBeNull();
        expect(image.getAttribute('src')).toBe(fallback);
        expect(fallback.endsWith('.webp')).toBe(true);
      }
    });

    it('derives the WebP fallback from the AVIF path it is given', () => {
      const { container } = renderHeroMedia({
        baseImage: '/host.avif',
        subjectImage: '/object.avif',
        studyImage: '/study.avif',
      });

      idleCallbacks.flush();

      expect(pictureFor(container, '/host.webp')).toBeInTheDocument();
      expect(pictureFor(container, '/object.webp')).toBeInTheDocument();
      expect(pictureFor(container, '/study.webp')).toBeInTheDocument();
    });
  });

  describe('interactive object', () => {
    it('renders the cat as a real button, never a canvas layer', () => {
      const { container } = renderObject();
      const button = subjectButton();

      expect(button.tagName).toBe('BUTTON');
      expect(button).toHaveAttribute('type', 'button');
      expect(container.querySelector('canvas')).toBeNull();
    });

    it('hugs the trimmed subject and anchors to the right edge on desktop', () => {
      renderObject();

      const tokens = classesOf(subjectButton());

      // The subject box follows the trimmed bounds of the asset (1448x1637),
      // so the frame outlines the cat instead of a padded square.
      expect(tokens).toContain('aspect-[1448/1637]');
      expect(tokens).toEqual(
        expect.arrayContaining(['subject-object', 'md:absolute', 'md:right-0', 'md:w-auto']),
      );
      // The hero content is translated 5vh on md+, so anchoring the object at
      // the media box bottom clips its frame out of the viewport.
      expect(tokens).toContain('md:bottom-[5vh]');
      // The overlay root keeps pointer events off; the object restores them.
      expect(tokens).toContain('pointer-events-auto');
    });

    it('sits in the overlay stack on mobile instead of being positioned by hand', () => {
      renderObject();

      const tokens = classesOf(subjectButton());

      expect(tokens).toContain('mx-auto');
      expect(tokens).toEqual(expect.arrayContaining(['md:mx-0']));
      // Mobile uses the stacked flow, so the box is not absolutely positioned there.
      expect(tokens).not.toContain('absolute');
      // The height comes from the slot the overlay allocates, never from a
      // number copied out of a neighbouring block.
      expect(tokens).toContain('subject-object');
      expect(tokens).not.toContain('h-[64vh]');
    });

    it('places the cat photo and its warm study inside the object box', () => {
      const { container } = renderObject();

      idleCallbacks.flush();

      const button = subjectButton();

      expect(button.querySelector(`img[src="${SUBJECT_WEBP}"]`)).not.toBeNull();
      expect(button.querySelector(`img[src="${STUDY_WEBP}"]`)).not.toBeNull();
      // The host is a sibling layer, so the dog never swallows the tap.
      expect(button.querySelector(`img[src="${BASE_WEBP}"]`)).toBeNull();
      expect(container.querySelector(`img[src="${BASE_WEBP}"]`)).toBeNull();
    });
  });

  describe('reveal state', () => {
    it('marks the object with the reveal attributes the stylesheet targets', () => {
      renderPaintedObject();

      const button = subjectButton();

      expect(button).toHaveAttribute('data-subject-reveal');
      expect(button).toHaveAttribute('data-revealed', 'false');

      fireEvent.click(button);

      expect(subjectButton()).toHaveAttribute('data-revealed', 'true');
    });

    it('exposes the four style hooks the coordinated reactions need', () => {
      const { container } = renderPaintedObject();

      fireEvent.mouseOver(subjectButton());

      for (const hook of REVEAL_HOOKS) {
        expect(container.querySelector(hook), `${hook} is missing`).not.toBeNull();
      }
    });
  });

  describe('input parity', () => {
    it('names the object with the localized subject label', async () => {
      renderObject();

      expect(subjectButton()).toBeInTheDocument();

      await i18n.changeLanguage('en');

      expect(screen.getByRole('button', { name: EN_SUBJECT_LABEL })).toBeInTheDocument();
    });

    it('reveals on hover and hides when the pointer leaves', () => {
      renderPaintedObject();

      const button = subjectButton();

      fireEvent.mouseOver(button);

      expect(subjectButton()).toHaveAttribute('data-revealed', 'true');

      fireEvent.mouseOut(subjectButton());

      expect(subjectButton()).toHaveAttribute('data-revealed', 'false');
    });

    it('reveals on keyboard focus and hides on blur', () => {
      renderPaintedObject();

      const button = subjectButton();

      fireEvent.focus(button);

      expect(subjectButton()).toHaveAttribute('data-revealed', 'true');

      fireEvent.blur(subjectButton());

      expect(subjectButton()).toHaveAttribute('data-revealed', 'false');
    });

    it('pins the reveal with Enter and mirrors it on aria-pressed', () => {
      renderPaintedObject();

      const button = subjectButton();

      expect(button).toHaveAttribute('aria-pressed', 'false');

      fireEvent.focus(button);
      fireEvent.keyDown(button, { key: 'Enter' });

      expect(subjectButton()).toHaveAttribute('aria-pressed', 'true');
      expect(subjectButton()).toHaveAttribute('data-revealed', 'true');

      fireEvent.keyDown(subjectButton(), { key: 'Enter' });

      expect(subjectButton()).toHaveAttribute('aria-pressed', 'false');
    });

    it('pins the reveal with Space and mirrors it on aria-pressed', () => {
      renderPaintedObject();

      const button = subjectButton();

      fireEvent.focus(button);
      fireEvent.keyDown(button, { key: ' ' });

      expect(subjectButton()).toHaveAttribute('aria-pressed', 'true');
      expect(subjectButton()).toHaveAttribute('data-revealed', 'true');

      fireEvent.keyDown(subjectButton(), { key: ' ' });

      expect(subjectButton()).toHaveAttribute('aria-pressed', 'false');
    });

    it('pins the reveal on tap and keeps it while the pointer leaves', () => {
      renderPaintedObject();

      const button = subjectButton();

      fireEvent.click(button);
      fireEvent.mouseOut(subjectButton());

      expect(subjectButton()).toHaveAttribute('aria-pressed', 'true');
      expect(subjectButton()).toHaveAttribute('data-revealed', 'true');
    });
  });

  describe('reduced motion', () => {
    it('still applies the reveal when reduced motion is preferred', () => {
      stubReducedMotionPreference(true);
      renderPaintedObject();

      fireEvent.click(subjectButton());

      expect(subjectButton()).toHaveAttribute('data-revealed', 'true');
      expect(subjectButton()).toHaveAttribute('aria-pressed', 'true');
    });

    it('starts no animation frame loop on mount or after interaction', () => {
      stubReducedMotionPreference(false);
      const requestFrame = vi.spyOn(window, 'requestAnimationFrame');

      for (const width of [390, 1440]) {
        Object.defineProperty(window, 'innerWidth', { configurable: true, value: width });

        const { container, unmount } = renderObject();
        const button = subjectButton();

        idleCallbacks.flush();
        fireEvent.load(studyImage(container));
        fireEvent.mouseOver(button);
        fireEvent.click(button);
        fireEvent.keyDown(button, { key: 'Enter' });
        fireEvent.mouseOut(button);

        unmount();
      }

      expect(requestFrame).not.toHaveBeenCalled();
    });
  });

  describe('study layer', () => {
    it('keeps the study out of first paint', () => {
      const { container } = renderObject();

      expect(container.querySelector(`img[src="${STUDY_WEBP}"]`)).toBeNull();
      expect(idleCallbacks.pending()).toBe(1);
    });

    it('mounts the study on the first idle moment, without any reveal intent', () => {
      const { container } = renderObject();

      idleCallbacks.flush();

      // No hover, focus or tap: warming the study is what keeps the first
      // reveal from opening onto an empty layer.
      expect(container.querySelector(`img[src="${STUDY_WEBP}"]`)).not.toBeNull();
      expect(subjectButton()).toHaveAttribute('data-revealed', 'false');
    });

    it('falls back to a short timer when requestIdleCallback is unavailable', async () => {
      vi.unstubAllGlobals();
      expect(window.requestIdleCallback).toBeUndefined();

      const { container } = renderObject();

      expect(container.querySelector(`img[src="${STUDY_WEBP}"]`)).toBeNull();

      await waitFor(() => {
        expect(container.querySelector(`img[src="${STUDY_WEBP}"]`)).not.toBeNull();
      });
    });

    it('holds the four reactions at rest until the study image has loaded', () => {
      const { container } = renderObject();

      idleCallbacks.flush();

      const study = studyImage(container);

      expect(subjectButton()).toHaveAttribute('data-study-ready', 'false');

      fireEvent.mouseOver(subjectButton());

      // The state attribute already flipped; the visuals must wait for the pixels.
      expect(subjectButton()).toHaveAttribute('data-revealed', 'true');
      expect(subjectButton()).toHaveAttribute('data-study-ready', 'false');

      fireEvent.load(study);

      expect(subjectButton()).toHaveAttribute('data-study-ready', 'true');
      expect(subjectButton()).toHaveAttribute('data-revealed', 'true');
    });

    it('accepts the WebP study as painted when the AVIF copy fails', () => {
      const { container } = renderObject();

      idleCallbacks.flush();

      fireEvent.error(studyImage(container));

      expect(subjectButton()).toHaveAttribute('data-study-ready', 'false');

      fireEvent.load(studyImage(container));

      expect(subjectButton()).toHaveAttribute('data-study-ready', 'true');
    });

    it('keeps index.html preloading only the two first-paint hero images', () => {
      const html = readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf8');
      const preloads = Array.from(html.matchAll(/<link[^>]+rel="preload"[^>]*>/g)).map(
        (match) => match[0],
      );

      expect(preloads).toHaveLength(2);
      expect(preloads.some((tag) => tag.includes(STUDY_AVIF))).toBe(false);
      expect(preloads.some((tag) => tag.includes(BASE_AVIF))).toBe(true);
      expect(preloads.some((tag) => tag.includes(SUBJECT_AVIF))).toBe(true);
    });

    it('keeps the first paint inside the hero media budget', () => {
      const avifSize = (name: string): number => statSync(path.resolve(process.cwd(), 'public', name)).size;

      expect(avifSize('milo1_nobg.avif') + avifSize('atreus1_nobg.avif')).toBe(398828);
      expect(avifSize('atreusx_nobg.avif')).toBe(238119);
    });
  });
});

const ES_HERO_TITLE = 'Amor y ciencia para el bienestar de tu';
const EN_HERO_TITLE = 'Love and science for the well-being of your';
const ES_LOADING = 'Cargando magia...';
const WHATSAPP_PHONE = '51959390711';

/**
 * jsdom's `localStorage` can be shadowed by the runtime's experimental global,
 * so the home page gets an explicit in-memory store instead.
 */
function stubBrowserStorage(): void {
  const store = new Map<string, string>();

  vi.stubGlobal('localStorage', {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => {
      store.set(key, String(value));
    },
    removeItem: (key: string) => {
      store.delete(key);
    },
    clear: () => {
      store.clear();
    },
    key: (index: number) => Array.from(store.keys())[index] ?? null,
    get length() {
      return store.size;
    },
  });
}

/** jsdom ships neither observer, and the home page mounts components that need both. */
function stubLayoutEnvironment(): void {
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe(): void {}
      unobserve(): void {}
      disconnect(): void {}
    },
  );

  vi.stubGlobal(
    'IntersectionObserver',
    class {
      observe(): void {}
      unobserve(): void {}
      disconnect(): void {}
      takeRecords(): [] {
        return [];
      }
    },
  );
}

function renderHome() {
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={['/']}>
        <Home />
      </MemoryRouter>
    </HelmetProvider>,
  );
}

/** Every `w-[Npx]` class used inside `root`, as numbers. */
function fixedPixelWidths(root: Element): number[] {
  return Array.from(root.querySelectorAll('*'))
    .flatMap((element) => classesOf(element))
    .map((token) => /^w-\[(\d+)px\]$/.exec(token))
    .filter((match): match is RegExpExecArray => match !== null)
    .map((match) => Number(match[1]));
}

describe('Home hero composition', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('es');
    // framer-motion reads the preference on mount and jsdom has no matchMedia.
    stubReducedMotionPreference(false);
    stubLayoutEnvironment();
    stubBrowserStorage();
    stubIdleCallbacks();
  });

  afterEach(async () => {
    cleanup();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    mediaFailure.backdrop = false;
    mediaFailure.object = false;
    await i18n.changeLanguage('es');
  });

  it('renders exactly one hero heading, localized in both languages', async () => {
    const first = renderHome();

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(ES_HERO_TITLE);

    first.unmount();
    await i18n.changeLanguage('en');
    renderHome();

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(EN_HERO_TITLE);
  });

  it('composes the hero from the dog host and the cat object, not the brush', () => {
    const { container } = renderHome();
    const backdrop = container.querySelector('[data-hero-media]') as HTMLElement;
    const slot = container.querySelector('[data-hero-media-slot]') as HTMLElement;
    const subject = screen.getByRole('button', { name: ES_SUBJECT_LABEL });

    expect(backdrop).not.toBeNull();
    expect(backdrop.querySelector(`img[src="${BASE_WEBP}"]`)).not.toBeNull();
    // The host is a full-bleed layer outside the stack; the interactive object
    // lives in the slot the overlay allocates between the lockup and the copy.
    expect(backdrop.contains(subject)).toBe(false);
    expect(slot.contains(subject)).toBe(true);
    expect(backdrop.compareDocumentPosition(slot) & Node.DOCUMENT_POSITION_FOLLOWING).not.toBe(0);
    expect(container.querySelector('canvas')).toBeNull();
    // The retired brush announced its own loading state with this copy.
    expect(screen.queryByText(ES_LOADING)).not.toBeInTheDocument();
  });

  it('keeps the hero copy alive when the whole media layer fails', () => {
    mediaFailure.backdrop = true;
    mediaFailure.object = true;
    renderHome();

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(ES_HERO_TITLE);
    expect(screen.getByRole('link', { name: /reservar cita/i })).toBeInTheDocument();
    // Each media layer keeps its own boundary, so both report the failure.
    expect(screen.getByText('Error loading hero effect')).toBeInTheDocument();
    expect(screen.getByText('Error loading hero subject')).toBeInTheDocument();
  });

  it('keeps the hero copy alive when only the subject object fails', () => {
    mediaFailure.object = true;
    const { container } = renderHome();

    expect(container.querySelector(`img[src="${BASE_WEBP}"]`)).not.toBeNull();
    expect(screen.getByText('Error loading hero subject')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(ES_HERO_TITLE);
    expect(screen.getByRole('link', { name: /reservar cita/i })).toBeInTheDocument();
  });

  it('keeps the primary CTA on WhatsApp in a new tab and the secondary on the services page', () => {
    renderHome();

    const primary = screen.getByRole('link', { name: /reservar cita/i });
    const secondary = screen.getByRole('link', { name: /conoce nuestros servicios/i });

    expect(primary.getAttribute('href') ?? '').toContain(`https://wa.me/${WHATSAPP_PHONE}`);
    expect(primary).toHaveAttribute('target', '_blank');
    expect(primary.getAttribute('rel') ?? '').toContain('noopener');
    expect(secondary).toHaveAttribute('href', '/servicios');
  });

  it('keeps the hero inside a 360x640 viewport', () => {
    const { container } = renderHome();
    const backdrop = container.querySelector('[data-hero-media]') as HTMLElement;
    const heroBox = backdrop.parentElement?.closest('.overflow-hidden');
    const slot = container.querySelector('[data-hero-media-slot]');
    const subject = screen.getByRole('button', { name: ES_SUBJECT_LABEL });

    // The backdrop fills the hero box instead of reserving its own size, and
    // the hero box clips, so a 640px-tall viewport never overflows.
    expect(classesOf(backdrop)).toEqual(expect.arrayContaining(['absolute', 'inset-0']));
    expect(classesOf(heroBox)).toEqual(expect.arrayContaining(['h-full', 'w-full', 'overflow-hidden']));

    // The overlay owns the stacked layout and hands the object the leftover
    // height, so no hero element claims a fixed width as wide as the smallest
    // supported viewport.
    expect(classesOf(slot as Element)).toEqual(expect.arrayContaining(['flex-1', 'min-h-0']));
    expect(slot).toContainElement(subject);
    expect(classesOf(subject)).toContain('subject-object');
    expect(fixedPixelWidths(backdrop)).toEqual(
      fixedPixelWidths(backdrop).filter((width) => width < 360),
    );
  });
});
