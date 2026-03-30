import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronRight, 
  ChevronLeft, 
  MapPin, 
  Car, 
  Utensils, 
  Package, 
  Truck,
  CheckCircle2,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CreateZoneSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

const steps = [
  'Basic Info',
  'Geometry',
  'Services',
  'Rules',
  'Pricing',
  'Review'
];

export function CreateZoneSheet({ isOpen, onClose }: CreateZoneSheetProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-2xl flex flex-col p-0 gap-0">
        <SheetHeader className="px-6 py-6 border-b border-slate-100 shrink-0">
          <SheetTitle className="text-2xl font-bold text-slate-900 tracking-tight">
            Create Operational Zone
          </SheetTitle>
          <SheetDescription className="text-slate-500 font-medium">
            Step {currentStep + 1}: {steps[currentStep]}
          </SheetDescription>
          
          <div className="flex gap-1 mt-4">
             {steps.map((step, i) => (
                <div 
                  key={step} 
                  className={cn(
                    "h-1.5 flex-1 rounded-full transition-all duration-300",
                    i <= currentStep ? "bg-blue-600" : "bg-slate-100"
                  )} 
                />
             ))}
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6">
           {currentStep === 0 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                 <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Zone Name</label>
                    <Input placeholder="Enter zone name (e.g. Harare North CBD)" className="h-11 bg-slate-50" />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-sm font-bold text-slate-700">City</label>
                       <Select defaultValue="sf">
                          <SelectTrigger className="h-11 bg-slate-50">
                             <SelectValue placeholder="Select city" />
                          </SelectTrigger>
                          <SelectContent>
                             <SelectItem value="sf">San Francisco</SelectItem>
                             <SelectItem value="ha">Harare</SelectItem>
                             <SelectItem value="ny">New York</SelectItem>
                          </SelectContent>
                       </Select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-sm font-bold text-slate-700">Zone Type</label>
                       <Select defaultValue="operational">
                          <SelectTrigger className="h-11 bg-slate-50">
                             <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                             <SelectItem value="operational">Operational</SelectItem>
                             <SelectItem value="surge">Surge Zone</SelectItem>
                             <SelectItem value="restricted">Restricted Zone</SelectItem>
                             <SelectItem value="priority">Priority Coverage</SelectItem>
                          </SelectContent>
                       </Select>
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Description (Optional)</label>
                    <textarea 
                      className="w-full h-24 p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
                      placeholder="Operational purpose, specific timeframes, or area constraints..."
                    ></textarea>
                 </div>
              </div>
           )}

           {currentStep === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                 <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                       <MapPin className="w-8 h-8" />
                    </div>
                    <p className="font-bold text-slate-900 text-lg">Define Area on Map</p>
                    <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">Click "Start Drawing" to define the zone boundaries directly on the interactive workspace.</p>
                    <Button className="mt-6 bg-blue-600 hover:bg-blue-700 h-11 px-8 font-bold">Start Drawing Tools</Button>
                 </div>
                 
                 <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <p className="text-xs font-bold text-emerald-800 uppercase tracking-tight">GeoJSON Upload Support Available</p>
                 </div>
              </div>
           )}

           {currentStep === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                 <div className="grid grid-cols-2 gap-4">
                    {[
                      { icon: Car, label: 'Ride Hailing', value: 'ride' },
                      { icon: Utensils, label: 'Food Delivery', value: 'food' },
                      { icon: Package, label: 'Parcel Delivery', value: 'parcel' },
                      { icon: Truck, label: 'City to City', value: 'city' }
                    ].map(s => (
                      <div key={s.value} className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 hover:border-blue-500 hover:bg-blue-50/20 cursor-pointer transition-all group">
                         <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-lg flex items-center justify-center group-hover:bg-blue-100 group-hover:text-blue-600">
                            <s.icon className="w-5 h-5" />
                         </div>
                         <span className="font-bold text-slate-900 flex-1">{s.label}</span>
                         <div className="w-5 h-5 rounded border-2 border-slate-200"></div>
                      </div>
                    ))}
                 </div>
              </div>
           )}

           {currentStep > 2 && (
              <div className="p-8 text-center text-slate-400 animate-in fade-in slide-in-from-right-4 duration-300">
                 <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-20" />
                 <p className="font-bold">Advanced Rules Configuration</p>
                 <p className="text-sm">Extended flow for rule-based operational parameters.</p>
              </div>
           )}
        </div>

        <SheetFooter className="px-6 py-6 border-t border-slate-50 flex items-center justify-between sm:justify-between shrink-0 bg-white">
           <Button 
             variant="ghost" 
             onClick={prevStep} 
             disabled={currentStep === 0}
             className="h-11 px-6 font-bold text-slate-500 hover:text-slate-900"
           >
              <ChevronLeft className="w-4 h-4 mr-2" /> Back
           </Button>
           
           {currentStep < steps.length - 1 ? (
              <Button onClick={nextStep} className="h-11 px-8 bg-blue-600 hover:bg-blue-700 font-bold shadow-lg shadow-blue-600/20">
                 Next Step <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
           ) : (
              <Button onClick={() => {}} className="h-11 px-8 bg-black hover:bg-slate-800 text-white font-bold shadow-xl">
                 Create & Activate Zone
              </Button>
           )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
