import React, { useState, useEffect } from 'react';
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
  Form,
  Switch,
  InputNumber,
  Badge,
  Alert,
  Drawer,
  message,
  Select
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
  SaveOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import { PolygonF, MarkerF } from '@react-google-maps/api';
import { BaseMap, useBaseMap } from '../components/BaseMap';

const { Title, Text } = Typography;

interface Zone {
  id: string;
  name: string;
  status: 'Active' | 'Inactive';
  points: {lat: number, lng: number}[];
  volume: string;
  extraFare: boolean;
  farePercent?: number;
}

const INITIAL_ZONES: Zone[] = [
  { id: '1', name: 'Dhanmondi', volume: 'High', extraFare: true, status: 'Active', points: [{lat: 23.7516, lng: 90.3704}, {lat: 23.7556, lng: 90.3804}, {lat: 23.7456, lng: 90.3854}, {lat: 23.7406, lng: 90.3754}], farePercent: 20 },
  { id: '2', name: 'Gulshan', volume: 'Medium', extraFare: false, status: 'Active', points: [{lat: 23.7925, lng: 90.4078}, {lat: 23.7985, lng: 90.4178}, {lat: 23.7885, lng: 90.4228}, {lat: 23.7825, lng: 90.4128}] },
];

const MapEvents = ({ onMapClick }: { onMapClick: (latlng: {lat: number, lng: number}) => void }) => {
  const { map } = useBaseMap();
  useEffect(() => {
    if (!map) return;
    const listener = map.addListener('click', (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        onMapClick({ lat: e.latLng.lat(), lng: e.latLng.lng() });
      }
    });
    return () => google.maps.event.removeListener(listener);
  }, [map, onMapClick]);
  return null;
};

export const ZoneSetupPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Setup');
  const [zones, setZones] = useState<Zone[]>(INITIAL_ZONES);
  const [drawingPoints, setDrawingPoints] = useState<{lat: number, lng: number}[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingZone, setEditingZone] = useState<Zone | null>(null);
  const [form] = Form.useForm();

  const columns = [
    { title: 'Zone Name', dataIndex: 'name', key: 'name', render: (text: string) => <Text strong>{text}</Text> },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (status: string) => <Tag color={status === 'Active' ? 'green' : 'default'}>{status}</Tag> },
    { title: 'Volume', dataIndex: 'volume', key: 'volume', render: (v: string) => <Tag color="blue">{v}</Tag> },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Zone) => (
        <Space>
          <Button type="text" icon={<EditOutlined />} onClick={() => {
            setEditingZone(record);
            form.setFieldsValue(record);
            setIsDrawerOpen(true);
          }} />
          <Button type="text" icon={<DeleteOutlined />} danger onClick={() => setZones(prev => prev.filter(z => z.id !== record.id))} />
        </Space>
      ),
    },
  ];

  const handleMapClick = (latlng: {lat: number, lng: number}) => {
    if (activeTab === 'Setup') {
      setDrawingPoints(prev => [...prev, latlng]);
    }
  };

  const handleSaveZone = (values: any) => {
    if (editingZone) {
      setZones(prev => prev.map(z => z.id === editingZone.id ? { ...z, ...values } : z));
      message.success('Zone updated');
    } else {
      const newZone: Zone = {
        id: Math.random().toString(36).substr(2, 9),
        name: values.name,
        status: 'Active',
        points: [...drawingPoints],
        volume: 'Low',
        extraFare: values.extraFare,
        farePercent: values.farePercent
      };
      setZones(prev => [newZone, ...prev]);
      message.success('Zone created');
    }
    setDrawingPoints([]);
    setIsDrawerOpen(false);
    setEditingZone(null);
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
            <Button type="primary" icon={<PlusOutlined />} onClick={() => {
              setDrawingPoints([]);
              setActiveTab('Setup');
            }}>New Boundary</Button>
          </Space>
        </Col>
      </Row>

      <Row gutter={24}>
        <Col span={16}>
          <Card 
            styles={{ body: { padding: 0, height: 500, position: 'relative' } }} 
            bordered={false}
            style={{ borderRadius: 16, overflow: 'hidden' }}
          >
            <BaseMap
              center={[23.8103, 90.4125]}
              zoom={13}
              height={500}
            >
              <MapEvents onMapClick={handleMapClick} />
              
              {zones.map(zone => (
                <PolygonF 
                  key={zone.id} 
                  path={zone.points} 
                  options={{ 
                    strokeColor: zone.status === 'Active' ? '#10b981' : '#94a3b8', 
                    strokeWeight: 2,
                    fillOpacity: 0.2, 
                    fillColor: zone.status === 'Active' ? '#10b981' : '#94a3b8' 
                  }} 
                />
              ))}

              {drawingPoints.length > 0 && (
                <PolygonF 
                  path={drawingPoints} 
                  options={{ 
                    strokeColor: '#3b82f6', 
                    strokeOpacity: 0.8, 
                    strokeWeight: 2,
                    fillOpacity: 0.2, 
                    fillColor: '#3b82f6' 
                  }} 
                />
              )}
              {drawingPoints.map((p, i) => (
                <MarkerF key={i} position={p} />
              ))}
            </BaseMap>

            {drawingPoints.length >= 3 && (activeTab === 'Setup') && (
              <div style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 1000 }}>
                <Button type="primary" size="large" icon={<SaveOutlined />} onClick={() => {
                  setEditingZone(null);
                  setIsDrawerOpen(true);
                }}>
                  Confirm & Define Area
                </Button>
              </div>
            )}

            <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 1000 }}>
              <Space orientation="vertical">
                <Button 
                  icon={<PlusOutlined />} 
                  onClick={() => setActiveTab('Setup')} 
                  type={activeTab === 'Setup' ? 'primary' : 'default'} 
                  title="Drawing Mode"
                />
                <Button 
                  icon={<CompassOutlined />} 
                  onClick={() => setActiveTab('View')} 
                  type={activeTab === 'View' ? 'primary' : 'default'} 
                  title="View Mode"
                />
              </Space>
            </div>
          </Card>
          
          <div style={{ marginTop: 24 }}>
            <Card title={<Space><InfoCircleOutlined style={{ color: '#10b981' }} /> Instructions</Space>} bordered={false} className="shadow-sm" style={{ borderRadius: 12 }}>
              <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
                <div style={{ display: 'flex', gap: 12 }}>
                  <Text type="secondary" style={{ width: 24, height: 24, borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>1</Text>
                  <div>
                    <Text strong>Create zone by click on map and connect the dots together</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 13 }}>Define the service area boundaries by placing markers precisely where you want the geofence to exist.</Text>
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: 12 }}>
                  <div style={{ width: 24, height: 24, borderRadius: 4, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <CompassOutlined style={{ fontSize: 14 }} />
                  </div>
                  <div>
                    <Text strong>Use this to drag map to find proper area</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 13 }}>Navigate through different clusters and cities by panning the map with your cursor.</Text>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 12 }}>
                  <div style={{ width: 24, height: 24, borderRadius: 4, background: '#0e172a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <PlusOutlined style={{ fontSize: 14 }} />
                  </div>
                  <div>
                    <Text strong>Click this icon to start pin points in the map and connect them to draw a zone</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 13 }}>Minimum 3 points are required to form a closed polygon. Once complete, define the logic in the setup drawer.</Text>
                  </div>
                </div>
              </Space>
            </Card>
          </div>
        </Col>

        <Col span={8}>
          <Card bordered={false} styles={{ body: { padding: 0 } }}>
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

      <Drawer
        title={editingZone ? "Edit Operational Zone" : "Define New Operational Zone"}
        open={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setEditingZone(null);
        }}
        width={450}
        extra={<Button type="primary" onClick={() => form.submit()}>Save Zone</Button>}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSaveZone} initialValues={{ extraFare: false }}>
          <Form.Item label="Zone Name" name="name" rules={[{ required: true, message: 'Please enter zone name' }]}>
            <Input placeholder="Ex: Downtown Harare" />
          </Form.Item>
          {editingZone && (
            <Form.Item label="Status" name="status">
              <Select options={[{ value: 'Active', label: 'Active' }, { value: 'Inactive', label: 'Inactive' }]} />
            </Form.Item>
          )}
          <Form.Item label="Enable Surge Pricing" name="extraFare" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item 
            noStyle 
            shouldUpdate={(prev, curr) => prev.extraFare !== curr.extraFare}
          >
            {({ getFieldValue }) => getFieldValue('extraFare') && (
              <Form.Item label="Surge Percentage" name="farePercent">
                <InputNumber min={0} max={100} formatter={value => `${value}%`} style={{ width: '100%' }} />
              </Form.Item>
            )}
          </Form.Item>
          <Alert
            message="Dynamic Pricing"
            description="Enabling surge pricing in this zone will automatically apply a multiplier to all services within the boundary."
            type="warning"
            showIcon
            icon={<WarningOutlined />}
            style={{ marginTop: 16 }}
          />
        </Form>
      </Drawer>
    </div>
  );
};

