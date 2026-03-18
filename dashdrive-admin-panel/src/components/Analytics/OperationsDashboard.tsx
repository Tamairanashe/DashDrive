import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const mockData = [
  { name: '08:00', rides: 45, cancels: 2 },
  { name: '10:00', rides: 52, cancels: 5 },
  { name: '12:00', rides: 88, cancels: 8 },
  { name: '14:00', rides: 70, cancels: 4 },
  { name: '16:00', rides: 110, cancels: 12 },
  { name: '18:00', rides: 140, cancels: 15 },
];

export const OperationsDashboard = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Operations Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-green-50 shadow-sm border-green-100">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-green-700">Active Rides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">242</div>
            <p className="text-xs text-green-600">+12.5% from last hour</p>
          </CardContent>
        </Card>
        
        <Card className="bg-blue-50 shadow-sm border-blue-100">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-blue-700">Avg. Matching Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.4 min</div>
            <p className="text-xs text-blue-600">-0.2 min target</p>
          </CardContent>
        </Card>

        <Card className="bg-red-50 shadow-sm border-red-100">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-red-700">Overall Cancel Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2%</div>
            <p className="text-xs text-red-600">+0.8% alert threshold</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Ride Velocity (24h)</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="rides" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="cancels" stroke="#ef4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Peak Demand Centers</CardTitle>
          </CardHeader>
          <CardContent className="h-[250px]">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={[
                 { location: 'Borrowdale', demand: 120 },
                 { location: 'Avondale', demand: 95 },
                 { location: 'CBD', demand: 210 },
                 { location: 'Hatfield', demand: 60 },
               ]}>
                 <XAxis dataKey="location" />
                 <YAxis />
                 <Tooltip />
                 <Bar dataKey="demand" fill="#3b82f6" radius={[4, 4, 0, 0]} />
               </BarChart>
             </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
           <CardHeader>
             <CardTitle>System Health</CardTitle>
           </CardHeader>
           <CardContent>
             <ul className="space-y-3">
               <li className="flex justify-between items-center">
                 <span className="text-sm text-gray-600">WebSocket Connections</span>
                 <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded">Healthy (1.2k)</span>
               </li>
               <li className="flex justify-between items-center">
                 <span className="text-sm text-gray-600">Geo-Indexing Lag</span>
                 <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded">12ms</span>
               </li>
               <li className="flex justify-between items-center">
                 <span className="text-sm text-gray-600">Payment Gateway</span>
                 <span className="px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded">Degraded (Retrying)</span>
               </li>
             </ul>
           </CardContent>
        </Card>
      </div>
    </div>
  );
};
