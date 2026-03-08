import { useState, useEffect } from 'react';
import { Card, Table, Typography, Button, Tag, Space, Modal, Input, message, Tooltip, Alert } from 'antd';
import { Copy, Trash2, Plus, Eye, EyeOff, ShieldCheck, Globe, Code } from 'lucide-react';
import { api } from '../../api';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text, Paragraph } = Typography;

interface ApiKeyRecord {
    id: string;
    key: string;
    name: string;
    createdAt: string;
    lastUsedAt: string | null;
    isActive: boolean;
}

export function DirectDeveloper({ token }: { token: string }) {
    const [keys, setKeys] = useState<ApiKeyRecord[]>([]);
    const [loading, setLoading] = useState(false);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [newKeyName, setNewKeyName] = useState('');
    const [showKeyId, setShowKeyId] = useState<string | null>(null);

    const loadKeys = async () => {
        setLoading(true);
        try {
            const data = await api.developer.listKeys(token);
            setKeys(data);
        } catch (err: any) {
            message.error(err.message || 'Failed to load keys');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadKeys();
    }, [token]);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        message.success('API Key copied to clipboard');
    };

    const handleCreateKey = async () => {
        if (!newKeyName) {
            message.error('Please enter a name for the key');
            return;
        }

        try {
            const newKey = await api.developer.generateKey(token, newKeyName);
            setKeys([newKey, ...keys]);
            setIsCreateModalVisible(false);
            setNewKeyName('');
            message.success('New API Key generated successfully');
        } catch (err: any) {
            message.error(err.message || 'Failed to generate key');
        }
    };

    const handleRevokeKey = (id: string) => {
        Modal.confirm({
            title: 'Revoke API Key?',
            content: 'This action cannot be undone. Any applications using this key will immediately lose access to the DashDrive API.',
            okText: 'Revoke Key',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: async () => {
                try {
                    await api.developer.revokeKey(token, id);
                    setKeys(keys.map(k => k.id === id ? { ...k, isActive: false } : k));
                    message.success('API Key revoked');
                } catch (err: any) {
                    message.error(err.message || 'Failed to revoke key');
                }
            }
        });
    };

    const columns: ColumnsType<ApiKeyRecord> = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <Text strong>{text}</Text>,
        },
        {
            title: 'Secret Key',
            dataIndex: 'key',
            key: 'key',
            render: (key, record) => (
                <div className="flex items-center gap-2 font-mono text-sm bg-gray-50 px-2 py-1 rounded border border-gray-200 w-fit">
                    <span>{showKeyId === record.id ? key : `${key.substring(0, 8)}...${key.substring(key.length - 4)}`}</span>
                    <div className="flex items-center gap-1 ml-2 border-l border-gray-300 pl-2">
                        <Tooltip title={showKeyId === record.id ? "Hide" : "Show"}>
                            <Button
                                type="text"
                                size="small"
                                icon={showKeyId === record.id ? <EyeOff size={14} /> : <Eye size={14} />}
                                onClick={() => setShowKeyId(showKeyId === record.id ? null : record.id)}
                            />
                        </Tooltip>
                        <Tooltip title="Copy">
                            <Button
                                type="text"
                                size="small"
                                icon={<Copy size={14} />}
                                onClick={() => copyToClipboard(key)}
                            />
                        </Tooltip>
                    </div>
                </div>
            ),
        },
        {
            title: 'Last Used',
            dataIndex: 'lastUsedAt',
            key: 'lastUsedAt',
            render: (date) => date ? new Date(date).toLocaleString() : <Text type="secondary">Never used</Text>,
        },
        {
            title: 'Created',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => new Date(date).toLocaleDateString(),
        },
        {
            title: 'Status',
            dataIndex: 'isActive',
            key: 'isActive',
            render: (active) => (
                <Tag color={active ? 'success' : 'default'} className="px-2 py-0.5 rounded-md border-0 uppercase text-[10px] font-bold">
                    {active ? 'Active' : 'Revoked'}
                </Tag>
            ),
        },
        {
            title: '',
            key: 'actions',
            render: (_, record) => (
                <Tooltip title="Revoke Key">
                    <Button
                        type="text"
                        danger
                        icon={<Trash2 size={16} />}
                        onClick={() => handleRevokeKey(record.id)}
                    />
                </Tooltip>
            ),
        },
    ];

    return (
        <Space direction="vertical" size="large" className="w-full max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                            <Code size={24} />
                        </div>
                        <Title level={3} style={{ margin: 0 }}>Developer Tokens</Title>
                    </div>
                    <Text className="text-gray-500 mt-2 block">Manage secret keys to integrate DashDrive logistics into your own applications.</Text>
                </div>
                <Button
                    type="primary"
                    icon={<Plus size={18} />}
                    onClick={() => setIsCreateModalVisible(true)}
                    className="bg-black hover:bg-gray-800 rounded-lg h-10 font-semibold px-6 flex items-center gap-2"
                >
                    Create New Key
                </Button>
            </div>

            <Alert
                message={<span className="font-bold">Security Warning</span>}
                description="Your API keys carry significant privileges. Do not share them or expose them in client-side code (browsers/mobile). Treat them exactly like your password."
                type="warning"
                showIcon
                icon={<ShieldCheck className="text-amber-500" />}
                className="rounded-xl border-amber-100 bg-amber-50"
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 shadow-sm border-gray-100 rounded-2xl overflow-hidden">
                    <Table
                        loading={loading}
                        columns={columns}
                        dataSource={keys}
                        rowKey="id"
                        pagination={false}
                    />
                </Card>

                <div className="flex flex-col gap-6">
                    <Card className="shadow-sm border-gray-100 rounded-2xl bg-gray-50/50">
                        <div className="flex items-center gap-2 mb-4">
                            <Globe size={18} className="text-blue-500" />
                            <Text strong>API Documentation</Text>
                        </div>
                        <Paragraph className="text-sm text-gray-500">
                            Learn how to use our REST API to automate your delivery workflows, calculate quotes, and track riders.
                        </Paragraph>
                        <Button block className="rounded-lg font-medium">Read API Docs</Button>
                    </Card>

                    <Card className="shadow-sm border-gray-100 rounded-2xl">
                        <div className="flex items-center gap-2 mb-4">
                            <ShieldCheck size={18} className="text-emerald-500" />
                            <Text strong>Best Practices</Text>
                        </div>
                        <ul className="text-xs text-gray-500 space-y-2 pl-4 list-disc">
                            <li>Rotate keys every 90 days</li>
                            <li>Use separate keys for staging and production</li>
                            <li>Whitelist your server IP addresses (coming soon)</li>
                        </ul>
                    </Card>
                </div>
            </div>

            <Modal
                title="Create New API Key"
                open={isCreateModalVisible}
                onOk={handleCreateKey}
                onCancel={() => {
                    setIsCreateModalVisible(false);
                    setNewKeyName('');
                }}
                okText="Generate Key"
                okButtonProps={{ className: 'bg-black border-black' }}
                className="rounded-2xl overflow-hidden"
            >
                <div className="py-4">
                    <Text className="block mb-2 font-medium">Key Name</Text>
                    <Input
                        placeholder="e.g. My Website Production"
                        value={newKeyName}
                        onChange={e => setNewKeyName(e.target.value)}
                        className="h-10 rounded-lg"
                        autoFocus
                    />
                    <Text className="text-xs text-gray-400 mt-2 block">
                        A descriptive name helps you identify where this key is being used.
                    </Text>
                </div>
            </Modal>
        </Space>
    );
}
