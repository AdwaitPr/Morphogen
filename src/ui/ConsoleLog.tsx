import React, { useState, useEffect, useRef } from 'react';
import { useGenomeStore } from '../store/genomeStore';

interface LogEntry {
  id: string;
  time: string;
  text: string;
  type: 'info' | 'warn' | 'success';
}

export const ConsoleLog: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([
    { id: '1', time: '16:15:02', text: 'ENGINE_INIT: GLSL 3.0 Core profile loaded', type: 'info' },
    { id: '2', time: '16:15:03', text: 'GENOME_LOAD: 8 parametric loci identified', type: 'info' },
    { id: '3', time: '16:15:04', text: 'SYS_STABLE: Chamber pressure 101.3 kPa', type: 'success' },
  ]);

  const params = useGenomeStore((state) => state.params);
  const prevParamsRef = useRef(params);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prev = prevParamsRef.current;
    const now = new Date();
    const timeStr = now.toTimeString().slice(0, 8);

    // Detect which parameter changed
    for (const key of Object.keys(params) as (keyof typeof params)[]) {
      if (prev[key] !== params[key]) {
        const entry: LogEntry = {
          id: Math.random().toString(),
          time: timeStr,
          text: `GENOME_MUTATION: ${key} -> ${params[key]}`,
          type: 'info',
        };
        setLogs((l) => [...l.slice(-15), entry]);
        break;
      }
    }
    prevParamsRef.current = params;
  }, [params]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="absolute bottom-4 left-4 w-88 h-28 bg-bg-panel/85 backdrop-blur border border-border-subtle rounded-lg p-2.5 font-mono text-[10px] flex flex-col justify-between shadow-panel z-10 pointer-events-auto">
      <div className="text-[9px] uppercase tracking-wider text-text-muted flex items-center justify-between border-b border-border-subtle/60 pb-1.5 shrink-0">
        <div className="flex items-center space-x-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-teal shadow-glow-teal animate-pulse" />
          <span className="font-bold text-text-primary">TERMINAL TELEMETRY LOG</span>
        </div>
        <span className="text-accent-teal text-[9px]">FEED: LIVE</span>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-1 pt-1.5 text-text-muted"
      >
        {logs.map((log) => (
          <div key={log.id} className="leading-tight flex space-x-1.5">
            <span className="text-text-faint shrink-0">[{log.time}]</span>
            <span
              className={
                log.type === 'success'
                  ? 'text-accent-lime'
                  : log.type === 'warn'
                  ? 'text-accent-amber'
                  : 'text-text-primary'
              }
            >
              {log.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
