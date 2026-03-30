import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, Badge, Card, Typography, Select, Button, 
  Space, Popover, InputNumber, Switch, Divider, Avatar 
} from 'antd';
import { 
  LeftOutlined, RightOutlined, FilterOutlined, 
  CalendarOutlined, ShopOutlined, InfoCircleOutlined 
} from '@ant-design/icons';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { motion } from 'framer-motion';

const { Title, Text } = Typography;

// Mock Data for Properties
const PROPERTY_BOOKINGS = [
  {
    id: 'B-2001',
    guest: 'Alice Williams',
    property: 'Emerald Lake Cabin',
    start: '2026-04-05',
    end: '2026-04-10',
    status: 'CONFIRMED'
  },
  {
    id: 'B-2002',
    guest: 'Robert Blake',
    property: 'Emerald Lake Cabin',
    start: '2026-04-15',
    end: '2026-04-20',
    status: 'CONFIRMED'
  }
];

const BLOCKED_DATES = ['2026-04-12', '2026-04-13', '2026-04-14'];
const CUSTOM_PRICES: Record<string, number> = {
  '2026-04-10': 150,
  '2026-04-11': 150,
};

export default function HostCalendar() {
  const navigate = useNavigate();
  const [propertyId, setPropertyId] = useState('p1');
  const [currentDate, setCurrentDate] = useState(() => dayjs('2026-04-01'));
  const [blockedDates, setBlockedDates] = useState<string[]>(BLOCKED_DATES);
  const [priceOverrides, setPriceOverrides] = useState<Record<string, number>>(CUSTOM_PRICES);
  const [popoverVisible, setPopoverVisible] = useState<Record<string, boolean>>({});

  const defaultPrice = 120; // Default for Emerald Lake Cabin

  const handlePrevMonth = () => setCurrentDate(currentDate.subtract(1, 'month'));
  const handleNextMonth = () => setCurrentDate(currentDate.add(1, 'month'));

  const handleSaveSettings = (dateStr: string, newPrice: number, isBlocked: boolean) => {
    setPriceOverrides(prev => ({ ...prev, [dateStr]: newPrice }));
    if (isBlocked && !blockedDates.includes(dateStr)) {
      setBlockedDates(prev => [...prev, dateStr]);
    } else if (!isBlocked && blockedDates.includes(dateStr)) {
      setBlockedDates(prev => prev.filter(d => d !== dateStr));
    }
    setPopoverVisible(prev => ({ ...prev, [dateStr]: false }));
  };

  const PriceEditor = ({ dateStr, currentPrice, currentlyBlocked }: any) => {
    const [price, setPrice] = useState(currentPrice);
    const [blocked, setBlocked] = useState(currentlyBlocked);

    return (
      <div className="w-64 space-y-4 p-2">
        <div className="flex justify-between items-center">
          <Text strong>Date</Text>
          <Tag color="blue">{dayjs(dateStr).format('MMM D, YYYY')}</Tag>
        </div>
        <Divider className="my-2" />
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Text>Nightly Rate</Text>
            <InputNumber 
              value={price} 
              onChange={(val) => setPrice(val || defaultPrice)} 
              prefix="$" 
              min={1} 
              disabled={blocked}
              className="w-32 rounded-lg"
            />
          </div>
          <div className="flex justify-between items-center">
            <Text>Blocked</Text>
            <Switch checked={blocked} onChange={setBlocked} className={blocked ? 'bg-red-500' : ''} />
          </div>
        </div>
        <Button 
          type="primary" 
          block 
          className="h-10 rounded-xl bg-indigo-600 font-bold"
          onClick={() => handleSaveSettings(dateStr, price, blocked)}
        >
          Update Settings
        </Button>
      </div>
    );
  };

  const cellRender = (current: Dayjs, info: any) => {
    if (info.type !== 'date') return info.originNode;

    const dateStr = current.format('YYYY-MM-DD');
    const currentMs = current.startOf('day').valueOf();
    
    const booking = PROPERTY_BOOKINGS.find(b => {
      const startMs = dayjs(b.start).startOf('day').valueOf();
      const endMs = dayjs(b.end).startOf('day').valueOf();
      return currentMs >= startMs && currentMs <= endMs;
    });

    const isBlocked = blockedDates.includes(dateStr);
    const price = priceOverrides[dateStr] || defaultPrice;

    const content = (
      <div className={`p-1 h-full min-h-[100px] border-t border-gray-100 transition-all ${
        booking ? 'bg-indigo-50/50' : isBlocked ? 'bg-gray-50 opacity-60' : 'hover:bg-gray-50'
      }`}>
        <div className="flex justify-between items-start mb-1">
          <Text className="text-[10px] text-gray-400 font-black">{current.date()}</Text>
          {!booking && !isBlocked && <Text className="text-[10px] text-indigo-500 font-bold">${price}</Text>}
        </div>

        {booking && (
          <div className="bg-indigo-600 rounded-lg p-1.5 shadow-sm">
            <div className="text-[9px] text-white/70 uppercase font-black leading-none mb-1">Booked</div>
            <div className="text-[10px] text-white font-bold truncate">{booking.guest}</div>
          </div>
        )}

        {isBlocked && (
          <div className="flex items-center justify-center h-12">
            <Badge status="default" text={<span className="text-[10px] text-gray-400 font-bold uppercase">Blocked</span>} />
          </div>
        )}

        {!booking && !isBlocked && (
          <div className="flex flex-col items-center justify-center h-12 opacity-0 group-hover:opacity-100">
             <Text className="text-[10px] text-gray-300 font-bold uppercase">Available</Text>
          </div>
        )}
      </div>
    );

    return (
      <Popover 
        content={<PriceEditor dateStr={dateStr} currentPrice={price} currentlyBlocked={isBlocked} />} 
        title={<span className="font-black text-gray-800">Nightly Pricing</span>}
        trigger="click"
        open={popoverVisible[dateStr]}
        onOpenChange={(visible) => setPopoverVisible(prev => ({ ...prev, [dateStr]: visible }))}
      >
        <div className="h-full group">{content}</div>
      </Popover>
    );
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="flex justify-between items-center bg-white/40 backdrop-blur-md p-6 rounded-[2.5rem] border border-white/20 shadow-xl">
        <div>
          <Title level={3} className="!mb-0 !font-black text-gray-800">Availability & Pricing</Title>
          <Text className="text-gray-400">Control your property's booking calendar and dynamic rates.</Text>
        </div>
        <Space size="middle">
           <Button icon={<CalendarOutlined />} className="h-12 rounded-2xl px-6 border-gray-200">iCal Sync</Button>
           <Button type="primary" className="h-12 rounded-2xl px-10 bg-indigo-600 shadow-lg shadow-indigo-100 font-bold">Apply Bulk Edits</Button>
        </Space>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <Col className="lg:col-span-3">
          <Card className="rounded-[2.5rem] overflow-hidden shadow-xl border-none p-0" styles={{ body: { padding: 0 } }}>
            <div className="bg-white p-6 border-b border-gray-50 flex justify-between items-center">
               <Space size="large">
                  <Select
                    value={propertyId}
                    onChange={setPropertyId}
                    className="w-64 rounded-xl"
                    options={[
                      { value: 'p1', label: 'Emerald Lake Cabin' },
                      { value: 'p2', label: 'Modern City Loft' },
                      { value: 'p3', label: 'Zambezi Sunset Villa' }
                    ]}
                  />
                  <Space className="bg-gray-50 p-1 rounded-2xl border border-gray-100">
                    <Button type="text" icon={<LeftOutlined className="text-xs" />} onClick={handlePrevMonth} />
                    <Title level={5} className="!mb-0 w-40 text-center !text-sm !font-black uppercase tracking-widest text-gray-600">
                      {currentDate.format('MMMM YYYY')}
                    </Title>
                    <Button type="text" icon={<RightOutlined className="text-xs" />} onClick={handleNextMonth} />
                  </Space>
               </Space>
               <Space>
                 <Badge status="processing" text="Booked" />
                 <Badge status="success" text="Available" />
                 <Badge status="default" text="Blocked" />
               </Space>
            </div>
            <Calendar 
              value={currentDate} 
              onChange={setCurrentDate}
              cellRender={cellRender} 
              headerRender={() => null}
              className="host-calendar-grid"
            />
          </Card>
        </Col>

        <Col className="space-y-6">
          <Card className="rounded-[2.5rem] border-none shadow-xl bg-indigo-600 text-white">
            <div className="space-y-4">
              <Title level={4} className="!text-white !mb-0 font-black">Calendar Insights</Title>
              <div className="space-y-6 pt-4">
                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                  <Text className="text-indigo-100">Occupancy Rate</Text>
                  <Text className="font-black text-xl">84%</Text>
                </div>
                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                  <Text className="text-indigo-100">Avg. Nightly Rate</Text>
                  <Text className="font-black text-xl">$138</Text>
                </div>
                <div className="flex justify-between items-center">
                  <Text className="text-indigo-100">Est. Revenue (Apr)</Text>
                  <Text className="font-black text-xl text-yellow-400">$4,250</Text>
                </div>
              </div>
            </div>
          </Card>

          <Card className="rounded-[2.5rem] border-none shadow-xl bg-white">
             <div className="space-y-4">
                <div className="flex items-center gap-3">
                   <div className="bg-amber-100 p-3 rounded-2xl text-amber-600">
                     <InfoCircleOutlined />
                   </div>
                   <Title level={5} className="!mb-0 font-black">Host Tips</Title>
                </div>
                <Paragraph className="text-gray-400 text-sm">
                  Properties in Nyanga are seeing a 15% increase in demand for the upcoming weekend. 
                  Consider adjusting your rates to maximize yield.
                </Paragraph>
                <Button block ghost type="primary" className="rounded-xl font-bold">Try Smart Pricing</Button>
             </div>
          </Card>
        </Col>
      </div>
    </motion.div>
  );
}

// Add these styles to your project's CSS for a better calendar look
// .host-calendar-grid .ant-picker-calendar-date { margin: 0 !important; width: 100% !important; }
// .host-calendar-grid .ant-picker-calendar-date-content { height: 100% !important; margin: 0 !important; }
// .host-calendar-grid .ant-picker-cell-inner { border-radius: 0 !important; }
// .host-calendar-grid .ant-picker-cell:hover .ant-picker-cell-inner { background: transparent !important; }
