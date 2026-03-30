import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Activity, 
  Map, 
  Zap, 
  ShieldAlert, 
  Car, 
  Utensils, 
  Package, 
  Truck,
  History,
  TrendingUp,
  AlertTriangle,
  Users,
  Settings2,
  Clock3,
  BarChart3,
  FileText,
  DollarSign
} from 'lucide-react';
import { Zone } from '../hooks/useZones';
import { cn } from '@/lib/utils';

interface ZoneDetailSheetProps {
  zone: Zone | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ZoneDetailSheet({ zone, isOpen, onClose }: ZoneDetailSheetProps) {
  if (!zone) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-2xl flex flex-col p-0 gap-0 border-l border-slate-200 shadow-2xl">
        <SheetHeader className="px-6 py-6 border-b border-slate-100 shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                <Map className="w-6 h-6" />
              </div>
              <div>
                <SheetTitle className="text-2xl font-bold text-slate-900 tracking-tight">
                  {zone.name}
                </SheetTitle>
                <div className="flex items-center gap-2 mt-1">
                   <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 uppercase text-[10px] tracking-widest font-bold">
                     {zone.status}
                   </Badge>
                   <span className="text-sm text-slate-400 font-medium">#{zone.id}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
               <Button variant="outline" className="h-9 border-slate-200">Edit</Button>
               <Button className="h-9 bg-blue-600 hover:bg-blue-700">Actions</Button>
            </div>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs defaultValue="overview" className="h-full flex flex-col">
            <div className="px-6 border-b border-slate-100 bg-slate-50/50 shrink-0">
              <TabsList className="bg-transparent h-14 w-full justify-start gap-6 border-none p-0 overflow-x-auto no-scrollbar">
                <TabsTrigger value="overview" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none h-full px-0 font-bold text-slate-400 data-[state=active]:text-blue-600 transition-all">Overview</TabsTrigger>
                <TabsTrigger value="rules" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none h-full px-0 font-bold text-slate-400 data-[state=active]:text-blue-600 transition-all">Service Rules</TabsTrigger>
                <TabsTrigger value="pricing" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none h-full px-0 font-bold text-slate-400 data-[state=active]:text-blue-600 transition-all">Pricing</TabsTrigger>
                <TabsTrigger value="dispatch" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none h-full px-0 font-bold text-slate-400 data-[state=active]:text-blue-600 transition-all">Dispatch</TabsTrigger>
                <TabsTrigger value="performance" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none h-full px-0 font-bold text-slate-400 data-[state=active]:text-blue-600 transition-all">Performance</TabsTrigger>
                <TabsTrigger value="logs" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none h-full px-0 font-bold text-slate-400 data-[state=active]:text-blue-600 transition-all">Audit Logs</TabsTrigger>
              </TabsList>
            </div>

            <ScrollArea className="flex-1 p-6">
              <TabsContent value="overview" className="mt-0 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <p className="text-xs font-bold text-slate-400 uppercase mb-2">Operational Health</p>
                      <div className="flex items-center justify-between">
                         <div className="text-2xl font-bold text-slate-900">{zone.metrics?.totalTrips}</div>
                         <div className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" /> +12%
                         </div>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">Total Trips</p>
                   </div>
                   <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <p className="text-xs font-bold text-slate-400 uppercase mb-2">Demand Level</p>
                      <div className="flex items-center justify-between">
                         <div className="text-2xl font-bold text-slate-900 capitalize">{zone.metrics?.demandLevel}</div>
                         <div className={cn(
                           "w-3 h-3 rounded-full",
                           zone.metrics?.demandLevel === 'high' ? "bg-rose-500 animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.6)]" : "bg-emerald-500"
                         )}></div>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">Current traffic intensity</p>
                   </div>
                </div>

                <div className="space-y-4">
                   <h4 className="font-bold text-slate-900">Zone Configuration</h4>
                   <div className="space-y-3">
                      <div className="flex items-center justify-between py-2 border-b border-slate-50">
                         <span className="text-sm text-slate-500">City</span>
                         <span className="text-sm font-bold text-slate-700">{zone.cityName}</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-slate-50">
                         <span className="text-sm text-slate-500">Service Area</span>
                         <div className="flex items-center gap-2">
                           {getServiceBadge(zone.serviceType)}
                         </div>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-slate-50">
                         <span className="text-sm text-slate-500">Geometry Type</span>
                         <span className="text-sm font-bold text-slate-700">Polygon (4 vertices)</span>
                      </div>
                      <div className="flex items-center justify-between py-2">
                         <span className="text-sm text-slate-500">Priority Level</span>
                         <Badge variant="secondary" className="font-bold">Level {zone.priority}</Badge>
                      </div>
                   </div>
                </div>

                <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex gap-3">
                   <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                   <div>
                      <p className="text-sm font-bold text-amber-900">Config Pending</p>
                      <p className="text-xs text-amber-700 mt-1">This zone is missing a clear dispatch rule. Automatic assignment may be limited.</p>
                   </div>
                </div>
              </TabsContent>

              <TabsContent value="rules" className="mt-0">
                 <div className="p-8 text-center text-slate-400">
                    <Settings2 className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p className="font-bold">Service Rules Configuration</p>
                    <p className="text-sm">Manage pickup/dropoff and batching rules here.</p>
                 </div>
              </TabsContent>

              <TabsContent value="pricing" className="mt-0">
                 <div className="p-8 text-center text-slate-400">
                    <DollarSign className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p className="font-bold">Pricing Intelligence</p>
                    <p className="text-sm">Manage surge and extra fare templates.</p>
                 </div>
              </TabsContent>

              <TabsContent value="logs" className="mt-0">
                 <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="flex gap-4 items-start relative pl-6 before:absolute before:left-0 before:top-2 before:bottom-0 before:w-px before:bg-slate-100">
                        <div className="absolute left-[-4px] top-2 w-2 h-2 rounded-full bg-slate-300 ring-4 ring-white"></div>
                        <div className="flex-1 pb-4 border-b border-slate-50">
                           <div className="flex items-center justify-between">
                              <span className="text-sm font-bold text-slate-700">Zone Status Updated</span>
                              <span className="text-xs text-slate-400 font-medium">10:45 AM</span>
                           </div>
                           <p className="text-xs text-slate-500 mt-1 px-2 py-1 bg-slate-50 rounded inline-block border border-slate-100">
                              Draft → Published
                           </p>
                           <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-tight font-bold">BY ADMIN_JAY</p>
                        </div>
                      </div>
                    ))}
                 </div>
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function getServiceBadge(service: string) {
  switch (service) {
    case 'Ride': return <Badge className="gap-1 bg-blue-50 text-blue-600 border-blue-100"><Car className="w-3 h-3" /> Ride</Badge>;
    case 'Food': return <Badge className="gap-1 bg-emerald-50 text-emerald-600 border-emerald-100"><Utensils className="w-3 h-3" /> Food</Badge>;
    case 'Parcel': return <Badge className="gap-1 bg-purple-50 text-purple-600 border-purple-100"><Package className="w-3 h-3" /> Parcel</Badge>;
    default: return <Badge variant="outline">{service}</Badge>;
  }
}
