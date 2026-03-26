import { useState, useMemo } from 'react';
import { useFleetData, ServiceType, DriverStatus } from './hooks/useFleetData';
import { FleetMap } from './components/FleetMap';
import { DriverDetailsPanel } from './components/DriverDetailsPanel';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, MapPin, Activity, AlertTriangle, Users, Zap, Clock, ShieldAlert, X } from 'lucide-react';
import { useNavigationStore } from '@/store/navigation';

export function FleetPage() {
  const params = useNavigationStore((state) => state.params);
  const setActiveModule = useNavigationStore((state) => state.setActiveModule);

  const [isLive, setIsLive] = useState(true);
  const { data: drivers, isLoading, isError } = useFleetData(isLive);
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);
  
  // Filters
  const getInitialStatusFilter = () => {
    if (params.focus === 'supply' || params.focus === 'imbalance') return 'Idle';
    if (params.focus === 'cancellations') return 'Issue';
    return 'all';
  };

  const [cityFilter, setCityFilter] = useState<string>(params.city || 'sf');
  const [serviceFilter, setServiceFilter] = useState<string>(params.serviceType || 'all');
  const [statusFilter, setStatusFilter] = useState<string>(getInitialStatusFilter());
  const [zoneFilter, setZoneFilter] = useState<string>(params.zoneId || 'all');
  const [searchQuery, setSearchQuery] = useState('');

  // Clear params after initial load if needed, or keep them to show banner
  const hasContext = !!params.source;

  const clearContext = () => {
    setActiveModule('Fleet View', {});
    setServiceFilter('all');
    setStatusFilter('all');
    setZoneFilter('all');
  };

  const filteredDrivers = drivers?.filter(d => {
    if (serviceFilter !== 'all' && d.serviceType !== serviceFilter) return false;
    if (statusFilter !== 'all' && d.status !== statusFilter) return false;
    if (zoneFilter !== 'all' && d.zoneId !== zoneFilter) return false;
    if (searchQuery && !d.name.toLowerCase().includes(searchQuery.toLowerCase()) && !d.id.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  }) || [];

  const onlineDrivers = drivers?.filter(d => d.status !== 'Offline').length || 0;
  const idleDrivers = drivers?.filter(d => d.status === 'Idle').length || 0;
  const busyDrivers = drivers?.filter(d => d.status === 'Busy' || d.status === 'En Route').length || 0;
  const couriersActive = drivers?.filter(d => (d.serviceType === 'Food' || d.serviceType === 'Parcel') && d.status !== 'Offline').length || 0;
  const issuesCount = drivers?.filter(d => d.status === 'Issue').length || 0;

  // Service Switching Logic
  const serviceSwitchingInsights = useMemo(() => {
    if (!drivers) return [];
    
    // Group idle drivers by zone and service type
    const idleDriversByZoneAndService: Record<string, Record<string, number>> = {};
    
    drivers.forEach(d => {
      if (d.status === 'Idle' && d.zoneId) {
        if (!idleDriversByZoneAndService[d.zoneId]) {
          idleDriversByZoneAndService[d.zoneId] = {};
        }
        idleDriversByZoneAndService[d.zoneId][d.serviceType] = (idleDriversByZoneAndService[d.zoneId][d.serviceType] || 0) + 1;
      }
    });

    const insights = [];
    
    for (const [zoneId, services] of Object.entries(idleDriversByZoneAndService)) {
      const idleFood = services['Food'] || 0;
      const idleParcel = services['Parcel'] || 0;
      const idleRide = services['Ride'] || 0;
      
      const lowDemandIdleCount = idleFood + idleParcel;
      
      // If there are a good number of idle food/parcel couriers, and few idle ride drivers, suggest a switch
      if (lowDemandIdleCount >= 2 && idleRide <= 2) {
        const zoneName = zoneId.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
        const sourceServices = [];
        if (idleFood > 0) sourceServices.push('Food');
        if (idleParcel > 0) sourceServices.push('Parcel');
        
        insights.push({
          id: `switch-${zoneId}`,
          zoneId,
          zoneName,
          targetService: 'Ride',
          sourceServices,
          idleCount: lowDemandIdleCount,
          reason: `High Ride Demand in ${zoneName}`,
          description: `${lowDemandIdleCount} ${sourceServices.join(' and ')} couriers are idle near ${zoneName}. Suggest switching them to Ride service to meet demand.`
        });
      }
    }
    
    return insights;
  }, [drivers]);

  if (isLoading && !drivers) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900"></div>
          <p className="text-sm font-medium text-slate-500">Loading fleet command center...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center bg-slate-50">
        <div className="text-center text-red-500">
          <p className="font-semibold">Failed to load fleet data.</p>
          <p className="text-sm">Please check your connection and try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] -m-6 bg-slate-50 overflow-hidden">
      {/* TOP HEADER */}
      <header className="flex-none bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between z-10 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            Fleet View <Badge variant="secondary" className="bg-blue-100 text-blue-700">Command Center</Badge>
          </h1>
          <p className="text-xs text-slate-500">Real-time driver and courier monitoring</p>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap justify-end">
          <Select value={cityFilter} onValueChange={setCityFilter}>
            <SelectTrigger className="w-[120px] h-8 text-xs bg-slate-50 border-slate-200 font-semibold">
              <SelectValue placeholder="City" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sf">San Francisco</SelectItem>
              <SelectItem value="ny">New York</SelectItem>
              <SelectItem value="la">Los Angeles</SelectItem>
              <SelectItem value="chicago">Chicago</SelectItem>
            </SelectContent>
          </Select>

          <div className="relative w-40">
            <Search className="absolute left-2.5 top-2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search ID or Name" 
              className="pl-8 h-8 text-xs bg-slate-50 border-slate-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Select value={serviceFilter} onValueChange={setServiceFilter}>
            <SelectTrigger className="w-[110px] h-8 text-xs bg-slate-50 border-slate-200">
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

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[100px] h-8 text-xs bg-slate-50 border-slate-200">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Idle">Idle</SelectItem>
              <SelectItem value="Busy">Busy</SelectItem>
              <SelectItem value="En Route">En Route</SelectItem>
              <SelectItem value="Issue">Issue</SelectItem>
            </SelectContent>
          </Select>

          <Select value={zoneFilter} onValueChange={setZoneFilter}>
            <SelectTrigger className="w-[100px] h-8 text-xs bg-slate-50 border-slate-200">
              <SelectValue placeholder="Zone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Zones</SelectItem>
              <SelectItem value="downtown">Downtown</SelectItem>
              <SelectItem value="airport">Airport</SelectItem>
              <SelectItem value="zone_1">Loop</SelectItem>
              <SelectItem value="zone_2">West Loop</SelectItem>
              <SelectItem value="zone_3">River North</SelectItem>
              <SelectItem value="zone_4">South Loop</SelectItem>
              <SelectItem value="zone_5">Lincoln Park</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="all">
            <SelectTrigger className="w-[100px] h-8 text-xs bg-slate-50 border-slate-200">
              <SelectValue placeholder="Operator" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Operators</SelectItem>
              <SelectItem value="alpha">Alpha Fleet</SelectItem>
              <SelectItem value="independent">Independent</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="all">
            <SelectTrigger className="w-[100px] h-8 text-xs bg-slate-50 border-slate-200">
              <SelectValue placeholder="Vehicle" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Vehicles</SelectItem>
              <SelectItem value="car">Car</SelectItem>
              <SelectItem value="scooter">Scooter</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2 ml-2 pl-2 border-l border-slate-200">
            <span className="text-xs font-medium text-slate-700">Live</span>
            <Switch checked={isLive} onCheckedChange={setIsLive} />
            {isLive && <span className="relative flex h-2 w-2 ml-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>}
          </div>
        </div>
      </header>

      {hasContext && (
        <div className="flex-none bg-blue-50 border-b border-blue-100 px-6 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-blue-800">
            <Activity className="w-4 h-4" />
            <span>Focused from Heat Map: Zone <strong>{params.zoneId}</strong>, Service <strong>{params.serviceType}</strong>, Issue <strong>{params.focus}</strong></span>
          </div>
          <Button variant="ghost" size="sm" className="h-6 text-blue-700 hover:bg-blue-100 hover:text-blue-900" onClick={clearContext}>
            <X className="w-4 h-4 mr-1" /> Clear Focus
          </Button>
        </div>
      )}

      {/* KPI STRIP */}
      <div className="flex-none bg-slate-50 border-b border-slate-200 p-4">
        <div className="grid grid-cols-6 gap-4">
          <Card className="shadow-sm border-slate-200">
            <CardContent className="p-3 flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg text-blue-700"><Users className="w-5 h-5" /></div>
              <div>
                <div className="text-xs text-slate-500 font-medium">Online Drivers</div>
                <div className="text-xl font-bold text-slate-900">{onlineDrivers}</div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm border-slate-200">
            <CardContent className="p-3 flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg text-green-700"><MapPin className="w-5 h-5" /></div>
              <div>
                <div className="text-xs text-slate-500 font-medium">Idle Drivers</div>
                <div className="text-xl font-bold text-slate-900">{idleDrivers}</div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm border-slate-200">
            <CardContent className="p-3 flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg text-indigo-700"><Activity className="w-5 h-5" /></div>
              <div>
                <div className="text-xs text-slate-500 font-medium">Busy / En Route</div>
                <div className="text-xl font-bold text-slate-900">{busyDrivers}</div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm border-slate-200">
            <CardContent className="p-3 flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg text-orange-700"><Zap className="w-5 h-5" /></div>
              <div>
                <div className="text-xs text-slate-500 font-medium">Couriers Active</div>
                <div className="text-xl font-bold text-slate-900">{couriersActive}</div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm border-slate-200">
            <CardContent className="p-3 flex items-center gap-3">
              <div className="p-2 bg-slate-200 rounded-lg text-slate-700"><Clock className="w-5 h-5" /></div>
              <div>
                <div className="text-xs text-slate-500 font-medium">Inactive &gt; 10m</div>
                <div className="text-xl font-bold text-slate-900">{Math.floor(idleDrivers * 0.15)}</div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm border-red-200 bg-red-50">
            <CardContent className="p-3 flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg text-red-700"><ShieldAlert className="w-5 h-5" /></div>
              <div>
                <div className="text-xs text-red-700 font-medium">Compliance Issues</div>
                <div className="text-xl font-bold text-red-900">{issuesCount}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* MAIN CONTENT (12-COLUMN GRID) */}
      <div className="flex-1 overflow-hidden grid grid-cols-12 gap-0 relative">
        
        {/* LEFT: LIVE FLEET MAP (8 COLUMNS) */}
        <div className="col-span-8 relative border-r border-slate-200">
          <FleetMap 
            drivers={filteredDrivers} 
            selectedDriverId={selectedDriverId} 
            onSelectDriver={setSelectedDriverId}
            autoZoom={hasContext}
          />
          
          {/* Map Overlay Legend */}
          <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-slate-200 z-10">
            <h4 className="text-xs font-bold text-slate-900 mb-2 uppercase tracking-wider">Status Legend</h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500 border border-white shadow-sm"></div> Idle</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500 border border-white shadow-sm"></div> Busy</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-yellow-400 border border-white shadow-sm"></div> En Route</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500 border border-white shadow-sm"></div> Issue</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-slate-400 border border-white shadow-sm"></div> Offline</div>
            </div>
          </div>
        </div>

        {/* RIGHT: FLEET INTELLIGENCE PANEL (4 COLUMNS) */}
        <div className="col-span-4 bg-white overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-200 bg-slate-50">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-600" /> Fleet Intelligence
            </h2>
          </div>
          
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full p-4">
            <div className="space-y-6">
              
              {/* Live Status Panel */}
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Live Status</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-600">Utilization (Busy/En Route)</span>
                      <span className="font-bold text-slate-900">{Math.round((busyDrivers / (onlineDrivers || 1)) * 100)}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${(busyDrivers / (onlineDrivers || 1)) * 100}%` }}></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="p-2 bg-slate-50 rounded border border-slate-100">
                      <div className="text-[10px] text-slate-500 uppercase">Avg Response</div>
                      <div className="text-sm font-bold text-slate-900">2.4 min</div>
                    </div>
                    <div className="p-2 bg-slate-50 rounded border border-slate-100">
                      <div className="text-[10px] text-slate-500 uppercase">Active Services</div>
                      <div className="text-sm font-bold text-slate-900">4 / 4</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contextual Actions (from Heat Map) */}
              {hasContext && (
                <div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-blue-500" /> Recommended Actions
                  </h3>
                  <Card className="border-blue-200 bg-blue-50 shadow-none">
                    <CardContent className="p-3">
                      <div className="flex items-start gap-2">
                        <Activity className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        <div>
                          <div className="text-sm font-bold text-blue-900">Address {params.focus} in {params.zoneId}</div>
                          <div className="text-xs text-blue-700 mt-1">
                            There are {filteredDrivers.length} {params.serviceType} drivers available in this view.
                          </div>
                          <Button size="sm" className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white h-7 text-xs">
                            Dispatch Available Fleet
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Service Switching Insight */}
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-yellow-500" /> Service Switching Engine
                </h3>
                {serviceSwitchingInsights.length > 0 ? (
                  <div className="space-y-3">
                    {serviceSwitchingInsights.map(insight => (
                      <Card key={insight.id} className="border-yellow-200 bg-yellow-50 shadow-none">
                        <CardContent className="p-3">
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-yellow-600 shrink-0 mt-0.5" />
                            <div>
                              <div className="text-sm font-bold text-yellow-900">{insight.reason}</div>
                              <div className="text-xs text-yellow-700 mt-1">
                                {insight.description}
                              </div>
                              <Button size="sm" className="w-full mt-2 bg-yellow-600 hover:bg-yellow-700 text-white h-7 text-xs">
                                Broadcast Switch Suggestion
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-slate-500 italic p-3 border border-dashed border-slate-200 rounded-lg text-center">
                    No service switching opportunities detected at this time.
                  </div>
                )}
              </div>

              {/* Supply Shortage Zones */}
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Supply Shortages</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 rounded-lg border border-red-100 bg-red-50/50">
                    <div>
                      <div className="text-sm font-medium text-slate-900">Financial District</div>
                      <div className="text-xs text-red-600">Needs ~15 more drivers</div>
                    </div>
                    <Button variant="outline" size="sm" className="h-7 text-xs border-red-200 text-red-700 hover:bg-red-50">
                      Dispatch
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg border border-orange-100 bg-orange-50/50">
                    <div>
                      <div className="text-sm font-medium text-slate-900">Airport Terminal 1</div>
                      <div className="text-xs text-orange-600">Needs ~8 more drivers</div>
                    </div>
                    <Button variant="outline" size="sm" className="h-7 text-xs border-orange-200 text-orange-700 hover:bg-orange-50">
                      Dispatch
                    </Button>
                  </div>
                </div>
              </div>

              {/* Driver Alerts */}
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Active Alerts</h3>
                <div className="space-y-2">
                  {drivers?.filter(d => d.status === 'Issue').slice(0, 3).map(driver => (
                    <div key={driver.id} className="flex items-start gap-2 p-2 rounded-lg border border-slate-200 hover:border-slate-300 cursor-pointer transition-colors" onClick={() => setSelectedDriverId(driver.id)}>
                      <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-slate-900 truncate">{driver.name} ({driver.id})</div>
                        <div className="text-xs text-red-600 truncate">{driver.issues?.[0] || 'Unknown issue'}</div>
                      </div>
                    </div>
                  ))}
                  {issuesCount === 0 && (
                    <div className="text-sm text-slate-500 italic p-2">No active alerts.</div>
                  )}
                </div>
              </div>

            </div>
          </ScrollArea>
        </div>
      </div>
      </div>

      {/* DRIVER DETAILS SHEET */}
      <DriverDetailsPanel 
        driver={drivers?.find(d => d.id === selectedDriverId) || null}
        isOpen={!!selectedDriverId}
        onClose={() => setSelectedDriverId(null)}
      />
    </div>
  );
}
