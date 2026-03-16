import React, { useState } from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Typography, 
  Steps, 
  Form, 
  Input, 
  Select, 
  Button, 
  Upload, 
  InputNumber,
  Divider,
} from 'antd';
import { 
  CarOutlined, 
  CameraOutlined, 
  SettingOutlined, 
  SafetyOutlined,
  CheckCircleOutlined,
  LeftOutlined,
  RightOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';

const { Title, Text } = Typography;
const { Option } = Select;

const CreateListing: React.FC = () => {
  const [current, setCurrent] = useState(0);

  const steps = [
    { title: 'Vehicle Info', icon: <CarOutlined /> },
    { title: 'Specifications', icon: <SettingOutlined /> },
    { title: 'Photos', icon: <CameraOutlined /> },
    { title: 'Done', icon: <CheckCircleOutlined /> },
  ];

  const next = () => setCurrent(current + 1);
  const prev = () => setCurrent(current - 1);

  return (
    <div className="max-w-[800px] mx-auto py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Title level={2} className="!font-black text-center mb-12 text-4xl">List your vehicle</Title>
        
        <Card bordered={false} className="shadow-2xl rounded-[2.5rem] overflow-hidden">
          <div className="p-8">
            <Steps 
              current={current} 
              items={steps} 
              className="mb-12 custom-steps"
            />

            <Form layout="vertical" className="mt-8">
              {current === 0 && (
                <div className="space-y-4">
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item label={<Text className="text-[11px] font-black uppercase tracking-widest text-gray-400">Make</Text>}>
                        <Input placeholder="e.g. Toyota" className="h-12 rounded-xl" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label={<Text className="text-[11px] font-black uppercase tracking-widest text-gray-400">Model</Text>}>
                        <Input placeholder="e.g. Corolla" className="h-12 rounded-xl" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item label={<Text className="text-[11px] font-black uppercase tracking-widest text-gray-400">Year</Text>}>
                        <Select placeholder="Select year" className="h-12 w-full">
                          {[2026, 2025, 2024, 2023].map(y => <Option key={y} value={y}>{y}</Option>)}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label={<Text className="text-[11px] font-black uppercase tracking-widest text-gray-400">License Plate</Text>}>
                        <Input placeholder="e.g. ABC123" className="h-12 rounded-xl" />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
              )}

              {current === 1 && (
                <div className="space-y-4">
                  <Row gutter={16}>
                    <Col span={8}>
                      <Form.Item label={<Text className="text-[11px] font-black uppercase tracking-widest text-gray-400">Seats</Text>}>
                        <InputNumber min={2} max={10} className="w-full h-12 rounded-xl leading-[48px]" />
                      </Form.Item>
                    </Col>
                    <Col span={16}>
                      <Form.Item label={<Text className="text-[11px] font-black uppercase tracking-widest text-gray-400">Fuel Type</Text>}>
                        <Select placeholder="Select fuel type" className="h-12 w-full">
                          <Option value="petrol">Petrol</Option>
                          <Option value="hybrid">Hybrid</Option>
                          <Option value="electric">Electric</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Form.Item label={<Text className="text-[11px] font-black uppercase tracking-widest text-gray-400">Description</Text>}>
                    <Input.TextArea placeholder="Tell guests about your car..." className="rounded-xl p-4" rows={4} />
                  </Form.Item>
                </div>
              )}

              {current === 2 && (
                <div className="text-center py-12">
                   <div className="mb-6 w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto text-3xl">
                      <CameraOutlined />
                   </div>
                   <Title level={4} className="font-black">Upload high-quality photos</Title>
                   <Text type="secondary" className="block mb-8">Listings with 10+ photos earn 2.5x more.</Text>
                   <Upload.Dragger className="rounded-3xl border-dashed bg-gray-50 p-12 overflow-hidden">
                      <p className="ant-upload-text font-bold">Drag files or click to upload</p>
                      <p className="ant-upload-hint">Upload front, side, and interior shots</p>
                   </Upload.Dragger>
                </div>
              )}

              {current === 3 && (
                <div className="text-center py-12">
                   <div className="mb-6 w-24 h-24 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto text-4xl">
                      <CheckCircleOutlined />
                   </div>
                   <Title level={4} className="font-black">Ready to list!</Title>
                   <Text type="secondary" className="block max-w-[300px] mx-auto text-center">
                     Our team will review your listing and it should be live within 24 hours.
                   </Text>
                   <Divider className="my-8" />
                   <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex gap-4 text-left">
                      <SafetyOutlined className="text-blue-600 text-xl" />
                      <div>
                        <Text strong className="text-blue-900 block">Insurance protected</Text>
                        <Text className="text-blue-700/80 text-xs">Your car is covered by our partner Travelers Insurance.</Text>
                      </div>
                   </div>
                </div>
              )}

              <div className="mt-12 flex justify-between">
                {current > 0 ? (
                  <Button size="large" className="h-12 px-8 rounded-xl font-bold" onClick={prev} icon={<LeftOutlined />}>
                    Back
                  </Button>
                ) : <div />}
                
                {current < steps.length - 1 ? (
                  <Button type="primary" size="large" className="h-12 px-8 rounded-xl font-bold bg-blue-600" onClick={next}>
                    Next <RightOutlined />
                  </Button>
                ) : (
                  <Button type="primary" size="large" className="h-12 px-8 rounded-xl font-bold bg-blue-600" onClick={() => window.location.href = '/host'}>
                    Submit Listing
                  </Button>
                )}
              </div>
            </Form>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default CreateListing;
