import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Filter, Map, List, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface ZoneFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  cityFilter: string;
  setCityFilter: (city: string) => void;
  serviceFilter: string;
  setServiceFilter: (service: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  typeFilter: string;
  setTypeFilter: (type: string) => void;
  viewMode: 'map' | 'list';
  setViewMode: (mode: 'map' | 'list') => void;
}

export function ZoneFilters({
  searchQuery,
  setSearchQuery,
  cityFilter,
  setCityFilter,
  serviceFilter,
  setServiceFilter,
  statusFilter,
  setStatusFilter,
  typeFilter,
  setTypeFilter,
  viewMode,
  setViewMode,
}: ZoneFiltersProps) {
  return (
    <Card className="p-4 border-none shadow-sm bg-white">
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="flex flex-1 w-full gap-4 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search zone name, code, or pricing rule..."
              className="pl-9 h-10 bg-slate-50 border-slate-100 focus:bg-white transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="hidden md:flex gap-2">
            <Select value={cityFilter} onValueChange={setCityFilter}>
              <SelectTrigger className="w-[140px] h-10 bg-slate-50 border-slate-100">
                <SelectValue placeholder="City" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                <SelectItem value="sf">San Francisco</SelectItem>
                <SelectItem value="ny">New York</SelectItem>
                <SelectItem value="la">Los Angeles</SelectItem>
                <SelectItem value="ha">Harare</SelectItem>
              </SelectContent>
            </Select>

            <Select value={serviceFilter} onValueChange={setServiceFilter}>
              <SelectTrigger className="w-[140px] h-10 bg-slate-50 border-slate-100">
                <SelectValue placeholder="Service" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Services</SelectItem>
                <SelectItem value="Ride">Ride Hailing</SelectItem>
                <SelectItem value="Food">Food Delivery</SelectItem>
                <SelectItem value="Parcel">Parcel</SelectItem>
                <SelectItem value="City-to-City">City-to-City</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[130px] h-10 bg-slate-50 border-slate-100">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-2 w-full lg:w-auto justify-end">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 text-slate-500 hover:text-slate-900"
            onClick={() => {
              setSearchQuery('');
              setCityFilter('all');
              setServiceFilter('all');
              setStatusFilter('all');
              setTypeFilter('all');
            }}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>

          <Button variant="outline" className="h-10 gap-2 border-slate-200">
            <SlidersHorizontal className="h-4 w-4" />
            <span className="hidden sm:inline">Advanced</span>
          </Button>

          <div className="h-10 bg-slate-100 p-1 rounded-lg flex gap-1 border border-slate-200">
            <Button
              variant={viewMode === 'map' ? 'secondary' : 'ghost'}
              size="sm"
              className={`h-full px-3 gap-2 ${viewMode === 'map' ? 'bg-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              onClick={() => setViewMode('map')}
            >
              <Map className="h-4 w-4" />
              <span className="text-xs font-semibold">Map</span>
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="sm"
              className={`h-full px-3 gap-2 ${viewMode === 'list' ? 'bg-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
              <span className="text-xs font-semibold">List</span>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
