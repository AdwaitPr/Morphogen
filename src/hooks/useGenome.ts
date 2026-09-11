import { useGenomeStore } from '../store/genomeStore';
import { GenomeParamKey } from '../types/genome';
import { useShallow } from 'zustand/react/shallow';

/**
 * useGenome
 *
 * Typed selector hook with useShallow for accessing genome params and actions.
 */
export function useGenome() {
  const { params, setParam, applyPreset, randomize, resetToDefault } = useGenomeStore(
    useShallow((state) => ({
      params: state.params,
      setParam: state.setParam,
      applyPreset: state.applyPreset,
      randomize: state.randomize,
      resetToDefault: state.resetToDefault,
    }))
  );

  return {
    params,
    setParam,
    applyPreset,
    randomize,
    resetToDefault,
  };
}

/**
 * useSingleGene
 *
 * Efficiently selects a single gene value and setter.
 */
export function useSingleGene(key: GenomeParamKey) {
  const value = useGenomeStore((state) => state.params[key]);
  const setParam = useGenomeStore((state) => state.setParam);

  return [value, (val: number) => setParam(key, val)] as const;
}
