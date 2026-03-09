import React, { useState } from 'react';
import { Typography, Table, Tag, Card, Button, Modal, Descriptions, Space } from 'antd';
import { WarningOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface Borrower {
  userId: string;
  name: string;
  userType: string;
  driverTier: string;
  trips: number;
  rating: number;
  accountAge: string;
  city: string;
  avgEarnings: number;
  walletBalance: number;
  loanHistory: number;
  repaymentBehavior: string;
  riskFlags: string[];
}

export const CustomersPage: React.FC = () => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selected, setSelected] = useState<Borrower | null>(null);

  const borrowers: Borrower[] = [
    { userId: 'USR-001', name: 'Driver John', userType: 'Driver', driverTier: 'Premium', trips: 1340, rating: 4.8, accountAge: '18 months', city: 'Harare', avgEarnings: 900, walletBalance: 320, loanHistory: 2, repaymentBehavior: 'Excellent', riskFlags: [] },
    { userId: 'USR-002', name: 'Driver Sarah', userType: 'Driver', driverTier: 'Gold', trips: 890, rating: 4.6, accountAge: '12 months', city: 'Bulawayo', avgEarnings: 650, walletBalance: 150, loanHistory: 1, repaymentBehavior: 'Good', riskFlags: [] },
    { userId: 'USR-003', name: 'Rider Mike', userType: 'Rider', driverTier: 'N/A', trips: 120, rating: 4.2, accountAge: '8 months', city: 'Harare', avgEarnings: 0, walletBalance: 45, loanHistory: 0, repaymentBehavior: 'No history', riskFlags: ['Low account age'] },
    { userId: 'USR-004', name: 'Driver Grace', userType: 'Driver', driverTier: 'Premium', trips: 1800, rating: 4.9, accountAge: '24 months', city: 'Harare', avgEarnings: 1200, walletBalance: 580, loanHistory: 3, repaymentBehavior: 'Excellent', riskFlags: [] },
    { userId: 'USR-005', name: 'Driver Tino', userType: 'Driver', driverTier: 'Standard', trips: 80, rating: 3.9, accountAge: '3 months', city: 'Mutare', avgEarnings: 400, walletBalance: 20, loanHistory: 0, repaymentBehavior: 'No history', riskFlags: ['High cancellation rate', 'Multiple loan applications', 'Low earnings stability'] },
    { userId: 'USR-006', name: 'Driver Alex', userType: 'Driver', driverTier: 'Gold', trips: 960, rating: 4.5, accountAge: '14 months', city: 'Harare', avgEarnings: 750, walletBalance: 210, loanHistory: 1, repaymentBehavior: 'Good', riskFlags: [] },
  ];

  const columns = [
    { title: 'User ID', dataIndex: 'userId', render: (t: string) => <Text strong>{t}</Text> },
    { title: 'Name', dataIndex: 'name' },
    { title: 'Type', dataIndex: 'userType', render: (t: string) => <Tag color={t === 'Driver' ? 'blue' : 'green'}>{t}</Tag> },
    { title: 'Tier', dataIndex: 'driverTier', render: (t: string) => <Tag>{t}</Tag> },
    { title: 'Rating', dataIndex: 'rating', render: (v: number) => `${v} ⭐` },
    { title: 'Trips', dataIndex: 'trips' },
    { title: 'Avg Earnings', dataIndex: 'avgEarnings', render: (v: number) => v > 0 ? `$${v}/mo` : 'N/A' },
    { title: 'Loan History', dataIndex: 'loanHistory', render: (v: number) => v > 0 ? `${v} loans` : 'None' },
    { title: 'Risk', render: (_: any, r: Borrower) => r.riskFlags.length > 0 ? <Tag color="red" icon={<WarningOutlined />}>{r.riskFlags.length} flags</Tag> : <Tag color="green">Clear</Tag> },
    { title: 'Actions', render: (_: any, r: Borrower) => <Button size="small" type="primary" ghost onClick={() => { setSelected(r); setIsDetailsOpen(true); }}>Profile</Button> },
  ];

  return (
    <div>
      <Title level={4}>Borrower Profiles</Title>
      <Text type="secondary" style={{ marginBottom: 16, display: 'block' }}>View detailed profiles and risk indicators for DashDrive users.</Text>
      <Table columns={columns} dataSource={borrowers} rowKey="userId" scroll={{ x: 1100 }} />

      <Modal title={`Borrower ${selected?.name}`} open={isDetailsOpen} onCancel={() => setIsDetailsOpen(false)} footer={null} width={640}>
        {selected && (
          <div>
            <Descriptions bordered column={2} size="small" title="Profile" style={{ marginBottom: 16 }}>
              <Descriptions.Item label="User ID">{selected.userId}</Descriptions.Item>
              <Descriptions.Item label="Type"><Tag color={selected.userType === 'Driver' ? 'blue' : 'green'}>{selected.userType}</Tag></Descriptions.Item>
              <Descriptions.Item label="Tier"><Tag>{selected.driverTier}</Tag></Descriptions.Item>
              <Descriptions.Item label="City">{selected.city}</Descriptions.Item>
              <Descriptions.Item label="Trips">{selected.trips}</Descriptions.Item>
              <Descriptions.Item label="Rating">{selected.rating} ⭐</Descriptions.Item>
              <Descriptions.Item label="Account Age">{selected.accountAge}</Descriptions.Item>
            </Descriptions>
            <Descriptions bordered column={2} size="small" title="Financial Data" style={{ marginBottom: 16 }}>
              <Descriptions.Item label="Avg Monthly Earnings">${selected.avgEarnings}/mo</Descriptions.Item>
              <Descriptions.Item label="Wallet Balance">${selected.walletBalance}</Descriptions.Item>
              <Descriptions.Item label="Loan History">{selected.loanHistory > 0 ? `${selected.loanHistory} loans` : 'None'}</Descriptions.Item>
              <Descriptions.Item label="Repayment Behavior"><Tag color={selected.repaymentBehavior === 'Excellent' ? 'green' : selected.repaymentBehavior === 'Good' ? 'blue' : 'default'}>{selected.repaymentBehavior}</Tag></Descriptions.Item>
            </Descriptions>
            {selected.riskFlags.length > 0 && (
              <Card title="⚠️ Risk Indicators" bordered={false} style={{ background: '#fff2e8' }}>
                <Space direction="vertical">
                  {selected.riskFlags.map((f, i) => <Text key={i} type="warning">⚠️ {f}</Text>)}
                </Space>
              </Card>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};
