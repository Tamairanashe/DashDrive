import React, { useState, useRef } from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Typography, 
  Tabs, 
  Input, 
  Button, 
  Space, 
  Tag, 
  Table,
  Modal,
  Form,
  Switch,
  InputNumber,
  Badge,
  Alert
} from 'antd';
import { 
  PlusOutlined, 
  SearchOutlined, 
  DeleteOutlined, 
  EditOutlined, 
  HistoryOutlined,
  GlobalOutlined,
  CompassOutlined,
  WarningOutlined,
  SaveOutlined
} from '@ant-design/icons';
import { MapContainer, TileLayer, Polygon, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const { Title, Text } = Typography;

interface Zone {
  id: string;
  name: string;
  status: 'Active' | 'Inactive';
  points: [number, number][];
  volume: string;
  extraFare: boolean;
}

const INITIAL_ZONES: Zone[] = [
  { id: '1', name: 'Dhanmondi', volume: 'High', extraFare: true, status: 'Active', points: [[23.7516, 90.3704], [23.7556, 90.3804], [23.7456, 90.3854], [23.7406, 90.3754]] },
  { id: '2', name: 'Gulshan', volume: 'Medium', extraFare: false, status: 'Active', points: [[23.7925, 90.4078], [23.7985, 90.4178], [23.7885, 90.4228], [23.7825, 90.4128]] },
];

const MapEvents = ({ onMapClick }: { onMapClick: (latlng: [number, number]) => void }) => {
  useMapEvents({
    click: (e) => onMapClick([e.latlng.lat, e.latlng.lng]),
  });
  return null;
};

export const ZoneSetupPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Setup');
  const [zones, setZones] = useState<Zone[]>(INITIAL_ZONES);
  const [drawingPoints, setDrawingPoints] = useState<[number, number][]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const columns = [
    { title: 'Zone Name', dataIndex: 'name', key: 'name', render: (text: string) => <Text strong>{text}</Text> },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (status: string) => <Tag color={status === 'Active' ? 'green' : 'default'}>{status}</Tag> },
    { title: 'Volume', dataIndex: 'volume', key: 'volume', render: (v: string) => <Tag color="blue">{v}</Tag> },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space>
          <Button type="text" icon={<EditOutlined />} />
          <Button type="text" icon={<DeleteOutlined />} danger />
        </Space>
      ),
    },
  ];

  const handleMapClick = (latlng: [number, number]) => {
    if (activeTab === 'Setup') {
      setDrawingPoints(prev => [...prev, latlng]);
    }
  };

  const handleSaveZone = (values: any) => {
    const newZone: Zone = {
      id: Math.random().toString(36).substr(2, 9),
      name: values.name,
      status: 'Active',
      points: [...drawingPoints],
      volume: 'Low',
      extraFare: values.extraFare
    };
    setZones(prev => [newZone, ...prev]);
    setDrawingPoints([]);
    setIsModalOpen(false);
    form.resetFields();
  };

  return (
    <div style={{ padding: '0 0 24px 0' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={4} style={{ margin: 0 }}>Operational Zone Setup</Title>
          <Text type="secondary">Define geofences for service boundaries, surge pricing, and operational logic</Text>
        </Col>
        <Col>
          <Space>
            <Button icon={<HistoryOutlined />}>Activity Log</Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setDrawingPoints([])}>New Boundary</Button>
          </Space>
        </Col>
      </Row>

      <Row gutter={24}>
        <Col span={16}>
          <Card 
            bodyStyle={{ padding: 0, height: 500, position: 'relative' }} 
            bordered={false}
            style={{ borderRadius: 16, overflow: 'hidden' }}
          >
            <MapContainer
              center={[23.8103, 90.4125]}
              zoom={13}
              style={{ height: '100%', width: '100%' }}
              zoomControl={false}
            >
              <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png" />
              <MapEvents onMapClick={handleMapClick} />
              
              {zones.map(zone => (
                <Polygon 
                  key={zone.id} 
                  positions={zone.points} 
                  pathOptions={{ color: zone.status === 'Active' ? '#10b981' : '#94a3b8', fillOpacity: 0.2 }} 
                />
              ))}

              {drawingPoints.length > 0 && (
                <Polygon 
                  positions={drawingPoints} 
                  pathOptions={{ color: '#3b82f6', dashArray: '5, 10' }} 
                />
              )}
            </MapContainer>

            {drawingPoints.length >= 3 && (
              <div style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 1000 }}>
                <Button type="primary" size="large" icon={<SaveOutlined />} onClick={() => setIsModalOpen(true)}>
                  Confirm & Define Area
                </Button>
              </div>
            )}

            <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 1000 }}>
              <Space direction="vertical">
                <Button icon={<PlusOutlined />} />
                <Button icon={<CompassOutlined />} />
              </Space>
            </div>
          </Card>
          
          <div style={{ marginTop: 24 }}>
            <Alert
              message="Drawing Instructions"
              description="Click on the map to define the corners of your operational zone. You need at least 3 points to create a geofence. Once satisfied, click 'Confirm & Define Area' to save."
              type="info"
              showIcon
              icon={<GlobalOutlined />}
            />
          </div>
        </Col>

        <Col span={8}>
          <Card bordered={false} bodyStyle={{ padding: 0 }}>
            <div style={{ padding: '16px 24px', borderBottom: '1px solid #f1f5f9' }}>
              <Title level={5} style={{ margin: 0 }}>Existing Boundaries</Title>
            </div>
            <Table 
              columns={columns} 
              dataSource={zones} 
              pagination={{ pageSize: 5 }} 
              rowKey="id"
              size="middle"
            />
          </Card>
        </Col>
      </Row>

      <Modal
        title="Define New Operational Zone"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        okText="Save Zone"
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSaveZone} initialValues={{ extraFare: false }}>
          <Form.Item label="Zone Name" name="name" rules={[{ required: true, message: 'Please enter zone name' }]}>
            <Input placeholder="Ex: Downtown Harare" />
          </Form.Item>
          <Form.Item label="Enable Surge Pricing" name="extraFare" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item label="Surge Percentage" name="farePercent" hidden={!form.getFieldValue('extraFare')}>
            <InputNumber min={0} max={100} formatter={value => `${value}%`} />
          </Form.Item>
          <Alert
            message="Dynamic Pricing"
            description="Enabling surge pricing in this zone will automatically apply a multiplier to all services within the boundary."
            type="warning"
            showIcon
            icon={<WarningOutlined />}
          />
        </Form>
      </Modal>
    </div>
  );
};
