import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Tag, 
  Button, 
  Space, 
  Typography, 
  Card, 
  Modal, 
  Image, 
  Descriptions, 
  message,
  Empty
} from 'antd';
import { 
  CheckCircleOutlined, 
  CloseCircleOutlined, 
  FileSearchOutlined,
  IdcardOutlined
} from '@ant-design/icons';
import { adminApi } from '../api/adminApi';

const { Title, Text } = Typography;

export const DriverVerificationPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [riders, setRiders] = useState<any[]>([]);
  const [selectedRider, setSelectedRider] = useState<any>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getPendingRiders();
      setRiders(res.data || []);
    } catch (err) {
      console.error(err);
      // Mock data for demo
      setRiders([
        { 
          id: 'DRV-101', 
          name: 'John Banda', 
          phone: '+260971234567', 
          vehicleType: 'Motorcycle', 
          licensePlate: 'BCD 1234',
          idImageUrl: 'https://picsum.photos/seed/id/400/250',
          licenseImageUrl: 'https://picsum.photos/seed/license/400/250',
          insuranceImageUrl: 'https://picsum.photos/seed/ins/400/250',
          createdAt: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (status: 'APPROVED' | 'REJECTED') => {
    try {
      await adminApi.verifyRider(selectedRider.id, status);
      message.success(`Rider ${status.toLowerCase()} successfully`);
      setIsModalVisible(false);
      fetchPending();
    } catch (err) {
      message.error('Action failed');
    }
  };

  const columns = [
    { title: 'Date Applied', dataIndex: 'createdAt', key: 'createdAt', render: (d: string) => new Date(d).toLocaleDateString() },
    { title: 'Name', dataIndex: 'name', key: 'name', render: (text: string) => <Text strong>{text}</Text> },
    { title: 'Phone', dataIndex: 'phone', key: 'phone' },
    { title: 'Vehicle', dataIndex: 'vehicleType', key: 'vehicleType', render: (v: string) => <Tag color="blue">{v}</Tag> },
    { title: 'License Plate', dataIndex: 'licensePlate', key: 'licensePlate' },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: any) => (
        <Button 
          icon={<FileSearchOutlined />} 
          onClick={() => { setSelectedRider(record); setIsModalVisible(true); }}
        >
          Review Documents
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: '0 0 24px 0' }}>
      <Title level={4} style={{ marginBottom: 24 }}>Driver KYC & Verification</Title>
      
      <Card bordered={false} className="shadow-sm">
        <Table 
          columns={columns} 
          dataSource={riders} 
          loading={loading} 
          rowKey="id"
          locale={{ emptyText: <Empty description="No pending verifications" /> }}
        />
      </Card>

      <Modal
        title={selectedRider ? `Verify: ${selectedRider.name}` : 'Rider Review'}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        width={800}
        footer={[
          <Button key="reject" danger icon={<CloseCircleOutlined />} onClick={() => handleVerify('REJECTED')}>Reject</Button>,
          <Button key="approve" type="primary" icon={<CheckCircleOutlined />} onClick={() => handleVerify('APPROVED')}>Approve Rider</Button>,
        ]}
      >
        {selectedRider && (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Descriptions bordered size="small" column={2}>
              <Descriptions.Item label="Rider ID">{selectedRider.id}</Descriptions.Item>
              <Descriptions.Item label="Vehicle">{selectedRider.vehicleType}</Descriptions.Item>
              <Descriptions.Item label="Phone">{selectedRider.phone}</Descriptions.Item>
              <Descriptions.Item label="License Plate">{selectedRider.licensePlate}</Descriptions.Item>
            </Descriptions>

            <div>
              <Title level={5}><IdcardOutlined /> Documents</Title>
              <Space size="middle" wrap>
                <div style={{ textAlign: 'center' }}>
                  <Text type="secondary">National ID</Text><br />
                  <Image src={selectedRider.idImageUrl} width={220} fallback="https://via.placeholder.com/220x140?text=ID+Image" />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <Text type="secondary">Driving License</Text><br />
                  <Image src={selectedRider.licenseImageUrl} width={220} fallback="https://via.placeholder.com/220x140?text=License+Image" />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <Text type="secondary">Vehicle Insurance</Text><br />
                  <Image src={selectedRider.insuranceImageUrl} width={220} fallback="https://via.placeholder.com/220x140?text=Insurance+Image" />
                </div>
              </Space>
            </div>
          </Space>
        )}
      </Modal>
    </div>
  );
};
