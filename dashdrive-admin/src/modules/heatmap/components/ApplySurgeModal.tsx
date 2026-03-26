// ────────────────────────────────────────────────────────────────
// Heat Map — Apply Surge Modal
// ────────────────────────────────────────────────────────────────

import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Zap, AlertTriangle, Clock, Check } from 'lucide-react';
import { toast } from 'sonner';
import type { HeatMapZone } from '../types';

interface ApplySurgeModalProps {
  zone: HeatMapZone | null;
  isOpen: boolean;
  onClose: () => void;
}

const MULTIPLIERS = [1.1, 1.2, 1.3, 1.4, 1.5, 1.8, 2.0, 2.5, 3.0];
const DURATIONS = [
  { value: 15, label: '15 minutes' },
  { value: 30, label: '30 minutes' },
  { value: 45, label: '45 minutes' },
  { value: 60, label: '1 hour' },
  { value: 90, label: '1.5 hours' },
  { value: 120, label: '2 hours' },
];

export function ApplySurgeModal({ zone, isOpen, onClose }: ApplySurgeModalProps) {
  const [multiplier, setMultiplier] = useState(1.5);
  const [duration, setDuration] = useState(30);
  const [isApplying, setIsApplying] = useState(false);
  const [services, setServices] = useState<string[]>(['Ride Hailing', 'Food Delivery']);

  if (!zone) return null;

  const toggleService = (svc: string) => {
    setServices((prev) => prev.includes(svc) ? prev.filter((s) => s !== svc) : [...prev, svc]);
  };

  const handleApply = async () => {
    setIsApplying(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1500));
    setIsApplying(false);
    toast.success(`Surge ${multiplier}x applied to ${zone.name} for ${duration} min`, {
      description: `Affecting ${services.join(', ')} services`,
    });
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-[380px] sm:max-w-[380px] flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-base">
            <div className="p-1.5 bg-violet-100 rounded-lg">
              <Zap className="w-5 h-5 text-violet-600" />
            </div>
            Apply Surge Pricing
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 space-y-5 py-4">
          {/* Zone info */}
          <Card className="shadow-none border-slate-200">
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-slate-900">{zone.name}</span>
                <Badge className={`text-[10px] ${zone.status === 'critical' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                  {zone.status}
                </Badge>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-[10px] text-slate-500">Demand</div>
                  <div className="text-sm font-bold text-slate-900">{zone.metrics.activeDemand}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500">Supply</div>
                  <div className="text-sm font-bold text-slate-900">{zone.metrics.idleSupply}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500">D/S Ratio</div>
                  <div className="text-sm font-bold text-red-700">{zone.metrics.demandSupplyRatio}x</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Multiplier */}
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">Surge Multiplier</label>
            <div className="grid grid-cols-3 gap-1.5">
              {MULTIPLIERS.map((m) => (
                <button
                  key={m}
                  className={`px-3 py-2 rounded-lg border text-sm font-bold transition-all ${
                    multiplier === m
                      ? 'bg-violet-600 text-white border-violet-600 shadow-md'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-violet-300'
                  }`}
                  onClick={() => setMultiplier(m)}
                >
                  {m}x
                </button>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">Duration</label>
            <Select value={duration.toString()} onValueChange={(v) => setDuration(parseInt(v))}>
              <SelectTrigger className="h-9 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DURATIONS.map((d) => (
                  <SelectItem key={d.value} value={d.value.toString()}>{d.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Services */}
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">Affected Services</label>
            <div className="flex flex-wrap gap-1.5">
              {['Ride Hailing', 'Food Delivery', 'Parcel Delivery', 'City to City'].map((svc) => (
                <button
                  key={svc}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all ${
                    services.includes(svc)
                      ? 'bg-violet-100 text-violet-700 border-violet-300'
                      : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                  }`}
                  onClick={() => toggleService(svc)}
                >
                  {services.includes(svc) && <Check className="w-3 h-3 inline mr-1" />}
                  {svc}
                </button>
              ))}
            </div>
          </div>

          {/* Warning */}
          <Card className="shadow-none border-amber-200 bg-amber-50">
            <CardContent className="p-3 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-[11px] text-amber-700">
                Surge pricing will increase fares by <strong>{multiplier}x</strong> in <strong>{zone.name}</strong> for <strong>{duration} minutes</strong>.
                This affects riders and may attract drivers from nearby zones.
              </div>
            </CardContent>
          </Card>
        </div>

        <SheetFooter className="flex-none border-t border-slate-200 pt-4">
          <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
          <Button
            className="flex-1 bg-violet-600 hover:bg-violet-700 gap-2"
            onClick={handleApply}
            disabled={isApplying || services.length === 0}
          >
            {isApplying ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Applying...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                Apply {multiplier}x Surge
              </>
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
