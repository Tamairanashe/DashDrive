// ────────────────────────────────────────────────────────────────
// Heat Map — KPI Strip (8 operational metrics)
// ────────────────────────────────────────────────────────────────

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  TrendingUp, TrendingDown, Minus,
} from 'lucide-react';
import { FluentEmoji } from '@/src/components/ui/FluentEmoji';
import type { KPIMetric } from '../types';

const COLOR_MAP: Record<string, { bg: string; text: string; border: string }> = {
  blue:    { bg: 'bg-blue-50',    text: 'text-blue-600',    border: 'border-blue-100' },
  green:   { bg: 'bg-green-50',   text: 'text-green-600',   border: 'border-green-100' },
  amber:   { bg: 'bg-amber-50',   text: 'text-amber-600',   border: 'border-amber-100' },
  rose:    { bg: 'bg-rose-50',    text: 'text-rose-600',    border: 'border-rose-100' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100' },
  violet:  { bg: 'bg-violet-50',  text: 'text-violet-600',  border: 'border-violet-100' },
  cyan:    { bg: 'bg-cyan-50',    text: 'text-cyan-600',    border: 'border-cyan-100' },
  red:     { bg: 'bg-red-50',     text: 'text-red-600',     border: 'border-red-100' },
};

interface HeatMapKPIStripProps {
  metrics: KPIMetric[];
  isLoading: boolean;
}

export function HeatMapKPIStrip({ metrics, isLoading }: HeatMapKPIStripProps) {
  if (isLoading) {
    return (
      <div className="flex-none border-b border-slate-200 bg-slate-50/50 px-4 py-3">
        <div className="grid grid-cols-8 gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="shadow-none border-slate-200">
              <CardContent className="p-3">
                <Skeleton className="h-3 w-16 mb-2" />
                <Skeleton className="h-6 w-12 mb-1" />
                <Skeleton className="h-3 w-10" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-none border-b border-slate-200 bg-slate-50/50 px-4 py-3">
      <div className="grid grid-cols-8 gap-2">
        {metrics.map((kpi) => {
          const colors = COLOR_MAP[kpi.color] || COLOR_MAP.blue;
          const TrendIcon = kpi.trend === 'up' ? TrendingUp : kpi.trend === 'down' ? TrendingDown : Minus;

          return (
            <Card key={kpi.id} className={`shadow-none border ${colors.border} hover:shadow-sm transition-shadow cursor-default`}>
              <CardContent className="p-2.5">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <div className={`p-0.5 rounded ${colors.bg}`}>
                    <FluentEmoji emoji={kpi.icon} size={14} />
                  </div>
                  <span className="text-[10px] font-medium text-slate-500 truncate">{kpi.label}</span>
                </div>
                <div className="text-base font-bold text-slate-900 leading-tight truncate">{kpi.value}</div>
                <div className={`flex items-center gap-0.5 mt-1 text-[10px] font-medium ${kpi.trendIsGood ? 'text-emerald-600' : kpi.trend === 'flat' ? 'text-slate-400' : 'text-rose-600'}`}>
                  <TrendIcon className="w-2.5 h-2.5" />
                  <span className="truncate">{kpi.trendValue}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
