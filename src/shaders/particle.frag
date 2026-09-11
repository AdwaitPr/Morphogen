// ═══════════════════════════════════════════════════════════
// BioSynth Lab — Nutrient Particle Fragment Shader
// ═══════════════════════════════════════════════════════════

#ifdef GL_ES
precision highp float;
#endif

varying float v_alpha;

const vec3 PARTICLE_COLOR = vec3(0.45, 0.85, 0.78); // Luminous teal

void main() {
  // Circular soft particle disk
  float dist = length(gl_PointCoord - vec2(0.5));
  if (dist > 0.5) {
    discard;
  }

  // Soft glow edge falloff
  float glow = smoothstep(0.5, 0.0, dist);
  gl_FragColor = vec4(PARTICLE_COLOR, v_alpha * glow);
}
