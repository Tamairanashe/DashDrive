import { cn } from '@/lib/utils';
import { 
  Map, 
  Car, 
  Activity, 
  Utensils, 
  ShoppingCart, 
  ShoppingBag, 
  Package, 
  Home, 
  Ticket, 
  Key, 
  MapPin, 
  GraduationCap, 
  Users, 
  Bike, 
  Building2, 
  UserCog, 
  Settings2, 
  Radio, 
  LocateFixed, 
  BellRing, 
  Route, 
  TrendingUp, 
  History, 
  LineChart, 
  FileText, 
  Wallet, 
  PieChart, 
  Landmark, 
  CreditCard, 
  Image as ImageIcon, 
  Tag, 
  Percent, 
  Send, 
  Mail, 
  Rocket, 
  Store, 
  Zap, 
  PenTool, 
  Star, 
  MessageSquare, 
  Shield, 
  Award, 
  LifeBuoy, 
  Wrench, 
  Building, 
  Sliders, 
  ClipboardList, 
  Lock, 
  Code, 
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigationStore } from '@/store/navigation';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const navigationGroups = [
  {
    title: 'Dashboard',
    items: [
      { name: 'Dashboard', icon: Activity },
      { name: 'Heat Map', icon: Map },
      { name: 'Fleet View', icon: Car },
    ]
  },
  {
    title: 'SERVICES',
    items: [
      { name: 'Ride Hailing', icon: Car },
      { name: 'Food Delivery', icon: Utensils },
      { name: 'Mart Delivery', icon: ShoppingCart },
      { name: 'Shopping', icon: ShoppingBag },
      { name: 'Parcel Delivery', icon: Package },
      { name: 'Marketplace & Stays', icon: Home },
      { name: 'Events Booking', icon: Ticket },
      { name: 'Car Rental', icon: Key },
      { name: 'City to City', icon: MapPin },
      { name: 'School Run Monitor', icon: GraduationCap },
    ]
  },
  {
    title: 'PARTNERS & FLEET',
    items: [
      { name: 'Drivers', icon: Users },
      { name: 'Couriers', icon: Bike },
      { name: 'Fleet Operators', icon: Building2 },
      { name: 'Vehicle Management', icon: Car },
    ]
  },
  {
    title: 'USERS',
    items: [
      { name: 'User Management', icon: UserCog },
    ]
  },
  {
    title: 'OPERATIONS',
    items: [
      { name: 'Operations Hub', icon: Settings2 },
      { name: 'Zone Setup', icon: Map },
      { name: 'Dispatch Management', icon: Radio },
      { name: 'Live Tracking', icon: LocateFixed },
      { name: 'Active Alerts', icon: BellRing },
      { name: 'Roads Management Insights', icon: Route },
      { name: 'Surge Control', icon: TrendingUp },
      { name: 'History Logs', icon: History },
    ]
  },
  {
    title: 'ANALYTICS & PERFORMANCE',
    items: [
      { name: 'Performance Analytics', icon: LineChart },
      { name: 'Reports', icon: FileText },
    ]
  },
  {
    title: 'FINANCE',
    items: [
      { name: 'Fare Management', icon: Wallet },
      { name: 'Financial Reports Hub', icon: PieChart },
      { name: 'Settlement & Payouts', icon: Landmark },
      { name: 'Fintech Partner Hub', icon: CreditCard },
    ]
  },
  {
    title: 'MARKETING & GROWTH',
    items: [
      { name: 'Banner Setup', icon: ImageIcon },
      { name: 'Coupon Setup', icon: Tag },
      { name: 'Discount Setup', icon: Percent },
      { name: 'Send Notifications', icon: Send },
      { name: 'Newsletter', icon: Mail },
      { name: 'Growth Engine', icon: Rocket },
    ]
  },
  {
    title: 'MARKETPLACE & INTEGRATIONS',
    items: [
      { name: 'Product Marketplace', icon: Store },
      { name: 'Utility Aggregator', icon: Zap },
    ]
  },
  {
    title: 'CONTENT',
    items: [
      { name: 'Blog Setup', icon: PenTool },
    ]
  },
  {
    title: 'QUALITY & TRUST',
    items: [
      { name: 'Reviews & Ratings', icon: Star },
      { name: 'Partner Feedback', icon: MessageSquare },
      { name: 'Moderation Queue', icon: Shield },
      { name: 'Reputation Analytics', icon: Award },
    ]
  },
  {
    title: 'SUPPORT',
    items: [
      { name: 'Support Hub', icon: LifeBuoy },
      { name: 'Technical Resolution', icon: Wrench },
    ]
  },
  {
    title: 'ENTERPRISE',
    items: [
      { name: 'Enterprise Business Setup', icon: Building },
      { name: 'Configuration', icon: Sliders },
      { name: 'Audit Logs', icon: ClipboardList },
      { name: 'Access & Governance', icon: Lock },
      { name: 'API Management', icon: Code },
      { name: 'System Settings', icon: Settings },
    ]
  }
];

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const { activeModule, setActiveModule } = useNavigationStore();

  return (
    <aside
      className={cn(
        "relative flex flex-col border-r bg-white transition-all duration-300 ease-in-out",
        isOpen ? "w-64" : "w-20"
      )}
    >
      <div className="flex h-16 items-center justify-between border-b px-4 shrink-0">
        {isOpen && (
          <span className="text-xl font-bold tracking-tight text-slate-900">
            DashDrive
          </span>
        )}
        {!isOpen && (
          <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-md bg-slate-900 text-white font-bold">
            D
          </div>
        )}
      </div>

      <ScrollArea className="flex-1 py-4">
        <nav className="space-y-6 px-3">
          {navigationGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-1">
              {isOpen && group.title !== 'Dashboard' && (
                <h3 className="px-3 text-xs font-semibold text-slate-500 tracking-wider mb-2 mt-4">
                  {group.title}
                </h3>
              )}
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeModule === item.name;
                return (
                  <button
                    key={item.name}
                    onClick={() => setActiveModule(item.name)}
                    title={!isOpen ? item.name : undefined}
                    className={cn(
                      "w-full group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      isActive 
                        ? "bg-slate-900 text-white" 
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-5 w-5 flex-shrink-0",
                        isOpen ? "mr-3" : "mx-auto",
                        isActive ? "text-white" : "text-slate-400 group-hover:text-slate-900"
                      )}
                      aria-hidden="true"
                    />
                    {isOpen && <span className="truncate">{item.name}</span>}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
      </ScrollArea>

      <div className="border-t p-4 shrink-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="mx-auto flex w-full justify-center"
        >
          {isOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
        </Button>
      </div>
    </aside>
  );
}
