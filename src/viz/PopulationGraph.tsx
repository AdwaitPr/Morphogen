import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { useGenomeStore } from '../store/genomeStore';
import { useSimulationStore } from '../store/simulationStore';

const WIDTH = 240;
const HEIGHT = 80;
const MARGIN = { top: 6, right: 8, bottom: 18, left: 24 };

export const PopulationGraph: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const { growth, branchCount } = useGenomeStore((state) => state.params);
  const paused = useSimulationStore((state) => state.paused);

  // Biological biomass formula: growth * (1 + branchCount / 12)
  const currentBioMass = growth * (1 + branchCount / 12);

  // 30 rolling data points
  const [dataPoints, setDataPoints] = useState<number[]>(() =>
    Array.from({ length: 30 }, () => currentBioMass)
  );

  useEffect(() => {
    if (paused) return;

    const interval = window.setInterval(() => {
      setDataPoints((prev) => {
        const next = [...prev.slice(1)];
        // Add small jitter to simulate living cellular fluctuations
        const jitter = (Math.random() - 0.5) * 0.04;
        const clampedVal = Math.max(0, Math.min(2.0, currentBioMass + jitter));
        next.push(clampedVal);
        return next;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [currentBioMass, paused]);

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const innerWidth = WIDTH - MARGIN.left - MARGIN.right;
    const innerHeight = HEIGHT - MARGIN.top - MARGIN.bottom;

    const g = svg
      .append('g')
      .attr('transform', `translate(${MARGIN.left}, ${MARGIN.top})`);

    // Scale X & Y (Y is clamped strictly to [0, 2])
    const xScale = d3
      .scaleLinear()
      .domain([0, dataPoints.length - 1])
      .range([0, innerWidth]);

    const yScale = d3
      .scaleLinear()
      .domain([0, 2.0])
      .range([innerHeight, 0]);

    // Grid lines
    [0.5, 1.0, 1.5].forEach((val) => {
      g.append('line')
        .attr('x1', 0)
        .attr('x2', innerWidth)
        .attr('y1', yScale(val))
        .attr('y2', yScale(val))
        .attr('stroke', '#23262B')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '2,2');
    });

    // Area Generator
    const areaGen = d3
      .area<number>()
      .x((_, i) => xScale(i))
      .y0(innerHeight)
      .y1((d) => yScale(Math.max(0, Math.min(2.0, d))))
      .curve(d3.curveMonotoneX);

    // Line Generator
    const lineGen = d3
      .line<number>()
      .x((_, i) => xScale(i))
      .y((d) => yScale(Math.max(0, Math.min(2.0, d))))
      .curve(d3.curveMonotoneX);

    // Gradient Def
    const defs = svg.append('defs');
    const grad = defs
      .append('linearGradient')
      .attr('id', 'popGrad')
      .attr('x1', '0')
      .attr('y1', '0')
      .attr('x2', '0')
      .attr('y2', '1');

    grad
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#4FB6AC')
      .attr('stop-opacity', '0.35');

    grad
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#4FB6AC')
      .attr('stop-opacity', '0.0');

    // Render Area
    g.append('path')
      .datum(dataPoints)
      .attr('d', areaGen)
      .attr('fill', 'url(#popGrad)');

    // Render Line
    g.append('path')
      .datum(dataPoints)
      .attr('d', lineGen)
      .attr('fill', 'none')
      .attr('stroke', '#4FB6AC')
      .attr('stroke-width', 1.5);

    // Y Axis label
    g.append('text')
      .attr('x', -2)
      .attr('y', yScale(1.8))
      .attr('text-anchor', 'end')
      .attr('font-size', '8px')
      .attr('font-family', 'var(--font-mono)')
      .attr('fill', '#8B9198')
      .text('2.0');

    g.append('text')
      .attr('x', -2)
      .attr('y', yScale(0.1))
      .attr('text-anchor', 'end')
      .attr('font-size', '8px')
      .attr('font-family', 'var(--font-mono)')
      .attr('fill', '#8B9198')
      .text('0.0');
  }, [dataPoints]);

  return (
    <div className="w-full flex justify-center items-center">
      <svg
        ref={svgRef}
        width={WIDTH}
        height={HEIGHT}
        className="overflow-visible"
        aria-label="Population Dynamics Growth Curve"
      />
    </div>
  );
};
