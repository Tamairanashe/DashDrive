// ────────────────────────────────────────────────────────────────
// Heat Map — Map Legend
// ────────────────────────────────────────────────────────────────

import type { HeatMapLayerId } from '../types';
import { LAYER_META } from '../types';

interface MapLegendProps {
  layer: HeatMapLayerId;
}

const INTENSITY_COLORS = [
  { color: '#22c55e', label: 'Healthy' },
  { color: '#eab308', label: 'Rising' },
  { color: '#f97316', label: 'Elevated' },
  { color: '#ef4444', label: 'Severe' },
  { color: '#a855f7', label: 'Critical' },
];

export function MapLegend({ layer }: MapLegendProps) {
  const meta = LAYER_META[layer];

  return (
    <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-slate-200 z-10">
      <h4 className="text-[10px] font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: meta.color }} />
        {meta.label} Layer
      </h4>
      <p className="text-[10px] text-slate-500 mb-2">{meta.description}</p>
      <div className="space-y-1">
        {INTENSITY_COLORS.map((ic) => (
          <div key={ic.label} className="flex items-center gap-2 text-[10px]">
            <div className="w-3 h-3 rounded-sm border border-white shadow-sm" style={{ backgroundColor: ic.color, opacity: 0.8 }} />
            <span className="text-slate-600">{ic.label}</span>
          </div>
        ))}
      </div>
      {/* Gradient bar */}
      <div className="mt-2 h-1.5 rounded-full bg-gradient-to-r from-green-500 via-yellow-500 via-orange-500 to-red-500 opacity-80" />
      <div className="flex justify-between text-[9px] text-slate-400 mt-0.5">
        <span>Low</span>
        <span>High</span>
      </div>
    </div>
  );
}
