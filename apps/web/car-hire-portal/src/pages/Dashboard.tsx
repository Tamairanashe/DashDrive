import { Card, Row, Col, Statistic, Alert, Typography, Badge, Space } from 'antd';
import { DollarOutlined, CarOutlined, EnvironmentOutlined, BellOutlined, RiseOutlined } from '@ant-design/icons';
import { Area, Column } from '@ant-design/plots';
import { motion } from 'framer-motion';

const { Title, Text } = Typography;

export default function Dashboard() {
  const earningsData = [
    { month: 'Jan', value: 3500 },
    { month: 'Feb', value: 4200 },
    { month: 'Mar', value: 3800 },
    { month: 'Apr', value: 5100 },
    { month: 'May', value: 6000 },
    { month: 'Jun', value: 7200 },
  ];

  const earningsConfig = {
    data: earningsData,
    xField: 'month',
    yField: 'value',
    color: '#4f46e5',
    areaStyle: {
      fill: 'l(270) 0:#ffffff 0.5:#c7d2fe 1:#4f46e5',
    },
    smooth: true,
  };

  const tripData = [
    { type: 'Completed', value: 45 },
    { type: 'Active', value: 8 },
    { type: 'Upcoming', value: 12 },
    { type: 'Cancelled', value: 3 },
  ];

  const tripConfig = {
    data: tripData,
    xField: 'type',
    yField: 'value',
    color: '#10b981',
    columnWidthRatio: 0.6,
  };

  const alerts = [
    { id: 1, type: 'warning', message: 'Booking request from John D. expires in 2 hours.' },
    { id: 2, type: 'info', message: 'New message from Sarah regarding Tesla Model 3.' },
    { id: 3, type: 'error', message: 'Insurance document for Toyota Corolla expires in 5 days.' },
  ];

  const [liveEarnings, setLiveEarnings] = React.useState(7200.45);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setLiveEarnings(prev => prev + Math.random() * 0.5);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="flex justify-between items-end mb-8">
        <div>
          <Title level={2} className="!mb-1 !font-black tracking-tight text-gray-800">Host Command Center</Title>
          <Text className="text-gray-400">Real-time performance metrics and fleet overview.</Text>
        </div>
        <div className="flex bg-white/50 backdrop-blur-md p-1 rounded-2xl border border-white/20 shadow-sm">
          <Button type="text" className="rounded-xl px-6 font-semibold">Today</Button>
          <Button type="primary" className="rounded-xl px-6 shadow-md bg-indigo-600">Last 7 Days</Button>
        </div>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <motion.div
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card 
              variant="borderless" 
              className="shadow-2xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 text-white overflow-hidden relative"
              styles={{ body: { padding: '32px' } }}
            >
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <DollarOutlined style={{ fontSize: '180px' }} />
              </div>
              
              <div className="relative z-10 flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <Text className="text-indigo-100 text-xs uppercase tracking-[0.2em] font-bold">Total Performance</Text>
                    <Badge status="processing" color="#10b981" />
                  </div>
                  <div className="text-5xl font-black mt-2 flex items-baseline tracking-tighter">
                    <span className="text-2xl mr-1 opacity-60 font-medium">$</span>
                    {liveEarnings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div className="mt-8 flex items-center">
                    <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center text-sm font-bold border border-white/10">
                      <RiseOutlined className="mr-2 text-green-400" />
                      +14.2% <span className="text-indigo-200 font-normal ml-2">vs last month</span>
                    </div>
                  </div>
                </div>
                <div className="h-14 w-14 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20 shadow-lg">
                  <DollarOutlined className="text-2xl" />
                </div>
              </div>
            </Card>
          </motion.div>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card 
            variant="borderless" 
            className="shadow-xl h-full flex flex-col justify-center bg-white/40 backdrop-blur-md border border-white/20 rounded-[2.5rem]"
          >
            <Statistic 
              title={<span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Active Trips</span>}
              value={8} 
              prefix={<div className="bg-green-100 p-2 rounded-xl mr-2 inline-flex"><EnvironmentOutlined className="text-green-600" /></div>}
              valueStyle={{ fontWeight: 900, fontSize: '2.5rem', letterSpacing: '-0.05em' }} 
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card 
            variant="borderless" 
            className="shadow-xl h-full flex flex-col justify-center bg-white/40 backdrop-blur-md border border-white/20 rounded-[2.5rem]"
          >
            <Statistic 
              title={<span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Fleet Size</span>}
              value={4} 
              prefix={<div className="bg-indigo-100 p-2 rounded-xl mr-2 inline-flex"><CarOutlined className="text-indigo-600" /></div>}
              valueStyle={{ fontWeight: 900, fontSize: '2.5rem', letterSpacing: '-0.05em' }} 
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card 
            title={<span className="font-black text-gray-800">Revenue Dynamics</span>}
            variant="borderless" 
            className="shadow-xl bg-white/40 backdrop-blur-md border border-white/20 rounded-[2.5rem]"
          >
            <Area {...earningsConfig} height={350} />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card 
            title={<span className="font-black text-gray-800">Efficiency</span>}
            variant="borderless" 
            className="shadow-xl bg-white/40 backdrop-blur-md border border-white/20 rounded-[2.5rem]"
          >
            <Column {...tripConfig} height={350} />
          </Card>
        </Col>
      </Row>

      <Card 
        title={<span className="font-black text-gray-800">Critical Alerts</span>}
        variant="borderless" 
        className="shadow-xl bg-white/40 backdrop-blur-md border border-white/20 rounded-[2.5rem]"
      >
        <div className="space-y-4">
          {alerts.map(alert => (
            <motion.div 
              key={alert.id}
              whileHover={{ x: 5 }}
            >
              <Alert 
                className={`rounded-2xl border-none p-4 shadow-sm ${
                  alert.type === 'warning' ? 'bg-amber-50' : 
                  alert.type === 'error' ? 'bg-red-50' : 'bg-blue-50'
                }`}
                message={<span className="font-bold text-gray-800">{alert.message}</span>} 
                type={alert.type as any} 
                showIcon 
              />
            </motion.div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}
