import { useState } from 'react';
import { Upload as UploadIcon } from 'lucide-react';
import { Card, Typography, Input, Select, InputNumber, Button, Upload } from 'antd';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Dragger } = Upload;

export function AddProduct() {
    const [quantity, setQuantity] = useState(1);

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Products Description Section */}
            <Card bordered={false} className="shadow-sm rounded-[32px] overflow-hidden" bodyStyle={{ padding: 32 }}>
                <Title level={4} style={{ margin: 0, marginBottom: 32, fontWeight: 900, letterSpacing: '-0.02em' }}>Products Description</Title>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div className="space-y-2">
                        <Text strong style={{ fontSize: '14px', display: 'block' }}>Product Name</Text>
                        <Input
                            size="large"
                            placeholder="Enter product name"
                            style={{ borderRadius: 12, backgroundColor: '#f9fafb', border: 'none', padding: '12px 16px' }}
                        />
                    </div>

                    <div className="space-y-2">
                        <Text strong style={{ fontSize: '14px', display: 'block' }}>Category</Text>
                        <Select
                            size="large"
                            defaultValue="Select Category"
                            style={{ width: '100%', borderRadius: 12 }}
                            className="bg-gray-50 border-none add-product-select"
                            options={[
                                { value: 'Select Category', label: 'Select Category' },
                                { value: 'Laptop', label: 'Laptop' },
                                { value: 'Accessories', label: 'Accessories' },
                                { value: 'Watch', label: 'Watch' }
                            ]}
                        />
                    </div>

                    <div className="space-y-2">
                        <Text strong style={{ fontSize: '14px', display: 'block' }}>Brand</Text>
                        <Select
                            size="large"
                            defaultValue="Select Brand"
                            style={{ width: '100%', borderRadius: 12 }}
                            className="bg-gray-50 border-none add-product-select"
                            options={[
                                { value: 'Select Brand', label: 'Select Brand' },
                                { value: 'ASUS', label: 'ASUS' },
                                { value: 'Apple', label: 'Apple' },
                                { value: 'Samsung', label: 'Samsung' }
                            ]}
                        />
                    </div>

                    <div className="space-y-2">
                        <Text strong style={{ fontSize: '14px', display: 'block' }}>Color</Text>
                        <Select
                            size="large"
                            defaultValue="Select color"
                            style={{ width: '100%', borderRadius: 12 }}
                            className="bg-gray-50 border-none add-product-select"
                            options={[
                                { value: 'Select color', label: 'Select color' },
                                { value: 'Space Gray', label: 'Space Gray' },
                                { value: 'Silver', label: 'Silver' },
                                { value: 'Gold', label: 'Gold' }
                            ]}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    <div className="space-y-2">
                        <Text strong style={{ fontSize: '14px', display: 'block' }}>Weight (kg)</Text>
                        <InputNumber
                            size="large"
                            defaultValue={15}
                            style={{ width: '100%', borderRadius: 12, backgroundColor: '#f9fafb', border: 'none', padding: '4px' }}
                        />
                    </div>
                    <div className="space-y-2">
                        <Text strong style={{ fontSize: '14px', display: 'block' }}>Length (cm)</Text>
                        <InputNumber
                            size="large"
                            defaultValue={120}
                            style={{ width: '100%', borderRadius: 12, backgroundColor: '#f9fafb', border: 'none', padding: '4px' }}
                        />
                    </div>
                    <div className="space-y-2">
                        <Text strong style={{ fontSize: '14px', display: 'block' }}>Width (cm)</Text>
                        <InputNumber
                            size="large"
                            defaultValue={23}
                            style={{ width: '100%', borderRadius: 12, backgroundColor: '#f9fafb', border: 'none', padding: '4px' }}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Text strong style={{ fontSize: '14px', display: 'block' }}>Description</Text>
                    <TextArea
                        rows={4}
                        placeholder="Receipt Info (optional)"
                        style={{ borderRadius: 12, backgroundColor: '#f9fafb', border: 'none', padding: '12px 16px', resize: 'none' }}
                    />
                </div>
            </Card>

            {/* Pricing & Availability Section */}
            <Card bordered={false} className="shadow-sm rounded-[32px] overflow-hidden" bodyStyle={{ padding: 32 }}>
                <Title level={4} style={{ margin: 0, marginBottom: 32, fontWeight: 900, letterSpacing: '-0.02em' }}>Pricing & Availability</Title>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    <div className="space-y-2">
                        <Text strong style={{ fontSize: '14px', display: 'block' }}>Regular Price ($)</Text>
                        <InputNumber
                            size="large"
                            placeholder="0.00"
                            style={{ width: '100%', borderRadius: 12, backgroundColor: '#f9fafb', border: 'none', padding: '4px' }}
                        />
                    </div>
                    <div className="space-y-2">
                        <Text strong style={{ fontSize: '14px', display: 'block' }}>Sale Price ($)</Text>
                        <InputNumber
                            size="large"
                            placeholder="0.00"
                            style={{ width: '100%', borderRadius: 12, backgroundColor: '#f9fafb', border: 'none', padding: '4px' }}
                        />
                    </div>
                    <div className="space-y-2">
                        <Text strong style={{ fontSize: '14px', display: 'block' }}>Discount (%)</Text>
                        <InputNumber
                            size="large"
                            placeholder="0.00"
                            style={{ width: '100%', borderRadius: 12, backgroundColor: '#f9fafb', border: 'none', padding: '4px' }}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <Text strong style={{ fontSize: '14px', display: 'block' }}>Stock Quantity</Text>
                        <InputNumber
                            size="large"
                            min={0}
                            value={quantity}
                            onChange={(val) => setQuantity(val || 0)}
                            style={{ width: '100%', borderRadius: 12, backgroundColor: '#f9fafb', border: 'none', padding: '4px' }}
                        />
                    </div>

                    <div className="space-y-2">
                        <Text strong style={{ fontSize: '14px', display: 'block' }}>Availability Status</Text>
                        <Select
                            size="large"
                            defaultValue="In Stock"
                            style={{ width: '100%', borderRadius: 12 }}
                            className="bg-gray-50 border-none add-product-select"
                            options={[
                                { value: 'In Stock', label: 'In Stock' },
                                { value: 'Out of Stock', label: 'Out of Stock' },
                                { value: 'Pre-order', label: 'Pre-order' }
                            ]}
                        />
                    </div>
                </div>
            </Card>

            {/* Product Images Section */}
            <Card bordered={false} className="shadow-sm rounded-[32px] overflow-hidden" bodyStyle={{ padding: 32 }}>
                <Title level={4} style={{ margin: 0, marginBottom: 32, fontWeight: 900, letterSpacing: '-0.02em' }}>Products Images</Title>
                <Dragger
                    name="file"
                    multiple={true}
                    action="/upload.do"
                    style={{ background: '#f8fafc', border: '2px dashed #bfdbfe', borderRadius: 24, padding: 48 }}
                >
                    <p className="ant-upload-drag-icon flex justify-center mb-6">
                        <div className="size-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center transition-transform hover:scale-110">
                            <UploadIcon size={32} />
                        </div>
                    </p>
                    <p className="ant-upload-text" style={{ fontWeight: 900, color: '#1f2937' }}>
                        Click to upload <span style={{ fontWeight: 500, color: '#9ca3af' }}>or drag and drop SVG,</span>
                    </p>
                    <p className="ant-upload-hint" style={{ fontWeight: 500, color: '#9ca3af', fontSize: '14px' }}>
                        PNG, JPG or GIF (MAX. 800x400px)
                    </p>
                </Dragger>
            </Card>

            {/* Footer Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-4">
                <Button size="large" style={{ borderRadius: 16, fontWeight: 900, height: 48, padding: '0 32px' }}>
                    Draft
                </Button>
                <Button type="primary" size="large" style={{ backgroundColor: '#2563eb', borderRadius: 16, fontWeight: 900, height: 48, padding: '0 32px' }} className="shadow-lg shadow-blue-100 w-full sm:w-auto">
                    Publish Product
                </Button>
            </div>
        </div>
    );
}
