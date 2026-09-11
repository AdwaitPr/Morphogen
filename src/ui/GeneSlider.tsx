import React, { useRef, useState, useEffect, useCallback } from 'react';
import { GenomeParamKey, GENOME_META } from '../types/genome';
import { updateGenomeRef } from '../store/genomeRefs';
import { useGenomeStore } from '../store/genomeStore';
import { useUIStore } from '../store/uiStore';

interface GeneSliderProps {
  param: GenomeParamKey;
}

export const GeneSlider: React.FC<GeneSliderProps> = ({ param }) => {
  const meta = GENOME_META[param];
  const storeValue = useGenomeStore((state) => state.params[param]);
  const setParam = useGenomeStore((state) => state.setParam);
  const setDragLock = useUIStore((state) => state.setDragLock);

  // Local display state for responsive feedback
  const [displayValue, setDisplayValue] = useState<number>(storeValue);
  const isDragging = useRef<boolean>(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const lastThrottleTime = useRef<number>(0);

  // Synchronize displayValue with external store changes when NOT dragging
  useEffect(() => {
    if (!isDragging.current) {
      setDisplayValue(storeValue);
    }
  }, [storeValue]);

  // Convert client coordinate to clamped value
  const calculateValueFromPointer = useCallback(
    (clientX: number) => {
      if (!trackRef.current) return meta.default;
      const rect = trackRef.current.getBoundingClientRect();
      const fraction = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const raw = meta.min + fraction * (meta.max - meta.min);

      // Quantize to step
      const steps = Math.round((raw - meta.min) / meta.step);
      const stepped = meta.min + steps * meta.step;
      return parseFloat(Math.min(meta.max, Math.max(meta.min, stepped)).toFixed(2));
    },
    [meta]
  );

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    isDragging.current = true;
    setDragLock(param);

    const val = calculateValueFromPointer(e.clientX);
    setDisplayValue(val);
    updateGenomeRef(param, val); // Tier 1: hot path
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;

    const val = calculateValueFromPointer(e.clientX);
    setDisplayValue(val);
    updateGenomeRef(param, val); // Tier 1: hot path ref update (0ms, 60fps)

    // Tier 2: throttled Zustand commit (~10fps / 100ms)
    const now = performance.now();
    if (now - lastThrottleTime.current > 100) {
      setParam(param, val);
      lastThrottleTime.current = now;
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Ignored if pointer was lost
    }
    isDragging.current = false;
    setDragLock(null);

    const finalVal = calculateValueFromPointer(e.clientX);
    setDisplayValue(finalVal);
    updateGenomeRef(param, finalVal);
    setParam(param, finalVal); // Tier 3: cold path final commit
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    let nextVal = displayValue;
    const largeStep = meta.step * 10;

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        nextVal = e.shiftKey ? displayValue + largeStep : displayValue + meta.step;
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        nextVal = e.shiftKey ? displayValue - largeStep : displayValue - meta.step;
        break;
      case 'Home':
        nextVal = meta.min;
        break;
      case 'End':
        nextVal = meta.max;
        break;
      default:
        return;
    }

    e.preventDefault();
    const clamped = parseFloat(Math.min(meta.max, Math.max(meta.min, nextVal)).toFixed(2));
    setDisplayValue(clamped);
    updateGenomeRef(param, clamped);
    setParam(param, clamped);
  };

  const fillPercent = Math.max(
    0,
    Math.min(100, ((displayValue - meta.min) / (meta.max - meta.min)) * 100)
  );

  return (
    <div className="space-y-1.5 font-mono select-none">
      {/* Label and Value readout */}
      <div className="flex justify-between items-center text-xs">
        <span className="text-text-primary font-medium tracking-wide">
          {meta.label}
        </span>
        <span className="text-accent-teal font-medium tabular-nums">
          {displayValue} {meta.unit ? <span className="text-[10px] text-text-muted">{meta.unit}</span> : null}
        </span>
      </div>

      {/* Accessible Interactive Slider Track */}
      <div
        ref={trackRef}
        role="slider"
        tabIndex={0}
        aria-label={meta.ariaLabel}
        aria-valuenow={displayValue}
        aria-valuemin={meta.min}
        aria-valuemax={meta.max}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onKeyDown={handleKeyDown}
        className="relative h-6 bg-bg-elevated rounded border border-border-subtle overflow-hidden flex items-center px-1 cursor-ew-resize group hover:border-accent-teal/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-teal transition-all"
      >
        {/* Progress Fill Bar */}
        <div
          className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-accent-teal/30 to-accent-lime/30 border-r border-accent-teal"
          style={{ width: `${fillPercent}%` }}
        />

        {/* Thumb Handle */}
        <div
          className="absolute w-2.5 h-4.5 bg-accent-teal rounded-sm shadow-glow-teal transform -translate-x-1/2 group-hover:scale-110 transition-transform pointer-events-none"
          style={{ left: `${fillPercent}%` }}
        />

        {/* Min/Max subtle limits */}
        <div className="relative z-10 w-full flex justify-between text-[9px] text-text-muted px-1.5 pointer-events-none">
          <span>{meta.min}</span>
          <span>{meta.max}</span>
        </div>
      </div>
    </div>
  );
};
