// ═══════════════════════════════════════════════════════════
// BioSynth Lab — Nutrient Particle Vertex Shader
// ═══════════════════════════════════════════════════════════

uniform float u_time;
uniform float u_pulseRate;

attribute float a_scale;
attribute float a_phase;

varying float v_alpha;

void main() {
  vec3 pos = position;

  // Gentle upward drift with looping bounds
  float drift = u_time * 0.2 + a_phase;
  pos.y = mod(pos.y + drift + 6.0, 12.0) - 6.0;

  // Pulse expansion reaction
  float pulse = sin(u_time * u_pulseRate + a_phase) * 0.15;
  pos += normalize(pos) * pulse;

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  // Point size attenuation with camera distance
  gl_PointSize = (24.0 * a_scale) * (1.0 / -mvPosition.z);

  // Fade near edges of chamber
  float dist = length(pos);
  v_alpha = smoothstep(6.0, 1.5, dist) * 0.6;
}
