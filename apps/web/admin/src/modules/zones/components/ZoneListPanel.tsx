import { ScrollArea } from '@/components/ui/scroll-area';
import { Zone } from '../hooks/useZones';
import { ZoneListItem } from './ZoneListItem';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Map, SearchX } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ZoneListPanelProps {
  zones: Zone[];
  selectedZoneId: string | null;
  onSelectZone: (id: string | null) => void;
}

export function ZoneListPanel({ zones, selectedZoneId, onSelectZone }: ZoneListPanelProps) {
  if (zones.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center text-slate-400">
        <div className="p-6 bg-slate-50 rounded-full mb-4">
           <SearchX className="w-12 h-12 opacity-20" />
        </div>
        <h3 className="font-bold text-slate-900 text-lg">No zones found</h3>
        <p className="text-sm max-w-[240px] mt-1 mx-auto text-slate-500">
           Try adjusting your filters or create a new zone to get started.
        </p>
        <Button variant="outline" className="mt-6 border-slate-200">
           Clear All Filters
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="px-6 py-4 flex items-center justify-between border-b border-slate-50 sticky top-0 bg-white/80 backdrop-blur-md z-10">
         <h2 className="font-bold text-slate-900 tracking-tight flex items-center gap-2">
            Operational Zones
            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] rounded-full font-bold uppercase">
               {zones.length}
            </span>
         </h2>
         <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Sort: Newest
         </div>
      </div>
      
      <ScrollArea className="flex-1 px-6 py-4">
        <div className="pb-8">
          {zones.map((zone) => (
            <ZoneListItem
              key={zone.id}
              zone={zone}
              isActive={selectedZoneId === zone.id}
              onSelect={onSelectZone}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
