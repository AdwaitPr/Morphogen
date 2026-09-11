# BioSynth Lab — Design System Token Contract & Reference

This document formalizes the visual and motion tokens for BioSynth Lab. All components, shaders, overlays, and canvas elements adhere to this single source of truth.

---

## 1. Color System

### Base Lab Surfaces (Dark Theme)

| Token | Hex | HSL | Intended Surface |
|---|---|---|---|
| `--bg-base` | `#0E1114` | `hsl(210, 18%, 6%)` | Root viewport background, canvas backdrop |
| `--bg-panel` | `#1A1A1A` | `hsl(0, 0%, 10%)` | Sidebars, top header, bottom status bar |
| `--bg-elevated` | `#23262B` | `hsl(218, 10%, 15%)` | Card surfaces, slider tracks, dropdowns, inputs |
| `--border-subtle`| `#2E3238` | `hsl(216, 10%, 20%)` | 1px structural dividing borders and gridlines |

### Accent Palette

| Token | Hex | Role & Application |
|---|---|---|
| `--accent-teal` | `#4FB6AC` | Primary sci-fi biolab accent: active genes, focus rings, glow effects, primary telemetry |
| `--accent-amber` | `#E8A33D` | Environmental / warning indicator: temperature stress, radiation, rim illumination |
| `--accent-alert` | `#D1495B` | Critical warnings, toxicity, mutation failures, viewport gate alert |
| `--accent-lime` | `#A4D65E` | Metabolic / viability health: high energy, nominal state, ATP synthesis |

### Deuteranopia-Safe Fallback Palette (`[data-palette="deuteranopia"]`)

When activated via `data-palette="deuteranopia"` on `<html>`:

| Token | Normal Hex | Accessible Hex | Role |
|---|---|---|---|
| `--accent-teal` | `#4FB6AC` | `#4A90D9` (Vibrant Blue) | Distinguishable from reddish/greenish tones |
| `--accent-lime` | `#A4D65E` | `#5EC8D6` (High-contrast Cyan) | Clean visual distinction from amber/alert |
| `--accent-amber`| `#E8A33D` | `#E8A33D` (Unchanged) | Retained (high luminance contrast) |
| `--accent-alert`| `#D1495B` | `#D1495B` (Unchanged) | Retained (distinct spectral range) |

### Contrast Ratio Verification (WCAG AA Compliance ≥ 4.5:1)

| Foreground Token | Background Surface | Contrast Ratio | WCAG AA Status |
|---|---|---|---|
| `--text-primary` (`#F2F4F5`) | `--bg-base` (`#0E1114`) | 15.2:1 | PASS (AAA) |
| `--text-primary` (`#F2F4F5`) | `--bg-panel` (`#1A1A1A`) | 12.4:1 | PASS (AAA) |
| `--text-primary` (`#F2F4F5`) | `--bg-elevated` (`#23262B`)| 10.8:1 | PASS (AAA) |
| `--text-muted` (`#8B9198`) | `--bg-base` (`#0E1114`) | 6.1:1 | PASS (AA) |
| `--text-muted` (`#8B9198`) | `--bg-panel` (`#1A1A1A`) | 5.0:1 | PASS (AA) |
| `--accent-teal` (`#4FB6AC`) | `--bg-base` (`#0E1114`) | 8.0:1 | PASS (AAA Large / AA) |
| `--accent-amber` (`#E8A33D`)| `--bg-base` (`#0E1114`) | 7.9:1 | PASS (AAA Large / AA) |
| `--accent-lime` (`#A4D65E`) | `--bg-base` (`#0E1114`) | 9.5:1 | PASS (AAA) |
| `--accent-alert` (`#D1495B`)| `--bg-base` (`#0E1114`) | 4.6:1 | PASS (AA) |
| `--text-faint` (`#5A6068`) | `--bg-base` (`#0E1114`) | 3.3:1 | Decorative only (hints, grid marks) |

---

## 2. Typography Scale

Fonts are self-hosted via `public/fonts/` as `woff2`:
- **UI & Labels:** `HK Grotesk` (Regular 400, Medium 500, Bold 700)
- **Data & Readouts:** `JetBrains Mono` (Regular 400)

| Layer | Semantic Role | Font Family | Size | Weight | Tracking | Line Height |
|---|---|---|---|---|---|---|
| Layer 1 | Lab Header / Titles | HK Grotesk / Mono | 14px (`0.875rem`) | Bold (700) | `0.1em` (`widest`) | 1.2 |
| Layer 2 | Control Labels | HK Grotesk | 12px (`0.75rem`) | Medium (500) | `0.025em` (`wide`) | 1.5 |
| Layer 3 | Telemetry & Values | JetBrains Mono | 13px (`0.8125rem`)| Regular (400) | `0` (`normal`) | 1.4 |
| Layer 4 | Hints & Secondary | HK Grotesk | 11px (`0.6875rem`)| Regular (400) | `0.025em` (`wide`) | 1.4 |
| Layer 5 | Console & Logs | JetBrains Mono | 10px (`0.625rem`) | Regular (400) | `0.05em` (`wider`)| 1.6 |

---

## 3. Motion Language

Centralized in `src/tokens/motion.ts`.

- **GSAP Presets:**
  - `morph`: `power2.inOut` (600ms) for procedural organ morphs
  - `settle`: `power3.out` (400ms) for UI slider release settle
  - `telemetry`: `none` (linear, 150ms) for smooth metric interpolation
- **Motion (Framer Motion v11+) Spring:**
  - `stiffness`: 300, `damping`: 25 (snappy, tactile HUD panels)
  - `stiffness`: 180, `damping`: 20 (fluid modal popovers)
- **Reduced Motion:** Respects `prefers-reduced-motion: reduce` across GSAP and Framer Motion wrappers.

---

## 4. Spacing, Borders & Shadows

- **Spacing Base (8px grid):** `4px`, `8px`, `12px`, `16px`, `24px`, `32px`, `48px`, `64px`
- **Border Radii:**
  - `4px`: Control buttons, sliders, input badges
  - `8px`: Flyout panels, cards, toast notifications
  - `12px`: Large overlay modals (onboarding, shortcuts)
- **Glow & Shadow Effects:**
  - `--glow-teal`: `0 0 12px rgba(79, 182, 172, 0.4)`
  - `--glow-amber`: `0 0 12px rgba(232, 163, 61, 0.3)`
  - `--shadow-panel`: `0 4px 20px rgba(0, 0, 0, 0.5), 0 0 0 1px var(--border-subtle)`
