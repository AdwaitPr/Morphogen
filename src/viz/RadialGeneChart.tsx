import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useGenomeStore } from '../store/genomeStore';
import { GENOME_META } from '../types/genome';
import { PACKED_GENE_KEYS } from '../utils/genome';

const WIDTH = 220;
const HEIGHT = 180;
const RADIUS = 65;
const CENTER_X = WIDTH / 2;
const CENTER_Y = HEIGHT / 2;

export const RadialGeneChart: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const params = useGenomeStore((state) => state.params);

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const g = svg
      .append('g')
      .attr('transform', `translate(${CENTER_X}, ${CENTER_Y})`);

    const totalAxes = PACKED_GENE_KEYS.length;
    const angleSlice = (Math.PI * 2) / totalAxes;

    // 1. Concentric reference grid octagons (25%, 50%, 75%, 100%)
    const levels = [0.25, 0.5, 0.75, 1.0];
    levels.forEach((level) => {
      const levelRadius = RADIUS * level;
      const points: [number, number][] = [];

      for (let i = 0; i < totalAxes; i++) {
        const angle = i * angleSlice - Math.PI / 2;
        points.push([
          Math.cos(angle) * levelRadius,
          Math.sin(angle) * levelRadius,
        ]);
      }

      g.append('polygon')
        .attr('points', points.map((p) => p.join(',')).join(' '))
        .attr('fill', 'none')
        .attr('stroke', '#2E3238')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', level === 1.0 ? 'none' : '2,2');
    });

    // 2. Axis spokes and labels
    PACKED_GENE_KEYS.forEach((key, i) => {
      const angle = i * angleSlice - Math.PI / 2;
      const x = Math.cos(angle) * RADIUS;
      const y = Math.sin(angle) * RADIUS;

      // Spoke line
      g.append('line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', x)
        .attr('y2', y)
        .attr('stroke', '#2E3238')
        .attr('stroke-width', 1);

      // Label text
      const labelRadius = RADIUS + 14;
      const lx = Math.cos(angle) * labelRadius;
      const ly = Math.sin(angle) * labelRadius;

      g.append('text')
        .attr('x', lx)
        .attr('y', ly + 3)
        .attr('text-anchor', 'middle')
        .attr('font-size', '8px')
        .attr('font-family', 'var(--font-mono)')
        .attr('fill', '#8B9198')
        .text(GENOME_META[key].label.slice(0, 4));
    });

    // 3. Compute normalized polygon coordinates [0, 1]
    const polygonPoints: [number, number][] = PACKED_GENE_KEYS.map((key, i) => {
      const meta = GENOME_META[key];
      const rawVal = params[key];
      // Normalize strictly between 0 and 1
      const normalized = Math.max(0, Math.min(1, (rawVal - meta.min) / (meta.max - meta.min)));
      const angle = i * angleSlice - Math.PI / 2;
      const r = normalized * RADIUS;

      return [Math.cos(angle) * r, Math.sin(angle) * r];
    });

    // 4. Render radar polygon with glowing fill
    g.append('polygon')
      .attr('points', polygonPoints.map((p) => p.join(',')).join(' '))
      .attr('fill', 'rgba(79, 182, 172, 0.25)')
      .attr('stroke', '#4FB6AC')
      .attr('stroke-width', 1.5);

    // 5. Data points on vertices
    polygonPoints.forEach(([x, y]) => {
      g.append('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', 2.5)
        .attr('fill', '#A4D65E')
        .attr('stroke', '#0E1114')
        .attr('stroke-width', 1);
    });
  }, [params]);

  return (
    <div className="w-full flex justify-center items-center py-1">
      <svg
        ref={svgRef}
        width={WIDTH}
        height={HEIGHT}
        className="overflow-visible"
        aria-label="Radial Genome Expression Radar Chart"
      />
    </div>
  );
};
