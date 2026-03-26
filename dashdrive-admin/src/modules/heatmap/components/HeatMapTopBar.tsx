// ────────────────────────────────────────────────────────────────
// Heat Map — Top Bar (Control Center)
// ────────────────────────────────────────────────────────────────

import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Search, RefreshCw, Maximize2, Minimize2, GitCompare, Calendar,
} from 'lucide-react';
import { CITIES, SEARCH_SUGGESTIONS } from '../mockData';
import type { HeatMapServiceType, HeatMapLayerId, DateRangePreset, LiveMode } from '../types';
import { LAYER_META } from '../types';

interface HeatMapTopBarProps {
  city: string;
  onCityChange: (city: string) => void;
  service: HeatMapServiceType;
  onServiceChange: (s: HeatMapServiceType) => void;
  layer: HeatMapLayerId;
  onLayerChange: (l: HeatMapLayerId) => void;
  dateRange: DateRangePreset;
  onDateRangeChange: (d: DateRangePreset) => void;
  liveMode: LiveMode;
  onLiveModeChange: (m: LiveMode) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onCompareOpen: () => void;
  onRefresh: () => void;
  isFullscreen: boolean;
  onFullscreenToggle: () => void;
  isRefreshing: boolean;
}

const DATE_RANGE_OPTIONS: { value: DateRangePreset; label: string }[] = [
  { value: 'realtime', label: 'Realtime' },
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'last7', label: 'Last 7 Days' },
  { value: 'last30', label: 'Last 30 Days' },
  { value: 'thisMonth', label: 'This Month' },
  { value: 'lastMonth', label: 'Last Month' },
];

const SERVICE_OPTIONS: HeatMapServiceType[] = ['All', 'Ride Hailing', 'Food Delivery', 'Parcel Delivery', 'City to City'];

export function HeatMapTopBar({
  city, onCityChange,
  service, onServiceChange,
  layer, onLayerChange,
  dateRange, onDateRangeChange,
  liveMode, onLiveModeChange,
  searchQuery, onSearchChange,
  onCompareOpen, onRefresh,
  isFullscreen, onFullscreenToggle,
  isRefreshing,
}: HeatMapTopBarProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const filteredSuggestions = SEARCH_SUGGESTIONS.filter((s) =>
    s.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <header className="flex-none bg-white border-b border-slate-200 px-4 py-2.5 flex items-center gap-2 flex-wrap z-20 shadow-sm">
      {/* Search */}
      <div className="relative flex-1 min-w-[220px] max-w-[360px]" ref={searchRef}>
        <Search className="absolute left-2.5 top-2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search zones, hotspots, conditions..."
          className="pl-8 h-8 text-xs bg-slate-50 border-slate-200"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
        />
        {showSuggestions && searchQuery.length === 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-50 py-1 max-h-[200px] overflow-y-auto">
            <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Suggestions</div>
            {SEARCH_SUGGESTIONS.map((s) => (
              <button key={s} className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 transition-colors" onClick={() => { onSearchChange(s); setShowSuggestions(false); }}>
                {s}
              </button>
            ))}
          </div>
        )}
        {showSuggestions && searchQuery.length > 0 && filteredSuggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-50 py-1">
            {filteredSuggestions.map((s) => (
              <button key={s} className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 transition-colors" onClick={() => { onSearchChange(s); setShowSuggestions(false); }}>
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* City */}
      <Select value={city} onValueChange={onCityChange}>
        <SelectTrigger className="w-[110px] h-8 text-xs bg-slate-50 border-slate-200 font-semibold">
          <SelectValue placeholder="City" />
        </SelectTrigger>
        <SelectContent>
          {CITIES.map((c) => (
            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Service */}
      <Select value={service} onValueChange={(v) => onServiceChange(v as HeatMapServiceType)}>
        <SelectTrigger className="w-[130px] h-8 text-xs bg-slate-50 border-slate-200">
          <SelectValue placeholder="Service" />
        </SelectTrigger>
        <SelectContent>
          {SERVICE_OPTIONS.map((s) => (
            <SelectItem key={s} value={s}>{s}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Layer */}
      <Select value={layer} onValueChange={(v) => onLayerChange(v as HeatMapLayerId)}>
        <SelectTrigger className="w-[120px] h-8 text-xs bg-slate-50 border-slate-200">
          <SelectValue placeholder="Layer" />
        </SelectTrigger>
        <SelectContent>
          {(Object.keys(LAYER_META) as HeatMapLayerId[]).map((l) => (
            <SelectItem key={l} value={l}>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: LAYER_META[l].color }} />
                {LAYER_META[l].label}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Date Range */}
      <Popover>
        <PopoverTrigger asChild>
          <div className="flex h-8 items-center gap-1.5 px-3 py-1 rounded-md border border-slate-200 bg-slate-50 text-xs font-medium cursor-pointer hover:bg-slate-100 transition-colors">
            <Calendar className="h-3.5 w-3.5" />
            {DATE_RANGE_OPTIONS.find((d) => d.value === dateRange)?.label || 'Realtime'}
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-[160px] p-1" align="start">
          {DATE_RANGE_OPTIONS.map((d) => (
            <button
              key={d.value}
              className={`w-full text-left px-3 py-1.5 text-xs rounded transition-colors ${dateRange === d.value ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'}`}
              onClick={() => onDateRangeChange(d.value)}
            >
              {d.label}
            </button>
          ))}
        </PopoverContent>
      </Popover>

      {/* Divider */}
      <div className="w-px h-6 bg-slate-200" />

      {/* Live/History Toggle */}
      <div className="flex items-center gap-1.5">
        <span className="text-xs font-medium text-slate-600">Live</span>
        <Switch
          checked={liveMode === 'live'}
          onCheckedChange={(v) => onLiveModeChange(v ? 'live' : 'history')}
        />
        {liveMode === 'live' && (
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
          </span>
        )}
      </div>

      {/* Divider */}
      <div className="w-px h-6 bg-slate-200" />

      {/* Compare */}
      <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5" onClick={onCompareOpen}>
        <GitCompare className="h-3.5 w-3.5" />
        Compare
      </Button>

      {/* Refresh */}
      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onRefresh} disabled={isRefreshing}>
        <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
      </Button>

      {/* Fullscreen */}
      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onFullscreenToggle}>
        {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
      </Button>
    </header>
  );
}
