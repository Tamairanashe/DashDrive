import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { useZones, Zone, ServiceType, ZoneStatus, ZoneType } from './hooks/useZones';
import { ZoneEditorMap } from './components/ZoneEditorMap';
import { ZoneListPanel } from './components/ZoneListPanel';
import { ZoneDetailSheet } from './components/ZoneDetailSheet';
import { CreateZoneSheet } from './components/CreateZoneSheet';
import { ZoneKPICards } from './components/ZoneKPICards';
import { ZoneFilters } from './components/ZoneFilters';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Download, 
  Upload, 
  Map, 
  Layers, 
  ChevronRight, 
  Home,
  Settings2,
  LayoutGrid,
  MoreHorizontal
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export function ZoneManagementPage() {
  // Filter States
  const [cityFilter, setCityFilter] = useState<string>('all');
  const [serviceFilter, setServiceFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // UI States
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [isCreateSheetOpen, setIsCreateSheetOpen] = useState(false);
  const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false);
  const [isDrawingMode, setIsDrawingMode] = useState(false);

  // Data Fetching
  const { data: zones = [], isLoading } = useZones(cityFilter, serviceFilter);
  
  // Filtering Logic
  const filteredZones = useMemo(() => {
    return zones.filter(z => {
      const matchesSearch = !searchQuery || 
        z.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        z.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesType = typeFilter === 'all' || z.zoneType === typeFilter;
      const matchesStatus = statusFilter === 'all' || z.status === statusFilter;
      
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [zones, searchQuery, typeFilter, statusFilter]);

  const selectedZone = useMemo(() => 
    zones.find(z => z.id === selectedZoneId) || null
  , [zones, selectedZoneId]);

  // Handlers
  const handleSelectZone = (id: string | null) => {
    setSelectedZoneId(id);
    if (id) {
      setIsDetailSheetOpen(true);
    }
  };

  const handlePolygonComplete = (polygon: google.maps.Polygon) => {
    setIsDrawingMode(false);
    // In a real app, this would trigger the next step in the creation sheet
    polygon.setMap(null);
    setIsCreateSheetOpen(true);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-50/50 overflow-hidden">
      {/* 1. Header Layer */}
      <header className="px-8 py-6 bg-white border-b border-slate-100 shrink-0">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
            <Home className="w-3.5 h-3.5" />
            <ChevronRight className="w-3.5 h-3.5" />
            <span>Operations</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-900">Zone Management</span>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" className="h-9 gap-2 border-slate-200 text-slate-600 font-bold text-xs uppercase tracking-tight hover:bg-slate-50">
              <Upload className="w-3.5 h-3.5" /> Import
            </Button>
            <DropdownMenu>
               <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-9 gap-2 border-slate-200 text-slate-600 font-bold text-xs uppercase tracking-tight hover:bg-slate-50">
                    <Download className="w-3.5 h-3.5" /> Export
                  </Button>
               </DropdownMenuTrigger>
               <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem className="text-xs font-bold">Export as GeoJSON</DropdownMenuItem>
                  <DropdownMenuItem className="text-xs font-bold">Export as KML</DropdownMenuItem>
                  <DropdownMenuItem className="text-xs font-bold">Export CSV Summary</DropdownMenuItem>
               </DropdownMenuContent>
            </DropdownMenu>
            <Button 
              onClick={() => setIsCreateSheetOpen(true)} 
              className="h-9 gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-tight shadow-lg shadow-blue-600/20"
            >
              <Plus className="w-4 h-4" /> Create Zone
            </Button>
          </div>
        </div>
        
        <div className="flex items-end justify-between">
           <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tighter flex items-center gap-3">
                Zone Management
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none px-2 py-0.5 text-[10px] font-black uppercase tracking-widest">
                  Operational
                </Badge>
              </h1>
              <p className="text-sm text-slate-500 font-medium mt-1">
                Spatial governance, geofencing, and service coverage command center.
              </p>
           </div>
           
           <div className="flex gap-4">
              <div className="flex flex-col items-end">
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Status</span>
                 <div className="flex items-center gap-2 mt-1">
                    <div className="flex -space-x-2">
                       {[1, 2, 3].map(i => (
                          <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center overflow-hidden">
                             <div className="w-full h-full bg-blue-600 opacity-20" />
                          </div>
                       ))}
                    </div>
                    <span className="text-xs font-bold text-slate-700">12 Admins Online</span>
                 </div>
              </div>
           </div>
        </div>
      </header>

      {/* 2. KPI & Filters Layer */}
      <div className="px-8 py-6 space-y-6 shrink-0 bg-slate-50/50">
        <ZoneKPICards zones={zones} />
        
        <ZoneFilters 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          cityFilter={cityFilter}
          setCityFilter={setCityFilter}
          serviceFilter={serviceFilter}
          setServiceFilter={setServiceFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />
      </div>

      {/* 3. Main Workspace Layer */}
      <div className="flex-1 flex overflow-hidden px-8 pb-8">
        <div className="flex-1 flex bg-white rounded-3xl border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
          
          {/* Left Side: Zone List (Visible in List mode or split mode) */}
          {(viewMode === 'list' || true) && (
            <div className={cn(
              "border-r border-slate-50 flex flex-col transition-all duration-500",
              viewMode === 'list' ? "w-full" : "w-[420px] shrink-0"
            )}>
              <ZoneListPanel 
                zones={filteredZones} 
                selectedZoneId={selectedZoneId}
                onSelectZone={handleSelectZone}
              />
            </div>
          )}

          {/* Right Side: Interactive Map Workspace */}
          <div className="flex-1 relative bg-slate-50">
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-50/50 backdrop-blur-sm z-20">
                 <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">Initializing Map Canvas...</p>
                 </div>
              </div>
            ) : null}
            
            <ZoneEditorMap 
              zones={filteredZones} 
              selectedZoneId={selectedZoneId}
              onSelectZone={handleSelectZone}
              isDrawingMode={isDrawingMode}
              onPolygonComplete={handlePolygonComplete}
            />
          </div>
        </div>
      </div>

      {/* 4. Overlay Layers (Sheets/Dialogs) */}
      <ZoneDetailSheet 
        zone={selectedZone} 
        isOpen={isDetailSheetOpen} 
        onClose={() => setIsDetailSheetOpen(false)}
      />
      
      <CreateZoneSheet 
        isOpen={isCreateSheetOpen} 
        onClose={() => setIsCreateSheetOpen(false)}
      />

    </div>
  );
}
