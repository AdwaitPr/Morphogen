// ═══════════════════════════════════════════════════════════
// BioSynth Lab — Organism Fragment Shader
// Bioluminescence, Fresnel rim illumination, and iridescent cellular membrane
// ═══════════════════════════════════════════════════════════

#ifdef GL_ES
precision highp float;
#endif

uniform float u_time;
uniform float u_bioluminescence; // [0.0, 1.0] — Emissive intensity
uniform vec3 u_baseColor;        // Primary cellular base color

varying vec3 v_normal;
varying vec3 v_viewDir;
varying float v_displacement;
varying vec3 v_worldPos;

// Lab color palette constants
const vec3 RIM_TEAL = vec3(0.31, 0.71, 0.67);  // #4FB6AC
const vec3 RIM_AMBER = vec3(0.91, 0.64, 0.24); // #E8A33D
const vec3 GLOW_LIME = vec3(0.64, 0.84, 0.37); // #A4D65E

void main() {
  vec3 N = normalize(v_normal);
  vec3 V = normalize(v_viewDir);

  // ── 1. Diffuse Shading with Directional Lighting ──
  vec3 lightDir = normalize(vec3(1.0, 1.2, 1.0));
  float diff = max(dot(N, lightDir), 0.0);
  float wrapDiff = (dot(N, lightDir) + 0.3) / 1.3; // Half-Lambert soft subsurface wrap
  wrapDiff = max(wrapDiff, 0.0);

  // ── 2. Cellular Base Color + Internal Depth Modulation ──
  // Deeper crevices appear darker teal/cyan; peaks catch translucency
  vec3 surfaceColor = u_baseColor * (0.6 + 0.4 * wrapDiff);
  surfaceColor += vec3(0.02, 0.08, 0.07) * (v_displacement * 2.5);

  // ── 3. Fresnel Rim Glow ──
  float NdotV = max(dot(N, V), 0.0);
  float fresnel = pow(1.0 - NdotV, 2.5);
  
  // Dual-tone rim: Teal forward, subtle Amber rim on opposite glance
  float amberBlend = smoothstep(-0.2, 0.6, -N.x);
  vec3 rimColor = mix(RIM_TEAL, RIM_AMBER, amberBlend * 0.45);
  vec3 rim = rimColor * fresnel * 1.2;

  // ── 4. Bioluminescent Emissive Core ──
  // Modulate bioluminescence with displacement ripples and pulse
  float pulseMod = 0.85 + 0.15 * sin(u_time * 2.0 + v_displacement * 10.0);
  vec3 bioEmission = mix(RIM_TEAL, GLOW_LIME, 0.3 + 0.2 * sin(u_time)) 
                   * u_bioluminescence * pulseMod;

  // Emissive concentrates in folds and pulses outwards
  bioEmission *= (0.7 + 0.6 * fresnel + max(-v_displacement * 2.0, 0.0));

  // ── 5. Specular Highlight (Membrane Wetness) ──
  vec3 H = normalize(lightDir + V);
  float spec = pow(max(dot(N, H), 0.0), 32.0) * 0.4;
  vec3 specular = vec3(1.0) * spec;

  // ── 6. Final Composite ──
  vec3 finalColor = surfaceColor + rim + bioEmission + specular;

  gl_FragColor = vec4(finalColor, 1.0);
}
