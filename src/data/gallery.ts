const baseGalleryItems = Array.from({ length: 27 }, (_, i) => ({
  image: `/gallery/${i + 1}.webp`,
  title: `Galería ${i + 1}`,
  href: undefined,
}));

// Rellenamos hasta 30 para que las 5 columnas tengan exactamente 6 imágenes cada una y no haya descuadres
export const galleryItems = [
  ...baseGalleryItems,
  baseGalleryItems[0],
  baseGalleryItems[1],
  baseGalleryItems[2],
];
