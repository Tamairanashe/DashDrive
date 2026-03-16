import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Ticket, DollarSign, Radio } from 'lucide-react';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e'];

export default function Analytics() {
  const [trafficData, setTrafficData] = useState([
    { name: 'Direct', value: 400 },
    { name: 'Social', value: 300 },
    { name: 'Email', value: 300 },
    { name: 'Referral', value: 200 },
  ]);

  const [salesByDay, setSalesByDay] = useState([
    { name: 'Mon', sales: 4000 },
    { name: 'Tue', sales: 3000 },
    { name: 'Wed', sales: 5000 },
    { name: 'Thu', sales: 8780 },
    { name: 'Fri', sales: 12900 },
    { name: 'Sat', sales: 18300 },
    { name: 'Sun', sales: 15400 },
  ]);

  const [metrics, setMetrics] = useState({
    revenue: 185000,
    tickets: 3320,
    views: 55645,
    conversion: 6.2
  });

  const totalTraffic = trafficData.reduce((sum, item) => sum + item.value, 0);

  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percent = ((data.value / totalTraffic) * 100).toFixed(1);
      return (
        <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-100">
          <p className="font-medium text-gray-900 mb-1">{data.name}</p>
          <p className="text-indigo-600 font-semibold">{data.value.toLocaleString()} visitors</p>
          <p className="text-sm text-gray-500">{percent}% of total traffic</p>
        </div>
      );
    }
    return null;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      // Increment traffic
      setTrafficData(prev => {
        const next = [...prev];
        const idx = Math.floor(Math.random() * next.length);
        next[idx] = { ...next[idx], value: next[idx].value + Math.floor(Math.random() * 3) };
        return next;
      });

      // Increment sales by day (simulate today's ongoing sales)
      const hasSale = Math.random() > 0.5;
      let revenueDelta = 0;
      let ticketsDelta = 0;

      if (hasSale) {
        revenueDelta = Math.floor(Math.random() * 150) + 50;
        ticketsDelta = Math.floor(Math.random() * 2) + 1;
        
        setSalesByDay(prev => {
          const next = [...prev];
          next[6] = { ...next[6], sales: next[6].sales + revenueDelta };
          return next;
        });
      }

      // Update top metrics
      setMetrics(prev => ({
        revenue: prev.revenue + revenueDelta,
        tickets: prev.tickets + ticketsDelta,
        views: prev.views + Math.floor(Math.random() * 8) + 1,
        conversion: Number((prev.conversion + (Math.random() * 0.02 - 0.01)).toFixed(2))
      }));

    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h1 className="text-2xl font-semibold text-gray-900">Live Analytics</h1>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 animate-pulse">
            <Radio className="w-3 h-3 mr-1" />
            Live
          </span>
        </div>
        <select className="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border bg-white">
          <option>Last 7 days</option>
          <option>Last 30 days</option>
          <option>This Year</option>
          <option>All Time</option>
        </select>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg transition-all duration-300">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-6 w-6 text-indigo-500" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                  <dd>
                    <div className="text-2xl font-semibold text-gray-900">${metrics.revenue.toLocaleString()}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg transition-all duration-300">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Ticket className="h-6 w-6 text-indigo-500" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Tickets Sold</dt>
                  <dd>
                    <div className="text-2xl font-semibold text-gray-900">{metrics.tickets.toLocaleString()}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg transition-all duration-300">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-indigo-500" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Page Views</dt>
                  <dd>
                    <div className="text-2xl font-semibold text-gray-900">{metrics.views.toLocaleString()}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg transition-all duration-300">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-indigo-500" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Conversion Rate</dt>
                  <dd>
                    <div className="text-2xl font-semibold text-gray-900">{metrics.conversion}%</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Sales by Day</h2>
            <div className="text-sm text-green-600 font-medium flex items-center">
              <TrendingUp className="w-4 h-4 mr-1" />
              +${(metrics.revenue - 185000).toLocaleString()} today
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesByDay} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `$${value}`} tick={{ fill: '#6b7280' }} />
                <RechartsTooltip 
                  cursor={{fill: '#f3f4f6'}} 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Sales']}
                />
                <Bar dataKey="sales" fill="#6366f1" radius={[4, 4, 0, 0]} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Live Traffic Sources</h2>
            <div className="flex items-center text-sm text-gray-500">
              <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-ping"></span>
              Tracking active users
            </div>
          </div>
          <div className="h-80 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={trafficData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  isAnimationActive={false}
                >
                  {trafficData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip content={<CustomPieTooltip />} cursor={{fill: 'transparent'}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
