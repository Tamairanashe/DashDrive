import React, { useState } from 'react';
import { Typography, Row, Col, Table, Tag, Button, Space, Modal, Descriptions, Card, Statistic, Steps, message } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, FileSearchOutlined, ExclamationCircleOutlined, UploadOutlined, AlertOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface Claim {
  id: string;
  user: string;
  policy: string;
  incidentType: string;
  claimAmount: number;
  status: string;
  date: string;
  description: string;
  tripId: string;
  location: string;
  time: string;
  driverRating: number;
  hasPhotos: boolean;
  hasDriverStatement: boolean;
  hasPoliceReport: boolean;
  hasTripData: boolean;
}

export const ClaimsPage: React.FC = () => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);

  const statusSteps: Record<string, number> = { Submitted: 0, Investigating: 1, Approved: 2, Paid: 3, Rejected: 2 };

  const [claims, setClaims] = useState<Claim[]>([
    { id: 'CLM-2001', user: 'Driver Alex', policy: 'Accident Cover', incidentType: 'Vehicle Accident', claimAmount: 2500, status: 'Submitted', date: '2026-03-08', description: 'Rear-end collision at Samora Machel intersection during rush hour.', tripId: 'TRIP-8821', location: 'Samora Machel Ave, Harare', time: '17:45', driverRating: 4.8, hasPhotos: true, hasDriverStatement: true, hasPoliceReport: true, hasTripData: true },
    { id: 'CLM-2002', user: 'Driver Sarah', policy: 'Vehicle Damage', incidentType: 'Vandalism', claimAmount: 1200, status: 'Investigating', date: '2026-03-06', description: 'Vehicle window smashed and belongings stolen while parked overnight.', tripId: 'N/A', location: 'CBD Parking Lot, Bulawayo', time: '06:30', driverRating: 4.6, hasPhotos: true, hasDriverStatement: true, hasPoliceReport: false, hasTripData: false },
    { id: 'CLM-2003', user: 'Rider Mike', policy: 'Trip Protection', incidentType: 'Injury', claimAmount: 800, status: 'Approved', date: '2026-03-03', description: 'Minor injury when vehicle hit a pothole at speed.', tripId: 'TRIP-9012', location: 'Herbert Chitepo St', time: '14:20', driverRating: 4.2, hasPhotos: false, hasDriverStatement: true, hasPoliceReport: false, hasTripData: true },
    { id: 'CLM-2004', user: 'Driver Tino', policy: 'Accident Cover', incidentType: 'Theft', claimAmount: 9500, status: 'Rejected', date: '2026-02-28', description: 'Vehicle theft reported — GPS data contradicts claim timeline.', tripId: 'N/A', location: 'Unknown', time: 'N/A', driverRating: 3.9, hasPhotos: false, hasDriverStatement: true, hasPoliceReport: true, hasTripData: false },
    { id: 'CLM-2005', user: 'Driver Grace', policy: 'Vehicle Damage', incidentType: 'Flood Damage', claimAmount: 4000, status: 'Paid', date: '2026-02-15', description: 'Vehicle submerged during Cyclone Freddy heavy rains.', tripId: 'N/A', location: 'Warren Park D, Harare', time: '21:00', driverRating: 4.9, hasPhotos: true, hasDriverStatement: true, hasPoliceReport: true, hasTripData: false },
  ]);

  const statusColors: Record<string, string> = { Submitted: 'gold', Investigating: 'blue', Approved: 'green', Rejected: 'red', Paid: 'purple' };

  const updateClaim = (id: string, status: string) => { setClaims(c => c.map(cl => cl.id === id ? { ...cl, status } : cl)); message.success(`Claim ${id} → ${status}`); };

  const columns = [
    { title: 'Claim ID', dataIndex: 'id', render: (t: string) => <Text strong>{t}</Text> },
    { title: 'User', dataIndex: 'user' },
    { title: 'Policy', dataIndex: 'policy', render: (t: string) => <Tag color="purple">{t}</Tag> },
    { title: 'Incident', dataIndex: 'incidentType' },
    { title: 'Amount', dataIndex: 'claimAmount', render: (v: number) => `$${v.toLocaleString()}` },
    { title: 'Status', dataIndex: 'status', render: (s: string) => <Tag color={statusColors[s]}>{s}</Tag> },
    { title: 'Date', dataIndex: 'date' },
    {
      title: 'Actions',
      render: (_: any, record: Claim) => (
        <Space>
          <Button size="small" icon={<FileSearchOutlined />} onClick={() => { setSelectedClaim(record); setIsDetailsOpen(true); }}>Review</Button>
          {record.status === 'Submitted' && <Button size="small" type="default" onClick={() => updateClaim(record.id, 'Investigating')}>Investigate</Button>}
          {['Submitted', 'Investigating'].includes(record.status) && (
            <>
              <Button size="small" type="primary" icon={<CheckCircleOutlined />} onClick={() => updateClaim(record.id, 'Approved')}>Approve</Button>
              <Button size="small" danger icon={<CloseCircleOutlined />} onClick={() => updateClaim(record.id, 'Rejected')}>Reject</Button>
            </>
          )}
          {record.status === 'Approved' && <Button size="small" style={{ color: '#722ed1', borderColor: '#722ed1' }} onClick={() => updateClaim(record.id, 'Paid')}>Pay Claim</Button>}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={6}><Card bordered={false}><Statistic title="Total Claims" value={claims.length} /></Card></Col>
        <Col span={6}><Card bordered={false}><Statistic title="Pending" value={claims.filter(c => ['Submitted', 'Investigating'].includes(c.status)).length} valueStyle={{ color: '#faad14' }} /></Card></Col>
        <Col span={6}><Card bordered={false}><Statistic title="Approved / Paid" value={claims.filter(c => ['Approved', 'Paid'].includes(c.status)).length} valueStyle={{ color: '#52c41a' }} /></Card></Col>
        <Col span={6}><Card bordered={false}><Statistic title="Total Claim Value" value={claims.reduce((s, c) => s + c.claimAmount, 0)} prefix="$" valueStyle={{ color: '#722ed1' }} /></Card></Col>
      </Row>

      <Title level={4}>Claims Queue</Title>
      <Table columns={columns} dataSource={claims} rowKey="id" scroll={{ x: 1100 }} />

      <Modal title={`Claim ${selectedClaim?.id}`} open={isDetailsOpen} onCancel={() => setIsDetailsOpen(false)} footer={null} width={700}>
        {selectedClaim && (
          <div>
            {/* Workflow Steps */}
            <Card bordered={false} style={{ marginBottom: 16, background: '#fafafa' }}>
              <Steps
                current={statusSteps[selectedClaim.status] ?? 0}
                status={selectedClaim.status === 'Rejected' ? 'error' : 'process'}
                items={[
                  { title: 'Submitted' },
                  { title: 'Verification' },
                  { title: selectedClaim.status === 'Rejected' ? 'Rejected' : 'Approved' },
                  { title: 'Paid' },
                ]}
              />
            </Card>

            <Descriptions bordered column={2} size="small" title="Incident Information" style={{ marginBottom: 16 }}>
              <Descriptions.Item label="Type">{selectedClaim.incidentType}</Descriptions.Item>
              <Descriptions.Item label="Claim Amount">${selectedClaim.claimAmount.toLocaleString()}</Descriptions.Item>
              <Descriptions.Item label="Trip ID">{selectedClaim.tripId}</Descriptions.Item>
              <Descriptions.Item label="Location">{selectedClaim.location}</Descriptions.Item>
              <Descriptions.Item label="Time">{selectedClaim.time}</Descriptions.Item>
              <Descriptions.Item label="Date">{selectedClaim.date}</Descriptions.Item>
              <Descriptions.Item label="Description" span={2}>{selectedClaim.description}</Descriptions.Item>
            </Descriptions>
            <Descriptions bordered column={2} size="small" title="Evidence & Documents" style={{ marginBottom: 16 }}>
              <Descriptions.Item label="📷 Photos">{selectedClaim.hasPhotos ? <Tag color="green">Uploaded</Tag> : <Tag color="red">Missing</Tag>}</Descriptions.Item>
              <Descriptions.Item label="📝 Driver Statement">{selectedClaim.hasDriverStatement ? <Tag color="green">Provided</Tag> : <Tag color="red">Missing</Tag>}</Descriptions.Item>
              <Descriptions.Item label="🚔 Police Report">{selectedClaim.hasPoliceReport ? <Tag color="green">Filed</Tag> : <Tag color="orange">Not Filed</Tag>}</Descriptions.Item>
              <Descriptions.Item label="📍 Trip Data">{selectedClaim.hasTripData ? <Tag color="green">Available</Tag> : <Tag color="default">N/A</Tag>}</Descriptions.Item>
              <Descriptions.Item label="Driver Rating">{selectedClaim.driverRating} ⭐</Descriptions.Item>
              <Descriptions.Item label="Status"><Tag color={statusColors[selectedClaim.status]}>{selectedClaim.status}</Tag></Descriptions.Item>
            </Descriptions>

            <Space style={{ marginTop: 16 }}>
              {['Submitted', 'Investigating'].includes(selectedClaim.status) && (
                <>
                  <Button type="primary" icon={<CheckCircleOutlined />} onClick={() => { updateClaim(selectedClaim.id, 'Approved'); setIsDetailsOpen(false); }}>Approve Claim</Button>
                  <Button danger icon={<CloseCircleOutlined />} onClick={() => { updateClaim(selectedClaim.id, 'Rejected'); setIsDetailsOpen(false); }}>Reject Claim</Button>
                  <Button icon={<UploadOutlined />}>Request Evidence</Button>
                  <Button icon={<AlertOutlined />} style={{ color: '#ff4d4f', borderColor: '#ff4d4f' }}>Escalate Investigation</Button>
                </>
              )}
              {selectedClaim.status === 'Approved' && <Button type="primary" style={{ background: '#722ed1' }} onClick={() => { updateClaim(selectedClaim.id, 'Paid'); setIsDetailsOpen(false); }}>Process Payout</Button>}
            </Space>
          </div>
        )}
      </Modal>
    </div>
  );
};
