/**
 * Decorative contour field behind the hero media.
 *
 * The reference hero is a quiet light field crossed by thin organic lines, not a
 * flat surface: the lines give the composition depth without competing with the
 * subject. They are drawn as one symmetric SVG so the field scales with the hero
 * box instead of depending on a bitmap, and they are inert for assistive
 * technology.
 */
const CONTOURS = [
  "M-40 210 C 180 150, 300 320, 520 250 S 860 90, 1080 170 S 1400 330, 1660 240",
  "M-40 330 C 200 270, 330 430, 560 360 S 900 210, 1120 290 S 1440 440, 1660 360",
  "M-40 470 C 220 400, 360 560, 600 480 S 940 330, 1160 420 S 1480 570, 1660 480",
  "M-40 610 C 240 530, 380 700, 640 610 S 980 470, 1200 560 S 1500 700, 1660 610",
  "M-40 750 C 260 670, 400 840, 680 750 S 1020 620, 1240 700 S 1520 830, 1660 750",
];

export default function HeroField() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      data-hero-field
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
    >
      {CONTOURS.map((path) => (
        <path
          key={path}
          d={path}
          stroke="currentColor"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}
