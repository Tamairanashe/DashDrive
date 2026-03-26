import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { DriverLocation } from "../hooks/useFleetData";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Navigation, Clock, Activity, AlertTriangle, Star, 
  MapPin, Car, MessageSquare, Phone, PowerOff, RefreshCw,
  TrendingUp, CheckCircle2, XCircle, Zap, Compass, Crosshair
} from "lucide-react";

interface DriverDetailsPanelProps {
  driver: DriverLocation | null;
  isOpen: boolean;
  onClose: () => void;
}

export function DriverDetailsPanel({ driver, isOpen, onClose }: DriverDetailsPanelProps) {
  if (!driver) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Idle': return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">Idle</Badge>;
      case 'Busy': return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200">Busy</Badge>;
      case 'En Route': return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200">En Route</Badge>;
      case 'Issue': return <Badge className="bg-red-100 text-red-800 hover:bg-red-100 border-red-200">Issue</Badge>;
      case 'Offline': return <Badge variant="outline" className="text-slate-500">Offline</Badge>;
      default: return null;
    }
  };

  const getServiceBadge = (service: string) => {
    switch (service) {
      case 'Ride': return <Badge variant="secondary" className="bg-slate-100 text-slate-800">Ride</Badge>;
      case 'Food': return <Badge variant="secondary" className="bg-orange-100 text-orange-800">Food</Badge>;
      case 'Parcel': return <Badge variant="secondary" className="bg-indigo-100 text-indigo-800">Parcel</Badge>;
      case 'City-to-City': return <Badge variant="secondary" className="bg-purple-100 text-purple-800">City-to-City</Badge>;
      default: return null;
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-[400px] sm:w-[540px] p-0 flex flex-col bg-slate-50">
        
        {/* HEADER */}
        <div className="p-6 border-b bg-white shadow-sm z-10">
          <SheetHeader className="text-left">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border-2 border-slate-100 shadow-sm">
                  <AvatarImage src={driver.avatarUrl} alt={driver.name} />
                  <AvatarFallback className="bg-slate-200 text-slate-700 text-lg">
                    {driver.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <SheetTitle className="text-xl flex items-center gap-2">
                    {driver.name}
                    {getServiceBadge(driver.serviceType)}
                  </SheetTitle>
                  <SheetDescription className="font-mono mt-1 text-slate-500 flex items-center gap-2">
                    {driver.id} • {driver.fleetOperator}
                  </SheetDescription>
                </div>
              </div>
              {getStatusBadge(driver.status)}
            </div>
            
            <div className="flex items-center gap-4 text-sm text-slate-600 mt-2">
              <div className="flex items-center gap-1.5 font-medium">
                <Car className="h-4 w-4 text-slate-400" />
                {driver.vehicle}
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-slate-400" />
                Updated {new Date(driver.lastUpdated).toLocaleTimeString()}
              </div>
            </div>
          </SheetHeader>
        </div>

        <ScrollArea className="flex-1 p-6">
          <div className="space-y-6">
            
            {/* ISSUES (If any) */}
            {driver.issues && driver.issues.length > 0 && (
              <div className="p-4 rounded-xl border border-red-200 bg-red-50">
                <h3 className="text-sm font-bold text-red-900 flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  Active Alerts
                </h3>
                <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                  {driver.issues.map((issue, idx) => (
                    <li key={idx}>{issue}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* CURRENT ACTIVITY */}
            {driver.currentJob && (
              <section>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Activity className="h-4 w-4 text-blue-500" />
                  Current Activity
                </h3>
                <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
                  <div className="p-3 border-b bg-slate-50/50 flex justify-between items-center">
                    <div>
                      <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">{driver.currentJob.type} JOB</div>
                      <div className="text-xs text-slate-500 font-mono">{driver.currentJob.id}</div>
                    </div>
                    <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">
                      {driver.currentJob.status}
                    </Badge>
                  </div>
                  <div className="p-4">
                    <div className="relative pl-6">
                      <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-slate-200"></div>
                      <div className="relative mb-4">
                        <div className="absolute -left-6 top-0.5 h-3 w-3 rounded-full border-2 border-emerald-500 bg-white"></div>
                        <div className="text-xs font-medium text-slate-500 mb-0.5">Pickup</div>
                        <div className="text-sm font-medium text-slate-900">{driver.currentJob.pickupLocation}</div>
                      </div>
                      <div className="relative">
                        <div className="absolute -left-6 top-0.5 h-3 w-3 rounded-full border-2 border-blue-500 bg-white"></div>
                        <div className="text-xs font-medium text-slate-500 mb-0.5">Dropoff</div>
                        <div className="text-sm font-medium text-slate-900">{driver.currentJob.dropoffLocation}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* LIVE TELEMETRY */}
            <section>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Navigation className="h-4 w-4 text-emerald-500" />
                Live Telemetry
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl border bg-white shadow-sm flex items-center gap-3">
                  <div className="p-2 bg-slate-100 rounded-lg"><Zap className="h-4 w-4 text-slate-600" /></div>
                  <div>
                    <div className="text-xs text-slate-500 font-medium">Speed</div>
                    <div className="text-lg font-bold text-slate-900">{driver.speed} <span className="text-xs font-normal text-slate-500">mph</span></div>
                  </div>
                </div>
                <div className="p-3 rounded-xl border bg-white shadow-sm flex items-center gap-3">
                  <div className="p-2 bg-slate-100 rounded-lg"><Compass className="h-4 w-4 text-slate-600" /></div>
                  <div>
                    <div className="text-xs text-slate-500 font-medium">Heading</div>
                    <div className="text-lg font-bold text-slate-900">{driver.heading}°</div>
                  </div>
                </div>
                <div className="p-3 rounded-xl border bg-white shadow-sm flex items-center gap-3">
                  <div className="p-2 bg-slate-100 rounded-lg"><Crosshair className="h-4 w-4 text-slate-600" /></div>
                  <div>
                    <div className="text-xs text-slate-500 font-medium">Accuracy</div>
                    <div className="text-lg font-bold text-slate-900">±{driver.locationAccuracy} <span className="text-xs font-normal text-slate-500">m</span></div>
                  </div>
                </div>
                <div className="p-3 rounded-xl border bg-white shadow-sm flex items-center gap-3">
                  <div className="p-2 bg-slate-100 rounded-lg"><MapPin className="h-4 w-4 text-slate-600" /></div>
                  <div>
                    <div className="text-xs text-slate-500 font-medium">Coordinates</div>
                    <div className="text-xs font-mono text-slate-900">{driver.lat.toFixed(4)}, {driver.lng.toFixed(4)}</div>
                  </div>
                </div>
              </div>
            </section>

            {/* PERFORMANCE (TODAY) */}
            <section>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-indigo-500" />
                Performance (Today)
              </h3>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl border bg-white shadow-sm text-center">
                    <div className="text-xs text-slate-500 font-medium mb-1">Rating</div>
                    <div className="text-xl font-bold text-slate-900 flex items-center justify-center gap-1">
                      {driver.rating.toFixed(2)} <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                    </div>
                  </div>
                  <div className="p-3 rounded-xl border bg-white shadow-sm text-center">
                    <div className="text-xs text-slate-500 font-medium mb-1">Trips</div>
                    <div className="text-xl font-bold text-slate-900">{driver.tripsToday}</div>
                  </div>
                  <div className="p-3 rounded-xl border bg-white shadow-sm text-center">
                    <div className="text-xs text-slate-500 font-medium mb-1">Earnings</div>
                    <div className="text-xl font-bold text-slate-900">${driver.earningsToday}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl border bg-white shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-emerald-50 rounded-lg"><CheckCircle2 className="h-4 w-4 text-emerald-600" /></div>
                      <div className="text-sm font-medium text-slate-700">Acceptance Rate</div>
                    </div>
                    <div className="text-lg font-bold text-emerald-600">{driver.acceptanceRate}%</div>
                  </div>
                  <div className="p-3 rounded-xl border bg-white shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-red-50 rounded-lg"><XCircle className="h-4 w-4 text-red-600" /></div>
                      <div className="text-sm font-medium text-slate-700">Cancellation Rate</div>
                    </div>
                    <div className="text-lg font-bold text-red-600">{driver.cancellationRate}%</div>
                  </div>
                </div>
              </div>
            </section>

          </div>
        </ScrollArea>

        {/* ACTIONS FOOTER */}
        <div className="p-4 border-t bg-white shadow-sm grid grid-cols-2 gap-3">
          <Button variant="outline" className="w-full flex items-center gap-2 h-10">
            <MessageSquare className="h-4 w-4" /> Message
          </Button>
          <Button variant="outline" className="w-full flex items-center gap-2 h-10">
            <Phone className="h-4 w-4" /> Call
          </Button>
          <Button variant="outline" className="w-full flex items-center gap-2 h-10 border-blue-200 text-blue-700 hover:bg-blue-50">
            <RefreshCw className="h-4 w-4" /> Reassign
          </Button>
          <Button variant="outline" className="w-full flex items-center gap-2 h-10 border-red-200 text-red-700 hover:bg-red-50">
            <PowerOff className="h-4 w-4" /> Force Offline
          </Button>
        </div>

      </SheetContent>
    </Sheet>
  );
}
