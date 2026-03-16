import { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownRight, Ticket, Users, DollarSign, TrendingUp, Radio } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const generateInitialLiveSales = () => {
  const data = [];
  const now = new Date();
  for (let i = 20; i >= 0; i--) {
    const t = new Date(now.getTime() - i * 3000);
    data.push({
      time: t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      sales: Math.floor(Math.random() * 500) + 1000,
    });
  }
  return data;
};

export default function Dashboard() {
  const [liveSales, setLiveSales] = useState(generateInitialLiveSales());
  const [stats, setStats] = useState([
    { name: 'Total Revenue', stat: 124500, icon: DollarSign, change: '12%', changeType: 'increase', prefix: '$' },
    { name: 'Tickets Sold', stat: 3450, icon: Ticket, change: '5.4%', changeType: 'increase', prefix: '' },
    { name: 'Conversion Rate', stat: 6.2, icon: TrendingUp, change: '3.2%', changeType: 'decrease', suffix: '%' },
    { name: 'Page Views', stat: 55645, icon: Users, change: '18%', changeType: 'increase', prefix: '' },
  ]);
  const [ticketTypes, setTicketTypes] = useState([
    { name: 'VIP', sold: 320, total: 500, revenue: 64000, price: 200 },
    { name: 'Standard', sold: 2100, total: 5000, revenue: 168000, price: 80 },
    { name: 'Early Bird', sold: 900, total: 1000, revenue: 45000, price: 50 },
  ]);
  const [recentOrders, setRecentOrders] = useState([
    { id: 1003, name: 'C. Davis', type: 'VIP', amount: 400, time: new Date(Date.now() - 30000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) },
    { id: 1002, name: 'B. Wilson', type: 'Standard', amount: 160, time: new Date(Date.now() - 120000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) },
    { id: 1001, name: 'A. Smith', type: 'Early Bird', amount: 100, time: new Date(Date.now() - 300000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const hasNewSale = Math.random() > 0.6;
      let revenueDelta = 0;
      let ticketsDelta = 0;
      let viewsDelta = Math.floor(Math.random() * 5) + 1;

      if (hasNewSale) {
        const ticketIndex = Math.floor(Math.random() * ticketTypes.length);
        const qty = Math.floor(Math.random() * 2) + 1;
        const t = ticketTypes[ticketIndex];
        
        if (t.sold + qty <= t.total) {
          revenueDelta = t.price * qty;
          ticketsDelta = qty;

          setTicketTypes(prev => {
            const next = [...prev];
            next[ticketIndex] = {
              ...next[ticketIndex],
              sold: next[ticketIndex].sold + qty,
              revenue: next[ticketIndex].revenue + revenueDelta
            };
            return next;
          });

          setRecentOrders(prev => {
            const newOrder = {
              id: prev[0].id + 1,
              name: ['J. Doe', 'M. Chen', 'S. Lee', 'E. Davis', 'R. Taylor', 'K. Patel'][Math.floor(Math.random() * 6)],
              type: t.name,
              amount: revenueDelta,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
            };
            return [newOrder, ...prev].slice(0, 6);
          });
        }
      }

      setStats(prev => [
        { ...prev[0], stat: prev[0].stat + revenueDelta },
        { ...prev[1], stat: prev[1].stat + ticketsDelta },
        { ...prev[2], stat: Number((prev[2].stat + (Math.random() * 0.04 - 0.02)).toFixed(2)) },
        { ...prev[3], stat: prev[3].stat + viewsDelta },
      ]);

      setLiveSales(prev => {
        const newTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const lastSales = prev[prev.length - 1].sales;
        const newSales = Math.max(500, lastSales + (Math.floor(Math.random() * 200) - 90) + revenueDelta);
        return [...prev.slice(1), { time: newTime, sales: newSales }];
      });

    }, 3000);

    return () => clearInterval(interval);
  }, [ticketTypes]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard Overview</h1>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 animate-pulse">
            <Radio className="w-3 h-3 mr-1" />
            Live
          </span>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            Export Report
          </button>
          <button className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
            Create Event
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div key={item.name} className="relative bg-white pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden transition-all duration-300">
            <dt>
              <div className="absolute bg-indigo-500 rounded-md p-3">
                <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 text-sm font-medium text-gray-500 truncate">{item.name}</p>
            </dt>
            <dd className="ml-16 pb-6 flex items-baseline sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900">
                {item.prefix || ''}{item.stat.toLocaleString()}{item.suffix || ''}
              </p>
              <p
                className={`ml-2 flex items-baseline text-sm font-semibold ${
                  item.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {item.changeType === 'increase' ? (
                  <ArrowUpRight className="self-center flex-shrink-0 h-4 w-4 text-green-500" aria-hidden="true" />
                ) : (
                  <ArrowDownRight className="self-center flex-shrink-0 h-4 w-4 text-red-500" aria-hidden="true" />
                )}
                <span className="sr-only">{item.changeType === 'increase' ? 'Increased' : 'Decreased'} by</span>
                {item.change}
              </p>
            </dd>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="bg-white shadow rounded-lg p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Live Revenue Stream</h2>
            <div className="flex items-center text-sm text-gray-500">
              <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-ping"></span>
              Updating in real-time
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={liveSales} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} tickFormatter={(value) => `$${value}`} domain={['auto', 'auto']} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue Volume']}
                  labelStyle={{ color: '#374151', fontWeight: 500, marginBottom: '4px' }}
                />
                <Area type="monotone" dataKey="sales" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorSales)" isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Ticket Breakdown */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Ticket Sales</h2>
          <div className="space-y-6">
            {ticketTypes.map((ticket) => (
              <div key={ticket.name}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="font-medium text-gray-900">{ticket.name}</span>
                  <span className="text-gray-500">{ticket.sold.toLocaleString()} / {ticket.total.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-500 ease-out" 
                    style={{ width: `${(ticket.sold / ticket.total) * 100}%` }}
                  ></div>
                </div>
                <div className="mt-1 text-xs text-gray-500 text-right">
                  ${ticket.revenue.toLocaleString()} revenue
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live Feed of Recent Orders */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Live Orders Feed</h2>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 animate-pulse">
            <Radio className="w-3 h-3 mr-1" />
            Receiving orders
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket Type</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentOrders.map((order) => (
                <tr key={order.id} className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">#{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium text-xs mr-2">
                        {order.name.charAt(0)}
                      </div>
                      {order.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      order.type === 'VIP' ? 'bg-purple-100 text-purple-800' :
                      order.type === 'Early Bird' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">${order.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
