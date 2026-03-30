import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { 
  MoreHorizontal, 
  MapPin, 
  Activity, 
  Zap, 
  ShieldAlert, 
  Car, 
  Utensils, 
  Package, 
  Truck,
  Eye,
  Pencil,
  Trash2,
  MoreVertical,
  History,
  TrendingUp,
  AlertTriangle,
  Users
} from 'lucide-react';
import { Zone, ServiceType, ZoneStatus, ZoneType } from '../hooks/useZones';
import { cn } from '@/lib/utils';

interface ZoneListItemProps {
  zone: Zone;
  isActive: boolean;
  onSelect: (id: string) => void;
}

export function ZoneListItem({ zone, isActive, onSelect }: ZoneListItemProps) {
  const getServiceIcon = (service: ServiceType) => {
    switch (service) {
      case 'Ride': return Car;
      case 'Food': return Utensils;
      case 'Parcel': return Package;
      case 'City-to-City': return Truck;
      default: return Activity;
    }
  };

  const getStatusBadge = (status: ZoneStatus) => {
    switch (status) {
      case 'published': return <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100">Active</Badge>;
      case 'draft': return <Badge variant="outline" className="border-slate-200 text-slate-500">Draft</Badge>;
      case 'scheduled': return <Badge className="bg-blue-50 text-blue-700 border-blue-100">Scheduled</Badge>;
      case 'archived': return <Badge className="bg-slate-100 text-slate-500 border-slate-200">Archived</Badge>;
      default: return null;
    }
  };

  const getTypeIcon = (type: ZoneType) => {
    switch (type) {
      case 'operational': return <Activity className="w-3 h-3 text-blue-500" />;
      case 'surge': return <Zap className="w-3 h-3 text-purple-500" />;
      case 'restricted': return <ShieldAlert className="w-3 h-3 text-rose-500" />;
      default: return null;
    }
  };

  const ServiceIcon = getServiceIcon(zone.serviceType);

  return (
    <div 
      onClick={() => onSelect(zone.id)}
      className={cn(
        "group relative p-4 mb-3 rounded-xl border-2 transition-all cursor-pointer",
        isActive 
          ? "border-blue-500 bg-blue-50/30 ring-1 ring-blue-500 ring-offset-1" 
          : "border-slate-100 bg-white hover:border-slate-200 hover:shadow-md",
        zone.zoneType === 'restricted' && !isActive && "border-rose-100 bg-rose-50/10 hover:border-rose-200"
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3">
          <div className={cn(
            "p-2 rounded-lg shrink-0 transition-colors",
            isActive ? "bg-blue-600 text-white" : "bg-slate-50 text-slate-400 group-hover:bg-slate-100"
          )}>
            <ServiceIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 leading-tight truncate max-w-[180px]">
                {zone.name}
              </h3>
              {getStatusBadge(zone.status)}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-500">
              <MapPin className="w-3 h-3" />
              <span>{zone.cityName}</span>
              <span className="text-slate-300">•</span>
              <span className="capitalize">{zone.zoneType}</span>
            </div>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem className="gap-2">
              <Eye className="w-4 h-4" /> View Details
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2">
              <Pencil className="w-4 h-4" /> Edit Configuration
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2">
              <TrendingUp className="w-4 h-4" /> Apply Surge
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2">
              <Activity className="w-4 h-4" /> View Logs
            </DropdownMenuItem>
            <hr className="my-1 border-slate-100" />
            <DropdownMenuItem className="gap-2 text-rose-600 focus:text-rose-600 focus:bg-rose-50">
              <Trash2 className="w-4 h-4" /> Archive Zone
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-4">
        <div className="p-2 rounded-lg bg-slate-50/50 border border-slate-100 text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Demand</p>
          <div className="flex items-center justify-center gap-1 mt-0.5">
             <div className={cn(
               "w-1.5 h-1.5 rounded-full",
               zone.metrics?.demandLevel === 'high' ? "bg-rose-500 animate-pulse" : 
               zone.metrics?.demandLevel === 'medium' ? "bg-amber-500" : "bg-emerald-500"
             )}></div>
             <span className="text-xs font-bold text-slate-700 capitalize">{zone.metrics?.demandLevel}</span>
          </div>
        </div>
        <div className="p-2 rounded-lg bg-slate-50/50 border border-slate-100 text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Supply</p>
          <div className="flex items-center justify-center gap-1 mt-0.5">
             <Users className="w-3 h-3 text-slate-400" />
             <span className="text-xs font-bold text-slate-700">
               {zone.metrics?.activeDrivers || zone.metrics?.activeCouriers}
             </span>
          </div>
        </div>
        <div className="p-2 rounded-lg bg-slate-50/50 border border-slate-100 text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Rules</p>
          <div className="flex items-center justify-center gap-1.5 mt-0.5">
            {zone.metrics?.hasSurge && <Zap className="w-3 h-3 text-purple-500" title="Surge Active" />}
            {zone.metrics?.hasExtraFare && <AlertTriangle className="w-3 h-3 text-amber-500" title="Extra Fare Active" />}
            {!zone.metrics?.hasSurge && !zone.metrics?.hasExtraFare && <Activity className="w-3 h-3 text-slate-300" />}
          </div>
        </div>
      </div>
      
      {/* Visual Indicator for restricted zones */}
      {zone.zoneType === 'restricted' && (
        <div className="absolute top-0 right-12 px-2 py-1 bg-rose-100 text-[10px] font-bold text-rose-700 rounded-b-md">
          RESTRICTED
        </div>
      )}
    </div>
  );
}
