import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { Card, Button, Badge } from './ui';
import { cn } from '../lib/utils';
import {
  Plus,
  Search,
  MoreVertical,
  Image as ImageIcon,
  ChevronRight,
  GripVertical,
  Eye,
  Pencil,
  BarChart3,
  Sparkles,
  Crop,
  Trash2,
  Upload,
  DollarSign,
  Clock,
  Calendar,
  Copy,
  Check,
  X,
  ArrowRight,
  Filter,
  Download,
  History as HistoryIcon,
  LayoutGrid,
  List,
  Settings2,
  AlertCircle,
  Smartphone,
  Monitor,
  Tablet
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const MENUS = [
  { id: 'm1', name: 'Breakfast Menu', hours: '6AM - 11AM', items: 8, categories: 2, status: 'Live', lastUpdated: 'Today 9:15 AM' },
  { id: 'm2', name: 'Lunch Menu', hours: '11AM - 4PM', items: 32, categories: 6, status: 'Live', lastUpdated: 'Yesterday 2:30 PM' },
  { id: 'm3', name: 'Dinner Menu', hours: '4PM - 10PM', items: 27, categories: 5, status: 'Live', lastUpdated: 'Jan 15, 2024' },
  { id: 'm4', name: 'Weekend Brunch', hours: 'Draft', items: 12, categories: 3, status: 'Draft', lastUpdated: 'New' },
];

const CATEGORIES = [
  { id: 1, name: 'Popular Items', count: 5, menus: ['Breakfast', 'Lunch', 'Dinner'], status: 'Live' },
  { id: 2, name: 'Burgers', count: 12, menus: ['Lunch', 'Dinner'], status: 'Live' },
  { id: 3, name: 'Sides', count: 8, menus: ['All Menus'], status: 'Live' },
  { id: 4, name: 'Drinks', count: 10, menus: ['All Menus'], status: 'Live' },
  { id: 5, name: 'Desserts', count: 4, menus: ['Dinner'], status: 'Live' },
];

const MENU_ITEMS = [
  { id: 1, name: 'Truffle Burger', price: 14.99, category: 'Burgers', status: 'Active', photo: 'burger1', rating: 4.8, reviews: 124, topSeller: true },
  { id: 2, name: 'Classic Cheeseburger', price: 12.99, category: 'Burgers', status: 'Active', photo: 'burger2', rating: 4.5, reviews: 87 },
  { id: 3, name: 'Sweet Potato Fries', price: 5.99, category: 'Sides', status: 'Active', photo: 'fries1', rating: 4.2, reviews: 56 },
  { id: 4, name: 'Onion Rings', price: 6.49, category: 'Sides', status: 'Inactive', photo: 'rings1', rating: 3.8, reviews: 32, warning: 'Below average' },
];

const CHANGE_HISTORY = [
  { id: 1, date: 'Today 9:45 AM', user: 'Alex (Admin)', action: 'Price Update', details: 'Truffle Burger: $13.99 → $14.99' },
  { id: 2, date: 'Today 9:30 AM', user: 'Alex (Admin)', action: 'Photo Upload', details: '5 photos uploaded for review' },
  { id: 3, date: 'Yesterday 4:15 PM', user: 'Jamie (Mgr)', action: 'New Item Added', details: 'Added "Garlic Knots" - $5.99' },
];

export const MenuMaker = ({ token, merchant }: { token: string | null, merchant: any }) => {
  const [activeTab, setActiveTab] = useState<'menus' | 'categories' | 'items' | 'bulk' | 'history'>('menus');
  const [selectedItem, setSelectedItem] = useState<any>(MENU_ITEMS[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');
  const [searchQuery, setSearchQuery] = useState('');
  const [liveCategories, setLiveCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const storeId = merchant?.stores?.[0]?.id;

  useEffect(() => {
    if (token && storeId) {
      fetchCategories();
    } else {
      setIsLoading(false);
    }
  }, [token, storeId]);

  const fetchCategories = async () => {
    try {
      const data = await api.menu.getCategories(storeId);
      setLiveCategories(data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateDescription = () => {
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 1500);
  };

  const renderMenusTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-zinc-900 text-white border-none">
          <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Active Menus</p>
          <div className="text-2xl font-black mt-1">3</div>
          <p className="text-[10px] text-emerald-400 mt-2 flex items-center gap-1">
            <Check size={10} /> All systems live
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Total Categories</p>
          <div className="text-2xl font-black text-zinc-900 mt-1">18</div>
          <p className="text-[10px] text-zinc-500 mt-2">Organized across menus</p>
        </Card>
        <Card className="p-4">
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Total Items</p>
          <div className="text-2xl font-black text-zinc-900 mt-1">67</div>
          <p className="text-[10px] text-zinc-500 mt-2">Live on Uber Eats</p>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Active Menus</h3>
          <Button variant="primary" size="sm" className="gap-2">
            <Plus size={14} /> New Menu
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-3">
          {MENUS.map((menu) => (
            <Card key={menu.id} className="p-4 hover:border-zinc-300 transition-all group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center",
                    menu.status === 'Live' ? "bg-emerald-50 text-emerald-600" : "bg-zinc-100 text-zinc-400"
                  )}>
                    <Clock size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-zinc-900">{menu.name}</h4>
                      <Badge variant={menu.status === 'Live' ? 'success' : 'neutral'}>{menu.status}</Badge>
                    </div>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      {menu.hours} • {menu.items} items • {menu.categories} categories
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-zinc-400 mr-2">Updated {menu.lastUpdated}</span>
                  <Button variant="outline" size="sm">Edit</Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8"><Copy size={14} /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical size={14} /></Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Card className="p-4 bg-emerald-50 border-emerald-100">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
            <Sparkles size={18} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-emerald-900">Menu Optimization Tip</h4>
            <p className="text-xs text-emerald-700 mt-1">
              Items with high-quality photos get 3x more orders. You have 12 items without photos.
            </p>
            <Button variant="primary" size="sm" className="mt-3 bg-emerald-600 hover:bg-emerald-700 border-emerald-600">
              Add Photos Now
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderCategoriesTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
          <input
            type="text"
            placeholder="Search categories..."
            className="w-full pl-10 pr-4 py-2 text-sm border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 bg-white"
          />
        </div>
        <Button variant="primary" size="sm" className="gap-2">
          <Plus size={14} /> New Category
        </Button>
      </div>

      <Card className="p-0 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-50 border-b border-zinc-100">
              <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Category</th>
              <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Items</th>
              <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Menus</th>
              <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {liveCategories.map((cat) => (
              <tr key={cat.id} className="hover:bg-zinc-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <GripVertical size={14} className="text-zinc-300 cursor-grab" />
                    <span className="text-sm font-bold text-zinc-900">{cat.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-zinc-600">{cat.products?.length || 0} items</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    <span className="text-[10px] px-1.5 py-0.5 bg-zinc-100 text-zinc-500 rounded font-medium">Main Menu</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge variant={cat.is_active ? "success" : "neutral"}>{cat.is_active ? "Live" : "Inactive"}</Badge>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8"><Pencil size={14} /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical size={14} /></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );

  const renderItemsTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      <div className="lg:col-span-2 space-y-4 overflow-y-auto pr-2 scrollbar-hide">
        <div className="sticky top-0 z-10 bg-zinc-50 pb-4 flex items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 bg-white"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2" onClick={() => setIsPreviewOpen(true)}>
              <Eye size={16} /> Preview
            </Button>
            <Button variant="primary" size="sm" className="gap-2">
              <Plus size={16} /> Add Item
            </Button>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <Button variant="secondary" size="sm" className="bg-zinc-900 text-white border-none whitespace-nowrap">All: 67</Button>
          <Button variant="ghost" size="sm" className="whitespace-nowrap">Live: 58</Button>
          <Button variant="ghost" size="sm" className="whitespace-nowrap">Draft: 9</Button>
          <Button variant="ghost" size="sm" className="whitespace-nowrap text-red-600">No Photo: 12</Button>
          <Button variant="ghost" size="sm" className="whitespace-nowrap text-amber-600">Low Rated: 3</Button>
        </div>

        <div className="space-y-3">
          {MENU_ITEMS.map((item) => (
            <Card
              key={item.id}
              className={cn(
                "p-3 hover:border-zinc-300 transition-all cursor-pointer group",
                selectedItem?.id === item.id ? "border-zinc-900 ring-1 ring-zinc-900 shadow-md" : ""
              )}
              onClick={() => setSelectedItem(item)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg bg-zinc-100 overflow-hidden flex-shrink-0 relative">
                    <img src={`https://picsum.photos/seed/${item.photo}/200/200`} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    {item.topSeller && (
                      <div className="absolute top-0 right-0 bg-amber-500 text-white p-1 rounded-bl-lg">
                        <Sparkles size={10} />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-zinc-900">{item.name}</h4>
                      {item.topSeller && <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">Top Seller</span>}
                    </div>
                    <p className="text-xs text-zinc-500">{item.category} • ${item.price}</p>
                    <div className="mt-2 flex items-center gap-3">
                      <Badge variant={item.status === 'Active' ? 'success' : 'neutral'}>{item.status}</Badge>
                      <div className="flex items-center gap-1 text-[10px] font-medium text-zinc-400">
                        <span className="text-amber-500">★ {item.rating}</span>
                        <span>({item.reviews} ratings)</span>
                      </div>
                      {item.warning && (
                        <span className="text-[10px] font-bold text-red-500 flex items-center gap-1">
                          <AlertCircle size={10} /> {item.warning}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-zinc-900"><Pencil size={16} /></Button>
                  <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-zinc-900"><MoreVertical size={16} /></Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="lg:col-span-1 bg-zinc-50 -m-6 p-6 border-l border-zinc-200">
        {renderItemEditor()}
      </div>
    </div>
  );

  const renderBulkActionsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">Bulk Operations</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2"><Filter size={14} /> Filters</Button>
          <Button variant="outline" size="sm" className="gap-2"><Download size={14} /> Export</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Price Actions" className="space-y-4">
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-between group">
              <span>Increase prices by %</span>
              <ArrowRight size={16} className="text-zinc-300 group-hover:text-zinc-900 group-hover:translate-x-1 transition-all" />
            </Button>
            <Button variant="outline" className="w-full justify-between group">
              <span>Decrease prices by %</span>
              <ArrowRight size={16} className="text-zinc-300 group-hover:text-zinc-900 group-hover:translate-x-1 transition-all" />
            </Button>
            <Button variant="outline" className="w-full justify-between group">
              <span>Set fixed price for selected</span>
              <ArrowRight size={16} className="text-zinc-300 group-hover:text-zinc-900 group-hover:translate-x-1 transition-all" />
            </Button>
          </div>
        </Card>

        <Card title="Availability & Status" className="space-y-4">
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-between group">
              <span>Mark as Available</span>
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
            </Button>
            <Button variant="outline" className="w-full justify-between group">
              <span>Mark as Unavailable</span>
              <div className="w-2 h-2 rounded-full bg-red-500" />
            </Button>
            <Button variant="outline" className="w-full justify-between group">
              <span>Set Custom Hours</span>
              <Clock size={16} className="text-zinc-400" />
            </Button>
          </div>
        </Card>

        <Card title="Category & Menu" className="space-y-4">
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-between group">
              <span>Move to Category</span>
              <LayoutGrid size={16} className="text-zinc-400" />
            </Button>
            <Button variant="outline" className="w-full justify-between group">
              <span>Add to Menu</span>
              <List size={16} className="text-zinc-400" />
            </Button>
          </div>
        </Card>

        <Card title="Photos" className="space-y-4">
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-between group">
              <span>Request Photos for Selected</span>
              <ImageIcon size={16} className="text-zinc-400" />
            </Button>
            <Button variant="outline" className="w-full justify-between group">
              <span>Bulk Photo Upload</span>
              <Upload size={16} className="text-zinc-400" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderHistoryTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">Change History</h3>
        <Button variant="outline" size="sm" className="gap-2"><Download size={14} /> Export Log</Button>
      </div>
      <Card className="p-0 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-50 border-b border-zinc-100">
              <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Date</th>
              <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">User</th>
              <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Action</th>
              <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {CHANGE_HISTORY.map((log) => (
              <tr key={log.id} className="hover:bg-zinc-50/50 transition-colors">
                <td className="px-6 py-4 text-xs text-zinc-600">{log.date}</td>
                <td className="px-6 py-4">
                  <span className="text-xs font-bold text-zinc-900">{log.user}</span>
                </td>
                <td className="px-6 py-4">
                  <Badge variant="neutral">{log.action}</Badge>
                </td>
                <td className="px-6 py-4 text-xs text-zinc-500">{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );

  const renderItemEditor = () => {
    if (!selectedItem) return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8 text-zinc-400">
        <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center mb-4">
          <Pencil size={24} className="opacity-20" />
        </div>
        <p className="text-sm font-bold">No Item Selected</p>
        <p className="text-xs mt-1">Select an item from the list to edit its details</p>
      </div>
    );

    return (
      <div className="space-y-6 overflow-y-auto h-full pr-2 scrollbar-hide pb-20">
        <div className="flex items-center justify-between sticky top-0 bg-zinc-50 z-10 py-2">
          <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">Edit Item</h3>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="text-xs">Cancel</Button>
            <Button variant="primary" size="sm" className="text-xs">Save Changes</Button>
          </div>
        </div>

        {/* Photo Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Item Photos</label>
            <span className="text-[10px] text-zinc-400">Max 5 photos</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-square rounded-xl bg-zinc-100 border-2 border-dashed border-zinc-200 relative group overflow-hidden">
                {i === 1 ? (
                  <>
                    <img
                      src={`https://picsum.photos/seed/${selectedItem.photo}/300/300`}
                      alt="Item"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button className="p-1.5 bg-white rounded-lg text-zinc-900 hover:bg-zinc-100"><Crop size={14} /></button>
                      <button className="p-1.5 bg-white rounded-lg text-red-600 hover:bg-red-50"><Trash2 size={14} /></button>
                    </div>
                  </>
                ) : (
                  <button className="absolute inset-0 flex flex-col items-center justify-center text-zinc-400 hover:text-zinc-600 hover:bg-zinc-200/50 transition-colors">
                    <Upload size={16} />
                    <span className="text-[10px] mt-1">Add</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Basic Info */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Item Name</label>
            <input
              type="text"
              defaultValue={selectedItem.name}
              className="w-full p-2.5 text-sm border border-zinc-200 rounded-xl outline-none focus:ring-2 focus:ring-zinc-900/5"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Description</label>
              <button
                onClick={handleGenerateDescription}
                disabled={isGenerating}
                className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 hover:text-emerald-700 disabled:opacity-50"
              >
                <Sparkles size={12} className={isGenerating ? "animate-pulse" : ""} />
                {isGenerating ? "Generating..." : "Suggest with AI"}
              </button>
            </div>
            <textarea
              placeholder="Describe your item..."
              defaultValue="A juicy, hand-pressed wagyu beef patty topped with black truffle aioli, caramelized onions, and melted gruyère on a toasted brioche bun."
              className="w-full p-3 text-sm border border-zinc-200 rounded-xl outline-none focus:ring-2 focus:ring-zinc-900/5 min-h-[100px] resize-none"
            />
          </div>
        </div>

        {/* Pricing Rules */}
        <div className="space-y-4">
          <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Pricing Rules</label>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-400">Delivery Price</label>
              <div className="relative">
                <DollarSign size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  defaultValue={selectedItem.price}
                  className="w-full pl-7 pr-3 py-2 text-sm border border-zinc-200 rounded-xl outline-none focus:ring-2 focus:ring-zinc-900/5"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-400">Pickup Price</label>
              <div className="relative">
                <DollarSign size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  defaultValue={(selectedItem.price * 0.9).toFixed(2)}
                  className="w-full pl-7 pr-3 py-2 text-sm border border-zinc-200 rounded-xl outline-none focus:ring-2 focus:ring-zinc-900/5"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Customizations */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Customizations</label>
            <Button variant="ghost" size="sm" className="text-[10px] text-zinc-400">Manage Groups</Button>
          </div>
          <div className="space-y-2">
            <div className="p-3 bg-white border border-zinc-200 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-zinc-900">Size Options</p>
                <p className="text-[10px] text-zinc-500">Required • Choose 1</p>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8"><ChevronRight size={14} /></Button>
            </div>
            <div className="p-3 bg-white border border-zinc-200 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-zinc-900">Extra Toppings</p>
                <p className="text-[10px] text-zinc-500">Optional • Up to 5</p>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8"><ChevronRight size={14} /></Button>
            </div>
          </div>
          <Button variant="outline" className="w-full border-dashed border-2 text-zinc-400 hover:text-zinc-900 hover:border-zinc-300 gap-2">
            <Plus size={14} /> Add Customization
          </Button>
        </div>

        {/* Inventory */}
        <Card title="Inventory & Status" className="bg-white">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-600">Available for sale</span>
              <div className="w-10 h-5 bg-emerald-500 rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-600">Sold out today</span>
              <div className="w-10 h-5 bg-zinc-200 rounded-full relative cursor-pointer">
                <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full" />
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      {/* Tab Navigation */}
      <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-xl w-fit mb-6">
        <button
          onClick={() => setActiveTab('menus')}
          className={cn(
            "px-4 py-2 text-xs font-bold rounded-lg transition-all",
            activeTab === 'menus' ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
          )}
        >
          Menus
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={cn(
            "px-4 py-2 text-xs font-bold rounded-lg transition-all",
            activeTab === 'categories' ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
          )}
        >
          Categories
        </button>
        <button
          onClick={() => setActiveTab('items')}
          className={cn(
            "px-4 py-2 text-xs font-bold rounded-lg transition-all",
            activeTab === 'items' ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
          )}
        >
          Menu Items
        </button>
        <button
          onClick={() => setActiveTab('bulk')}
          className={cn(
            "px-4 py-2 text-xs font-bold rounded-lg transition-all",
            activeTab === 'bulk' ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
          )}
        >
          Bulk Actions
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={cn(
            "px-4 py-2 text-xs font-bold rounded-lg transition-all",
            activeTab === 'history' ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
          )}
        >
          History
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto pr-2 scrollbar-hide">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {activeTab === 'menus' && renderMenusTab()}
            {activeTab === 'categories' && renderCategoriesTab()}
            {activeTab === 'items' && renderItemsTab()}
            {activeTab === 'bulk' && renderBulkActionsTab()}
            {activeTab === 'history' && renderHistoryTab()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Customer Preview Modal */}
      <AnimatePresence>
        {isPreviewOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl h-[80vh] overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-zinc-900">Customer Preview</h3>
                  <p className="text-xs text-zinc-500">How your menu appears to customers</p>
                </div>
                <div className="flex items-center gap-2 bg-zinc-100 p-1 rounded-xl">
                  <button
                    onClick={() => setPreviewDevice('mobile')}
                    className={cn("p-2 rounded-lg transition-all", previewDevice === 'mobile' ? "bg-white shadow-sm text-zinc-900" : "text-zinc-400")}
                  >
                    <Smartphone size={18} />
                  </button>
                  <button
                    onClick={() => setPreviewDevice('tablet')}
                    className={cn("p-2 rounded-lg transition-all", previewDevice === 'tablet' ? "bg-white shadow-sm text-zinc-900" : "text-zinc-400")}
                  >
                    <Tablet size={18} />
                  </button>
                  <button
                    onClick={() => setPreviewDevice('desktop')}
                    className={cn("p-2 rounded-lg transition-all", previewDevice === 'desktop' ? "bg-white shadow-sm text-zinc-900" : "text-zinc-400")}
                  >
                    <Monitor size={18} />
                  </button>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsPreviewOpen(false)}><X size={20} /></Button>
              </div>

              <div className="flex-1 bg-zinc-100 p-8 flex items-center justify-center overflow-hidden">
                <div className={cn(
                  "bg-white shadow-2xl transition-all duration-500 overflow-hidden flex flex-col",
                  previewDevice === 'mobile' ? "w-[375px] h-[667px] rounded-[3rem] border-[8px] border-zinc-900" :
                    previewDevice === 'tablet' ? "w-[768px] h-[1024px] rounded-3xl border-[12px] border-zinc-900 scale-[0.6]" :
                      "w-full h-full rounded-xl border border-zinc-200"
                )}>
                  {/* Mock App UI */}
                  <div className="bg-white h-full overflow-y-auto scrollbar-hide">
                    <div className="relative h-48 bg-zinc-900">
                      <img src="https://picsum.photos/seed/restaurant/800/400" className="w-full h-full object-cover opacity-60" alt="Restaurant" />
                      <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                        <h2 className="text-2xl font-black">Main Street Kitchen</h2>
                        <p className="text-xs opacity-80">⭐ 4.8 (500+) • Burgers • $$</p>
                      </div>
                    </div>
                    <div className="p-6 space-y-6">
                      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide border-b border-zinc-100">
                        <span className="text-sm font-bold border-b-2 border-zinc-900 pb-2">Popular</span>
                        <span className="text-sm font-medium text-zinc-400">Burgers</span>
                        <span className="text-sm font-medium text-zinc-400">Sides</span>
                        <span className="text-sm font-medium text-zinc-400">Drinks</span>
                      </div>
                      <div className="space-y-4">
                        <h3 className="font-bold text-zinc-900">Popular Items</h3>
                        {MENU_ITEMS.map(item => (
                          <div key={item.id} className="flex gap-4 items-center">
                            <div className="flex-1">
                              <h4 className="text-sm font-bold text-zinc-900">{item.name}</h4>
                              <p className="text-xs text-zinc-500 line-clamp-2 mt-1">A delicious choice for any time of day, made with fresh ingredients.</p>
                              <p className="text-sm font-bold text-zinc-900 mt-2">${item.price}</p>
                            </div>
                            <div className="w-20 h-20 rounded-xl bg-zinc-100 overflow-hidden">
                              <img src={`https://picsum.photos/seed/${item.photo}/200/200`} className="w-full h-full object-cover" alt={item.name} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
