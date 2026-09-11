import React from 'react';

interface GeneToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  ariaLabel?: string;
}

export const GeneToggle: React.FC<GeneToggleProps> = ({
  label,
  checked,
  onChange,
  ariaLabel,
}) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel || label}
      onClick={() => onChange(!checked)}
      className="w-full flex items-center justify-between p-2 rounded bg-bg-elevated/40 border border-border-subtle hover:border-accent-teal/50 focus-visible:ring-2 focus-visible:ring-accent-teal transition-all font-mono text-xs"
    >
      <span className="text-text-primary">{label}</span>
      <div className="flex items-center space-x-2">
        {/* LED Indicator */}
        <span
          className={`w-2 h-2 rounded-full transition-colors ${
            checked
              ? 'bg-accent-teal shadow-glow-teal animate-pulse'
              : 'bg-text-faint/40'
          }`}
        />
        <span className="text-[10px] text-text-muted uppercase">
          {checked ? 'ENABLED' : 'OFF'}
        </span>
      </div>
    </button>
  );
};
