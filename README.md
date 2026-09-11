# 🧬 Morphogen — Parametric In-Silico Organism Evolution Engine

> **A portfolio-grade, interactive 3D laboratory where synthetic organisms evolve in real time through parametric genetic controls, custom GLSL shaders, and three-tier reactive state architecture.**

[![GitHub](https://img.shields.io/badge/GitHub-AdwaitPr%2FMorphogen-181717?style=flat-square&logo=github)](https://github.com/AdwaitPr/Morphogen)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb?style=flat-square&logo=react)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-r182-black?style=flat-square&logo=three.js)](https://threejs.org/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Tests](https://img.shields.io/badge/Vitest-18%2F18%20Passed-brightgreen?style=flat-square&logo=vitest)](https://vitest.dev/)

---

## 🔬 System Overview

**Morphogen** is an interactive synthetic biology simulation chamber designed as a high-performance sci-fi biolab workstation. Users manipulate the genetic loci of an in-silico organism, watching its cellular membrane morph, branch tentacles, pulse bioluminescence, and alter surface topology at a locked 60 FPS.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            BIOSYNTH LAB HUD                                 │
├───────────────────────┬─────────────────────────────┬───────────────────────┤
│    CONTROL PANEL      │    3D SIMULATION CHAMBER    │  TELEMETRY & CHARTS   │
│                       │                             │                       │
│ • 8 Parametric Loci   │ • 5,120-tri Icosphere Mesh  │ • Real-time FPS       │
│ • 3-Tier Gene Sliders │ • Simplex 3D + FBM Vertex   │ • ATP Synthesis Tween │
│ • 4 Morphing Presets  │   Displacement & Normals    │ • Cell Viability      │
│ • Environmental Props │ • Instanced Surface Limbs   │ • D3 8-Axis Radar     │
│   (Temp, Viscosity)   │ • Instanced DNA Helix       │ • D3 60s Biomass Curve│
│                       │ • GPU Nutrient Particles    │ • Live Mutation Log   │
├───────────────────────┴─────────────────────────────┴───────────────────────┤
│ FOOTER: Sim Clock [Tick: 00142] • [SPACE] Pause • [R] Reset • [E] Evolve     │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## ⚡ Architectural Highlights

### 1. Three-Tier Slider Feedback Model
Dragging a slider must never choke the React render cycle or drop frames below 60fps. BioSynth Lab decouples user interaction into three distinct tiers:

```
                  ┌──────────────────────────────────────────────┐
                  │          USER POINTER INTERACTION            │
                  └──────┬──────────────────┬─────────────────┬──┘
                         │                  │                 │
             Tier 1 (Hot Path)     Tier 2 (Warm Path)  Tier 3 (Cold Path)
             [Every pointermove]   [Throttled 100ms]   [PointerUp / Commit]
                         │                  │                 │
                         ▼                  ▼                 ▼
                  Direct Mutation      Zustand Store     Local Storage,
                  of genomeRefs &       (Telemetry &      CRC32 Seed &
                  Shader Uniforms        D3 Charts)         URL Hash
                  (Zero Re-renders)
```

- **Tier 1 (Hot Path — 60 FPS):** Mutates mutable ref containers (`genomeRefs`) directly. `useFrame` copies these values straight into WebGL uniforms (`u_mutagen`, `u_growth`, etc.) with zero React reconciliation.
- **Tier 2 (Warm Path — Throttled 100ms):** Throttled sync into Zustand state to feed DOM telemetry displays, numerical readouts, and the D3 radar chart without thrashing.
- **Tier 3 (Cold Path — PointerUp):** Final atomic commit updating URL parameters with CRC32 checksums, history push state, and local persistence.
- **DragLock Protection:** While dragging any locus, incoming external events (preset morphs, keyboard evolution) cannot clobber the active slider ref.

### 2. CPU / GPU Noise Parity for Surface-Attached Tentacles
To mount instanced tentacle limbs precisely onto the undulating cellular membrane without clipping or floating:
- Both vertex shader (`organism.vert`) and TypeScript engine (`src/utils/noise.ts`) implement Stefan Gustavson's deterministic Simplex 3D Noise with 3-octave Fractional Brownian Motion (FBM).
- Branch root positions and normal orientations are computed on the CPU matching shader vertex displacements:
  $$\vec{P}_{\text{surface}} = \vec{P}_{\text{base}} \cdot \left(1.0 + \text{FBM}(\vec{P}_{\text{base}} \cdot \omega) \cdot A\right)$$
- An automated unit test verifies mathematical parity across 100 pseudo-random 3D points bounded within $[-1.0, 1.0]$.

### 3. Procedural GLSL Shaders
- **Finite-Difference Normal Recalculation:** Instead of distorted sphere normals, surface normals are dynamically computed in the vertex shader using central differences:
  $$\vec{N} = \text{normalize}\left(\frac{\partial \vec{P}}{\partial u} \times \frac{\partial \vec{P}}{\partial v}\right)$$
- **Fresnel Rim & Bioluminescence:** Custom fragment shader calculates viewing-angle fresnel intensity to produce a luminous, semi-translucent deep-sea biological sheen.
- **Radial Symmetry Folding:** Dynamic angular domain folding (`u_symmetry`) creates 2-fold to 8-fold kaleidoscopic organism forms.

### 4. Compact Binary Seed & CRC32 Tampering Detection
Genomes can be shared via URL hash or string seeds:
$$\text{Format: } \texttt{v1:<4-char-crc32>:<base64-float32-payload>}$$
- Encodes all 8 continuous parameters into an 8-float (32-byte) binary buffer.
- Verified against bitwise CRC32 lookup tables on load. Tampered or corrupted URLs fail gracefully back to homeostasis defaults.

---

## 📊 Live Data Visualizations (D3.js)

- **8-Axis Morphology Radar:** Custom D3.js chart plotting normalized locus values (`BRAN`, `SYMM`, `BIOL`, `HUE`, `SATU`, `PULS`, `MUTA`, `GROW`) with glowing semi-transparent polygonal fills and reactive vertices.
- **Population Dynamics Sparkline:** Real-time 60-second historical biomass tracker driven by simulation ticks, computed using `d3.curveMonotoneX` with strict Y-clamping $[0.0, 2.0]$.

---

## ⌨️ Keyboard & Accessibility Controls

| Key | Action | Description |
| :--- | :--- | :--- |
| <kbd>Space</kbd> | **Pause / Resume** | Freezes simulation ticks, noise evolution, and particle dynamics |
| <kbd>R</kbd> | **Homeostasis Reset** | Smoothly resets all genetic parameters to calibrated baseline |
| <kbd>E</kbd> | **Evolve / Randomize** | Generates bounded random mutations across all 8 loci |
| <kbd>1</kbd>–<kbd>4</kbd> | **Morph Presets** | Morph directly into `SPORE`, `FERN`, `POLYP`, or `ABERRATION` |
| <kbd>H</kbd> | **Workstation Tour** | Opens the interactive 3-step biolab walkthrough |
| <kbd>Esc</kbd> | **Dismiss / Skip** | Closes overlays, skips boot sequence, closes a11y menus |

- **Colorblind Support:** Deuteranopia/protanopia-safe high-contrast color palette toggleable via header `[A11Y / OPT]`.
- **Reduced Motion:** Respects OS preferences (`prefers-reduced-motion`) and offers manual override to halt GSAP tweens and camera oscillations.
- **Adaptive Quality Manager:** Monitors runtime frame rates and automatically scales down DPR and particle density if client dips below 45 FPS.

---

## 🛠️ Tech Stack & Dependencies

- **Core:** React 18, TypeScript 5.9, Vite 8.3
- **3D Graphics:** Three.js (r182), `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`
- **Shaders:** GLSL 3.0, `vite-plugin-glsl`
- **Visualizations:** D3.js (v7)
- **Animation & Audio:** GSAP 3.14, Motion 12, Tone.js
- **Styling:** Tailwind CSS v3, CSS Custom Properties Design Tokens
- **Testing:** Vitest, testing-library

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation
```bash
# Clone repository
git clone https://github.com/AdwaitPr/Morphogen.git
cd Morphogen

# Install dependencies
npm install

# Start local development server
npm run dev
```
Navigate to `http://localhost:5173/` in your browser.

### Running Test Suite
```bash
npm test
```
Runs 18 unit and integration tests covering:
1. Simplex 3D and FBM Noise numerical parity and bounds
2. CRC32 binary seed encoding, decoding, and tamper resistance
3. Genome store clamping, presets, and DragLock concurrency protection

### Production Build
```bash
npm run build
```

---

## 📜 License
MIT © 2026 Morphogen Contributors.
