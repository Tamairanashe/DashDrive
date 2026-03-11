import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Typography, Space, Tag, message, Row, Col, Modal, Image } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, EyeOutlined, IdcardOutlined } from '@ant-design/icons';
import { adminApi } from '../../api/adminApi';

const { Title, Text } = Typography;

export const KycVerification: React.FC = () => {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSub, setSelectedSub] = useState<any>(null);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const res = await adminApi.fintech.kyc.listSubmissions();
      setSubmissions(res.data || []);
    } catch (err) {
      message.error('Failed to fetch KYC submissions');
      // Mock data
      setSubmissions([
        { id: '1', user_name: 'John Doe', document_type: 'passport', document_url: 'https://via.placeholder.com/400x600', status: 'pending', submitted_at: '2023-10-25' },
        { id: '2', user_name: 'Jane Smith', document_type: 'national_id', document_url: 'https://via.placeholder.com/600x400', status: 'pending', submitted_at: '2023-10-26' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleVerify = async (id: string, status: 'verified' | 'rejected') => {
    try {
      await adminApi.fintech.kyc.verify(id, status);
      message.success(`Submission ${status} successfully`);
      fetchSubmissions();
    } catch (err) {
      message.error('Failed to update verification status');
    }
  };

  const columns = [
    { title: 'User Name', dataIndex: 'user_name', key: 'user_name' },
    { title: 'Document Type', dataIndex: 'document_type', key: 'document_type', render: (t: string) => <Tag color="orange">{t.toUpperCase()}</Tag> },
    { title: 'Submitted At', dataIndex: 'submitted_at', key: 'submitted_at' },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'pending' ? 'gold' : 'green'}>{status.toUpperCase()}</Tag>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button 
            icon={<EyeOutlined />} 
            size="small" 
            onClick={() => { setSelectedSub(record); setIsPreviewVisible(true); }}
          >
            Review
          </Button>
          <Button 
            type="primary" 
            ghost 
            icon={<CheckCircleOutlined />} 
            size="small" 
            onClick={() => handleVerify(record.id, 'verified')}
          >
            Approve
          </Button>
          <Button 
            danger 
            ghost 
            icon={<CloseCircleOutlined />} 
            size="small" 
            onClick={() => handleVerify(record.id, 'rejected')}
          >
            Reject
          </Button>
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: 24 }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={3}><IdcardOutlined /> KYC Compliance Dashboard</Title>
          <Text type="secondary">Review national IDs and passports for wallet activation.</Text>
        </Col>
      </Row>

      <Card className="shadow-sm">
        <Table 
          columns={columns} 
          dataSource={submissions} 
          rowKey="id" 
          loading={loading}
        />
      </Card>

      <Modal
        title={`Review Document: ${selectedSub?.user_name}`}
        visible={isPreviewVisible}
        onCancel={() => setIsPreviewVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsPreviewVisible(false)}>Close</Button>,
          <Button key="approve" type="primary" onClick={() => { handleVerify(selectedSub.id, 'verified'); setIsPreviewVisible(false); }}>Approve</Button>
        ]}
        width={800}
      >
        {selectedSub && (
          <div style={{ textAlign: 'center' }}>
            <Text strong>Type: {selectedSub.document_type.toUpperCase()}</Text>
            <div style={{ marginTop: 16 }}>
              <Image src={selectedSub.document_url} width="100%" alt="KYC Document" />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
