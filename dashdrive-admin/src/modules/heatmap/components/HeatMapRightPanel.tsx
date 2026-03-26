// ────────────────────────────────────────────────────────────────
// Heat Map — Right Intelligence Panel
// ────────────────────────────────────────────────────────────────

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import {
  TrendingUp, TrendingDown, ChevronRight,
  Activity, Target, Search as SearchIcon, Minus,
  Zap, Bell, Eye, DollarSign, Users,
} from 'lucide-react';
import { FluentEmoji } from '@/components/ui/FluentEmoji';
import type { HeatMapAlert, RecommendedAction, RevenueZone, SupplyResponse, HeatMapZone } from '../types';

interface HeatMapRightPanelProps {
  alerts: HeatMapAlert[];
  problemZones: HeatMapZone[];
  recommendedActions: RecommendedAction[];
  revenueZones: RevenueZone[];
  supplyResponses: SupplyResponse[];
  isLoading: boolean;
  onZoneOpen: (zoneId: string) => void;
  onApplySurge: (zoneId: string) => void;
  onNotifyFleet: (zoneId: string) => void;
  onOpenFleetView: (zoneId: string) => void;
}

const SEVERITY_CONFIG: Record<string, { emoji: string; color: string; bg: string; border: string }> = {
  critical: { emoji: 'shield-alert', color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200' },
  severe:   { emoji: 'alert-triangle', color: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-200' },
  warning:  { emoji: 'alert-circle', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' },
  info:     { emoji: 'info', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' },
};

const ACTION_CONFIG: Record<string, { emoji: string; color: string }> = {
  surge:       { emoji: 'zap', color: 'text-violet-600' },
  notify:      { emoji: 'bell', color: 'text-blue-600' },
  dispatch:    { emoji: 'send', color: 'text-green-600' },
  investigate: { emoji: 'search', color: 'text-amber-600' },
  incentive:   { emoji: 'dollar', color: 'text-emerald-600' },
};

export function HeatMapRightPanel({
  alerts, problemZones, recommendedActions, revenueZones, supplyResponses,
  isLoading, onZoneOpen, onApplySurge, onNotifyFleet, onOpenFleetView,
}: HeatMapRightPanelProps) {

  if (isLoading) {
    return (
      <div className="bg-white overflow-hidden flex flex-col h-full">
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="p-4 space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i}>
              <Skeleton className="h-3 w-24 mb-3" />
              <Skeleton className="h-20 w-full rounded-lg" />
              <Skeleton className="h-20 w-full rounded-lg mt-2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex-none">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Activity className="w-4 h-4 text-blue-600" />
          Intelligence Panel
        </h2>
        <p className="text-[10px] text-slate-500 mt-0.5">Real-time operational decisions</p>
      </div>

      <ScrollArea className="flex-1 min-h-0">
        <div className="p-4 space-y-6">

          {/* ── Active Alerts ── */}
          <section>
            <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <FluentEmoji emoji="alert-triangle" size={12} />
              Active Alerts
              <Badge variant="secondary" className="ml-auto text-[10px] h-4 px-1.5 bg-red-100 text-red-700">
                {alerts.filter((a) => a.status === 'active').length}
              </Badge>
            </h3>
            <div className="space-y-2">
              {alerts.filter((a) => a.status === 'active').slice(0, 4).map((alert) => {
                const cfg = SEVERITY_CONFIG[alert.severity] || SEVERITY_CONFIG.info;
                return (
                  <Card key={alert.id} className={`shadow-none border ${cfg.border} ${cfg.bg}`}>
                    <CardContent className="p-3">
                      <div className="flex items-start gap-2">
                        <FluentEmoji emoji={cfg.emoji} size={16} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className={`text-xs font-bold ${cfg.color}`}>{alert.summary}</span>
                          </div>
                          <div className="text-[11px] text-slate-600 mb-1">{alert.zone} — {alert.detail}</div>
                          {alert.metric && (
                            <div className="text-[10px] text-slate-500 mb-2">
                              {alert.metric}: <strong>{alert.metricValue}</strong>
                            </div>
                          )}
                          <div className="flex gap-1.5 flex-wrap">
                            <Button size="sm" className="h-6 text-[10px] px-2 bg-slate-900 hover:bg-slate-800" onClick={() => onApplySurge(alert.zoneId)}>
                              <FluentEmoji emoji="zap" size={10} className="mr-1" /> Surge
                            </Button>
                            <Button size="sm" variant="outline" className="h-6 text-[10px] px-2" onClick={() => onNotifyFleet(alert.zoneId)}>
                              <Bell className="w-3 h-3 mr-1" /> Notify
                            </Button>
                            <Button size="sm" variant="ghost" className="h-6 text-[10px] px-2" onClick={() => onZoneOpen(alert.zoneId)}>
                              <Eye className="w-3 h-3 mr-1" /> Zone
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
              {alerts.filter((a) => a.status === 'active').length === 0 && (
                <div className="text-xs text-slate-400 italic p-4 border border-dashed border-slate-200 rounded-lg text-center">
                  No active alerts — all zones healthy
                </div>
              )}
            </div>
          </section>

          {/* ── Top Problem Zones ── */}
          <section>
            <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Target className="w-3 h-3 text-orange-500" />
              Top Problem Zones
            </h3>
            <div className="space-y-1">
              {problemZones.slice(0, 5).map((zone, i) => (
                <button
                  key={zone.id}
                  className="w-full flex items-center gap-2 p-2 rounded-lg border border-slate-100 hover:border-slate-300 hover:bg-slate-50 transition-colors text-left"
                  onClick={() => onZoneOpen(zone.id)}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${i === 0 ? 'bg-red-100 text-red-700' : i === 1 ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-600'}`}>
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-slate-900 truncate">{zone.name}</div>
                    <div className="text-[10px] text-slate-500">
                      Score {zone.metrics.imbalanceScore} · ETA {zone.metrics.avgETA}m · Cancel {zone.metrics.cancelRate}%
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {zone.metrics.imbalanceScore > 60 ? (
                      <TrendingUp className="w-3 h-3 text-red-500" />
                    ) : (
                      <Minus className="w-3 h-3 text-slate-400" />
                    )}
                    <ChevronRight className="w-3 h-3 text-slate-400" />
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* ── Recommended Actions ── */}
          <section>
            <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-violet-500" />
              Recommended Actions
            </h3>
            <div className="space-y-2">
              {recommendedActions.slice(0, 4).map((action) => {
                const cfg = ACTION_CONFIG[action.actionType] || ACTION_CONFIG.investigate;
                return (
                  <div key={action.id} className="p-2.5 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors">
                    <div className="flex items-start gap-2">
                      <FluentEmoji emoji={cfg.emoji} size={14} />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-slate-900">{action.title}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{action.description}</div>
                        <div className="text-[10px] text-emerald-600 font-medium mt-1">
                          Impact: {action.estimatedImpact}
                        </div>
                      </div>
                      <Badge variant="secondary" className={`text-[9px] h-4 px-1 shrink-0 ${action.priority === 'high' ? 'bg-red-100 text-red-700' : action.priority === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                        {action.priority}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ── Top Revenue Zones ── */}
          <section>
            <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <DollarSign className="w-3 h-3 text-cyan-500" />
              Top Revenue Zones
            </h3>
            <div className="space-y-1">
              {revenueZones.slice(0, 5).map((rz) => (
                <div key={rz.id} className="flex items-center gap-2 p-2 rounded-lg border border-slate-100">
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-slate-900">{rz.name}</div>
                    <div className="text-[10px] text-slate-500">{rz.trips} trips · GMV ${(rz.gmv / 1000).toFixed(1)}k</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-slate-900">${(rz.revenue / 1000).toFixed(1)}k</div>
                    <div className={`text-[10px] font-medium flex items-center gap-0.5 justify-end ${rz.trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {rz.trend === 'up' ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
                      {rz.trendPercent > 0 ? '+' : ''}{rz.trendPercent}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Supply Response Tracker ── */}
          {supplyResponses.length > 0 && (
            <section>
              <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Users className="w-3 h-3 text-green-500" />
                Supply Response
              </h3>
              <div className="space-y-2">
                {supplyResponses.map((sr) => (
                  <Card key={sr.zoneId} className="shadow-none border-green-200 bg-green-50">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-green-900">{sr.zoneName}</span>
                        <Badge variant="secondary" className="text-[9px] h-4 bg-green-200 text-green-800">{sr.actionType}</Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div>
                          <div className="text-[10px] text-green-700">Notified</div>
                          <div className="text-sm font-bold text-green-900">{sr.driversNotified}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-green-700">Moving</div>
                          <div className="text-sm font-bold text-green-900">{sr.driversMoving}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-green-700">Supply Δ</div>
                          <div className="text-sm font-bold text-green-900">+{sr.supplyChangePct}%</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
