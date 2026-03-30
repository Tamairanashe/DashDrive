import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDashboardMetrics } from '../hooks/useDashboardData';
import { ArrowDownRight, ArrowUpRight, Car, AlertTriangle, Users, DollarSign } from 'lucide-react';

export function DashboardMetrics() {
  const { data, isLoading, isError } = useDashboardMetrics();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="h-10 bg-slate-100 rounded-t-lg" />
            <CardContent className="h-20 bg-slate-50 rounded-b-lg" />
          </Card>
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return <div className="text-red-500">Failed to load metrics.</div>;
  }

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  const metrics = [
    {
      title: 'Active Drivers',
      value: data.activeDrivers.value.toLocaleString(),
      trend: data.activeDrivers.trend,
      icon: Users,
    },
    {
      title: 'Ongoing Rides',
      value: data.ongoingRides.value.toLocaleString(),
      trend: data.ongoingRides.trend,
      icon: Car,
    },
    {
      title: 'Revenue (Today)',
      value: formatCurrency(data.revenueToday.value),
      trend: data.revenueToday.trend,
      icon: DollarSign,
    },
    {
      title: 'Critical Alerts',
      value: data.criticalAlerts.value.toString(),
      trend: data.criticalAlerts.trend,
      icon: AlertTriangle,
      valueClass: data.criticalAlerts.value > 0 ? 'text-red-600' : 'text-slate-900',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        const isPositive = metric.trend > 0;
        const isNegative = metric.trend < 0;
        const isNeutral = metric.trend === 0;

        return (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">
                {metric.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${metric.valueClass || 'text-slate-900'}`}>
                {metric.value}
              </div>
              <p className="flex items-center text-xs mt-1">
                {!isNeutral && (
                  <span className={`flex items-center mr-1 ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                    {isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {Math.abs(metric.trend)}%
                  </span>
                )}
                <span className="text-slate-500">
                  {isNeutral ? 'No change' : 'from last period'}
                </span>
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
