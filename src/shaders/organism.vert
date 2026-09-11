// ═══════════════════════════════════════════════════════════
// BioSynth Lab — Organism Vertex Shader
// Parametric procedural displacement & dynamic normal recalculation
// ═══════════════════════════════════════════════════════════

#include ./noise.glsl

uniform float u_time;          // Elapsed simulation time (seconds)
uniform float u_growth;        // [0, 1] — Primary displacement magnitude
uniform float u_mutagen;       // [0, 1] — High-frequency mutagenic noise distortion
uniform float u_pulseRate;     // [0.1, 3.0] — Metabolic breathing cycle speed
uniform float u_symmetry;      // [0, 1] — Radial symmetry folding intensity

varying vec3 v_normal;
varying vec3 v_viewDir;
varying float v_displacement;
varying vec3 v_worldPos;

/**
 * Calculates scalar displacement magnitude at any 3D coordinate point.
 * Matches the CPU displacement function in src/utils/noise.ts
 */
float getDisplacement(vec3 p) {
  vec3 pSym = p;

  // Radial symmetry coordinate folding
  if (u_symmetry > 0.01) {
    float angle = atan(p.z, p.x);
    float radius = length(p.xz);
    float folds = 5.0; // 5-fold bio-symmetric petals
    float segment = 6.2831853 / folds;
    float modAngle = abs(mod(angle + segment * 0.5, segment) - segment * 0.5);
    vec2 symXZ = vec2(cos(modAngle), sin(modAngle)) * radius;
    pSym.xz = mix(p.xz, symXZ, u_symmetry);
  }

  // 1. Primary 3-octave FBM noise
  vec3 noiseCoord = pSym * 2.0 + vec3(u_time * 0.1);
  float fbmVal = fbm3(noiseCoord);

  // 2. High-frequency mutagen distortion
  float mutagenVal = 0.0;
  if (u_mutagen > 0.0) {
    mutagenVal = snoise(pSym * 8.0) * u_mutagen * 0.25;
  }

  // 3. Breathing pulse oscillation
  float pulseVal = sin(u_time * u_pulseRate) * 0.05;

  // 4. Combined displacement modulated by growth factor
  return (fbmVal * 0.4 + mutagenVal + pulseVal) * u_growth;
}

void main() {
  // Compute displacement at current vertex position
  float disp = getDisplacement(position);
  v_displacement = disp;

  // Displace vertex along outward normal
  vec3 displacedPos = position + normal * disp;

  // ── Finite Differences Normal Recalculation ──
  // Perturb along tangent and bitangent to recover smooth lighting normals
  float eps = 0.01;
  vec3 tangent = normalize(cross(normal, vec3(0.0, 1.0, 0.0)));
  if (length(tangent) < 0.001) {
    tangent = normalize(cross(normal, vec3(1.0, 0.0, 0.0)));
  }
  vec3 bitangent = normalize(cross(normal, tangent));

  vec3 pTangent = position + tangent * eps;
  vec3 pBitangent = position + bitangent * eps;

  vec3 dispTangent = pTangent + normal * getDisplacement(pTangent);
  vec3 dispBitangent = pBitangent + normal * getDisplacement(pBitangent);

  vec3 newNormal = normalize(cross(dispTangent - displacedPos, dispBitangent - displacedPos));
  
  // Transform normal to view/model space
  v_normal = normalize(normalMatrix * newNormal);

  // Calculate world position & view direction for fresnel lighting
  vec4 worldPos = modelMatrix * vec4(displacedPos, 1.0);
  v_worldPos = worldPos.xyz;
  v_viewDir = normalize(cameraPosition - worldPos.xyz);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(displacedPos, 1.0);
}
