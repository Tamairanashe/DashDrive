import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AdminLayout } from './components/layout/AdminLayout';
import { DashboardPage } from './modules/dashboard/DashboardPage';
import { FleetPage } from './modules/fleet/FleetPage';
import { HeatMapPage } from './modules/heatmap/HeatMapPage';

import { ZoneManagementPage } from './modules/zones/ZoneManagementPage';
import { useNavigationStore } from '@/store/navigation';
import { Toaster } from 'sonner';

const queryClient = new QueryClient();

function ModuleRenderer() {
  const activeModule = useNavigationStore((state) => state.activeModule);

  switch (activeModule) {
    case 'Dashboard':
      return <DashboardPage />;
    case 'Fleet View':
      return <FleetPage />;
    case 'Heat Map':
      return <HeatMapPage />;

    case 'Zone Management':
      return <ZoneManagementPage />;
    default:
      return (
        <div className="flex h-[50vh] items-center justify-center text-slate-500">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-slate-900">{activeModule}</h2>
            <p>This module is under construction.</p>
          </div>
        </div>
      );
  }
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AdminLayout>
        <ModuleRenderer />
      </AdminLayout>
      <Toaster position="top-right" richColors />
    </QueryClientProvider>
  );
}
