import React, { useState } from 'react';
import { Typography, Card, Table, Button, Space, Tag, Input, DatePicker, Select, Modal, Divider } from 'antd';
import { ShieldAlert, Search, Filter, CheckCircle2, AlertTriangle, Clock, MapPin, UserCheck, MessageSquare } from 'lucide-react';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const StyledCard = Card as any;

// Mock Data
const mockResolvedAlerts = [
 {
 id: 'ALT-9921',
 type: 'RIDER_SOS',
 severity: 'CRITICAL',
 description: 'Rider triggered emergency SOS during delivery due to suspected accident.',
 triggerTime: '2025-06-14T21:15:00Z',
 resolutionTime: '2025-06-14T21:45:00Z',
 resolvedBy: 'Sarah Jenkins (Dispatcher)',
 resolutionNote: 'Contacted rider, false alarm. Phone dropped while riding, auto-triggered SOS. Rider is safe and continued delivery.',
 location: 'Borrowdale Road, Harare'
 },
 {
 id: 'ALT-9922',
 type: 'FRAUD_DETECTED',
 severity: 'HIGH',
 description: 'Multiple failed high-value top-up attempts from flagged IP.',
 triggerTime: '2025-06-14T14:30:00Z',
 resolutionTime: '2025-06-14T15:10:00Z',
 resolvedBy: 'David Osei (Risk Team)',
 resolutionNote: 'Account permanently frozen. Payment methods blacklisted. Forwarded to compliance.',
 location: 'System / IP: 192.168.1.5'
 },
 {
 id: 'ALT-9923',
 type: 'SLA_BREACH',
 severity: 'MEDIUM',
 description: 'Order ORD-5810 prep time exceeded SLA limit by 25 minutes.',
 triggerTime: '2025-06-15T12:00:00Z',
 resolutionTime: '2025-06-15T12:35:00Z',
 resolvedBy: 'System Auto-Resolve',
 resolutionNote: 'Order finally picked up by rider. Applied $5 credit to customer wallet automatically for the delay.',
 location: 'Nandos Avondale'
 },
 {
 id: 'ALT-9924',
 type: 'FLEET_GEOFENCE',
 severity: 'LOW',
 description: 'Rider RID-105 exited assigned operating zone (Northern Suburbs).',
 triggerTime: '2025-06-15T09:15:00Z',
 resolutionTime: '2025-06-15T09:40:00Z',
 resolvedBy: 'Sarah Jenkins (Dispatcher)',
 resolutionNote: 'Rider had to take a detour due to road closure on Churchill Ave. Approved temporary zone exit.',
 location: 'Churchill Ave, Harare'
 }
];

export function SolvedAlertList() {
 const [searchText, setSearchText] = useState('');
 const [selectedAlert, setSelectedAlert] = useState<any>(null);
 const [isModalVisible, setIsModalVisible] = useState(false);

 const getSeverityColor = (severity: string) => {
 switch (severity) {
 case 'CRITICAL': return 'red';
 case 'HIGH': return 'orange';
 case 'MEDIUM': return 'gold';
 case 'LOW': return 'blue';
 default: return 'default';
 }
 };

 const getTypeDisplay = (type: string) => {
 const text = type.replace('_', ' ');
 switch (type) {
 case 'RIDER_SOS': return <Space><AlertTriangle className="w-3 h-3 text-red-500" /> {text}</Space>;
 case 'FRAUD_DETECTED': return <Space><ShieldAlert className="w-3 h-3 text-orange-500" /> {text}</Space>;
 case 'SLA_BREACH': return <Space><Clock className="w-3 h-3 text-gold-500" /> {text}</Space>;
 case 'FLEET_GEOFENCE': return <Space><MapPin className="w-3 h-3 text-blue-500" /> {text}</Space>;
 default: return text;
 }
 };

 const calculateDuration = (start: string, end: string) => {
 const diffInMins = Math.round((new Date(end).getTime() - new Date(start).getTime()) / 60000);
 return `${diffInMins} mins`;
 };

 const showDetails = (record: any) => {
 setSelectedAlert(record);
 setIsModalVisible(true);
 };

 const columns = [
 {
 title: 'Alert ID & Type',
 key: 'type',
 render: (_: any, record: any) => (
 <Space orientation="vertical" size={2}>
 <Text strong className="font-mono text-xs">{record.id}</Text>
 <Text className="text-sm font-medium">{getTypeDisplay(record.type)}</Text>
 </Space>
 ),
 },
 {
 title: 'Severity',
 dataIndex: 'severity',
 key: 'severity',
 render: (severity: string) => (
 <Tag color={getSeverityColor(severity)} className="rounded-md border-0 m-0 font-bold">{severity}</Tag>
 ),
 },
 {
 title: 'Description',
 dataIndex: 'description',
 key: 'description',
 width: '30%',
 render: (text: string) => <Text className="text-zinc-600 text-sm line-clamp-2">{text}</Text>,
 },
 {
 title: 'Duration',
 key: 'duration',
 render: (_: any, record: any) => (
 <Space orientation="vertical" size={2}>
 <Text className="text-sm">{calculateDuration(record.triggerTime, record.resolutionTime)}</Text>
 <Text type="secondary" className="text-xs">Time to Resolve</Text>
 </Space>
 ),
 },
 {
 title: 'Resolved By',
 dataIndex: 'resolvedBy',
 key: 'resolvedBy',
 render: (text: string) => (
 <Space>
 <UserCheck className="w-4 h-4 text-green-500" />
 <Text className="text-sm">{text}</Text>
 </Space>
 ),
 },
 {
 title: 'Action',
 key: 'action',
 render: (_: any, record: any) => (
 <Button type="link" onClick={() => showDetails(record)} className="text-primary font-medium px-0">
 View Report
 </Button>
 ),
 },
 ];

 return (
 <div className="space-y-6 animate-in fade-in duration-500">
 <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-zinc-100">
 <div className="flex items-center gap-4">
 <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-600">
 <CheckCircle2 className="w-6 h-6" />
 </div>
 <div>
 <Title level={3} className="m-0 tracking-tight">Solved Alerts & Incidents</Title>
 <Text type="secondary">Historical log of resolved system alerts, SOS triggers, and operational breaches.</Text>
 </div>
 </div>
 <Space>
 <RangePicker className="h-11 rounded-xl" />
 </Space>
 </div>

 <StyledCard className="rounded-3xl shadow-sm border-zinc-100 overflow-hidden" bodyStyle={{ padding: 0 }}>
 <div className="p-5 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50 flex-wrap gap-4">
 <Input
 placeholder="Search by ID, Type, or description..."
 prefix={<Search className="w-4 h-4 text-zinc-400" />}
 value={searchText}
 onChange={(e) => setSearchText(e.target.value)}
 className="w-80 rounded-xl h-10"
 />
 <Space>
 <Select
 defaultValue="ALL"
 className="w-32 [&_.ant-select-selector]:rounded-xl [&_.ant-select-selector]:h-10"
 options={[
 { value: 'ALL', label: 'All Severities' },
 { value: 'CRITICAL', label: 'Critical' },
 { value: 'HIGH', label: 'High' },
 { value: 'MEDIUM', label: 'Medium' },
 { value: 'LOW', label: 'Low' }
 ]}
 />
 <Button icon={<Filter className="w-4 h-4" />} className="h-10 rounded-xl">Filters</Button>
 </Space>
 </div>
 <Table
 columns={columns}
 dataSource={mockResolvedAlerts}
 rowKey="id"
 pagination={{ pageSize: 10, className: 'px-6' }}
 className="[&_.ant-table-thead_th]:bg-zinc-50/50 [&_.ant-table-thead_th]:font-semibold [&_.ant-table-thead_th]:text-zinc-500 [&_.ant-table-tbody_td]:py-4"
 />
 </StyledCard>

 <Modal
 title={<div className="flex items-center gap-2"><ShieldAlert className="w-5 h-5 text-zinc-700" /> Incident Report: {selectedAlert?.id}</div>}
 open={isModalVisible}
 onCancel={() => setIsModalVisible(false)}
 footer={[
 <Button key="close" onClick={() => setIsModalVisible(false)} className="rounded-xl font-medium">Close Report</Button>
 ]}
 width={600}
 className="[&_.ant-modal-content]:rounded-2xl"
 >
 {selectedAlert && (
 <div className="mt-4 space-y-6">
 <div className="grid grid-cols-2 gap-4 bg-zinc-50 p-4 rounded-xl border border-zinc-100">
 <div>
 <Text type="secondary" className="text-xs font-bold ">Alert Type</Text>
 <div className="mt-1 font-medium">{selectedAlert.type.replace('_', ' ')}</div>
 </div>
 <div>
 <Text type="secondary" className="text-xs font-bold ">Severity</Text>
 <div className="mt-1"><Tag color={getSeverityColor(selectedAlert.severity)} className="rounded-md border-0 m-0 font-bold">{selectedAlert.severity}</Tag></div>
 </div>
 <div>
 <Text type="secondary" className="text-xs font-bold ">Triggered At</Text>
 <div className="mt-1 text-sm">{new Date(selectedAlert.triggerTime).toLocaleString()}</div>
 </div>
 <div>
 <Text type="secondary" className="text-xs font-bold ">Resolved At</Text>
 <div className="mt-1 text-sm">{new Date(selectedAlert.resolutionTime).toLocaleString()}</div>
 </div>
 </div>

 <div>
 <Text type="secondary" className="text-xs font-bold block mb-2 text-zinc-400">Initial Description</Text>
 <Text className="text-zinc-800 bg-red-50/50 p-3 rounded-xl border border-red-100 block">{selectedAlert.description}</Text>
 </div>

 <div className="flex items-start gap-2 text-sm text-zinc-600">
 <MapPin className="w-4 h-4 mt-0.5 text-zinc-400" />
 <span><strong className="text-zinc-700">Location Context:</strong> {selectedAlert.location}</span>
 </div>

 <Divider className="my-2" />

 <div>
 <div className="flex items-center gap-2 mb-2">
 <MessageSquare className="w-4 h-4 text-green-500" />
 <Text type="secondary" className="text-xs font-bold text-green-600">Resolution Log</Text>
 </div>
 <div className="bg-green-50/50 p-4 rounded-xl border border-green-100">
 <Text className="text-zinc-800 block mb-3 italic">"{selectedAlert.resolutionNote}"</Text>
 <div className="flex justify-between items-center text-xs text-zinc-500 border-t border-green-200/50 pt-2">
 <span>Resolved By: <strong className="text-zinc-700">{selectedAlert.resolvedBy}</strong></span>
 <span>Duration: <strong className="text-zinc-700">{calculateDuration(selectedAlert.triggerTime, selectedAlert.resolutionTime)}</strong></span>
 </div>
 </div>
 </div>
 </div>
 )}
 </Modal>
 </div>
 );
}

