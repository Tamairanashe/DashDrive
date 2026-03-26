import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ShieldAlert, Zap, MapPin } from 'lucide-react';
import { Zone } from '../hooks/useZones';

interface ZoneConflictPanelProps {
  zones: Zone[];
}

export function ZoneConflictPanel({ zones }: ZoneConflictPanelProps) {
  // Mock conflicts for demonstration
  const conflicts = [
    {
      id: 'c1',
      type: 'overlap',
      severity: 'high',
      title: 'Surge Policy Conflict',
      description: 'Mission District Food Surge overlaps with Downtown Surge Zone. Conflicting multipliers.',
      zones: ['zone-3', 'zone-1'],
      icon: <Zap className="w-4 h-4 text-yellow-600" />,
      color: 'yellow'
    },
    {
      id: 'c2',
      type: 'restriction',
      severity: 'critical',
      title: 'Restricted Area Overlap',
      description: 'SFO Airport Restricted zone overlaps with active Ride coverage. Pickups may fail.',
      zones: ['zone-2', 'zone-1'],
      icon: <ShieldAlert className="w-4 h-4 text-red-600" />,
      color: 'red'
    }
  ];

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-orange-500" /> Conflict Inspector
        </CardTitle>
        <Badge variant="secondary" className="bg-red-100 text-red-700 hover:bg-red-100">
          {conflicts.length} Issues
        </Badge>
      </CardHeader>
      <CardContent className="p-4 pt-2 space-y-3">
        {conflicts.map(conflict => (
          <div key={conflict.id} className={`p-3 rounded-lg border border-${conflict.color}-200 bg-${conflict.color}-50`}>
            <div className="flex items-start gap-2 mb-2">
              <div className="mt-0.5">{conflict.icon}</div>
              <div>
                <h4 className={`text-sm font-bold text-${conflict.color}-900`}>{conflict.title}</h4>
                <p className={`text-xs text-${conflict.color}-700 mt-1`}>{conflict.description}</p>
              </div>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/50">
              <div className="flex gap-1">
                {conflict.zones.map(zId => (
                  <Badge key={zId} variant="outline" className={`bg-white text-[10px] uppercase border-${conflict.color}-200 text-${conflict.color}-700`}>
                    {zId}
                  </Badge>
                ))}
              </div>
              <Button size="sm" variant="outline" className={`h-6 text-[10px] px-2 border-${conflict.color}-200 text-${conflict.color}-700 hover:bg-${conflict.color}-100`}>
                Resolve
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
