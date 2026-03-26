// ────────────────────────────────────────────────────────────────
// Heat Map — Zone Details Drawer (6 internal tabs)
// ────────────────────────────────────────────────────────────────

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Zap, Bell, Eye, Radio, MapPin, Clock, DollarSign, TrendingUp, TrendingDown,
  Activity, AlertTriangle, CloudRain, Car, Utensils, Route, Calendar,
  Minus, Pause, Gift, History,
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip as RechartsTooltip } from 'recharts';
import type { HeatMapZone } from '../types';
import { useNavigationStore } from '@/store/navigation';

interface ZoneDetailsDrawerProps {
  zone: HeatMapZone | null;
  isOpen: boolean;
  onClose: () => void;
  onApplySurge: (zoneId: string) => void;
  onNotifyFleet: (zoneId: string) => void;
}

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  healthy:  { label: 'Healthy',  className: 'bg-green-100 text-green-700' },
  elevated: { label: 'Elevated', className: 'bg-amber-100 text-amber-700' },
  critical: { label: 'Critical', className: 'bg-red-100 text-red-700' },
  inactive: { label: 'Inactive', className: 'bg-slate-100 text-slate-600' },
};

function MiniChart({ data, color, dataKey = 'value' }: { data: { time: string; value: number }[]; color: string; dataKey?: string }) {
  return (
    <div style={{ width: '100%', height: 80, minWidth: 0, minHeight: 0 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="time" tick={{ fontSize: 9 }} tickLine={false} axisLine={false} interval={5} />
          <YAxis hide />
          <RechartsTooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
          <Area type="monotone" dataKey={dataKey} stroke={color} fill={`url(#grad-${color})`} strokeWidth={1.5} dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function MetricRow({ label, value, unit, icon: Icon, color = 'text-slate-900' }: {
  label: string; value: string | number; unit?: string; icon: React.ElementType; color?: string;
}) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0">
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Icon className="w-3 h-3" />
        {label}
      </div>
      <div className={`text-xs font-bold ${color}`}>
        {value}{unit && <span className="font-normal text-slate-400 ml-0.5">{unit}</span>}
      </div>
    </div>
  );
}

export function ZoneDetailsDrawer({ zone, isOpen, onClose, onApplySurge, onNotifyFleet }: ZoneDetailsDrawerProps) {
  const setActiveModule = useNavigationStore((s) => s.setActiveModule);

  if (!zone) return null;
  const badge = STATUS_BADGE[zone.status] || STATUS_BADGE.inactive;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-[440px] sm:max-w-[440px] p-0 flex flex-col">
        {/* ── Header ── */}
        <SheetHeader className="p-4 pb-3 border-b border-slate-200 space-y-0 flex-none">
          <div className="flex items-center gap-2 mb-1">
            <SheetTitle className="text-base font-bold text-slate-900">{zone.name}</SheetTitle>
            <Badge className={`text-[10px] h-5 ${badge.className}`}>{badge.label}</Badge>
            {zone.metrics.surgeMultiplier && (
              <Badge className="text-[10px] h-5 bg-violet-100 text-violet-700">
                ⚡ {zone.metrics.surgeMultiplier}x Surge
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-500">
            <span>{zone.city}</span>
            <span>·</span>
            <span>{zone.serviceType}</span>
            <span>·</span>
            <span>Updated {new Date(zone.lastUpdated).toLocaleTimeString()}</span>
          </div>
        </SheetHeader>

        {/* ── Tabs ── */}
        <Tabs defaultValue="overview" className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="grid grid-cols-6 mx-4 mt-3 flex-none h-8">
            <TabsTrigger value="overview" className="text-[10px] px-1">Overview</TabsTrigger>
            <TabsTrigger value="demand" className="text-[10px] px-1">D vs S</TabsTrigger>
            <TabsTrigger value="eta" className="text-[10px] px-1">ETA</TabsTrigger>
            <TabsTrigger value="revenue" className="text-[10px] px-1">Revenue</TabsTrigger>
            <TabsTrigger value="history" className="text-[10px] px-1">History</TabsTrigger>
            <TabsTrigger value="actions" className="text-[10px] px-1">Actions</TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1">
            {/* ─── Overview ─── */}
            <TabsContent value="overview" className="px-4 pb-4 mt-0">
              <div className="space-y-4 pt-3">
                {/* Live metrics grid */}
                <Card className="shadow-none border-slate-200">
                  <CardContent className="p-3">
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Live Metrics</h4>
                    <MetricRow label="Active Demand" value={zone.metrics.activeDemand} icon={Activity} color="text-blue-700" />
                    <MetricRow label="Idle Supply" value={zone.metrics.idleSupply} icon={MapPin} color="text-green-700" />
                    <MetricRow label="Busy Supply" value={zone.metrics.busySupply} icon={Car} />
                    <MetricRow label="Avg ETA" value={zone.metrics.avgETA} unit="min" icon={Clock} color={zone.metrics.avgETA > 10 ? 'text-red-700' : 'text-slate-900'} />
                    <MetricRow label="Pickup ETA" value={zone.metrics.pickupETA} unit="min" icon={Clock} />
                    <MetricRow label="Cancel Rate" value={`${zone.metrics.cancelRate}%`} icon={AlertTriangle} color={zone.metrics.cancelRate > 5 ? 'text-red-700' : 'text-slate-900'} />
                    <MetricRow label="Acceptance Rate" value={`${zone.metrics.acceptanceRate}%`} icon={Activity} />
                    <MetricRow label="Fulfillment" value={`${zone.metrics.fulfillmentRate}%`} icon={Activity} color="text-emerald-700" />
                    <MetricRow label="Revenue" value={`$${zone.metrics.revenue.toLocaleString()}`} icon={DollarSign} color="text-cyan-700" />
                    <MetricRow label="D/S Ratio" value={`${zone.metrics.demandSupplyRatio}x`} icon={TrendingUp} color={zone.metrics.demandSupplyRatio > 3 ? 'text-red-700' : 'text-slate-900'} />
                    <MetricRow label="Imbalance Score" value={zone.metrics.imbalanceScore} icon={Zap} color={zone.metrics.imbalanceScore > 60 ? 'text-red-700' : 'text-slate-900'} />
                  </CardContent>
                </Card>

                {/* Context Insights */}
                <Card className="shadow-none border-slate-200">
                  <CardContent className="p-3">
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Context</h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center gap-2">
                        <Car className="w-3 h-3 text-slate-400" />
                        <span className="text-slate-600">{zone.contextInsights.traffic}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CloudRain className="w-3 h-3 text-slate-400" />
                        <span className="text-slate-600">{zone.contextInsights.weather}</span>
                      </div>
                      {zone.contextInsights.nearbyEvents && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3 h-3 text-amber-500" />
                          <span className="text-amber-700 font-medium">{zone.contextInsights.nearbyEvents}</span>
                        </div>
                      )}
                      {zone.contextInsights.restaurantBacklog && (
                        <div className="flex items-center gap-2">
                          <Utensils className="w-3 h-3 text-orange-500" />
                          <span className="text-orange-700 font-medium">{zone.contextInsights.restaurantBacklog}</span>
                        </div>
                      )}
                      {zone.contextInsights.routePressure && (
                        <div className="flex items-center gap-2">
                          <Route className="w-3 h-3 text-red-500" />
                          <span className="text-red-700 font-medium">{zone.contextInsights.routePressure}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* ─── Demand vs Supply ─── */}
            <TabsContent value="demand" className="px-4 pb-4 mt-0">
              <div className="space-y-4 pt-3">
                <div>
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Demand (24h)</h4>
                  <MiniChart data={zone.trendData.demand} color="#3b82f6" />
                </div>
                <div>
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Supply (24h)</h4>
                  <MiniChart data={zone.trendData.supply} color="#22c55e" />
                </div>
                <Card className="shadow-none border-amber-200 bg-amber-50">
                  <CardContent className="p-3">
                    <div className="text-xs font-bold text-amber-900 mb-1">D/S Ratio: {zone.metrics.demandSupplyRatio}x</div>
                    <div className="text-[11px] text-amber-700">
                      {zone.metrics.demandSupplyRatio > 3
                        ? 'Severe imbalance — intervention recommended'
                        : zone.metrics.demandSupplyRatio > 2
                          ? 'Elevated imbalance — monitor closely'
                          : 'Balanced — no action needed'}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* ─── ETA & Reliability ─── */}
            <TabsContent value="eta" className="px-4 pb-4 mt-0">
              <div className="space-y-4 pt-3">
                <div>
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">ETA Trend (24h)</h4>
                  <MiniChart data={zone.trendData.eta} color="#f59e0b" />
                </div>
                <div>
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Cancel Rate Trend (24h)</h4>
                  <MiniChart data={zone.trendData.cancels} color="#ef4444" />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <Card className="shadow-none border-slate-200">
                    <CardContent className="p-2 text-center">
                      <div className="text-[10px] text-slate-500">Avg ETA</div>
                      <div className="text-sm font-bold text-slate-900">{zone.metrics.avgETA}m</div>
                    </CardContent>
                  </Card>
                  <Card className="shadow-none border-slate-200">
                    <CardContent className="p-2 text-center">
                      <div className="text-[10px] text-slate-500">Acceptance</div>
                      <div className="text-sm font-bold text-slate-900">{zone.metrics.acceptanceRate}%</div>
                    </CardContent>
                  </Card>
                  <Card className="shadow-none border-slate-200">
                    <CardContent className="p-2 text-center">
                      <div className="text-[10px] text-slate-500">Cancel</div>
                      <div className="text-sm font-bold text-red-700">{zone.metrics.cancelRate}%</div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* ─── Revenue ─── */}
            <TabsContent value="revenue" className="px-4 pb-4 mt-0">
              <div className="space-y-4 pt-3">
                <div>
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Revenue Trend (24h)</h4>
                  <MiniChart data={zone.trendData.revenue} color="#06b6d4" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Card className="shadow-none border-slate-200">
                    <CardContent className="p-3 text-center">
                      <div className="text-[10px] text-slate-500">Today Revenue</div>
                      <div className="text-lg font-bold text-slate-900">${zone.metrics.revenue.toLocaleString()}</div>
                    </CardContent>
                  </Card>
                  <Card className="shadow-none border-slate-200">
                    <CardContent className="p-3 text-center">
                      <div className="text-[10px] text-slate-500">Avg Per Trip</div>
                      <div className="text-lg font-bold text-slate-900">
                        ${Math.round(zone.metrics.revenue / Math.max(zone.metrics.activeDemand, 1))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* ─── History ─── */}
            <TabsContent value="history" className="px-4 pb-4 mt-0">
              <div className="space-y-4 pt-3">
                <Card className="shadow-none border-slate-200">
                  <CardContent className="p-3">
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Today vs Yesterday</h4>
                    {zone.historyComparison.todayVsYesterday.map((row: any) => {
                      const pct = Math.round(((row.today - row.yesterday) / Math.max(row.yesterday, 1)) * 100);
                      return (
                        <div key={row.metric} className="flex items-center justify-between py-1 border-b border-slate-50 last:border-0">
                          <span className="text-[11px] text-slate-600">{row.metric}</span>
                          <div className="flex items-center gap-2 text-[11px]">
                            <span className="text-slate-500">{row.yesterday}</span>
                            <span>→</span>
                            <span className="font-bold text-slate-900">{row.today}</span>
                            <span className={`font-medium ${pct > 0 ? 'text-emerald-600' : pct < 0 ? 'text-rose-600' : 'text-slate-400'}`}>
                              {pct > 0 ? '+' : ''}{pct}%
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
                <Card className="shadow-none border-slate-200">
                  <CardContent className="p-3">
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Last 7d vs Previous 7d</h4>
                    {zone.historyComparison.last7VsPrev7.map((row: any) => {
                      const pct = Math.round(((row.current - row.previous) / Math.max(row.previous, 1)) * 100);
                      return (
                        <div key={row.metric} className="flex items-center justify-between py-1 border-b border-slate-50 last:border-0">
                          <span className="text-[11px] text-slate-600">{row.metric}</span>
                          <div className="flex items-center gap-2 text-[11px]">
                            <span className="text-slate-500">{row.previous}</span>
                            <span>→</span>
                            <span className="font-bold text-slate-900">{row.current}</span>
                            <span className={`font-medium ${pct > 0 ? 'text-emerald-600' : pct < 0 ? 'text-rose-600' : 'text-slate-400'}`}>
                              {pct > 0 ? '+' : ''}{pct}%
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* ─── Actions ─── */}
            <TabsContent value="actions" className="px-4 pb-4 mt-0">
              <div className="space-y-2 pt-3">
                <Button className="w-full justify-start gap-2 bg-violet-600 hover:bg-violet-700" onClick={() => onApplySurge(zone.id)}>
                  <Zap className="w-4 h-4" /> Apply Surge
                </Button>
                <Button className="w-full justify-start gap-2 bg-blue-600 hover:bg-blue-700" onClick={() => onNotifyFleet(zone.id)}>
                  <Bell className="w-4 h-4" /> Notify Drivers / Fleet
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2" onClick={() => {
                  onClose();
                  setActiveModule('Fleet View', { source: 'heatmap', zoneId: zone.id, serviceType: zone.serviceType, focus: 'supply' });
                }}>
                  <Eye className="w-4 h-4" /> Open Fleet View
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2" onClick={() => {
                  onClose();
                  setActiveModule('Dispatch Management', { zoneId: zone.id });
                }}>
                  <Radio className="w-4 h-4" /> Open Dispatch Management
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Activity className="w-4 h-4" /> View Live Trips
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <History className="w-4 h-4" /> View Zone History
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2 text-emerald-700 border-emerald-200 hover:bg-emerald-50">
                  <Gift className="w-4 h-4" /> Add Incentive
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2 text-red-700 border-red-200 hover:bg-red-50">
                  <Pause className="w-4 h-4" /> Pause Service
                </Button>
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
