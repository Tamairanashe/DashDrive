import { Zone } from '../hooks/useZones';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Map, Zap, ShieldAlert, Star, Store, Truck, Route, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

interface ZoneListPanelProps {
  zones: Zone[];
  selectedZoneId: string | null;
  onSelectZone: (id: string | null) => void;
}

export function ZoneListPanel({ zones, selectedZoneId, onSelectZone }: ZoneListPanelProps) {
  
  const getZoneIcon = (type: string) => {
    switch (type) {
      case 'operational': return <Map className="w-4 h-4 text-blue-500" />;
      case 'surge': return <Zap className="w-4 h-4 text-yellow-500" />;
      case 'restricted': return <ShieldAlert className="w-4 h-4 text-red-500" />;
      case 'priority': return <Star className="w-4 h-4 text-purple-500" />;
      case 'merchant': return <Store className="w-4 h-4 text-emerald-500" />;
      case 'fleet': return <Truck className="w-4 h-4 text-orange-500" />;
      case 'corridor': return <Route className="w-4 h-4 text-cyan-500" />;
      default: return <Map className="w-4 h-4 text-slate-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published': return <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100"><CheckCircle2 className="w-3 h-3 mr-1" /> Published</Badge>;
      case 'draft': return <Badge variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-100">Draft</Badge>;
      case 'scheduled': return <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100"><Clock className="w-3 h-3 mr-1" /> Scheduled</Badge>;
      case 'archived': return <Badge variant="secondary" className="bg-slate-100 text-slate-500 hover:bg-slate-100">Archived</Badge>;
      default: return null;
    }
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-2">
        {zones.length === 0 ? (
          <div className="text-center p-8 text-slate-500">
            <Map className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No zones found matching filters.</p>
          </div>
        ) : (
          zones.map(zone => (
            <div 
              key={zone.id}
              className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                selectedZoneId === zone.id 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50'
              }`}
              onClick={() => onSelectZone(zone.id)}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  {getZoneIcon(zone.zoneType)}
                  <span className="font-semibold text-slate-900 text-sm">{zone.name}</span>
                </div>
                {getStatusBadge(zone.status)}
              </div>
              
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                <Badge variant="outline" className="text-[10px] uppercase tracking-wider font-semibold bg-white">
                  {zone.serviceType}
                </Badge>
                <span className="capitalize">{zone.zoneType}</span>
                <span>•</span>
                <span className="uppercase">{zone.cityId}</span>
              </div>

              {zone.description && (
                <p className="text-xs text-slate-600 line-clamp-1 mb-2">{zone.description}</p>
              )}

              <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-100 pt-2 mt-1">
                <span>v{zone.version}</span>
                <span>Updated {new Date(zone.publishedAt || new Date()).toLocaleDateString()}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </ScrollArea>
  );
}
