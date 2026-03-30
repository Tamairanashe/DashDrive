import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRideVolume } from '../hooks/useDashboardData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export function RideVolumeChart() {
  const { data, isLoading, isError } = useRideVolume();

  if (isLoading) {
    return (
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Ride Volume</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] min-h-[300px] flex items-center justify-center bg-slate-50 animate-pulse rounded-md">
          <span className="text-slate-400">Loading chart...</span>
        </CardContent>
      </Card>
    );
  }

  if (isError || !data) {
    return (
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Ride Volume</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] min-h-[300px] flex items-center justify-center text-red-500">
          Failed to load chart data.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Ride Volume (Today vs Yesterday)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] min-h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis 
                dataKey="time" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#64748b' }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#64748b' }} 
              />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
              <Line 
                type="monotone" 
                name="Today"
                dataKey="today" 
                stroke="#0f172a" 
                strokeWidth={2} 
                dot={false} 
                activeDot={{ r: 4 }} 
              />
              <Line 
                type="monotone" 
                name="Yesterday"
                dataKey="yesterday" 
                stroke="#94a3b8" 
                strokeWidth={2} 
                strokeDasharray="4 4" 
                dot={false} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
