import { useState } from 'react';
import { useZones, Zone, ZoneType, ServiceType, ZoneStatus } from './hooks/useZones';
import { ZoneEditorMap } from './components/ZoneEditorMap';
import { ZoneListPanel } from './components/ZoneListPanel';
import { ZoneEditorSheet } from './components/ZoneEditorSheet';
import { PointInZoneTester } from './components/PointInZoneTester';
import { ZoneConflictPanel } from './components/ZoneConflictPanel';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Download, Upload, Search, Map, Layers, ShieldAlert, Zap, Filter } from 'lucide-react';

export function ZoneManagementPage() {
  const [cityFilter, setCityFilter] = useState<string>('all');
  const [serviceFilter, setServiceFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: zones = [], isLoading } = useZones(cityFilter, serviceFilter);
  
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const filteredZones = zones.filter(z => {
    if (typeFilter !== 'all' && z.zoneType !== typeFilter) return false;
    if (statusFilter !== 'all' && z.status !== statusFilter) return false;
    if (searchQuery && !z.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const selectedZone = zones.find(z => z.id === selectedZoneId) || null;

  const handleSelectZone = (id: string | null) => {
    setSelectedZoneId(id);
    if (id) {
      setIsEditorOpen(true);
    } else {
      setIsEditorOpen(false);
    }
  };

  const handleCreateZone = () => {
    setIsDrawingMode(true);
    setSelectedZoneId(null);
    setIsEditorOpen(false);
  };

  const handlePolygonComplete = (polygon: google.maps.Polygon) => {
    setIsDrawingMode(false);
    const path = polygon.getPath();
    const coordinates = [];
    for (let i = 0; i < path.getLength(); i++) {
      const point = path.getAt(i);
      coordinates.push({ lat: point.lat(), lng: point.lng() });
    }
    
    // In a real app, this would create a new draft zone and open the editor
    console.log('New polygon coordinates:', coordinates);
    
    // Mock opening editor for new zone
    const newZone: Zone = {
      id: `zone-new-${Date.now()}`,
      name: 'New Zone',
      cityId: cityFilter === 'all' ? 'sf' : cityFilter,
      serviceType: serviceFilter === 'all' ? 'Ride' : serviceFilter as ServiceType,
      zoneType: 'operational',
      status: 'draft',
      geometry: coordinates,
      priority: 1,
      createdBy: 'current_user',
      updatedBy: 'current_user',
      version: 1,
    };
    
    // We'd normally update state/cache here
    // setSelectedZoneId(newZone.id);
    // setIsEditorOpen(true);
    
    // Clean up the drawn polygon since we'll render it via state
    polygon.setMap(null);
  };

  const handleSaveZone = (updatedZone: Zone) => {
    console.log('Saving zone:', updatedZone);
    // In a real app, call API to save
    setIsEditorOpen(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-50">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200 shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Map className="w-5 h-5 text-blue-700" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 leading-tight">Zone Management</h1>
              <p className="text-sm text-slate-500">Spatial governance and geofencing</p>
            </div>
          </div>
          
          <div className="h-8 w-px bg-slate-200 mx-2" />
          
          <div className="flex items-center gap-2">
            <Select value={cityFilter} onValueChange={setCityFilter}>
              <SelectTrigger className="w-[140px] h-9 bg-slate-50 border-slate-200">
                <SelectValue placeholder="City" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                <SelectItem value="sf">San Francisco</SelectItem>
                <SelectItem value="ny">New York</SelectItem>
                <SelectItem value="la">Los Angeles</SelectItem>
              </SelectContent>
            </Select>

            <Select value={serviceFilter} onValueChange={setServiceFilter}>
              <SelectTrigger className="w-[140px] h-9 bg-slate-50 border-slate-200">
                <SelectValue placeholder="Service" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Services</SelectItem>
                <SelectItem value="Ride">Ride</SelectItem>
                <SelectItem value="Food">Food</SelectItem>
                <SelectItem value="Parcel">Parcel</SelectItem>
                <SelectItem value="City-to-City">City-to-City</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-9 gap-2 text-slate-600 border-slate-200">
            <Upload className="w-4 h-4" /> Import
          </Button>
          <Button variant="outline" className="h-9 gap-2 text-slate-600 border-slate-200">
            <Download className="w-4 h-4" /> Export
          </Button>
          <Button onClick={handleCreateZone} className="h-9 gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
            <Plus className="w-4 h-4" /> Create Zone
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Side: Map Canvas */}
        <div className="flex-1 relative border-r border-slate-200">
          <ZoneEditorMap 
            zones={filteredZones} 
            selectedZoneId={selectedZoneId}
            onSelectZone={handleSelectZone}
            isDrawingMode={isDrawingMode}
            onPolygonComplete={handlePolygonComplete}
          />
          
          {/* Map Overlays */}
          <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
            <div className="bg-white p-2 rounded-lg shadow-md border border-slate-200 flex flex-col gap-1">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 px-1">Legend</div>
              <div className="flex items-center gap-2 px-2 py-1 hover:bg-slate-50 rounded cursor-pointer">
                <div className="w-3 h-3 rounded-sm bg-blue-500 opacity-50 border border-blue-500"></div>
                <span className="text-xs font-medium text-slate-700">Operational</span>
              </div>
              <div className="flex items-center gap-2 px-2 py-1 hover:bg-slate-50 rounded cursor-pointer">
                <div className="w-3 h-3 rounded-sm bg-yellow-500 opacity-50 border border-yellow-500"></div>
                <span className="text-xs font-medium text-slate-700">Surge</span>
              </div>
              <div className="flex items-center gap-2 px-2 py-1 hover:bg-slate-50 rounded cursor-pointer">
                <div className="w-3 h-3 rounded-sm bg-red-500 opacity-50 border border-red-500"></div>
                <span className="text-xs font-medium text-slate-700">Restricted</span>
              </div>
            </div>
          </div>

          {isDrawingMode && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg font-medium text-sm flex items-center gap-2 z-10 animate-pulse">
              <Map className="w-4 h-4" /> Click on the map to draw polygon vertices
              <button onClick={() => setIsDrawingMode(false)} className="ml-2 p-1 hover:bg-blue-700 rounded-full">
                X
              </button>
            </div>
          )}
        </div>

        {/* Right Side: List & Diagnostics */}
        <div className="w-[400px] flex flex-col bg-white shrink-0">
          <div className="p-4 border-b border-slate-200 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search zones..." 
                className="pl-9 bg-slate-50 border-slate-200 h-9 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="h-8 text-xs bg-slate-50 border-slate-200">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="operational">Operational</SelectItem>
                  <SelectItem value="surge">Surge</SelectItem>
                  <SelectItem value="restricted">Restricted</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-8 text-xs bg-slate-50 border-slate-200">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex-1 overflow-hidden flex flex-col">
            <div className="flex-1 min-h-0">
              {isLoading ? (
                <div className="p-8 text-center text-slate-500">Loading zones...</div>
              ) : (
                <ZoneListPanel 
                  zones={filteredZones} 
                  selectedZoneId={selectedZoneId}
                  onSelectZone={handleSelectZone}
                />
              )}
            </div>
            
            <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-4 shrink-0">
              <PointInZoneTester zones={zones} />
              <ZoneConflictPanel zones={zones} />
            </div>
          </div>
        </div>
      </div>

      {/* Editor Sheet */}
      <ZoneEditorSheet 
        zone={selectedZone} 
        isOpen={isEditorOpen} 
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSaveZone}
      />
    </div>
  );
}
