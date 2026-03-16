import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Typography, Space, Tag, message, Row, Col, Drawer, Image } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, EyeOutlined, IdcardOutlined } from '@ant-design/icons';
import { adminApi } from '../../api/adminApi';

const { Title, Text } = Typography;

export const KycVerification: React.FC = () => {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSub, setSelectedSub] = useState<any>(null);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);

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
            onClick={() => { setSelectedSub(record); setIsDrawerVisible(true); }}
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
          <Title level={3} style={{ margin: 0 }}><IdcardOutlined /> KYC Compliance Dashboard</Title>
          <Text type="secondary">Review national IDs and passports for wallet activation.</Text>
        </Col>
      </Row>

      <Card style={{ borderRadius: 16, border: '1px solid #e2e8f0' }}>
        <Table 
          columns={columns} 
          dataSource={submissions} 
          rowKey="id" 
          loading={loading}
        />
      </Card>

      <Drawer
        title={<Space><EyeOutlined /> Review Document: {selectedSub?.user_name}</Space>}
        open={isDrawerVisible}
        onClose={() => setIsDrawerVisible(false)}
        width={700}
        extra={
          <Space>
            <Button onClick={() => setIsDrawerVisible(false)}>Close</Button>
            <Button type="primary" onClick={() => { handleVerify(selectedSub.id, 'verified'); setIsDrawerVisible(false); }} style={{ background: '#0e172a' }}>
              Approve Document
            </Button>
          </Space>
        }
      >
        {selectedSub && (
          <div style={{ padding: '8px 0' }}>
            <div style={{ marginBottom: 24, padding: 16, background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0' }}>
              <Row gutter={24}>
                <Col span={12}>
                  <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>User Name</Text>
                  <Text strong style={{ fontSize: 16 }}>{selectedSub.user_name}</Text>
                </Col>
                <Col span={12}>
                  <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>Document Type</Text>
                  <Tag color="orange" style={{ marginTop: 4 }}>{selectedSub.document_type.toUpperCase()}</Tag>
                </Col>
              </Row>
            </div>
            
            <Text strong style={{ display: 'block', marginBottom: 12 }}>ID Document Preview</Text>
            <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
              <Image src={selectedSub.document_url} width="100%" alt="KYC Document" />
            </div>

            <div style={{ marginTop: 32 }}>
              <Button 
                danger 
                block 
                size="large" 
                icon={<CloseCircleOutlined />} 
                onClick={() => { handleVerify(selectedSub.id, 'rejected'); setIsDrawerVisible(false); }}
                style={{ height: 48, borderRadius: 12 }}
              >
                Reject with Reason
              </Button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};
