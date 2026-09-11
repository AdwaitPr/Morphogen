/**
 * BioSynth Lab — GLSL Shader Module Declarations
 *
 * Allows importing .vert, .frag, and .glsl files as raw strings
 * via vite-plugin-glsl's import preprocessing.
 */

declare module '*.vert' {
  const shader: string;
  export default shader;
}

declare module '*.frag' {
  const shader: string;
  export default shader;
}

declare module '*.glsl' {
  const shader: string;
  export default shader;
}
