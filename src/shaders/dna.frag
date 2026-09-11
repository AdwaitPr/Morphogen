// ═══════════════════════════════════════════════════════════
// BioSynth Lab — DNA Helix Fragment Shader
// ═══════════════════════════════════════════════════════════

#ifdef GL_ES
precision highp float;
#endif

varying vec3 v_position;
varying float v_alpha;

const vec3 HELIX_TEAL = vec3(0.31, 0.71, 0.67);

void main() {
  // Translucent glowing strand
  gl_FragColor = vec4(HELIX_TEAL, v_alpha);
}
