import { GenomeParams, GenomeParamKey, GENOME_META, clampParam, getDefaultGenome } from '../types/genome';

/**
 * BioSynth Lab — Genome Seed & Encoding System
 *
 * Implements compact binary packing with CRC32 checksum verification and v1 schema versioning.
 * Format: `v1:<4-char-crc>:<base64-payload>`
 */

// CRC32 Lookup Table
const crcTable: Uint32Array = (() => {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c;
  }
  return table;
})();

export function computeCRC32(bytes: Uint8Array): number {
  let crc = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) {
    crc = (crc >>> 8) ^ crcTable[(crc ^ bytes[i]) & 0xff];
  }
  return (crc ^ 0xffffffff) >>> 0;
}

// Ordered keys for packing
export const PACKED_GENE_KEYS: GenomeParamKey[] = [
  'branchCount',
  'symmetry',
  'bioluminescence',
  'hue',
  'saturation',
  'pulseRate',
  'mutagen',
  'growth',
];

/**
 * Encodes a GenomeParams object into a versioned, checksummed URL seed string.
 */
export function encodeGenomeSeed(params: GenomeParams): string {
  const floatArray = new Float32Array(PACKED_GENE_KEYS.length);
  PACKED_GENE_KEYS.forEach((key, index) => {
    floatArray[index] = params[key] ?? GENOME_META[key].default;
  });

  const uint8Bytes = new Uint8Array(floatArray.buffer);
  const crc = computeCRC32(uint8Bytes);
  const crcHex = crc.toString(16).padStart(8, '0').slice(-4); // 4-char CRC

  // Base64 encode the byte array
  let binary = '';
  for (let i = 0; i < uint8Bytes.byteLength; i++) {
    binary += String.fromCharCode(uint8Bytes[i]);
  }
  const base64 = btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  return `v1:${crcHex}:${base64}`;
}

/**
 * Decodes a versioned URL seed string into a clamped GenomeParams object.
 * Returns null if format is invalid or checksum mismatches.
 */
export function decodeGenomeSeed(seedString: string): GenomeParams | null {
  if (!seedString || !seedString.startsWith('v1:')) {
    return null;
  }

  const parts = seedString.split(':');
  if (parts.length !== 3) {
    return null;
  }

  const [, expectedCrc, base64Payload] = parts;

  try {
    // Restore base64 padding and characters
    let base64 = base64Payload.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4 !== 0) {
      base64 += '=';
    }

    const binary = atob(base64);
    const uint8Bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      uint8Bytes[i] = binary.charCodeAt(i);
    }

    // Verify CRC32
    const actualCrc = computeCRC32(uint8Bytes);
    const actualCrcHex = actualCrc.toString(16).padStart(8, '0').slice(-4);

    if (actualCrcHex.toLowerCase() !== expectedCrc.toLowerCase()) {
      console.warn(`BioSynth: Checksum mismatch (expected ${expectedCrc}, got ${actualCrcHex})`);
      return null;
    }

    if (uint8Bytes.byteLength < PACKED_GENE_KEYS.length * 4) {
      return null;
    }

    const floatArray = new Float32Array(uint8Bytes.buffer, 0, PACKED_GENE_KEYS.length);
    const result = getDefaultGenome();

    PACKED_GENE_KEYS.forEach((key, index) => {
      const rawVal = floatArray[index];
      if (Number.isFinite(rawVal)) {
        result[key] = clampParam(key, rawVal);
      }
    });

    return result;
  } catch (err) {
    console.warn('BioSynth: Failed to decode genome seed:', err);
    return null;
  }
}
