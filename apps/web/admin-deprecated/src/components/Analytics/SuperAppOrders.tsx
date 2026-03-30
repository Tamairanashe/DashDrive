import React, { useState } from 'react';
import { Table, Badge, Card, Typography, Button, Space } from 'antd';
import { 
  ShoppingBag, 
  Utensils, 
  Package, 
  Filter, 
  Eye, 
  TrendingUp, 
  Users 
} from 'lucide-react';
import { StatCard } from '../StatCard';
import { cn } from '../../utils';

const { Title, Text } = Typography;

const SuperAppOrders = () => {
  const [orders] = useState([
    { id: 'ORD-101', type: 'FOOD', user: 'Julius C.', total: '$24.50', status: 'preparing', vendor: 'Pizza Inn' },
    { id: 'ORD-102', type: 'GROCERY', user: 'Sarah M.', total: '$62.10', status: 'ready', vendor: 'Pick n Pay' },
    { id: 'ORD-103', type: 'SHOPPING', user: 'Tinashe J.', total: '$120.00', status: 'searching', vendor: 'Tech Store' },
  ]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'FOOD': return <Utensils className="w-4 h-4 mr-2 text-amber-500" />;
      case 'GROCERY': return <ShoppingBag className="w-4 h-4 mr-2 text-emerald-500" />;
      default: return <Package className="w-4 h-4 mr-2 text-blue-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return <Badge status="success" text="Completed" />;
      case 'preparing': return <Badge status="warning" text="Preparing" />;
      case 'searching': return <Badge status="processing" text="Searching" />;
      default: return <Badge status="default" text={status} />;
    }
  };

  const columns = [
    { 
      title: 'Order ID', 
      dataIndex: 'id', 
      key: 'id', 
      render: (text: string) => <Text strong>{text}</Text> 
    },
    { 
      title: 'Type', 
      dataIndex: 'type', 
      key: 'type',
      render: (type: string) => (
        <div className="flex items-center">
          {getIcon(type)}
          <Text className="text-xs">{type}</Text>
        </div>
      )
    },
    { title: 'Vendor', dataIndex: 'vendor', key: 'vendor' },
    { title: 'User', dataIndex: 'user', key: 'user' },
    { title: 'Total', dataIndex: 'total', key: 'total' },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status',
      render: (status: string) => getStatusBadge(status)
    },
    { 
      title: 'Action', 
      key: 'action',
      render: () => (
        <Button size="small" type="text" icon={<Eye className="w-4 h-4" />}>
          Details
        </Button>
      )
    },
  ];

  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <Title level={2} className="m-0 text-slate-900 font-extrabold tracking-tight">Super-App Orders</Title>
          <Text className="text-slate-400">Manage multi-service delivery logistics</Text>
        </div>
        <Space>
          <Button icon={<Filter className="w-4 h-4" />}>Filter</Button>
          <Button type="primary">Export</Button>
        </Space>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Active Food"
          value="12"
          icon={<Utensils className="text-amber-500" />}
          color="bg-amber-500"
          trend="+5 today"
        />
        <StatCard
          title="Grocery Batches"
          value="5"
          icon={<ShoppingBag className="text-emerald-500" />}
          color="bg-emerald-500"
          trend="All on time"
        />
        <StatCard
          title="Total Users"
          value="842k"
          icon={<Users className="text-primary text-blue-500" />}
          color="bg-blue-500"
        />
        <StatCard
          title="Daily Revenue"
          value="$12.4k"
          icon={<TrendingUp className="text-emerald-500" />}
          color="bg-emerald-500"
          trend="+12% 📈"
        />
      </div>

      <Card 
        title={<span className="font-bold flex items-center gap-2"><Package className="w-5 h-5" /> Live Order Feed</span>}
        className="rounded-[24px] shadow-soft border-slate-100"
      >
        <Table 
          dataSource={orders} 
          columns={columns} 
          rowKey="id" 
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};

export default SuperAppOrders;
