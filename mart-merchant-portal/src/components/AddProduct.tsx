import { useState } from 'react';
import { Upload as UploadIcon } from 'lucide-react';
import { Card, Typography, Input, Select, InputNumber, Button, Upload, message } from 'antd';
import { api } from '../api';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Dragger } = Upload;

interface AddProductProps {
    token: string | null;
    merchant: any;
    onBack?: () => void;
}

export function AddProduct({ token, merchant, onBack }: AddProductProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [brand, setBrand] = useState('');
    const [price, setPrice] = useState<number>(0);
    const [quantity, setQuantity] = useState(1);
    const [description, setDescription] = useState('');

    const storeId = merchant?.stores?.[0]?.id;

    const handlePublish = async () => {
        if (!name || !price || !category) {
            message.error('Please fill in all required fields');
            return;
        }

        setIsLoading(true);
        try {
            await api.products.create(token!, {
                name,
                category,
                brand,
                price,
                stock: quantity,
                description,
                storeId
            });
            message.success('Product created successfully');
            if (onBack) onBack();
        } catch (err) {
            console.error('Failed to create product:', err);
            message.error('Failed to create product');
        } finally {
            setIsLoading(false);
        }
    };

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
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            style={{ borderRadius: 12, backgroundColor: '#f9fafb', border: 'none', padding: '12px 16px' }}
                        />
                    </div>

                    <div className="space-y-2">
                        <Text strong style={{ fontSize: '14px', display: 'block' }}>Category</Text>
                        <Select
                            size="large"
                            placeholder="Select Category"
                            style={{ width: '100%', borderRadius: 12 }}
                            className="bg-gray-50 border-none add-product-select"
                            onChange={setCategory}
                            options={[
                                { value: 'Grocery', label: 'Grocery' },
                                { value: 'Electronics', label: 'Electronics' },
                                { value: 'Fashion', label: 'Fashion' },
                                { value: 'Home', label: 'Home' }
                            ]}
                        />
                    </div>

                    <div className="space-y-2">
                        <Text strong style={{ fontSize: '14px', display: 'block' }}>Brand</Text>
                        <Input
                            size="large"
                            placeholder="Enter brand"
                            value={brand}
                            onChange={(e) => setBrand(e.target.value)}
                            style={{ borderRadius: 12, backgroundColor: '#f9fafb', border: 'none', padding: '12px 16px' }}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Text strong style={{ fontSize: '14px', display: 'block' }}>Description</Text>
                    <TextArea
                        rows={4}
                        placeholder="Product description..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        style={{ borderRadius: 12, backgroundColor: '#f9fafb', border: 'none', padding: '12px 16px', resize: 'none' }}
                    />
                </div>
            </Card>

            {/* Pricing & Availability Section */}
            <Card bordered={false} className="shadow-sm rounded-[32px] overflow-hidden" bodyStyle={{ padding: 32 }}>
                <Title level={4} style={{ margin: 0, marginBottom: 32, fontWeight: 900, letterSpacing: '-0.02em' }}>Pricing & Availability</Title>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div className="space-y-2">
                        <Text strong style={{ fontSize: '14px', display: 'block' }}>Price ($)</Text>
                        <InputNumber
                            size="large"
                            placeholder="0.00"
                            value={price}
                            onChange={(val) => setPrice(val || 0)}
                            style={{ width: '100%', borderRadius: 12, backgroundColor: '#f9fafb', border: 'none', padding: '4px' }}
                        />
                    </div>
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
                </div>
            </Card>

            {/* Product Images Section */}
            <Card bordered={false} className="shadow-sm rounded-[32px] overflow-hidden" bodyStyle={{ padding: 32 }}>
                <Title level={4} style={{ margin: 0, marginBottom: 32, fontWeight: 900, letterSpacing: '-0.02em' }}>Products Images</Title>
                <Dragger
                    name="file"
                    multiple={true}
                    action="/uplaod.do"
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
                <Button
                    size="large"
                    onClick={onBack}
                    style={{ borderRadius: 16, fontWeight: 900, height: 48, padding: '0 32px' }}
                >
                    Cancel
                </Button>
                <Button
                    type="primary"
                    size="large"
                    loading={isLoading}
                    onClick={handlePublish}
                    style={{ backgroundColor: '#2563eb', borderRadius: 16, fontWeight: 900, height: 48, padding: '0 32px' }}
                    className="shadow-lg shadow-blue-100 w-full sm:w-auto"
                >
                    Publish Product
                </Button>
            </div>
        </div>
    );
}
