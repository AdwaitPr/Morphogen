/**
 * BioSynth Lab — Motion Language
 *
 * Centralized animation presets for GSAP and Motion (Framer Motion v11+).
 * All motion constants are defined here to maintain consistency across
 * the application and enable easy reduced-motion overrides.
 *
 * Motion Language:
 * - Knob adjust:    power2.out, 200ms
 * - Organic pulse:  elastic.out(1, 0.4), 800ms
 * - Panel slide:    spring({ stiffness: 260, damping: 28 })
 * - Mutation morph:  power3.inOut, 600ms (GSAP timeline)
 */

// ── GSAP Ease Presets ──

export const EASE = {
  /** Slider knob response — snappy, responsive */
  knobAdjust: 'power2.out',

  /** Organic pulsing — bouncy, alive */
  organicPulse: 'elastic.out(1, 0.4)',

  /** Mutation morph — smooth, cinematic */
  mutationMorph: 'power3.inOut',

  /** Generic ease out — general purpose */
  out: 'power2.out',

  /** Generic ease in-out — transitions */
  inOut: 'power2.inOut',
} as const;

// ── GSAP Duration Presets (seconds) ──

export const DURATION = {
  /** Slider feedback, micro-interactions */
  fast: 0.2,

  /** Metric tween, label transitions */
  medium: 0.3,

  /** Preset morph, major transitions */
  morph: 0.6,

  /** Organic pulse cycle */
  pulse: 0.8,

  /** Boot sequence line delay */
  bootLine: 0.3,
} as const;

// ── Motion (Framer Motion) Spring Configs ──

export const SPRING = {
  /** Panel slide — responsive but controlled */
  panel: { stiffness: 260, damping: 28 },

  /** Tooltip entry — gentle arrival */
  tooltip: { stiffness: 300, damping: 30 },

  /** Bounce — playful micro-interaction */
  bounce: { stiffness: 400, damping: 15 },

  /** Smooth — slow, deliberate transitions */
  smooth: { stiffness: 100, damping: 20 },
} as const;

// ── Preset Morph Timeline Config ──

export const MORPH = {
  /** Total morph duration in seconds */
  duration: DURATION.morph,

  /** Stagger between each parameter's tween start (seconds) */
  stagger: 0.03,

  /** GSAP ease for the morph */
  ease: EASE.mutationMorph,

  /** Number of parameters tweened */
  paramCount: 8,
} as const;

// ── Throttle Intervals (ms) ──

export const THROTTLE = {
  /** Tier 2 store commit during slider drag */
  sliderStore: 100,

  /** URL sync debounce after Tier 3 commit */
  urlSync: 500,

  /** Population graph data sampling during morph */
  morphSample: 100,
} as const;
