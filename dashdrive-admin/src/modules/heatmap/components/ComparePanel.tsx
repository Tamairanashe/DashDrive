// ────────────────────────────────────────────────────────────────
// Heat Map — Compare Panel
// ────────────────────────────────────────────────────────────────

import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TrendingUp, TrendingDown, Minus, GitCompare, ArrowRight, Lightbulb } from 'lucide-react';
import type { HeatMapZone, HeatMapLayerId } from '../types';
import type { CompareResult } from '../types';
import { LAYER_META } from '../types';
import { generateCompareResult } from '../mockData';

interface ComparePanelProps {
  zones: HeatMapZone[];
  isOpen: boolean;
  onClose: () => void;
  onZoneHighlight: (zoneIds: string[]) => void;
}

type CompareType = 'zone-vs-zone' | 'same-zone-vs-date' | 'multi-zone' | 'period';

export function ComparePanel({ zones, isOpen, onClose, onZoneHighlight }: ComparePanelProps) {
  const [compareType, setCompareType] = useState<CompareType>('zone-vs-zone');
  const [zoneA, setZoneA] = useState<string>('cbd');
  const [zoneB, setZoneB] = useState<string>('borrowdale');
  const [metric, setMetric] = useState<HeatMapLayerId>('demand');
  const [result, setResult] = useState<CompareResult | null>(null);

  const handleCompare = () => {
    const res = generateCompareResult(zoneA, zoneB, zones);
    setResult(res);
    onZoneHighlight([zoneA, zoneB]);
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="bottom" className="h-[420px] p-0 flex flex-col">
        <SheetHeader className="p-4 pb-3 border-b border-slate-200 flex-none">
          <SheetTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
            <GitCompare className="w-5 h-5 text-violet-600" />
            Zone Comparison
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-1 overflow-hidden">
          {/* Left — Config */}
          <div className="w-[300px] border-r border-slate-200 p-4 space-y-4 flex-none">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Compare Type</label>
              <Select value={compareType} onValueChange={(v) => setCompareType(v as CompareType)}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="zone-vs-zone">Zone vs Zone</SelectItem>
                  <SelectItem value="same-zone-vs-date">Same Zone vs Date</SelectItem>
                  <SelectItem value="multi-zone">Multi-Zone</SelectItem>
                  <SelectItem value="period">Period Comparison</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Zone A</label>
              <Select value={zoneA} onValueChange={setZoneA}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {zones.map((z) => <SelectItem key={z.id} value={z.id}>{z.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Zone B</label>
              <Select value={zoneB} onValueChange={setZoneB}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {zones.map((z) => <SelectItem key={z.id} value={z.id}>{z.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Metric</label>
              <Select value={metric} onValueChange={(v) => setMetric(v as HeatMapLayerId)}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.keys(LAYER_META) as HeatMapLayerId[]).map((l) => (
                    <SelectItem key={l} value={l}>{LAYER_META[l].label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button className="w-full bg-violet-600 hover:bg-violet-700 gap-2" onClick={handleCompare}>
              <GitCompare className="w-4 h-4" /> Compare Now
            </Button>
          </div>

          {/* Right — Results */}
          <ScrollArea className="flex-1">
            <div className="p-4">
              {!result ? (
                <div className="flex flex-col items-center justify-center h-[280px] text-center">
                  <GitCompare className="w-10 h-10 text-slate-300 mb-3" />
                  <h3 className="text-sm font-semibold text-slate-500">Select zones and click Compare</h3>
                  <p className="text-xs text-slate-400 mt-1">Choose two zones and a metric to see side-by-side analysis</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Summary cards */}
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="shadow-none border-blue-200 bg-blue-50">
                      <CardContent className="p-4 text-center">
                        <div className="text-[10px] text-blue-600 font-bold uppercase mb-1">Zone A</div>
                        <div className="text-lg font-bold text-blue-900">{result.zoneA.name}</div>
                        <div className="text-2xl font-black text-blue-800 mt-1">{result.zoneA.value}</div>
                      </CardContent>
                    </Card>
                    <Card className="shadow-none border-emerald-200 bg-emerald-50">
                      <CardContent className="p-4 text-center">
                        <div className="text-[10px] text-emerald-600 font-bold uppercase mb-1">Zone B</div>
                        <div className="text-lg font-bold text-emerald-900">{result.zoneB.name}</div>
                        <div className="text-2xl font-black text-emerald-800 mt-1">{result.zoneB.value}</div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Metric table */}
                  <Card className="shadow-none border-slate-200">
                    <CardContent className="p-0">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-slate-100">
                            <th className="text-left p-2.5 text-[10px] font-bold text-slate-500 uppercase">Metric</th>
                            <th className="text-right p-2.5 text-[10px] font-bold text-blue-600 uppercase">{result.zoneA.name}</th>
                            <th className="text-right p-2.5 text-[10px] font-bold text-emerald-600 uppercase">{result.zoneB.name}</th>
                            <th className="text-right p-2.5 text-[10px] font-bold text-slate-500 uppercase">Diff</th>
                            <th className="text-right p-2.5 text-[10px] font-bold text-slate-500 uppercase">Change</th>
                          </tr>
                        </thead>
                        <tbody>
                          {result.details.map((row) => (
                            <tr key={row.metric} className="border-b border-slate-50 last:border-0">
                              <td className="p-2.5 font-medium text-slate-700">{row.metric}</td>
                              <td className="p-2.5 text-right font-bold text-slate-900">{row.a}</td>
                              <td className="p-2.5 text-right font-bold text-slate-900">{row.b}</td>
                              <td className="p-2.5 text-right font-mono text-[11px]">{row.diff > 0 ? '+' : ''}{row.diff}</td>
                              <td className="p-2.5 text-right">
                                <span className={`inline-flex items-center gap-0.5 font-medium ${row.pctChange > 0 ? 'text-emerald-600' : row.pctChange < 0 ? 'text-rose-600' : 'text-slate-400'}`}>
                                  {row.pctChange > 0 ? <TrendingUp className="w-3 h-3" /> : row.pctChange < 0 ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                                  {row.pctChange > 0 ? '+' : ''}{row.pctChange}%
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </CardContent>
                  </Card>

                  {/* Recommendation */}
                  <Card className="shadow-none border-violet-200 bg-violet-50">
                    <CardContent className="p-3 flex items-start gap-2">
                      <Lightbulb className="w-4 h-4 text-violet-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-bold text-violet-900 mb-0.5">Insight & Recommendation</div>
                        <div className="text-[11px] text-violet-700">{result.recommendation}</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
}
