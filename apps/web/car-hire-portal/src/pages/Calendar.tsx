import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Badge, Card, Typography, Select, Button, Space, Popover, InputNumber, Switch } from 'antd';
import { LeftOutlined, RightOutlined, FilterOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';

const { Title, Text } = Typography;

// Mock Data
const INITIAL_BOOKINGS = [
  {
    id: 'TRX-1023',
    guest: 'Sarah Johnson',
    vehicle: 'Tesla Model 3',
    start: '2026-04-10',
    end: '2026-04-12',
    status: 'CONFIRMED'
  },
  {
    id: 'TRX-1024',
    guest: 'Michael Chen',
    vehicle: 'Tesla Model 3',
    start: '2026-04-18',
    end: '2026-04-20',
    status: 'CONFIRMED'
  }
];

const INITIAL_BLOCKED = ['2026-04-15', '2026-04-16'];
const INITIAL_PRICES: Record<string, number> = {
  '2026-04-20': 70,
  '2026-04-21': 75,
};

export default function CalendarPage() {
  const navigate = useNavigate();
  const [vehicleId, setVehicleId] = useState('v1');
  const [currentDate, setCurrentDate] = useState(() => dayjs('2026-04-01'));
  const [bookings, setBookings] = useState(INITIAL_BOOKINGS);
  const [blockedDates, setBlockedDates] = useState<string[]>(INITIAL_BLOCKED);
  const [priceOverrides, setPriceOverrides] = useState<Record<string, number>>(INITIAL_PRICES);
  
  const [popoverVisible, setPopoverVisible] = useState<Record<string, boolean>>({});

  const defaultPrice = 55;

  const handlePrevMonth = () => setCurrentDate(currentDate.subtract(1, 'month'));
  const handleNextMonth = () => setCurrentDate(currentDate.add(1, 'month'));

  const handleOpenDrawer = (booking: any) => {
    navigate(`/trips/${booking.id}`);
  };

  const handleSavePriceAndAvailability = (dateStr: string, newPrice: number, isBlocked: boolean) => {
    setPriceOverrides(prev => ({ ...prev, [dateStr]: newPrice }));
    
    if (isBlocked && !blockedDates.includes(dateStr)) {
      setBlockedDates(prev => [...prev, dateStr]);
    } else if (!isBlocked && blockedDates.includes(dateStr)) {
      setBlockedDates(prev => prev.filter(d => d !== dateStr));
    }
    
    setPopoverVisible(prev => ({ ...prev, [dateStr]: false }));
  };

  const PriceEditor = ({ dateStr, currentPrice, currentlyBlocked }: { dateStr: string, currentPrice: number, currentlyBlocked: boolean }) => {
    const [price, setPrice] = useState(currentPrice);
    const [blocked, setBlocked] = useState(currentlyBlocked);

    return (
      <div className="w-64 space-y-4">
        <div className="flex justify-between items-center">
          <Text strong>Date</Text>
          <Text>{dayjs(dateStr).format('MMM D, YYYY')}</Text>
        </div>
        <div className="flex justify-between items-center">
          <Text>Daily Price</Text>
          <InputNumber 
            value={price} 
            onChange={(val) => setPrice(val || defaultPrice)} 
            prefix="$" 
            min={10} 
            disabled={blocked}
          />
        </div>
        <div className="flex justify-between items-center">
          <Text>Block Date</Text>
          <Switch checked={blocked} onChange={setBlocked} />
        </div>
        <Button 
          type="primary" 
          block 
          onClick={() => handleSavePriceAndAvailability(dateStr, price, blocked)}
        >
          Save Changes
        </Button>
      </div>
    );
  };

  const cellRender = (current: Dayjs, info: any) => {
    if (info.type !== 'date') return info.originNode;

    const dateStr = current.format('YYYY-MM-DD');
    const currentMs = current.startOf('day').valueOf();
    
    const booking = bookings.find(b => {
      const startMs = dayjs(b.start).startOf('day').valueOf();
      const endMs = dayjs(b.end).startOf('day').valueOf();
      return currentMs >= startMs && currentMs <= endMs;
    });

    const isBlocked = blockedDates.includes(dateStr);
    const price = priceOverrides[dateStr] || defaultPrice;

    if (booking) {
      return (
        <div 
          onClick={(e) => { e.stopPropagation(); handleOpenDrawer(booking); }} 
          className="bg-blue-50 border-l-4 border-blue-500 p-1 h-full min-h-[80px] cursor-pointer hover:bg-blue-100 transition-colors"
        >
          <Badge status="processing" text={<span className="font-semibold text-blue-700">Booked</span>} />
          <div className="text-xs text-blue-800 mt-1 truncate">{booking.guest}</div>
        </div>
      );
    }

    const content = (
      <div className={`p-1 h-full min-h-[80px] cursor-pointer transition-colors ${isBlocked ? 'bg-gray-100 opacity-70 hover:bg-gray-200' : 'hover:bg-gray-50'}`}>
        {isBlocked ? (
          <Badge status="default" text={<span className="text-gray-600">Blocked</span>} />
        ) : (
          <>
            <Badge status="success" text="Available" />
            <div className="text-sm font-semibold mt-1 text-gray-700">${price}</div>
          </>
        )}
      </div>
    );

    return (
      <Popover 
        content={<PriceEditor dateStr={dateStr} currentPrice={price} currentlyBlocked={isBlocked} />} 
        title="Edit Availability & Price"
        trigger="click"
        open={popoverVisible[dateStr]}
        onOpenChange={(visible) => setPopoverVisible(prev => ({ ...prev, [dateStr]: visible }))}
      >
        {content}
      </Popover>
    );
  };

  return (
    <div className="space-y-6">
      <Title level={4} className="!mb-0">Calendar & Pricing</Title>

      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <Space size="large" className="w-full sm:w-auto overflow-x-auto">
          <Select
            value={vehicleId}
            onChange={setVehicleId}
            style={{ width: 200 }}
            options={[
              { value: 'v1', label: 'Tesla Model 3' },
              { value: 'v2', label: 'BMW X5' },
              { value: 'v3', label: 'Toyota Corolla' }
            ]}
          />
          <Space>
            <Button icon={<LeftOutlined />} onClick={handlePrevMonth} />
            <Title level={5} className="!mb-0 w-32 text-center">
              {currentDate.format('MMMM YYYY')}
            </Title>
            <Button icon={<RightOutlined />} onClick={handleNextMonth} />
          </Space>
        </Space>
        
        <Space>
          <Button icon={<FilterOutlined />}>Filters</Button>
          <Button type="primary">Sync Calendar</Button>
        </Space>
      </div>

      {/* Calendar Grid */}
      <Card className="shadow-sm p-0" styles={{ body: { padding: 0 } }}>
        <Calendar 
          value={currentDate} 
          onChange={setCurrentDate}
          cellRender={cellRender} 
          headerRender={() => null}
        />
      </Card>
    </div>
  );
}
