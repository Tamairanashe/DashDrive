import React, { useState } from 'react';
import { 
  Typography, 
  Steps, 
  Button, 
  Form, 
  Input, 
  Select, 
  Radio, 
  Upload, 
  Card, 
  Row, 
  Col, 
  Space, 
  Divider, 
  Result,
  Alert,
  Tooltip,
  InputNumber
} from 'antd';
import { 
  EnvironmentOutlined, 
  NumberOutlined, 
  CheckCircleOutlined, 
  SettingOutlined, 
  PictureOutlined, 
  DollarOutlined,
  CompassOutlined,
  DashboardOutlined,
  CarOutlined,
  SafetyOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  ArrowRightOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;
const { Step } = Steps;

const HostVehicleRegistration: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const next = () => setCurrentStep(currentStep + 1);
  const prev = () => setCurrentStep(currentStep - 1);

  const steps = [
    {
      title: 'Location',
      icon: <EnvironmentOutlined />,
    },
    {
      title: 'VIN',
      icon: <NumberOutlined />,
    },
    {
      title: 'Trim',
      icon: <SettingOutlined />,
    },
    {
      title: 'Details',
      icon: <DashboardOutlined />,
    },
    {
      title: 'Photos',
      icon: <PictureOutlined />,
    },
    {
      title: 'Listing',
      icon: <DollarOutlined />,
    },
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="max-w-2xl mx-auto text-center">
              <Title level={2} className="!font-black text-gray-800 mb-2">Where is your car located?</Title>
              <Paragraph className="text-gray-500 text-lg">
                We need your vehicle's home location to ensure we operate in your area and to help guests find you.
              </Paragraph>
              
              <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 mt-12 text-left">
                <Form.Item
                  name="location"
                  rules={[{ required: true, message: 'Please enter your car\'s location' }]}
                >
                  <Input 
                    size="large" 
                    placeholder="Enter street address, city, and zip code" 
                    className="h-16 rounded-2xl border-gray-200 focus:border-indigo-500 text-lg"
                    prefix={<CompassOutlined className="text-gray-400 mr-2" />}
                  />
                </Form.Item>
                
                <div className="h-48 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center mt-6">
                  <div className="text-center">
                    <EnvironmentOutlined className="text-3xl text-gray-300 mb-2" />
                    <Text className="text-gray-400 block">Map selection will appear here</Text>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="max-w-2xl mx-auto text-center">
              <Title level={2} className="!font-black text-gray-800 mb-2">Enter your VIN</Title>
              <Paragraph className="text-gray-500 text-lg">
                Your Vehicle Identification Number (VIN) helps us fetch accurate details about your car automatically.
              </Paragraph>

              <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 mt-12 text-left">
                <Form.Item
                  name="vin"
                  rules={[
                    { required: true, message: 'Please enter your 17-digit VIN' },
                    { pattern: /^[A-HJ-NPR-Z0-9]{17}$/i, message: 'Please enter a valid 17-digit VIN' }
                  ]}
                >
                  <Input 
                    size="large" 
                    placeholder="17-digit VIN" 
                    className="h-16 rounded-2xl border-gray-200 focus:border-indigo-500 text-lg uppercase tracking-widest font-mono"
                  />
                </Form.Item>
                
                <Alert
                  className="rounded-2xl bg-indigo-50 border-indigo-100 mb-6"
                  message={<Text className="text-indigo-800 font-bold">Where can I find my VIN?</Text>}
                  description={
                    <Text className="text-indigo-600/80 text-sm">
                      Check your car's dashboard (driver's side), door jamb, or insurance/registration documents.
                    </Text>
                  }
                  type="info"
                  showIcon
                  icon={<InfoCircleOutlined className="text-indigo-500" />}
                />

                <Form.Item name="olderThan1981" valuePropName="checked">
                  <Radio.Group className="flex items-center space-x-2">
                    <Radio value={true}>My vehicle is older than 1981</Radio>
                  </Radio.Group>
                </Form.Item>
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <Title level={2} className="!font-black text-gray-800 mb-2">Confirm vehicle details</Title>
                <Paragraph className="text-gray-500 text-lg">
                  We've identified your vehicle. Please verify the trim and style.
                </Paragraph>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 text-left">
                  <Title level={4} className="!font-black mb-6">Vehicle Info</Title>
                  <div className="space-y-4">
                    <div>
                      <Text className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-1">Make & Model</Text>
                      <Text className="text-xl font-bold text-gray-800">2012 Ford Mustang</Text>
                    </div>
                    <div>
                      <Text className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-1">VIN</Text>
                      <Text className="text-lg font-mono text-gray-600">1ZVBP8EM5C5227395</Text>
                    </div>
                  </div>
                  <Divider />
                  <Form.Item name="trim" label={<Text className="font-black text-gray-600 uppercase text-[10px] tracking-widest">Trim</Text>}>
                    <Select size="large" className="w-full" placeholder="Select trim" defaultValue="boss_302">
                      <Select.Option value="boss_302">Boss 302</Select.Option>
                      <Select.Option value="gt">GT</Select.Option>
                      <Select.Option value="v6">V6</Select.Option>
                    </Select>
                  </Form.Item>
                  <Form.Item name="style" label={<Text className="font-black text-gray-600 uppercase text-[10px] tracking-widest">Style</Text>}>
                    <Select size="large" className="w-full" placeholder="Select style" defaultValue="2dr_cpe">
                      <Select.Option value="2dr_cpe">2dr Cpe Boss 302</Select.Option>
                    </Select>
                  </Form.Item>
                </div>

                <div className="flex flex-col space-y-4">
                  <div className="bg-indigo-600 p-8 rounded-[2.5rem] shadow-xl text-white relative overflow-hidden">
                    <CarOutlined className="absolute -right-8 -bottom-8 text-9xl text-white/10 rotate-12" />
                    <Title level={4} className="!text-white !font-black mb-2">Premium Listing</Title>
                    <Paragraph className="text-indigo-100 text-sm">
                      This model is currently in high demand in your area. Hosts with this vehicle earn 20% more on average.
                    </Paragraph>
                    <div className="bg-white/20 p-3 rounded-2xl inline-block mt-4">
                      <Text className="text-white font-bold">Trending in San Francisco</Text>
                    </div>
                  </div>
                  
                  <div className="bg-amber-50 p-6 rounded-[2.5rem] border border-amber-100">
                    <div className="flex items-start">
                      <SafetyOutlined className="text-2xl text-amber-500 mr-3 mt-1" />
                      <div>
                        <Text className="font-bold text-amber-800 block">Verified Vehicle</Text>
                        <Text className="text-amber-700/70 text-sm">
                          Once confirmed, some vehicle details cannot be changed to ensure trust on the platform.
                        </Text>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="max-w-2xl mx-auto text-center">
              <Title level={2} className="!font-black text-gray-800 mb-2">Odometer & Transmission</Title>
              <Paragraph className="text-gray-500 text-lg">
                Help guests understand your car's condition and driving experience.
              </Paragraph>

              <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 mt-12 text-left">
                <Form.Item 
                  name="odometer" 
                  label={<Text className="font-black text-gray-600 uppercase text-[10px] tracking-widest">Odometer Reading</Text>}
                  rules={[{ required: true, message: 'Please select an odometer range' }]}
                >
                  <Select size="large" className="w-full rounded-2xl" placeholder="Select odometer reading">
                    <Select.Option value="0-10k">0-10k miles</Select.Option>
                    <Select.Option value="10k-20k">10k-20k miles</Select.Option>
                    <Select.Option value="20k-50k">20k-50k miles</Select.Option>
                    <Select.Option value="50k-100k">50k-100k miles</Select.Option>
                    <Select.Option value="100k+">100k+ miles</Select.Option>
                  </Select>
                </Form.Item>

                <div className="mt-8">
                  <Text className="font-black text-gray-600 uppercase text-[10px] tracking-widest block mb-4">Transmission</Text>
                  <Form.Item name="transmission" rules={[{ required: true, message: 'Please select transmission' }]}>
                    <Radio.Group className="grid grid-cols-2 gap-4 w-full">
                      <Radio.Button value="automatic" className="h-16 flex items-center justify-center rounded-2xl border-gray-200">
                        <div className="font-bold">Automatic</div>
                      </Radio.Button>
                      <Radio.Button value="manual" className="h-16 flex items-center justify-center rounded-2xl border-gray-200">
                        <div className="font-bold">Manual</div>
                      </Radio.Button>
                    </Radio.Group>
                  </Form.Item>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="max-w-4xl mx-auto text-center">
              <Title level={2} className="!font-black text-gray-800 mb-2">Add vehicle photos</Title>
              <Paragraph className="text-gray-500 text-lg">
                Clear, high-quality photos help your car stand out and give guests confidence.
              </Paragraph>

              <div className="bg-white p-12 rounded-[2.5rem] shadow-xl border border-gray-100 mt-12">
                <Upload.Dragger 
                  multiple 
                  className="rounded-[2rem] border-2 border-dashed border-indigo-100 bg-indigo-50/30 p-12 hover:border-indigo-300 transition-colors"
                >
                  <p className="ant-upload-drag-icon">
                    <PictureOutlined className="text-6xl text-indigo-500 mb-4" />
                  </p>
                  <p className="text-xl font-bold text-gray-800 mb-2">Drag photos here or click to browse</p>
                  <p className="text-gray-400">Upload at least 5 photos showing front, back, sides, and interior.</p>
                </Upload.Dragger>

                <div className="grid grid-cols-4 gap-4 mt-8">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="aspect-square bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-center group cursor-pointer hover:border-indigo-200 transition-all">
                      <PlusOutlined className="text-gray-300 group-hover:text-indigo-400 text-xl" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 5:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="max-w-3xl mx-auto text-center">
              <Title level={2} className="!font-black text-gray-800 mb-2">Finalize listing details</Title>
              <Paragraph className="text-gray-500 text-lg">
                Set your price and tell guests what makes your car special.
              </Paragraph>

              <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100 mt-12 text-left">
                <Row gutter={24}>
                  <Col span={24}>
                    <Form.Item 
                      label={<Text className="font-black text-gray-600 uppercase text-[10px] tracking-widest">Base Daily Price</Text>}
                      name="base_price"
                    >
                      <InputNumber 
                        size="large" 
                        className="w-full h-14 rounded-2xl flex items-center text-xl font-black" 
                        prefix={<DollarOutlined className="text-gray-400" />}
                        defaultValue={85}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={24} className="mt-4">
                    <Form.Item 
                      label={<Text className="font-black text-gray-600 uppercase text-[10px] tracking-widest">Listing Description</Text>}
                      name="description"
                    >
                      <Input.TextArea 
                        rows={6} 
                        className="rounded-2xl p-4" 
                        placeholder="Share details about the car's condition, features, and why guests will love it..." 
                      />
                    </Form.Item>
                  </Col>
                </Row>
                
                <div className="bg-indigo-50 p-6 rounded-3xl mt-6 border border-indigo-100">
                  <div className="flex">
                    <CheckCircleOutlined className="text-indigo-500 text-xl mr-3" />
                    <div>
                      <Text className="font-bold text-indigo-900 block">Smart Pricing Recommended</Text>
                      <Text className="text-indigo-800/70 text-sm">
                        Turn on Smart Pricing to automatically adjust your rate based on demand.
                      </Text>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-8 md:p-12 lg:p-20">
      <div className="max-w-6xl mx-auto">
        {/* Navigation Header */}
        <div className="flex justify-between items-center mb-16">
          <Button 
            type="text" 
            icon={<ArrowLeftOutlined />} 
            onClick={() => currentStep === 0 ? navigate('/host/listings') : prev()}
            className="flex items-center text-gray-500 font-bold hover:text-indigo-600 h-12 rounded-xl"
          >
            {currentStep === 0 ? 'Exit Registration' : 'Back'}
          </Button>
          
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Step {currentStep + 1} of {steps.length}</span>
          </div>
        </div>

        {/* Steps Breadcrumbs (Optional but nice) */}
        <div className="hidden lg:block mb-20">
          <Steps 
            current={currentStep} 
            className="premium-steps"
            items={steps.map(step => ({
              ...step,
              className: 'font-black tracking-tight'
            }))}
          />
        </div>

        {/* Progress Bar (Mobile and Tablet) */}
        <div className="lg:hidden h-2 w-full bg-gray-100 rounded-full mb-12 overflow-hidden">
          <motion.div 
            className="h-full bg-indigo-600"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>

        {/* Form Content */}
        <Form form={form} layout="vertical" requiredMark={false}>
          {renderStepContent()}

          {/* Action Footer */}
          <div className="mt-20 flex justify-center">
            <Button
              type="primary"
              size="large"
              className="group bg-indigo-600 hover:bg-indigo-700 h-16 px-16 rounded-2xl text-lg font-black shadow-2xl shadow-indigo-100 border-none transition-all flex items-center"
              onClick={currentStep === steps.length - 1 ? () => navigate('/host/listings') : next}
            >
              {currentStep === steps.length - 1 ? 'Finish & List Car' : 'Next Step'}
              <ArrowRightOutlined className="ml-3 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </Form>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .premium-steps .ant-steps-item-title {
          font-weight: 900 !important;
          font-size: 13px !important;
          text-transform: uppercase !important;
          letter-spacing: 0.1em !important;
          color: #94a3b8 !important;
        }
        .premium-steps .ant-steps-item-active .ant-steps-item-title {
          color: #6366f1 !important;
        }
        .premium-steps .ant-steps-item-icon {
          display: none !important;
        }
        .premium-steps .ant-steps-item-tail::after {
          background-color: #f1f5f9 !important;
          height: 3px !important;
          border-radius: 2px !important;
        }
        .premium-steps .ant-steps-item-finish .ant-steps-item-tail::after {
          background-color: #6366f1 !important;
        }
        .ant-input-lg, .ant-input-number-lg {
          padding-top: 1.25rem !important;
          padding-bottom: 1.25rem !important;
        }
      `}} />
    </div>
  );
};

export default HostVehicleRegistration;
