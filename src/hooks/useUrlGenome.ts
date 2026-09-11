import { useEffect, useRef } from 'react';
import { useGenomeStore } from '../store/genomeStore';
import { encodeGenomeSeed, decodeGenomeSeed } from '../utils/genome';

/**
 * useUrlGenome
 *
 * Synchronizes genome parameters with the browser URL query parameter `?genome=v1:...`.
 * - Hydrates state on initial page load if URL seed is present
 * - Debounces URL updates on parameter changes to avoid browser history thrashing
 */
export function useUrlGenome() {
  const params = useGenomeStore((state) => state.params);
  const applyExternal = useGenomeStore((state) => state.applyExternal);
  const hydratedRef = useRef(false);
  const debounceTimerRef = useRef<number | null>(null);

  // 1. Initial hydration on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const searchParams = new URLSearchParams(window.location.search);
    const genomeQuery = searchParams.get('genome');

    if (genomeQuery) {
      const decoded = decodeGenomeSeed(genomeQuery);
      if (decoded) {
        applyExternal(decoded);
      }
    }
    hydratedRef.current = true;
  }, [applyExternal]);

  // 2. Debounced URL sync on parameter change
  useEffect(() => {
    if (!hydratedRef.current) return;
    if (typeof window === 'undefined') return;

    if (debounceTimerRef.current !== null) {
      window.clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = window.setTimeout(() => {
      const seed = encodeGenomeSeed(params);
      const url = new URL(window.location.href);
      url.searchParams.set('genome', seed);
      window.history.replaceState({}, '', url.toString());
    }, 250);

    return () => {
      if (debounceTimerRef.current !== null) {
        window.clearTimeout(debounceTimerRef.current);
      }
    };
  }, [params]);
}
