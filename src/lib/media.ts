const AVIF_EXTENSION = /\.avif(\?|#|$)/i;

/**
 * Every hero asset ships as AVIF with the original WebP kept as the runtime
 * fallback. Both reveal components need the same two rules, so they live here
 * instead of being copied into each of them: a change to the fallback policy
 * must not be able to drift between the layers.
 */
export const isAvifSource = (source: string): boolean => AVIF_EXTENSION.test(source);

/** Derives the WebP fallback path of an AVIF source, so callers never duplicate it. */
export const webpFallbackSource = (source: string): string =>
  isAvifSource(source) ? source.replace(AVIF_EXTENSION, ".webp$1") : source;
