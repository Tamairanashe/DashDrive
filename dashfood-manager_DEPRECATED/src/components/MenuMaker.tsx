import React, { useState } from 'react';
import {
  Plus,
  Search,
  ChevronDown,
  Eye,
  History,
  Info,
  ExternalLink,
  Image as ImageIcon,
  GripVertical,
  MoreVertical,
  ChevronRight,
  ChevronUp,
  ArrowLeft,
  StickyNote,
  Globe,
  X,
  Layout,
  Clock,
  Tag,
  ShoppingBag,
  Zap,
  Filter,
  Layers,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../types';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const menuItems = [
  {
    id: '1',
    name: 'Americana Pizza - 10"',
    price: '$14.45',
    menus: 'Menu',
    categories: '10" Pizza',
    usedIn: '-',
    contains: 'Add Toppings',
    lastUpdated: '10/07',
    image: 'https://picsum.photos/seed/pizza1/100/100',
    description: 'Classic Americana pizza with tomato sauce and mozzarella.'
  },
  {
    id: '2',
    name: 'Americana Pizza - 13"',
    price: '$18.70',
    menus: 'Menu',
    categories: '13" Pizza',
    usedIn: '-',
    contains: 'Add Toppings',
    lastUpdated: '10/07',
    image: 'https://picsum.photos/seed/pizza2/100/100',
    description: 'Large Americana pizza for sharing.'
  },
  {
    id: '3',
    name: 'Americana Pizza - 12" Gluten Free',
    price: '$21.00',
    menus: 'Menu',
    categories: '12" Gluten Fr...',
    usedIn: '-',
    contains: 'Add Toppings',
    lastUpdated: '07/11',
    image: null,
    description: 'Gluten-free base Americana pizza.'
  },
  {
    id: '4',
    name: 'Americana Pizza - 18"',
    price: '$23.70',
    menus: 'Menu',
    categories: '18" Pizzas',
    usedIn: '-',
    contains: 'Choice of Ext...',
    lastUpdated: '10/07',
    image: 'https://picsum.photos/seed/pizza3/100/100',
    description: 'Extra large 18 inch pizza.'
  }
];

const overviewData = [
  {
    id: 'cat-1',
    name: 'Breakfast favorites',
    itemCount: 1,
    items: [
      { id: 'item-1', name: 'Pancakes', price: '$8.50', description: 'Buckwheat pancakes with maple syrup' }
    ]
  },
  {
    id: 'cat-2',
    name: 'Drinks',
    itemCount: 3,
    items: [
      { id: 'item-2', name: 'Soda', price: '$2.50', description: 'Refreshing soda.' },
      { id: 'item-3', name: 'Water', price: '$0.80', description: 'Pure spring water.' },
      { id: 'item-4', name: 'Coffee', price: '$4.50', description: 'Hot brewed coffee.' }
    ]
  }
];

const menusData = [
  { id: 'menu-1', name: 'Breakfast', hours: 'Every day: 4:00 AM - 10:00 AM' },
  { id: 'menu-2', name: 'Lunch', hours: 'Mon-Fri: 11:00 AM - 3:00 PM' },
  { id: 'menu-3', name: 'Dinner', hours: 'Every day: 5:00 PM - 10:00 PM' },
  { id: 'menu-4', name: 'Late Night', hours: 'Fri-Sat: 10:00 PM - 2:00 AM' },
];

const categoriesData = [
  { id: 'cat-1', name: 'Breakfast favorites', itemCount: 1 },
  { id: 'cat-2', name: 'Drinks', itemCount: 3 },
  { id: 'cat-3', name: 'Starters', itemCount: 5 },
  { id: 'cat-4', name: 'Mains', itemCount: 12 },
  { id: 'cat-5', name: 'Sides', itemCount: 4 },
];

const modifierGroupsData = [
  {
    id: 'mg-1',
    name: 'Choose Meat Temperature',
    min: 1,
    max: 1,
    options: [
      { name: 'Rare', price: 0 },
      { name: 'Medium Rare', price: 0 },
      { name: 'Medium', price: 0 },
      { name: 'Well Done', price: 0 }
    ]
  },
  {
    id: 'mg-2',
    name: 'Add Extra Toppings',
    min: 0,
    max: 5,
    options: [
      { name: 'Bacon', price: 1.50 },
      { name: 'Avocado', price: 2.00 },
      { name: 'Fried Egg', price: 1.00 },
      { name: 'Cheese', price: 0.50 }
    ]
  }
];

interface SortableCategoryProps {
  category: any;
  isExpanded: boolean;
  onToggle: (id: string) => void;
  key?: any;
}

const SortableCategory = ({
  category,
  isExpanded,
  onToggle
}: SortableCategoryProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: category.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="card-premium h-20 bg-white border-none shadow-sm flex items-center group overflow-hidden"
    >
      <div {...attributes} {...listeners} className="w-14 h-full flex items-center justify-center text-zinc-200 group-hover:text-zinc-400 cursor-grab active:cursor-grabbing transition-colors bg-zinc-50/50">
        <GripVertical size={20} />
      </div>

      <div className="flex-1 px-6 flex items-center justify-between">
        <div className="space-y-0.5">
          <div className="flex items-center gap-3">
            <h3 className="font-black text-black tracking-tight text-lg group-hover:text-[#00ff90] transition-colors">{category.name}</h3>
            <span className="text-[10px] font-black text-[#00ff90] uppercase tracking-widest px-2 py-0.5 bg-[#00ff90]/10 rounded-full">Primary</span>
          </div>
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">{category.itemCount} Units Registered</p>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-1">Architecture</div>
            <div className="text-sm font-black text-zinc-900 leading-none">Global Sync</div>
          </div>
          <button
            onClick={() => onToggle(category.id)}
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
              isExpanded ? "bg-black text-[#00ff90]" : "bg-zinc-50 text-zinc-400 hover:text-black"
            )}
          >
            <ChevronDown size={18} className={cn("transition-transform duration-300", isExpanded ? "" : "-rotate-90")} />
          </button>
        </div>
      </div>
    </div>
  );
};


const MenuMaker = () => {
  const [activeSubTab, setActiveSubTab] = useState('Overview');
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['cat-1', 'cat-2']);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [schedule, setSchedule] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (let d = 0; d < 7; d++) {
      for (let h = 4; h <= 10; h++) initial[`${d}-${h}`] = 'Breakfast';
      for (let h = 11; h <= 15; h++) initial[`${d}-${h}`] = 'Lunch';
      for (let h = 17; h <= 22; h++) initial[`${d}-${h}`] = 'Dinner';
    }
    return initial;
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragValue, setDragValue] = useState<string | null>(null);
  const [modifierGroups, setModifierGroups] = useState(modifierGroupsData);
  const [linkingGroup, setLinkingGroup] = useState<any>(null);
  const [menus, setMenus] = useState(menusData);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [categories, setCategories] = useState(categoriesData);
  const [itemStock, setItemStock] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    menuItems.forEach(item => initial[item.id] = true);
    return initial;
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const subTabs = [
    { name: 'Overview', icon: Layout },
    { name: 'Menus', icon: Clock },
    { name: 'Categories', icon: Tag },
    { name: 'Items', icon: ShoppingBag },
    { name: 'Modifier Groups', icon: Zap }
  ];

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setCategories((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const duplicateMenu = (menu: any) => {
    const newMenu = {
      ...menu,
      id: `menu-${Date.now()}`,
      name: `${menu.name} (Copy)`
    };
    setMenus(prev => [...prev, newMenu]);
    setOpenMenuId(null);
  };

  const handleMouseDown = (day: number, hour: number) => {
    setIsDragging(true);
    const currentValue = schedule[`${day}-${hour}`];
    const newValue = currentValue === 'Breakfast' ? 'Lunch' : currentValue === 'Lunch' ? 'Dinner' : currentValue === 'Dinner' ? '' : 'Breakfast';
    setDragValue(newValue);
    setSchedule(prev => ({ ...prev, [`${day}-${hour}`]: newValue }));
  };

  const handleMouseEnter = (day: number, hour: number) => {
    if (isDragging && dragValue !== null) {
      setSchedule(prev => ({ ...prev, [`${day}-${hour}`]: dragValue }));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragValue(null);
  };

  const updateModifierLimit = (id: string, field: 'min' | 'max', delta: number) => {
    setModifierGroups(prev => prev.map(mg => {
      if (mg.id === id) {
        const newVal = Math.max(0, mg[field] + delta);
        return { ...mg, [field]: newVal };
      }
      return mg;
    }));
  };

  const toggleCategory = (id: string) => {
    setExpandedCategories(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const expandAll = () => setExpandedCategories(overviewData.map(c => c.id));
  const collapseAll = () => setExpandedCategories([]);

  const handleEditItem = (item: any) => {
    setSelectedItem(item);
  };

  if (selectedItem) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSelectedItem(null)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-stroke bg-white text-black hover:text-primary dark:border-strokedark dark:bg-boxdark dark:text-white"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h2 className="text-title-md2 font-bold text-black dark:text-white">
                Edit Item: {selectedItem.name}
              </h2>
              <p className="text-sm font-medium text-[#64748B]">ID: {selectedItem.id}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setSelectedItem(null)} className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white">
              Cancel
            </button>
            <button onClick={() => setSelectedItem(null)} className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-90">
              Save Changes
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left: General Info */}
          <div className="lg:col-span-8 space-y-8">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">General Information</h3>
              </div>
              <div className="p-6.5 space-y-4.5">
                <div>
                  <label className="mb-2.5 block text-black dark:text-white">Item Name</label>
                  <input type="text" defaultValue={selectedItem.name} className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary" />
                </div>
                <div>
                  <label className="mb-2.5 block text-black dark:text-white">Description</label>
                  <textarea rows={4} defaultValue={selectedItem.description} className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2.5 block text-black dark:text-white">Price ($)</label>
                    <input type="text" defaultValue={selectedItem.price.replace('$', '')} className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white" />
                  </div>
                  <div>
                    <label className="mb-2.5 block text-black dark:text-white">Category</label>
                    <input type="text" defaultValue={selectedItem.categories} className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white" />
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">Modifier Groups</h3>
              </div>
              <div className="p-6.5 space-y-4">
                {modifierGroups.slice(0, 2).map(group => (
                  <div key={group.id} className="flex items-center justify-between p-4 border border-stroke rounded dark:border-strokedark">
                    <div>
                      <p className="font-bold text-black dark:text-white">{group.name}</p>
                      <p className="text-xs text-[#64748B]">Min: {group.min} • Max: {group.max}</p>
                    </div>
                    <button className="text-meta-1"><X size={18} /></button>
                  </div>
                ))}
                <button className="flex w-full items-center justify-center gap-2 rounded border border-stroke py-2 font-medium text-black hover:bg-gray dark:border-strokedark dark:text-white dark:hover:bg-meta-4">
                  <Plus size={18} /> Add Group
                </button>
              </div>
            </div>
          </div>

          {/* Right: Media & Status */}
          <div className="lg:col-span-4 space-y-8">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">Media Asset</h3>
              </div>
              <div className="p-6.5">
                <div className="aspect-square w-full rounded border-2 border-dashed border-stroke flex items-center justify-center mb-4 dark:border-strokedark overflow-hidden">
                  {selectedItem.image ? (
                    <img src={selectedItem.image} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-[#64748B] flex flex-col items-center gap-2">
                      <ImageIcon size={48} />
                      <span className="text-xs">No image uploaded</span>
                    </div>
                  )}
                </div>
                <button className="w-full rounded bg-primary py-2 text-white font-medium hover:bg-opacity-90">Upload New</button>
              </div>
            </div>

            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">Availability</h3>
              </div>
              <div className="p-6.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-black dark:text-white">Status</span>
                  <button
                    onClick={() => setItemStock(prev => ({ ...prev, [selectedItem.id]: !prev[selectedItem.id] }))}
                    className={cn(
                      "flex h-6 w-11 items-center rounded-full px-1 transition-all",
                      itemStock[selectedItem.id] ? "bg-meta-3" : "bg-stroke dark:bg-strokedark"
                    )}
                  >
                    <div className={cn("h-4 w-4 rounded-full bg-white shadow-toggle transition-all", itemStock[selectedItem.id] ? "translate-x-5" : "")} />
                  </button>
                </div>
                <p className="mt-2 text-xs text-[#64748B]">Toggling this will immediately affect visibility in the customer-facing apps.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumb / Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-bold text-black dark:text-white">
          Menu Editor
        </h2>

        <nav>
          <ol className="flex items-center gap-2">
            <li><button className="font-medium text-[#64748B]">Dashboard /</button></li>
            <li className="font-medium text-primary">Menu Editor</li>
          </ol>
        </nav>
      </div>

      {/* TailAdmin Sub-Navigation Tabs */}
      <div className="rounded-sm border border-stroke bg-white p-1.5 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-wrap gap-3">
          {subTabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveSubTab(tab.name)}
              className={cn(
                "inline-flex items-center justify-center rounded-md py-3 px-4 text-sm font-medium transition-all duration-300 md:text-base lg:px-6",
                activeSubTab === tab.name
                  ? "bg-[#1C2434] text-white shadow-card"
                  : "text-[#64748B] hover:bg-gray-100 hover:text-black dark:hover:bg-meta-4"
              )}
            >
              <tab.icon size={18} className="mr-2" />
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h3 className="text-xl font-bold text-black dark:text-white">{activeSubTab}</h3>
            <div className="px-2 py-1 bg-[#10B981]/10 text-[#10B981] rounded text-[10px] font-bold uppercase">
              Live Sync
            </div>
          </div>
          <button className="inline-flex items-center justify-center rounded-md bg-[#1C2434] py-2 px-6 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10">
            <Plus size={18} className="mr-2" /> New {activeSubTab.replace('s', '')}
          </button>
        </div>

        {/* Section Content */}
        <div className="grid grid-cols-1 gap-6 pb-20">
          {activeSubTab === 'Overview' && (
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="p-6">
                <div className="flex flex-col gap-4">
                  {overviewData.map((category) => (
                    <div key={category.id} className="border-b border-stroke pb-4 last:border-0 last:pb-0 dark:border-strokedark">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <h4 className="font-bold text-black dark:text-white">{category.name}</h4>
                          <span className="text-xs text-[#64748B]">{category.itemCount} items</span>
                        </div>
                        <button onClick={() => toggleCategory(category.id)} className="text-[#64748B] hover:text-black dark:hover:text-white">
                          {expandedCategories.includes(category.id) ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </button>
                      </div>
                      {expandedCategories.includes(category.id) && (
                        <div className="pl-4 mt-3 space-y-3">
                          {category.items?.map((item: any) => (
                            <div key={item.id} className="flex items-center justify-between text-sm">
                              <div className="flex flex-col">
                                <span className="font-medium text-black dark:text-white">{item.name}</span>
                                <span className="text-xs text-[#64748B]">{item.description}</span>
                              </div>
                              <span className="font-bold text-black dark:text-white">{item.price}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSubTab === 'Menus' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menus.map((menu: any) => (
                <div key={menu.id} className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-lg bg-[#EFF4FB] flex items-center justify-center text-[#3C50E0] dark:bg-meta-4">
                      <Clock size={24} />
                    </div>
                    <button className="text-[#64748B] hover:text-black dark:hover:text-white"><MoreVertical size={18} /></button>
                  </div>
                  <h3 className="text-lg font-bold text-black dark:text-white mb-1">{menu.name}</h3>
                  <p className="text-xs text-[#64748B] font-medium mb-4">{menu.hours}</p>
                  <div className="pt-4 border-t border-stroke dark:border-strokedark flex items-center justify-between text-xs">
                    <span className="font-bold text-[#64748B]">Schedule Lock</span>
                    <button className="font-bold text-[#3C50E0]">Configure</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeSubTab === 'Categories' && (
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-2 border-b border-stroke dark:border-strokedark dark:bg-meta-4">
                    <th className="px-6 py-4 text-sm font-bold text-black dark:text-white">Category Name</th>
                    <th className="px-6 py-4 text-sm font-bold text-black dark:text-white">Items</th>
                    <th className="px-6 py-4 text-sm font-bold text-black dark:text-white text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat: any) => (
                    <tr key={cat.id} className="border-b border-stroke last:border-0 dark:border-strokedark hover:bg-gray-2 dark:hover:bg-meta-4">
                      <td className="px-6 py-4 text-sm font-medium text-black dark:text-white">{cat.name}</td>
                      <td className="px-6 py-4 text-sm text-[#64748B]">{cat.itemCount} items</td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-primary hover:underline font-medium text-sm">Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeSubTab === 'Items' && (
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark overflow-hidden">
              <div className="p-4 border-b border-stroke dark:border-strokedark bg-gray-2 dark:bg-meta-4 flex items-center justify-between">
                <div className="relative w-full max-w-100">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B]" size={18} />
                  <input type="text" placeholder="Search items..." className="w-full pl-12 pr-4 py-2 bg-white dark:bg-boxdark border border-stroke dark:border-strokedark rounded-md outline-none" />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-stroke dark:border-strokedark bg-gray-2 dark:bg-meta-4">
                      <th className="px-6 py-4 text-sm font-bold text-black dark:text-white">Item</th>
                      <th className="px-6 py-4 text-sm font-bold text-black dark:text-white">Category</th>
                      <th className="px-6 py-4 text-sm font-bold text-black dark:text-white">Price</th>
                      <th className="px-6 py-4 text-sm font-bold text-black dark:text-white text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {menuItems.map((item: any) => (
                      <tr key={item.id} className="border-b border-stroke last:border-0 dark:border-strokedark hover:bg-gray-2 dark:hover:bg-meta-4 cursor-pointer" onClick={() => handleEditItem(item)}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded overflow-hidden bg-gray-2">
                              {item.image ? <img src={item.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-zinc-300"><ImageIcon size={18} /></div>}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-black dark:text-white">{item.name}</p>
                              <p className="text-[10px] text-[#64748B]">ID: {item.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-[#64748B]">{item.categories}</td>
                        <td className="px-6 py-4 text-sm font-bold text-black dark:text-white">{item.price}</td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={(e) => { e.stopPropagation(); setItemStock(prev => ({ ...prev, [item.id]: !prev[item.id] })) }}
                            className={cn("px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider", itemStock[item.id] ? "bg-meta-3/10 text-meta-3" : "bg-meta-1/10 text-meta-1")}
                          >
                            {itemStock[item.id] ? 'In Service' : 'Off-Line'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeSubTab === 'Modifier Groups' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {modifierGroups.map((group: any) => (
                <div key={group.id} className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h4 className="text-lg font-bold text-black dark:text-white">{group.name}</h4>
                      <p className="text-xs text-[#64748B]">Target Node: Global</p>
                    </div>
                    <button onClick={() => setLinkingGroup(group)} className="text-primary hover:bg-[#EFF4FB] p-2 rounded dark:hover:bg-meta-4"><ExternalLink size={18} /></button>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-[#EFF4FB] dark:bg-meta-4 p-3 rounded flex justify-between">
                      <span className="text-xs font-medium text-[#64748B]">Min</span>
                      <span className="text-xs font-bold text-black dark:text-white">{group.min}</span>
                    </div>
                    <div className="bg-[#EFF4FB] dark:bg-meta-4 p-3 rounded flex justify-between">
                      <span className="text-xs font-medium text-[#64748B]">Max</span>
                      <span className="text-xs font-bold text-black dark:text-white">{group.max}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {group.options.map((opt: any, i: number) => (
                      <div key={i} className="flex items-center justify-between text-sm py-1">
                        <span className="text-[#64748B]">{opt.name}</span>
                        <span className="font-bold text-black dark:text-white">+${opt.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bulk Attachment Linker Modal */}
      <AnimatePresence>
        {linkingGroup && (
          <div className="fixed inset-0 z-99999 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-142.5 rounded-lg bg-white py-12 px-8 text-center dark:bg-boxdark md:py-15 md:px-17.5"
            >
              <h3 className="pb-2 text-xl font-bold text-black dark:text-white sm:text-2xl">
                Link "{linkingGroup.name}"
              </h3>
              <p className="text-[#64748B] mb-10">Select items to attach this modifier group.</p>
              <div className="max-h-60 overflow-y-auto mb-10 space-y-2 text-left">
                {menuItems.map(item => (
                  <div key={item.id} className="flex items-center gap-3 p-3 border border-stroke rounded dark:border-strokedark">
                    <input type="checkbox" className="h-4 w-4 rounded border-stroke" />
                    <span className="text-sm font-medium text-black dark:text-white">{item.name}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3 mt-10">
                <button onClick={() => setLinkingGroup(null)} className="flex-1 rounded border border-stroke py-3 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white">
                  Cancel
                </button>
                <button onClick={() => setLinkingGroup(null)} className="flex-1 rounded bg-primary py-3 px-6 font-medium text-white hover:bg-opacity-90">
                  Confirm Link
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MenuMaker;
