import { DashboardMetrics } from './components/DashboardMetrics';
import { RideVolumeChart } from './components/RideVolumeChart';
import { RecentAlertsTable } from './components/RecentAlertsTable';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Download } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function DashboardPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500">Overview of your fleet and operations today.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue placeholder="Select Zone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Zones</SelectItem>
              <SelectItem value="north">North District</SelectItem>
              <SelectItem value="south">South District</SelectItem>
              <SelectItem value="downtown">Downtown</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" className="bg-white">
            <CalendarIcon className="mr-2 h-4 w-4" />
            Today
          </Button>

          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <DashboardMetrics />

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Column: Chart (Takes up 2/3) */}
        <RideVolumeChart />

        {/* Right Column: Alerts (Takes up 1/3) */}
        <RecentAlertsTable />
      </div>
    </div>
  );
}
