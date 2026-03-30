import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zone } from '../hooks/useZones';
import { Map, Zap, ShieldAlert, TrendingUp, Users, AlertTriangle } from 'lucide-react';

interface ZoneKPICardsProps {
  zones: Zone[];
}

export function ZoneKPICards({ zones }: ZoneKPICardsProps) {
  const totalZones = zones.length;
  const activeZones = zones.filter(z => z.status === 'published').length;
  const restrictedZones = zones.filter(z => z.zoneType === 'restricted').length;
  const surgeZones = zones.filter(z => z.metrics?.hasSurge).length;
  const extraFareZones = zones.filter(z => z.metrics?.hasExtraFare).length;
  const lowSupplyZones = zones.filter(z => z.metrics?.supplyLevel === 'low').length;

  const stats = [
    {
      title: 'Total Zones',
      value: totalZones,
      icon: Map,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      description: 'Defined operational areas'
    },
    {
      title: 'Active Zones',
      value: activeZones,
      icon: Zap,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      description: 'Currently live & dispatching'
    },
    {
      title: 'Restricted Zones',
      value: restrictedZones,
      icon: ShieldAlert,
      color: 'text-rose-600',
      bg: 'bg-rose-50',
      description: 'Areas with limited service'
    },
    {
      title: 'Surge Enabled',
      value: surgeZones,
      icon: TrendingUp,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      description: 'Active pricing multipliers'
    },
    {
      title: 'Extra Fare',
      value: extraFareZones,
      icon: AlertTriangle,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      description: 'Zones with added surcharges'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="border-none shadow-sm bg-white hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-500">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${stat.bg}`}>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
            <p className="text-xs text-slate-400 mt-1">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
