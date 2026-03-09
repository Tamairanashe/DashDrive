import React, { useState } from 'react';
import { Typography, Table, Tag, Badge, Button, Space, Modal, Descriptions, message } from 'antd';

const { Title, Text } = Typography;

interface Policy {
  id: string;
  user: string;
  userType: string;
  product: string;
  coverage: number;
  premium: number;
  status: string;
  startDate: string;
  expiryDate: string;
  phone: string;
  city: string;
  driverTier: string;
  trips: number;
}

export const PoliciesPage: React.FC = () => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selected, setSelected] = useState<Policy | null>(null);

  const [policies, setPolicies] = useState<Policy[]>([
    { id: 'POL-3001', user: 'Driver John', userType: 'Driver', product: 'Accident Cover', coverage: 10000, premium: 3, status: 'Active', startDate: '2025-09-01', expiryDate: '2026-09-01', phone: '+263 71 234 5678', city: 'Harare', driverTier: 'Premium', trips: 1340 },
    { id: 'POL-3002', user: 'Driver Sarah', userType: 'Driver', product: 'Vehicle Damage', coverage: 15000, premium: 8, status: 'Active', startDate: '2025-11-15', expiryDate: '2026-11-15', phone: '+263 77 987 6543', city: 'Bulawayo', driverTier: 'Gold', trips: 890 },
    { id: 'POL-3003', user: 'Rider Mike', userType: 'Rider', product: 'Trip Protection', coverage: 5000, premium: 1.5, status: 'Active', startDate: '2026-01-10', expiryDate: '2026-07-10', phone: '+263 73 111 2222', city: 'Harare', driverTier: 'N/A', trips: 0 },
    { id: 'POL-3004', user: 'Driver Grace', userType: 'Driver', product: 'Accident Cover', coverage: 10000, premium: 3, status: 'Expired', startDate: '2024-08-01', expiryDate: '2025-08-01', phone: '+263 77 333 2211', city: 'Harare', driverTier: 'Premium', trips: 1800 },
    { id: 'POL-3005', user: 'Driver Tino', userType: 'Driver', product: 'Vehicle Damage', coverage: 15000, premium: 8, status: 'Cancelled', startDate: '2025-06-20', expiryDate: '2026-06-20', phone: '+263 71 555 4444', city: 'Mutare', driverTier: 'Standard', trips: 210 },
    { id: 'POL-3006', user: 'Driver Alex', userType: 'Driver', product: 'Accident Cover', coverage: 10000, premium: 3, status: 'Pending Activation', startDate: '2026-03-09', expiryDate: '2027-03-09', phone: '+263 78 666 7777', city: 'Harare', driverTier: 'Gold', trips: 560 },
  ]);

  const statusBadge = (s: string): any => s === 'Active' ? 'success' : s === 'Expired' ? 'default' : s === 'Cancelled' ? 'error' : 'warning';

  const updateStatus = (id: string, status: string) => { setPolicies(p => p.map(pol => pol.id === id ? { ...pol, status } : pol)); message.success(`Policy ${id} updated to ${status}`); setIsDetailsOpen(false); };

  const columns = [
    { title: 'Policy ID', dataIndex: 'id', render: (t: string) => <Text strong>{t}</Text> },
    { title: 'User', dataIndex: 'user' },
    { title: 'User Type', dataIndex: 'userType', render: (t: string) => <Tag color={t === 'Driver' ? 'blue' : 'green'}>{t}</Tag> },
    { title: 'Product', dataIndex: 'product', render: (t: string) => <Tag color="purple">{t}</Tag> },
    { title: 'Coverage', dataIndex: 'coverage', render: (v: number) => `$${v.toLocaleString()}` },
    { title: 'Premium', dataIndex: 'premium', render: (v: number) => `$${v}/mo` },
    { title: 'Status', dataIndex: 'status', render: (s: string) => <Badge status={statusBadge(s)} text={s} /> },
    { title: 'Start Date', dataIndex: 'startDate' },
    { title: 'Expiry Date', dataIndex: 'expiryDate' },
    {
      title: 'Actions',
      render: (_: any, record: Policy) => (
        <Button size="small" type="primary" ghost onClick={() => { setSelected(record); setIsDetailsOpen(true); }}>Details</Button>
      ),
    },
  ];

  return (
    <div>
      <Title level={4}>Policy Management</Title>
      <Text type="secondary" style={{ marginBottom: 16, display: 'block' }}>View and manage all insurance policies issued through DashDrive.</Text>
      <Table columns={columns} dataSource={policies} rowKey="id" scroll={{ x: 1200 }} />

      <Modal title={`Policy ${selected?.id}`} open={isDetailsOpen} onCancel={() => setIsDetailsOpen(false)} footer={null} width={640}>
        {selected && (
          <div>
            <Descriptions bordered column={2} size="small" title="User Profile" style={{ marginBottom: 16 }}>
              <Descriptions.Item label="Name">{selected.user}</Descriptions.Item>
              <Descriptions.Item label="Phone">{selected.phone}</Descriptions.Item>
              <Descriptions.Item label="City">{selected.city}</Descriptions.Item>
              <Descriptions.Item label="Driver Tier"><Tag>{selected.driverTier}</Tag></Descriptions.Item>
              <Descriptions.Item label="Trips Completed">{selected.trips}</Descriptions.Item>
              <Descriptions.Item label="User Type"><Tag color={selected.userType === 'Driver' ? 'blue' : 'green'}>{selected.userType}</Tag></Descriptions.Item>
            </Descriptions>
            <Descriptions bordered column={2} size="small" title="Policy Details" style={{ marginBottom: 16 }}>
              <Descriptions.Item label="Product">{selected.product}</Descriptions.Item>
              <Descriptions.Item label="Coverage">${selected.coverage.toLocaleString()}</Descriptions.Item>
              <Descriptions.Item label="Premium">${selected.premium}/mo</Descriptions.Item>
              <Descriptions.Item label="Status"><Badge status={statusBadge(selected.status)} text={selected.status} /></Descriptions.Item>
              <Descriptions.Item label="Start Date">{selected.startDate}</Descriptions.Item>
              <Descriptions.Item label="Expiry Date">{selected.expiryDate}</Descriptions.Item>
            </Descriptions>
            <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {selected.status === 'Active' && (
                <>
                  <Button danger onClick={() => updateStatus(selected.id, 'Cancelled')}>Cancel Policy</Button>
                  <Button onClick={() => updateStatus(selected.id, 'Suspended')}>Suspend Policy</Button>
                  <Button type="primary" ghost>Update Coverage</Button>
                </>
              )}
              {selected.status === 'Expired' && <Button type="primary" onClick={() => updateStatus(selected.id, 'Active')}>Renew Policy</Button>}
              {selected.status === 'Pending Activation' && <Button type="primary" onClick={() => updateStatus(selected.id, 'Active')}>Activate Policy</Button>}
              {selected.status === 'Cancelled' && <Button type="primary" ghost onClick={() => updateStatus(selected.id, 'Active')}>Reinstate Policy</Button>}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
