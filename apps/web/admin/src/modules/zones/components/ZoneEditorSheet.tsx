import { Zone } from '../hooks/useZones';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Map, Zap, ShieldAlert, Star, Store, Truck, Route, Clock, CheckCircle2, AlertCircle, Save, Trash2, Copy, History } from 'lucide-react';

interface ZoneEditorSheetProps {
  zone: Zone | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (zone: Zone) => void;
}

export function ZoneEditorSheet({ zone, isOpen, onClose, onSave }: ZoneEditorSheetProps) {
  if (!zone) return null;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-[400px] sm:w-[540px] p-0 flex flex-col h-full bg-slate-50 border-l border-slate-200">
        <SheetHeader className="p-6 bg-white border-b border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <Badge variant="outline" className="uppercase tracking-wider font-semibold text-[10px] bg-slate-100 text-slate-600">
              {zone.id}
            </Badge>
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
              {zone.status.toUpperCase()}
            </Badge>
          </div>
          <SheetTitle className="text-xl font-bold text-slate-900">{zone.name}</SheetTitle>
          <SheetDescription className="text-sm text-slate-500">
            Manage boundaries, rules, and linked policies for this zone.
          </SheetDescription>
        </SheetHeader>

        <Tabs defaultValue="details" className="flex-1 flex flex-col overflow-hidden">
          <div className="px-6 bg-white border-b border-slate-200">
            <TabsList className="w-full justify-start h-12 bg-transparent p-0">
              <TabsTrigger value="details" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none px-4 h-full">Details</TabsTrigger>
              <TabsTrigger value="policies" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none px-4 h-full">Policies</TabsTrigger>
              <TabsTrigger value="schedule" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none px-4 h-full">Schedule</TabsTrigger>
              <TabsTrigger value="audit" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none px-4 h-full">Audit Log</TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="flex-1 p-6">
            <TabsContent value="details" className="space-y-6 m-0">
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="name" className="text-xs font-bold text-slate-700 uppercase">Zone Name</Label>
                  <Input id="name" defaultValue={zone.name} className="bg-white" />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="description" className="text-xs font-bold text-slate-700 uppercase">Description</Label>
                  <Textarea id="description" defaultValue={zone.description} className="bg-white resize-none" rows={3} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label className="text-xs font-bold text-slate-700 uppercase">City</Label>
                    <Select defaultValue={zone.cityId}>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Select city" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sf">San Francisco</SelectItem>
                        <SelectItem value="ny">New York</SelectItem>
                        <SelectItem value="la">Los Angeles</SelectItem>
                        <SelectItem value="chicago">Chicago</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-xs font-bold text-slate-700 uppercase">Service Type</Label>
                    <Select defaultValue={zone.serviceType}>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Select service" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Ride">Ride</SelectItem>
                        <SelectItem value="Food">Food</SelectItem>
                        <SelectItem value="Parcel">Parcel</SelectItem>
                        <SelectItem value="City-to-City">City-to-City</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label className="text-xs font-bold text-slate-700 uppercase">Zone Type</Label>
                    <Select defaultValue={zone.zoneType}>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="operational">Operational</SelectItem>
                        <SelectItem value="surge">Surge</SelectItem>
                        <SelectItem value="restricted">Restricted</SelectItem>
                        <SelectItem value="priority">Priority</SelectItem>
                        <SelectItem value="merchant">Merchant</SelectItem>
                        <SelectItem value="fleet">Fleet</SelectItem>
                        <SelectItem value="corridor">Corridor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-xs font-bold text-slate-700 uppercase">Priority (1-100)</Label>
                    <Input type="number" defaultValue={zone.priority} className="bg-white" min={1} max={100} />
                  </div>
                </div>

                {zone.zoneType === 'restricted' && (
                  <div className="grid gap-2 p-4 bg-red-50 border border-red-100 rounded-lg">
                    <Label className="text-xs font-bold text-red-800 uppercase flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4" /> Restriction Type
                    </Label>
                    <Select defaultValue={zone.restrictionType || 'no_pickup'}>
                      <SelectTrigger className="bg-white border-red-200">
                        <SelectValue placeholder="Select restriction" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="no_pickup">No Pickup</SelectItem>
                        <SelectItem value="no_dropoff">No Dropoff</SelectItem>
                        <SelectItem value="no_delivery">No Delivery</SelectItem>
                        <SelectItem value="no_parking">No Parking/Waiting</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="policies" className="space-y-6 m-0">
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label className="text-xs font-bold text-slate-700 uppercase">Fare Policy</Label>
                  <Select defaultValue={zone.farePolicyId || 'none'}>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select fare policy" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Inherit from City Default</SelectItem>
                      <SelectItem value="fp-standard">Standard Rates</SelectItem>
                      <SelectItem value="fp-premium">Premium Rates (+20%)</SelectItem>
                      <SelectItem value="fp-discount">Discount Rates (-10%)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-[10px] text-slate-500">Controls base fare, per-km, and per-minute pricing in this zone.</p>
                </div>

                <div className="grid gap-2">
                  <Label className="text-xs font-bold text-slate-700 uppercase">Surge Policy</Label>
                  <Select defaultValue={zone.surgePolicyId || 'none'}>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select surge policy" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Surge Allowed</SelectItem>
                      <SelectItem value="sp-standard">Standard Dynamic Surge (Max 2.5x)</SelectItem>
                      <SelectItem value="sp-weekend-dinner">Weekend Dinner Surge (Fixed 1.5x)</SelectItem>
                      <SelectItem value="sp-event">Special Event Surge (Max 4.0x)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-[10px] text-slate-500">Defines how dynamic pricing multipliers are applied.</p>
                </div>

                <div className="grid gap-2">
                  <Label className="text-xs font-bold text-slate-700 uppercase">Dispatch Policy</Label>
                  <Select defaultValue={zone.dispatchPolicyId || 'none'}>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select dispatch policy" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Inherit from City Default</SelectItem>
                      <SelectItem value="dp-standard">Standard Radius (3km)</SelectItem>
                      <SelectItem value="dp-tight">Tight Radius (1.5km)</SelectItem>
                      <SelectItem value="dp-wide">Wide Radius (5km)</SelectItem>
                      <SelectItem value="dp-fifo">First-In-First-Out (Airport Queue)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-[10px] text-slate-500">Controls driver assignment radius and queueing logic.</p>
                </div>

                <div className="grid gap-2">
                  <Label className="text-xs font-bold text-slate-700 uppercase">Fleet Operator Assignment</Label>
                  <Select defaultValue={zone.fleetOperatorId || 'none'}>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select fleet operator" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">All Fleets (Open Market)</SelectItem>
                      <SelectItem value="fo-alpha">Alpha Fleet Exclusive</SelectItem>
                      <SelectItem value="fo-beta">Beta Logistics Exclusive</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-[10px] text-slate-500">Restricts dispatches in this zone to specific fleet partners.</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="schedule" className="space-y-6 m-0">
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg mb-4">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-blue-900">Zone Scheduling</h4>
                    <p className="text-xs text-blue-700 mt-1">
                      By default, zones are active 24/7 once published. You can restrict this zone to only be active during specific times.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-2">
                <Label className="text-xs font-bold text-slate-700 uppercase">Schedule Expression (Cron or Text)</Label>
                <Input defaultValue={zone.schedule || ''} placeholder="e.g., Friday-Sunday 18:00-22:00" className="bg-white" />
                <p className="text-[10px] text-slate-500">Leave blank for 24/7 active.</p>
              </div>
            </TabsContent>

            <TabsContent value="audit" className="space-y-6 m-0">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white border rounded-lg">
                  <div>
                    <div className="text-xs font-bold text-slate-500 uppercase">Created By</div>
                    <div className="text-sm font-medium text-slate-900">{zone.createdBy}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-slate-500 uppercase">Version</div>
                    <div className="text-sm font-medium text-slate-900">v{zone.version}</div>
                  </div>
                </div>

                <div className="relative pl-4 border-l-2 border-slate-200 space-y-6 mt-6">
                  <div className="relative">
                    <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-white"></div>
                    <div className="text-xs text-slate-500 mb-1">{new Date(zone.publishedAt || new Date()).toLocaleString()}</div>
                    <div className="text-sm font-medium text-slate-900">Zone Published</div>
                    <div className="text-xs text-slate-600">by {zone.updatedBy}</div>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-slate-300 ring-4 ring-white"></div>
                    <div className="text-xs text-slate-500 mb-1">2 hours prior</div>
                    <div className="text-sm font-medium text-slate-900">Policies Updated</div>
                    <div className="text-xs text-slate-600">Attached fp-standard and dp-standard</div>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-slate-300 ring-4 ring-white"></div>
                    <div className="text-xs text-slate-500 mb-1">1 day prior</div>
                    <div className="text-sm font-medium text-slate-900">Zone Created (Draft)</div>
                    <div className="text-xs text-slate-600">by {zone.createdBy}</div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </ScrollArea>

          <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="text-slate-500 hover:text-red-600 hover:bg-red-50 hover:border-red-200">
                <Trash2 className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" className="text-slate-500">
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button onClick={() => onSave(zone)} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Save className="w-4 h-4 mr-2" /> Save Changes
              </Button>
            </div>
          </div>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
