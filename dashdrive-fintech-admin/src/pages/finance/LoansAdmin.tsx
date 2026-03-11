import React, { useState } from 'react';
import { Typography, Row, Col, Table, Tag, Input, Space, Button, Dropdown, Drawer, Descriptions } from 'antd';
import { SearchOutlined, MoreOutlined, EyeOutlined, WarningOutlined, DownloadOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export const LoansAdmin: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<any>(null);

  const columns = [
    { title: 'Loan ID', dataIndex: 'id', key: 'id', render: (text: string) => <Text style={{ color: '#8c8c8c' }}>{text}</Text> },
    { title: 'Borrower', dataIndex: 'borrower', key: 'borrower', render: (text: string) => <Text strong style={{ color: '#fff' }}>{text}</Text> },
    { title: 'Lending Partner', dataIndex: 'lender', key: 'lender' },
    { title: 'Principal', dataIndex: 'amount', key: 'amount' },
    { title: 'APR', dataIndex: 'apr', key: 'apr' },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status',
      render: (status: string) => {
        let color = status === 'Funded' ? 'success' : status === 'Delinquent' ? 'error' : status === 'Pending' ? 'warning' : 'default';
        return <Tag color={color}>{status}</Tag>;
      }
    },
    {
      title: 'Governance',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button 
            type="primary" 
            ghost 
            size="small" 
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedLoan(record);
              setOpen(true);
            }}
          >
            Audit
          </Button>
          <Dropdown menu={{
            items: [
              { key: '1', icon: <WarningOutlined />, label: 'Flag for Investigation', danger: true },
              { key: '2', icon: <DownloadOutlined />, label: 'Export Agreements' },
            ]
          }} trigger={['click']}>
            <Button type="text" size="small" icon={<MoreOutlined />} style={{ color: '#fff' }} />
          </Dropdown>
        </Space>
      )
    }
  ];

  const data = [
    { key: '1', id: 'L-88392', borrower: 'Marcus Johnson', lender: 'Capital Drive Bank', amount: '$10,000', apr: '8.5%', status: 'Funded', date: '2026-10-15' },
    { key: '2', id: 'L-88393', borrower: 'Elena Rodriguez', lender: 'FinTech Credit Union', amount: '$4,500', apr: '12.0%', status: 'Delinquent', date: '2026-09-01' },
    { key: '3', id: 'L-88394', borrower: 'Sarah Jenkins', lender: 'DashDrive Internal', amount: '$15,000', apr: '7.0%', status: 'Pending', date: '2026-10-24' },
  ];

  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={2} style={{ margin: 0, color: '#ffffff' }}>Global Loans Ledger</Title>
          <Text type="secondary">System-wide oversight of all credit facilities initiated across the DashDrive ecosystem.</Text>
        </Col>
        <Col>
          <Space>
            <Input prefix={<SearchOutlined />} placeholder="Search by Loan ID or Borrower..." style={{ width: 300 }} />
          </Space>
        </Col>
      </Row>

      <Table 
        columns={columns} 
        dataSource={data} 
        style={{ background: '#1f1f1f', borderRadius: 8 }}
      />

      <Drawer
        title={<span style={{ color: '#fff' }}>Loan Audit: {selectedLoan?.id}</span>}
        placement="right"
        width={600}
        onClose={() => setOpen(false)}
        open={open}
        style={{ background: '#141414', color: '#fff' }}
        headerStyle={{ borderBottom: '1px solid #303030' }}
      >
        {selectedLoan && (
          <Descriptions title={<span style={{ color: '#fff' }}>Loan Details</span>} column={2} bordered size="small" style={{ marginBottom: 24 }}>
            <Descriptions.Item label="Borrower" labelStyle={{ color: '#8c8c8c' }} contentStyle={{ color: '#fff' }}>{selectedLoan.borrower}</Descriptions.Item>
            <Descriptions.Item label="Lending Partner" labelStyle={{ color: '#8c8c8c' }} contentStyle={{ color: '#fff' }}>{selectedLoan.lender}</Descriptions.Item>
            <Descriptions.Item label="Principal Amount" labelStyle={{ color: '#8c8c8c' }} contentStyle={{ color: '#fff' }}>{selectedLoan.amount}</Descriptions.Item>
            <Descriptions.Item label="Interest Rate (APR)" labelStyle={{ color: '#8c8c8c' }} contentStyle={{ color: '#fff' }}>{selectedLoan.apr}</Descriptions.Item>
            <Descriptions.Item label="Current Status" span={2} labelStyle={{ color: '#8c8c8c' }} contentStyle={{ color: '#fff' }}>
              <Tag color={selectedLoan.status === 'Funded' ? 'success' : selectedLoan.status === 'Delinquent' ? 'error' : 'warning'}>{selectedLoan.status}</Tag>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>
    </div>
  );
};
