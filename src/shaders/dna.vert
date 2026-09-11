// ═══════════════════════════════════════════════════════════
// BioSynth Lab — DNA Helix Vertex Shader
// ═══════════════════════════════════════════════════════════

uniform float u_time;
varying vec3 v_position;
varying float v_alpha;

void main() {
  v_position = position;

  // Gentle floating drift
  vec3 pos = position;
  pos.y += sin(u_time * 0.2 + position.x) * 0.1;

  vec4 mvPosition = modelViewMatrix * instanceMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  // Depth attenuation: farther helices fade gently into dark backdrop
  float depth = -mvPosition.z;
  v_alpha = smoothstep(25.0, 5.0, depth) * 0.35;
}
