// ────────────────────────────────────────────────────────────────
// Heat Map — Notify Fleet Modal
// ────────────────────────────────────────────────────────────────

import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Bell, MessageSquare, Smartphone, Send, Users, Check } from 'lucide-react';
import { toast } from 'sonner';
import type { HeatMapZone } from '../types';

interface NotifyFleetModalProps {
  zone: HeatMapZone | null;
  isOpen: boolean;
  onClose: () => void;
}

const TEMPLATES = [
  { id: 'demand', label: '🔥 High demand', message: 'High demand area — head to {zone} for more trips and earnings!' },
  { id: 'surge', label: '⚡ Surge active', message: 'Surge pricing active in {zone}! Earn {multiplier}x on every trip.' },
  { id: 'incentive', label: '💰 Incentive', message: 'Complete 3 trips in {zone} within the next hour to earn a $5 bonus.' },
  { id: 'custom', label: '✏️ Custom', message: '' },
];

export function NotifyFleetModal({ zone, isOpen, onClose }: NotifyFleetModalProps) {
  const [message, setMessage] = useState('');
  const [channels, setChannels] = useState<string[]>(['push', 'in-app']);
  const [isSending, setIsSending] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('demand');

  if (!zone) return null;

  const eligibleDrivers = zone.metrics.idleSupply + Math.floor(zone.metrics.busySupply * 0.3);

  const toggleChannel = (ch: string) => {
    setChannels((prev) => prev.includes(ch) ? prev.filter((c) => c !== ch) : [...prev, ch]);
  };

  const selectTemplate = (id: string) => {
    setSelectedTemplate(id);
    const tmpl = TEMPLATES.find((t) => t.id === id);
    if (tmpl && tmpl.message) {
      setMessage(
        tmpl.message
          .replace('{zone}', zone.name)
          .replace('{multiplier}', String(zone.metrics.surgeMultiplier || '1.5'))
      );
    }
  };

  const handleSend = async () => {
    setIsSending(true);
    await new Promise((r) => setTimeout(r, 2000));
    setIsSending(false);
    toast.success(`${eligibleDrivers} drivers notified in ${zone.name}`, {
      description: `Via ${channels.join(', ')} — message delivered`,
    });
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-[380px] sm:max-w-[380px] flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-base">
            <div className="p-1.5 bg-blue-100 rounded-lg">
              <Bell className="w-5 h-5 text-blue-600" />
            </div>
            Notify Fleet
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 space-y-5 py-4">
          {/* Zone + eligible count */}
          <Card className="shadow-none border-blue-200 bg-blue-50">
            <CardContent className="p-3 flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-blue-900">{zone.name}</div>
                <div className="text-[11px] text-blue-700">Targeting nearby idle + finishing drivers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black text-blue-800">{eligibleDrivers}</div>
                <div className="text-[10px] text-blue-600 font-medium">Eligible</div>
              </div>
            </CardContent>
          </Card>

          {/* Templates */}
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">Message Template</label>
            <div className="grid grid-cols-2 gap-1.5">
              {TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.id}
                  className={`px-2.5 py-2 rounded-lg border text-[11px] font-medium text-left transition-all ${
                    selectedTemplate === tmpl.id
                      ? 'bg-blue-100 text-blue-800 border-blue-300'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-blue-200'
                  }`}
                  onClick={() => selectTemplate(tmpl.id)}
                >
                  {tmpl.label}
                </button>
              ))}
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">Message</label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter notification message..."
              className="min-h-[80px] text-xs resize-none"
            />
            <div className="text-right text-[10px] text-slate-400 mt-1">{message.length}/200</div>
          </div>

          {/* Channels */}
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">Delivery Channels</label>
            <div className="flex gap-2">
              {[
                { id: 'push', label: 'Push', icon: Smartphone },
                { id: 'sms', label: 'SMS', icon: MessageSquare },
                { id: 'in-app', label: 'In-App', icon: Bell },
              ].map((ch) => {
                const Icon = ch.icon;
                const isSelected = channels.includes(ch.id);
                return (
                  <button
                    key={ch.id}
                    className={`flex-1 flex flex-col items-center gap-1 py-2.5 rounded-lg border transition-all ${
                      isSelected
                        ? 'bg-blue-100 text-blue-700 border-blue-300'
                        : 'bg-white text-slate-500 border-slate-200 hover:border-blue-200'
                    }`}
                    onClick={() => toggleChannel(ch.id)}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-[10px] font-medium">{ch.label}</span>
                    {isSelected && <Check className="w-3 h-3 text-blue-600" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preview */}
          {message && (
            <Card className="shadow-none border-slate-200">
              <CardContent className="p-3">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Preview</div>
                <div className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  {message}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <SheetFooter className="flex-none border-t border-slate-200 pt-4">
          <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
          <Button
            className="flex-1 bg-blue-600 hover:bg-blue-700 gap-2"
            onClick={handleSend}
            disabled={isSending || !message || channels.length === 0}
          >
            {isSending ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Send to {eligibleDrivers} Drivers
              </>
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
