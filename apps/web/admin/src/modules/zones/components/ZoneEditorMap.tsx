import { useEffect, useRef, useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Map as MapIcon, 
  Layers, 
  Maximize, 
  Zap, 
  ShieldAlert, 
  TrendingUp, 
  Users, 
  Plus, 
  MousePointer2, 
  Trash2,
  Copy,
  PenTool,
  Info
} from 'lucide-react';
import { Zone } from '../hooks/useZones';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ZoneEditorMapProps {
  zones: Zone[];
  selectedZoneId: string | null;
  onSelectZone: (id: string | null) => void;
  isDrawingMode: boolean;
  onPolygonComplete: (polygon: google.maps.Polygon) => void;
}

export function ZoneEditorMap({
  zones,
  selectedZoneId,
  onSelectZone,
  isDrawingMode,
  onPolygonComplete,
}: ZoneEditorMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const polygonsRef = useRef<{ [key: string]: google.maps.Polygon }>({});
  const drawingManagerRef = useRef<google.maps.drawing.DrawingManager | null>(null);

  // Map settings
  const [layers, setLayers] = useState({
    zones: true,
    demand: false,
    supply: false,
    satellite: false,
  });

  const [activeTool, setActiveTool] = useState<'select' | 'polygon' | 'circle'>(isDrawingMode ? 'polygon' : 'select');

  useEffect(() => {
    if (!mapRef.current || googleMapRef.current) return;

    const map = new google.maps.Map(mapRef.current, {
      center: { lat: 37.7749, lng: -122.4194 },
      zoom: 12,
      mapId: 'DEMO_MAP_ID',
      disableDefaultUI: true,
      zoomControl: true,
      styles: [
        {
          featureType: 'all',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#747474' }],
        },
        // More styles...
      ]
    });

    googleMapRef.current = map;

    // Set up drawing manager
    const drawingManager = new google.maps.drawing.DrawingManager({
      drawingControl: false,
      polygonOptions: {
        fillColor: '#3b82f6',
        fillOpacity: 0.3,
        strokeWeight: 2,
        strokeColor: '#2563eb',
        clickable: true,
        editable: true,
        zIndex: 1,
      },
    });

    drawingManager.setMap(map);
    drawingManagerRef.current = drawingManager;

    google.maps.event.addListener(drawingManager, 'polygoncomplete', (polygon: google.maps.Polygon) => {
      onPolygonComplete(polygon);
      drawingManager.setDrawingMode(null);
      setActiveTool('select');
    });

    // Cleanup
    return () => {
      google.maps.event.clearInstanceListeners(drawingManager);
    };
  }, []);

  // Update drawing mode
  useEffect(() => {
    if (drawingManagerRef.current) {
      if (activeTool === 'polygon') {
        drawingManagerRef.current.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
      } else {
        drawingManagerRef.current.setDrawingMode(null);
      }
    }
  }, [activeTool]);

  // Sync zones to map
  useEffect(() => {
    if (!googleMapRef.current) return;

    // Clear removed zones
    const currentZoneIds = new Set(zones.map(z => z.id));
    Object.keys(polygonsRef.current).forEach(id => {
      if (!currentZoneIds.has(id)) {
        polygonsRef.current[id].setMap(null);
        delete polygonsRef.current[id];
      }
    });

    // Add or update zones
    zones.forEach(zone => {
      const isSelected = selectedZoneId === zone.id;
      let color = '#3b82f6'; // operational
      if (zone.zoneType === 'surge') color = '#a855f7';
      if (zone.zoneType === 'restricted') color = '#f43f5e';

      const options: google.maps.PolygonOptions = {
        paths: zone.geometry,
        strokeColor: color,
        strokeOpacity: isSelected ? 1 : 0.8,
        strokeWeight: isSelected ? 3 : 2,
        fillColor: color,
        fillOpacity: isSelected ? 0.4 : 0.2,
      };

      if (polygonsRef.current[zone.id]) {
        polygonsRef.current[zone.id].setOptions(options);
      } else {
        const polygon = new google.maps.Polygon(options);
        polygon.setMap(googleMapRef.current);
        polygon.addListener('click', () => onSelectZone(zone.id));
        polygonsRef.current[zone.id] = polygon;
      }
    });
  }, [zones, selectedZoneId, onSelectZone]);

  return (
    <div className="relative w-full h-full bg-slate-100 overflow-hidden group/map">
      <div ref={mapRef} className="w-full h-full" />
      
      {/* Map Toolbar (Top Floating) */}
      <div className="absolute top-6 left-6 flex flex-col gap-3">
        <Card className="p-1 px-1.5 flex flex-col gap-1.5 border-none shadow-xl bg-white/95 backdrop-blur-md">
           <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant={activeTool === 'select' ? 'secondary' : 'ghost'} 
                    size="icon" 
                    className="h-10 w-10 text-slate-500 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                    onClick={() => setActiveTool('select')}
                  >
                    <MousePointer2 className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">Select Zone</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant={activeTool === 'polygon' ? 'secondary' : 'ghost'} 
                    size="icon" 
                    className="h-10 w-10 text-slate-500"
                    onClick={() => setActiveTool('polygon')}
                  >
                    <PenTool className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">Draw Polygon</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-10 w-10 text-slate-500"
                  >
                    <Maximize className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">Draw Circle</TooltipContent>
              </Tooltip>
           </TooltipProvider>

           <div className="h-px bg-slate-100 mx-2" />

           <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={cn("h-10 w-10 transition-colors", layers.demand ? 'text-blue-600 bg-blue-50' : 'text-slate-500')}
                    onClick={() => setLayers(prev => ({ ...prev, demand: !prev.demand }))}
                  >
                    <TrendingUp className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">Demand Heat</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={cn("h-10 w-10 transition-colors", layers.supply ? 'text-emerald-600 bg-emerald-50' : 'text-slate-500')}
                    onClick={() => setLayers(prev => ({ ...prev, supply: !prev.supply }))}
                  >
                    <Users className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">Supply Heat</TooltipContent>
              </Tooltip>
           </TooltipProvider>
        </Card>

        {/* Selected Zone Actions (Floating beside toolbar) */}
        {selectedZoneId && !isDrawingMode && (
          <Card className="p-1 px-1.5 flex flex-col gap-1.5 border-none shadow-xl bg-white/95 backdrop-blur-md animate-in slide-in-from-left duration-200">
             <TooltipProvider>
               <Tooltip>
                 <TooltipTrigger asChild>
                   <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-500 hover:text-blue-600">
                     <Plus className="h-5 w-5" />
                   </Button>
                 </TooltipTrigger>
                 <TooltipContent side="right">Duplicate Zone</TooltipContent>
               </Tooltip>
               <Tooltip>
                 <TooltipTrigger asChild>
                   <Button variant="ghost" size="icon" className="h-10 w-10 text-rose-500 hover:text-rose-600 hover:bg-rose-50">
                     <Trash2 className="h-5 w-5" />
                   </Button>
                 </TooltipTrigger>
                 <TooltipContent side="right">Delete Geometry</TooltipContent>
               </Tooltip>
             </TooltipProvider>
          </Card>
        )}
      </div>

      {/* Map Legend (Bottom Right) */}
      <div className="absolute bottom-10 right-10">
        <Card className="p-3 border-none shadow-2xl bg-white/95 backdrop-blur-md rounded-2xl min-w-[160px]">
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
             <Layers className="w-3 h-3" /> Zone Legend
           </p>
           <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                 <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm bg-blue-500/30 border border-blue-500"></div>
                    <span>Operational</span>
                 </div>
                 <span className="text-slate-400 font-medium">Active</span>
              </div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                 <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm bg-purple-500/30 border border-purple-500"></div>
                    <span>Pricing Zone</span>
                 </div>
                 <Badge variant="secondary" className="px-1 text-[8px] h-3 bg-purple-100 text-purple-700 uppercase tracking-tight">Surge</Badge>
              </div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                 <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm bg-rose-500/30 border border-rose-500"></div>
                    <span>Restricted</span>
                 </div>
                 <ShieldAlert className="w-3 h-3 text-rose-500" />
              </div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 opacity-50">
                 <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm border border-slate-400 border-dashed"></div>
                    <span>Draft Zone</span>
                 </div>
                 <span className="text-[8px] uppercase font-bold">Planned</span>
              </div>
           </div>
        </Card>
      </div>

      {/* Map Center Overlay (When Drawing) */}
      {activeTool !== 'select' && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10 animate-pulse">
           <div className="p-4 bg-blue-600/90 text-white rounded-2xl shadow-2xl flex items-center gap-3 border border-blue-400">
              <Plus className="w-6 h-6" />
              <div>
                 <p className="font-bold text-sm tracking-tight leading-none uppercase">Interactive Drawing Mode</p>
                 <p className="text-[10px] font-medium opacity-80 mt-1 uppercase tracking-widest">Click on map to drop vertices</p>
              </div>
           </div>
        </div>
      )}

      {/* Map Attribution/Info (Bottom Left) */}
      <div className="absolute bottom-10 left-10">
         <div className="flex items-center gap-2 px-3 py-1.5 bg-white/80 backdrop-blur-sm rounded-full border border-slate-100 shadow-lg text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            <Info className="w-3 h-3 text-blue-500" />
            V3.2.0 • DashDrive Spatial Engine
         </div>
      </div>
    </div>
  );
}
