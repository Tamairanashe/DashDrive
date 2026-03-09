import React, { useState } from 'react';
import { Typography, Row, Col, Table, Tag, Button, Space, Modal, Descriptions, Card, Statistic, Steps, message, Tabs, Alert, Progress, Divider, Avatar, Upload } from 'antd';
import {
  CheckCircleOutlined, CloseCircleOutlined, FileSearchOutlined,
  UploadOutlined, EditOutlined,
  WarningOutlined, SafetyCertificateOutlined, BankOutlined,
  DollarOutlined, UserOutlined, FileTextOutlined,
  CarOutlined, HomeOutlined, TeamOutlined,
  AuditOutlined, GlobalOutlined,
  InboxOutlined, EyeOutlined, DownloadOutlined, DeleteOutlined, PaperClipOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

interface CreditBureauReport {
  bureau: string;
  reportDate: string;
  bureauScore: number;
  scoreRating: string;
  activeFacilities: number;
  totalExposure: number;
  currentDelinquencies: number;
  historicalDefaults: number;
  judgments: number;
  enquiriesLast90Days: number;
  oldestAccount: string;
  lastPaymentStatus: string;
  alerts: string[];
  status: string;
  hasReport: boolean;
}

interface NextOfKin {
  fullName: string;
  relationship: string;
  phone: string;
  nationalId: string;
  address: string;
  employer: string;
}

interface Collateral {
  type: string;
  description: string;
  estimatedValue: number;
  status: string;
  hasProof: boolean;
}

interface Application {
  id: string;
  borrower: string;
  userType: string;
  product: string;
  amount: number;
  status: string;
  date: string;
  // Borrower Profile
  profilePicture: string;
  idNumber: string;
  email: string;
  address: string;
  city: string;
  accountAge: string;
  driverTier: string;
  trips: number;
  rating: number;
  phone: string;
  // Financial Metrics
  monthlyEarnings: number;
  avgTripsPerWeek: number;
  walletBalance: number;
  earningsStability: string;
  // Credit Scoring
  creditScore: number;
  riskLevel: string;
  cancellationRate: number;
  previousLoans: number;
  repaymentHistory: string;
  // Risk Flags
  riskFlags: string[];
  // Documents (Driver)
  hasNationalId: boolean;
  hasDriverLicense: boolean;
  hasVehicleReg: boolean;
  hasDashDriveEarnings: boolean;
  // Documents (Customer/Rider)
  hasPayslip: boolean;
  hasBankStatement: boolean;
  hasEmploymentLetter: boolean;
  hasOtherIncome: boolean;
  // Bank Requirements
  bankAccountRequired: boolean;
  earningsRoutingRequired: boolean;
  partnerBank: string;
  repaymentMethod: string;
  // Collateral
  collateral: Collateral[];
  collateralRequired: boolean;
  // Next of Kin
  nextOfKin: NextOfKin[];
  // External Credit Bureau
  bureau: CreditBureauReport;
  rejectionReason?: string;
  requestedDocs?: string[];
  proposedAmount?: number;
  adjustmentNote?: string;
}

const suggestedReasons = [
  "Credit score below minimum requirement",
  "Insufficient monthly earnings for requested amount",
  "Inconsistent earnings history",
  "Insufficient/Unverified collateral",
  "Incomplete or fraudulent documentation",
  "High existing debt-to-income ratio",
  "Account age below minimum required (6 months)",
  "Unfavorable credit bureau findings (Judgments/Defaults)"
];

export const ApplicationsPage: React.FC = () => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isRequestDocsModalOpen, setIsRequestDocsModalOpen] = useState(false);
  const [isAdjustLoanModalOpen, setIsAdjustLoanModalOpen] = useState(false);
  
  const [selected, setSelected] = useState<Application | null>(null);
  
  const [rejectionReason, setRejectionReason] = useState("");
  const [customReason, setCustomReason] = useState(false);
  
  const [selectedDocsToRequest, setSelectedDocsToRequest] = useState<string[]>([]);
  const [adjustmentAmount, setAdjustmentAmount] = useState<number>(0);
  const [adjustmentRationale, setAdjustmentRationale] = useState("");

  const statusSteps: Record<string, number> = { Submitted: 0, 'Under Review': 1, Approved: 2, Disbursed: 3, Rejected: 2 };

  const [apps, setApps] = useState<Application[]>([
    {
      id: 'APP-1021', borrower: 'Driver John', userType: 'Driver', product: 'Vehicle Loan', amount: 5000, status: 'Submitted', date: '2026-03-08',
      profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John', idNumber: '63-123456 A 78', email: 'john.moyo@email.co.zw', address: '14 Samora Machel Ave, Harare',
      city: 'Harare', accountAge: '18 months', driverTier: 'Premium', trips: 1340, rating: 4.8, phone: '+263 71 234 5678',
      monthlyEarnings: 900, avgTripsPerWeek: 45, walletBalance: 320, earningsStability: 'Stable',
      creditScore: 82, riskLevel: 'Low', cancellationRate: 2, previousLoans: 1, repaymentHistory: 'On-time (1/1)',
      riskFlags: [],
      hasNationalId: true, hasDriverLicense: true, hasVehicleReg: true, hasDashDriveEarnings: true,
      hasPayslip: false, hasBankStatement: false, hasEmploymentLetter: false, hasOtherIncome: false,
      bankAccountRequired: true, earningsRoutingRequired: true, partnerBank: 'XYZ Bank', repaymentMethod: 'Auto-deduct from DashDrive payouts → XYZ Bank',
      collateralRequired: true,
      collateral: [
        { type: 'Vehicle', description: '2019 Toyota Corolla — Reg: AEP 1234', estimatedValue: 12000, status: 'Verified', hasProof: true },
      ],
      nextOfKin: [
        { fullName: 'Mary Moyo', relationship: 'Spouse', phone: '+263 77 111 2233', nationalId: '63-234567 A 89', address: '14 Samora Machel, Harare', employer: 'TelOne' },
        { fullName: 'Peter Moyo', relationship: 'Brother', phone: '+263 71 444 5566', nationalId: '63-345678 B 12', address: '22 Chinhoyi St, Harare', employer: 'Self-employed' },
      ],
      bureau: { bureau: 'FCB Zimbabwe', reportDate: '2026-03-07', bureauScore: 680, scoreRating: 'Good', activeFacilities: 2, totalExposure: 3200, currentDelinquencies: 0, historicalDefaults: 0, judgments: 0, enquiriesLast90Days: 1, oldestAccount: '2023-06-01', lastPaymentStatus: 'Current', alerts: [], status: 'Clear', hasReport: true },
    },
    {
      id: 'APP-1022', borrower: 'Driver Sarah', userType: 'Driver', product: 'Fuel Credit', amount: 200, status: 'Under Review', date: '2026-03-07',
      profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', idNumber: '63-234567 B 90', email: '', address: '22 Fort St, Bulawayo',
      city: 'Bulawayo', accountAge: '12 months', driverTier: 'Gold', trips: 890, rating: 4.6, phone: '+263 77 987 6543',
      monthlyEarnings: 650, avgTripsPerWeek: 32, walletBalance: 150, earningsStability: 'Moderate',
      creditScore: 75, riskLevel: 'Low', cancellationRate: 5, previousLoans: 0, repaymentHistory: 'No history',
      riskFlags: [],
      hasNationalId: true, hasDriverLicense: true, hasVehicleReg: false, hasDashDriveEarnings: true,
      hasPayslip: false, hasBankStatement: false, hasEmploymentLetter: false, hasOtherIncome: false,
      bankAccountRequired: false, earningsRoutingRequired: false, partnerBank: '', repaymentMethod: 'Wallet deduction',
      collateralRequired: false,
      collateral: [],
      nextOfKin: [
        { fullName: 'Thomas Ndlovu', relationship: 'Father', phone: '+263 77 222 3344', nationalId: '63-456789 C 34', address: '8 Fort St, Bulawayo', employer: 'Retired' },
      ],
      bureau: { bureau: 'FCB Zimbabwe', reportDate: '2026-03-06', bureauScore: 620, scoreRating: 'Fair', activeFacilities: 1, totalExposure: 800, currentDelinquencies: 0, historicalDefaults: 0, judgments: 0, enquiriesLast90Days: 2, oldestAccount: '2024-11-01', lastPaymentStatus: 'Current', alerts: [], status: 'Clear', hasReport: false },
    },
    {
      id: 'APP-1023', borrower: 'Rider Mike', userType: 'Rider', product: 'Personal Loan', amount: 1500, status: 'Submitted', date: '2026-03-06',
      profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike', idNumber: '63-345678 C 12', email: 'mike.chikwena@gmail.com', address: '3 Leopold Takawira St, Harare',
      city: 'Harare', accountAge: '8 months', driverTier: 'N/A', trips: 120, rating: 4.2, phone: '+263 73 111 2222',
      monthlyEarnings: 0, avgTripsPerWeek: 0, walletBalance: 45, earningsStability: 'N/A',
      creditScore: 68, riskLevel: 'Medium', cancellationRate: 8, previousLoans: 0, repaymentHistory: 'No history',
      riskFlags: ['Low account age', 'No DashDrive earnings — external income required'],
      hasNationalId: true, hasDriverLicense: false, hasVehicleReg: false, hasDashDriveEarnings: false,
      hasPayslip: true, hasBankStatement: true, hasEmploymentLetter: true, hasOtherIncome: false,
      bankAccountRequired: true, earningsRoutingRequired: false, partnerBank: 'XYZ Bank', repaymentMethod: 'Bank debit order',
      collateralRequired: false,
      collateral: [],
      nextOfKin: [
        { fullName: 'Susan Chikwena', relationship: 'Mother', phone: '+263 71 555 6677', nationalId: '63-567890 D 56', address: '3 Leopold Takawira, Harare', employer: 'Min. of Education' },
      ],
      bureau: { bureau: 'FCB Zimbabwe', reportDate: '2026-03-05', bureauScore: 540, scoreRating: 'Fair', activeFacilities: 0, totalExposure: 0, currentDelinquencies: 0, historicalDefaults: 0, judgments: 0, enquiriesLast90Days: 3, oldestAccount: 'None', lastPaymentStatus: 'N/A', alerts: ['Multiple enquiries in short period'], status: 'Review', hasReport: false },
    },
    {
      id: 'APP-1024', borrower: 'Driver Grace', userType: 'Driver', product: 'Microloan', amount: 800, status: 'Approved', date: '2026-03-05',
      profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Grace', idNumber: '63-456789 D 34', email: 'grace.matanda@outlook.com', address: '5 Josiah Tongogara Ave, Harare',
      city: 'Harare', accountAge: '24 months', driverTier: 'Premium', trips: 1800, rating: 4.9, phone: '+263 77 333 2211',
      monthlyEarnings: 1200, avgTripsPerWeek: 55, walletBalance: 580, earningsStability: 'Very Stable',
      creditScore: 91, riskLevel: 'Low', cancellationRate: 1, previousLoans: 2, repaymentHistory: 'On-time (2/2)',
      riskFlags: [],
      hasNationalId: true, hasDriverLicense: true, hasVehicleReg: true, hasDashDriveEarnings: true,
      hasPayslip: false, hasBankStatement: false, hasEmploymentLetter: false, hasOtherIncome: true,
      bankAccountRequired: false, earningsRoutingRequired: true, partnerBank: 'XYZ Bank', repaymentMethod: 'Auto-deduct from DashDrive payouts → XYZ Bank',
      collateralRequired: false,
      collateral: [],
      nextOfKin: [
        { fullName: 'Robert Matanda', relationship: 'Husband', phone: '+263 78 777 8899', nationalId: '63-678901 E 78', address: '5 Josiah Tongogara, Harare', employer: 'Econet Wireless' },
      ],
      bureau: { bureau: 'FCB Zimbabwe', reportDate: '2026-03-04', bureauScore: 740, scoreRating: 'Excellent', activeFacilities: 3, totalExposure: 5400, currentDelinquencies: 0, historicalDefaults: 0, judgments: 0, enquiriesLast90Days: 0, oldestAccount: '2021-03-15', lastPaymentStatus: 'Current', alerts: [], status: 'Clear', hasReport: true },
    },
    {
      id: 'APP-1025', borrower: 'Driver Tino', userType: 'Driver', product: 'Vehicle Loan', amount: 6000, status: 'Rejected', date: '2026-03-04',
      profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tino', idNumber: '63-567890 E 56', email: '', address: '10 Main St, Mutare',
      city: 'Mutare', accountAge: '3 months', driverTier: 'Standard', trips: 80, rating: 3.9, phone: '+263 71 555 4444',
      monthlyEarnings: 400, avgTripsPerWeek: 12, walletBalance: 20, earningsStability: 'Unstable',
      creditScore: 45, riskLevel: 'High', cancellationRate: 15, previousLoans: 0, repaymentHistory: 'No history',
      riskFlags: ['High cancellation rate (15%)', 'Low earnings stability', 'Account age below 6 months', 'Multiple recent loan applications'],
      hasNationalId: true, hasDriverLicense: true, hasVehicleReg: false, hasDashDriveEarnings: true,
      hasPayslip: false, hasBankStatement: false, hasEmploymentLetter: false, hasOtherIncome: false,
      bankAccountRequired: true, earningsRoutingRequired: true, partnerBank: 'XYZ Bank', repaymentMethod: 'Auto-deduct from DashDrive payouts → XYZ Bank',
      collateralRequired: true,
      collateral: [
        { type: 'Vehicle', description: '2014 Honda Fit — Reg: ADT 9876', estimatedValue: 4500, status: 'Pending Verification', hasProof: false },
      ],
      nextOfKin: [
        { fullName: 'James Tino', relationship: 'Father', phone: '+263 73 999 0011', nationalId: '63-789012 F 90', address: '10 Main St, Mutare', employer: 'Farmer' },
      ],
      bureau: { bureau: 'FCB Zimbabwe', reportDate: '2026-03-03', bureauScore: 380, scoreRating: 'Poor', activeFacilities: 1, totalExposure: 1500, currentDelinquencies: 1, historicalDefaults: 1, judgments: 1, enquiriesLast90Days: 5, oldestAccount: '2025-09-01', lastPaymentStatus: 'Delinquent (60+ days)', alerts: ['Active judgment', 'Delinquent account', 'Multiple recent enquiries'], status: 'Adverse', hasReport: true },
    },
    {
      id: 'APP-1026', borrower: 'Customer Lisa', userType: 'Customer', product: 'Personal Loan', amount: 3000, status: 'Under Review', date: '2026-03-03',
      profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa', idNumber: '63-678901 F 78', email: 'lisa.mutasa@yahoo.com', address: '18 Harare St, Eastlea, Harare',
      city: 'Harare', accountAge: '6 months', driverTier: 'N/A', trips: 50, rating: 4.4, phone: '+263 78 888 9999',
      monthlyEarnings: 0, avgTripsPerWeek: 0, walletBalance: 80, earningsStability: 'N/A',
      creditScore: 72, riskLevel: 'Medium', cancellationRate: 3, previousLoans: 0, repaymentHistory: 'No history',
      riskFlags: ['No DashDrive earnings — external income required'],
      hasNationalId: true, hasDriverLicense: false, hasVehicleReg: false, hasDashDriveEarnings: false,
      hasPayslip: true, hasBankStatement: true, hasEmploymentLetter: false, hasOtherIncome: true,
      bankAccountRequired: true, earningsRoutingRequired: false, partnerBank: 'XYZ Bank', repaymentMethod: 'Bank debit order',
      collateralRequired: false,
      collateral: [],
      nextOfKin: [
        { fullName: 'Nyasha Mutasa', relationship: 'Sister', phone: '+263 71 666 7788', nationalId: '63-890123 G 12', address: '18 Harare St, Harare', employer: 'Delta Corp' },
        { fullName: 'Paul Mutasa', relationship: 'Father', phone: '+263 77 888 9900', nationalId: '63-901234 H 34', address: '18 Harare St, Harare', employer: 'Retired' },
      ],
      bureau: { bureau: 'FCB Zimbabwe', reportDate: '2026-03-02', bureauScore: 590, scoreRating: 'Fair', activeFacilities: 1, totalExposure: 2000, currentDelinquencies: 0, historicalDefaults: 0, judgments: 0, enquiriesLast90Days: 2, oldestAccount: '2024-06-01', lastPaymentStatus: 'Current', alerts: [], status: 'Clear', hasReport: false },
    },
  ]);

  const statusColors: Record<string, string> = { Submitted: 'gold', 'Under Review': 'blue', Approved: 'green', Rejected: 'red', Disbursed: 'purple' };
  const riskColor = (r: string) => r === 'Low' ? 'green' : r === 'Medium' ? 'orange' : 'red';

  const updateApp = (id: string, status: string, extra?: any) => { 
    setApps(a => a.map(ap => ap.id === id ? { ...ap, status, ...extra } : ap)); 
    message.success(`${id} → ${status}`); 
    
    if (status === 'Rejected' && extra?.rejectionReason) {
      console.log(`BROADCAST: Notification sent to borrower for ${id}. Reason: ${extra.rejectionReason}`);
      message.info(`Rejection reason broadcasted to borrower`);
    }

    if (extra?.requestedDocs) {
      console.log(`BROADCAST: Document request sent to borrower for ${id}. Required: ${extra.requestedDocs.join(', ')}`);
      message.info(`Document request sent to borrower`);
    }

    if (extra?.proposedAmount) {
      console.log(`BROADCAST: Loan adjustment proposed for ${id}. New amount: $${extra.proposedAmount}. Note: ${extra.adjustmentNote}`);
      message.info(`Loan adjustment proposed to borrower`);
    }
  };

  const handleReject = () => {
    if (!selected || !rejectionReason) {
      message.error("Please provide a reason for rejection");
      return;
    }
    updateApp(selected.id, 'Rejected', { rejectionReason });
    setIsRejectModalOpen(false);
    setIsDetailsOpen(false);
    setRejectionReason("");
    setCustomReason(false);
  };

  const handleRequestDocs = () => {
    if (!selected || selectedDocsToRequest.length === 0) {
      message.error("Please select at least one document to request");
      return;
    }
    updateApp(selected.id, 'Under Review', { requestedDocs: selectedDocsToRequest });
    setIsRequestDocsModalOpen(false);
    setSelectedDocsToRequest([]);
  };

  const handleAdjustLoan = () => {
    if (!selected || !adjustmentAmount || adjustmentAmount <= 0) {
      message.error("Please provide a valid adjustment amount");
      return;
    }
    updateApp(selected.id, 'Under Review', { 
      proposedAmount: adjustmentAmount, 
      adjustmentNote: adjustmentRationale 
    });
    setIsAdjustLoanModalOpen(false);
    setAdjustmentAmount(0);
    setAdjustmentRationale("");
  };

  const columns = [
    { title: 'App ID', dataIndex: 'id', render: (t: string) => <Text strong>{t}</Text> },
    { title: 'Borrower', dataIndex: 'borrower' },
    { title: 'Type', dataIndex: 'userType', render: (t: string) => <Tag color={t === 'Driver' ? 'blue' : t === 'Rider' ? 'green' : 'cyan'}>{t}</Tag> },
    { title: 'Product', dataIndex: 'product' },
    { title: 'Amount', dataIndex: 'amount', render: (v: number) => `$${v.toLocaleString()}` },
    { title: 'Score', dataIndex: 'creditScore', render: (v: number) => <Tag color={v >= 80 ? 'green' : v >= 60 ? 'orange' : 'red'}>{v}</Tag> },
    { title: 'Risk', dataIndex: 'riskLevel', render: (r: string) => <Tag color={riskColor(r)}>{r}</Tag> },
    { title: 'Status', dataIndex: 'status', render: (s: string) => <Tag color={statusColors[s]}>{s}</Tag> },
    { title: 'Date', dataIndex: 'date' },
    {
      title: 'Actions',
      render: (_: any, record: Application) => (
        <Space>
          <Button size="small" icon={<FileSearchOutlined />} onClick={() => { setSelected(record); setIsDetailsOpen(true); }}>Review</Button>
          {['Submitted', 'Under Review'].includes(record.status) && (
            <>
              <Button size="small" type="primary" icon={<CheckCircleOutlined />} onClick={() => updateApp(record.id, 'Approved')}>Approve</Button>
              <Button size="small" danger icon={<CloseCircleOutlined />} onClick={() => { setSelected(record); setIsRejectModalOpen(true); }}>Reject</Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  // Document row helper with upload capability
  const docRow = (has: boolean, label: string, required: boolean, autoPopulated?: boolean) => (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '12px 0', 
      borderBottom: '1px solid #f0f0f0',
      gap: '12px'
    }}>
      <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
        <PaperClipOutlined style={{ color: has ? '#52c41a' : '#d9d9d9', fontSize: 16, flexShrink: 0 }} />
        <div style={{ minWidth: 0 }}>
          <Text strong={required} style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {label}
            {required && <Text type="danger" style={{ marginLeft: 4 }}>*</Text>}
          </Text>
          {autoPopulated && <Tag color="geekblue" style={{ fontSize: 10, marginTop: 2 }}>AUTO-POPULATED</Tag>}
          {has && !autoPopulated && <Text type="secondary" style={{ fontSize: 11, display: 'block' }}>128 KB • PDF</Text>}
        </div>
      </div>
      <div style={{ flexShrink: 0 }}>
        <Space size={4}>
          {has ? (
            <>
              <Button size="small" type="text" icon={<EyeOutlined />}>View</Button>
              <Button size="small" type="text" icon={<DownloadOutlined />}>Download</Button>
              {!autoPopulated && (
                <Button size="small" type="text" danger icon={<DeleteOutlined />} onClick={() => message.info(`Remove feature coming soon`)}>Remove</Button>
              )}
            </>
          ) : (
            <Upload showUploadList={false} beforeUpload={() => { message.success(`${label} attached successfully`); return false; }}>
              <Button size="small" type="primary" ghost icon={<UploadOutlined />}>Attach</Button>
            </Upload>
          )}
        </Space>
      </div>
    </div>
  );

  const collateralIcon = (type: string) => {
    switch(type) {
      case 'Vehicle': return <CarOutlined />;
      case 'Property': return <HomeOutlined />;
      default: return <DollarOutlined />;
    }
  };
  
  const collateralStatusColor = (s: string) => s === 'Verified' ? 'green' : s === 'Pending Verification' ? 'orange' : 'red';

  return (
    <div>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={6}><Card bordered={false}><Statistic title="Total" value={apps.length} /></Card></Col>
        <Col span={6}><Card bordered={false}><Statistic title="Pending Review" value={apps.filter(a => ['Submitted', 'Under Review'].includes(a.status)).length} valueStyle={{ color: '#faad14' }} /></Card></Col>
        <Col span={6}><Card bordered={false}><Statistic title="Approved" value={apps.filter(a => ['Approved', 'Disbursed'].includes(a.status)).length} valueStyle={{ color: '#52c41a' }} /></Card></Col>
        <Col span={6}><Card bordered={false}><Statistic title="Total Requested" value={apps.reduce((s, a) => s + a.amount, 0)} prefix="$" valueStyle={{ color: '#1890ff' }} /></Card></Col>
      </Row>

      <Title level={4}>Loan Applications</Title>
      <Table columns={columns} dataSource={apps} rowKey="id" scroll={{ x: 1200 }} />

      {/* ========== APPLICATION REVIEW MODAL ========== */}
      <Modal
        title={<Space><FileSearchOutlined /> Application Review — {selected?.id}</Space>}
        open={isDetailsOpen}
        onCancel={() => setIsDetailsOpen(false)}
        footer={null}
        width={860}
      >
        {selected && (
          <div>
            {/* Workflow Steps */}
            <Card bordered={false} style={{ marginBottom: 16, background: '#fafafa' }}>
              <Steps size="small" current={statusSteps[selected.status] ?? 0} status={selected.status === 'Rejected' ? 'error' : 'process'}
                items={[{ title: 'Submitted' }, { title: 'Under Review' }, { title: selected.status === 'Rejected' ? 'Rejected' : 'Approved' }, { title: 'Disbursed' }]} />
            </Card>

            <Tabs items={[
              /* ---- TAB 1: BORROWER PROFILE ---- */
              {
                key: 'profile',
                label: <span><UserOutlined /> Borrower Profile</span>,
                children: (
                  <div>
                    {/* Profile Header with Avatar */}
                    <Card bordered={false} style={{ marginBottom: 16, background: '#fafafa' }}>
                      <Space size={16} align="start">
                        <Avatar size={80} src={selected.profilePicture} icon={<UserOutlined />} style={{ border: '2px solid #1677ff' }} />
                        <div>
                          <Title level={4} style={{ margin: 0 }}>{selected.borrower}</Title>
                          <Space style={{ marginTop: 4 }}>
                            <Tag color={selected.userType === 'Driver' ? 'blue' : selected.userType === 'Rider' ? 'green' : 'cyan'}>{selected.userType}</Tag>
                            {selected.userType === 'Driver' && <Tag>{selected.driverTier}</Tag>}
                            <Tag color="default">{selected.city}</Tag>
                          </Space>
                          <div style={{ marginTop: 4 }}><Text type="secondary">ID: </Text><Text code>{selected.idNumber}</Text></div>
                        </div>
                      </Space>
                    </Card>

                    <Row gutter={16}>
                      <Col span={12}>
                        <Descriptions bordered column={1} size="small" title="Personal Information">
                          <Descriptions.Item label="Full Name">{selected.borrower}</Descriptions.Item>
                          <Descriptions.Item label="ID Number"><Text code>{selected.idNumber}</Text></Descriptions.Item>
                          <Descriptions.Item label="Phone">{selected.phone}</Descriptions.Item>
                          <Descriptions.Item label="Email">{selected.email ? selected.email : <Text type="secondary" italic>Not provided</Text>}</Descriptions.Item>
                          <Descriptions.Item label="Address">{selected.address}</Descriptions.Item>
                          <Descriptions.Item label="City">{selected.city}</Descriptions.Item>
                          <Descriptions.Item label="Account Age">{selected.accountAge}</Descriptions.Item>
                          {selected.userType === 'Driver' && <Descriptions.Item label="Driver Tier"><Tag>{selected.driverTier}</Tag></Descriptions.Item>}
                          <Descriptions.Item label="Trips">{selected.trips}</Descriptions.Item>
                          <Descriptions.Item label="Rating">{selected.rating} ⭐</Descriptions.Item>
                        </Descriptions>
                      </Col>
                      <Col span={12}>
                        <Descriptions bordered column={1} size="small" title="Loan Request">
                          <Descriptions.Item label="Product"><Tag color="blue">{selected.product}</Tag></Descriptions.Item>
                          <Descriptions.Item label="Amount Requested"><Text strong style={{ fontSize: 16 }}>${selected.amount.toLocaleString()}</Text></Descriptions.Item>
                          <Descriptions.Item label="Status"><Tag color={statusColors[selected.status]}>{selected.status}</Tag></Descriptions.Item>
                          <Descriptions.Item label="Date Applied">{selected.date}</Descriptions.Item>
                        </Descriptions>

                        {selected.status === 'Rejected' && selected.rejectionReason && (
                          <Alert 
                            type="error" 
                            showIcon 
                            icon={<CloseCircleOutlined />}
                            message="Rejection Reason"
                            description={selected.rejectionReason}
                            style={{ marginTop: 16 }}
                          />
                        )}

                        {selected.proposedAmount && (
                          <Alert 
                            type="info" 
                            showIcon 
                            icon={<EditOutlined />}
                            message="Proposed Loan Adjustment"
                            description={
                              <div>
                                <Text>Original: <Text delete>${selected.amount.toLocaleString()}</Text> → Proposed: <Text strong>${selected.proposedAmount.toLocaleString()}</Text></Text>
                                <div style={{ marginTop: 4 }}><Text type="secondary">{selected.adjustmentNote}</Text></div>
                              </div>
                            }
                            style={{ marginTop: 16 }}
                          />
                        )}

                        {selected.requestedDocs && selected.requestedDocs.length > 0 && (
                          <Alert 
                            type="warning" 
                            showIcon 
                            icon={<UploadOutlined />}
                            message="Awaiting Requested Documents"
                            description={`Borrower notified to upload: ${selected.requestedDocs.join(', ')}`}
                            style={{ marginTop: 16 }}
                          />
                        )}

                        {selected.riskFlags.length > 0 && (
                          <Alert type="warning" showIcon icon={<WarningOutlined />}
                            message={`${selected.riskFlags.length} Risk Flag(s) Detected`}
                            description={<ul style={{ margin: '4px 0 0', paddingLeft: 16 }}>{selected.riskFlags.map((f, i) => <li key={i}>{f}</li>)}</ul>}
                            style={{ marginTop: 16 }} />
                        )}
                      </Col>
                    </Row>
                  </div>
                ),
              },

              /* ---- TAB 2: CREDIT & RISK SCORING ---- */
              {
                key: 'credit',
                label: <span><SafetyCertificateOutlined /> Credit & Risk</span>,
                children: (
                  <div>
                    {/* Score gauges row */}
                    <Row gutter={16} style={{ marginBottom: 16 }}>
                      <Col span={8}>
                        <Card bordered={false} style={{ textAlign: 'center' }}>
                          <Progress type="dashboard" percent={selected.creditScore} format={(p) => `${p}`}
                            strokeColor={selected.creditScore >= 80 ? '#52c41a' : selected.creditScore >= 60 ? '#faad14' : '#ff4d4f'} />
                          <div style={{ marginTop: 8 }}><Text strong>DashDrive Score</Text></div>
                          <Tag color={riskColor(selected.riskLevel)} style={{ marginTop: 4 }}>{selected.riskLevel} Risk</Tag>
                          <div><Text type="secondary" style={{ fontSize: 11 }}>Internal mobility data</Text></div>
                        </Card>
                      </Col>
                      <Col span={8}>
                        <Card bordered={false} style={{ textAlign: 'center' }}>
                          <Progress type="dashboard" percent={Math.round((selected.bureau.bureauScore / 900) * 100)} format={() => `${selected.bureau.bureauScore}`}
                            strokeColor={selected.bureau.bureauScore >= 650 ? '#52c41a' : selected.bureau.bureauScore >= 500 ? '#faad14' : '#ff4d4f'} />
                          <div style={{ marginTop: 8 }}><Text strong>{selected.bureau.bureau} Score</Text></div>
                          <Tag color={selected.bureau.bureauScore >= 650 ? 'green' : selected.bureau.bureauScore >= 500 ? 'orange' : 'red'} style={{ marginTop: 4 }}>{selected.bureau.scoreRating}</Tag>
                          <div><Text type="secondary" style={{ fontSize: 11 }}>External bureau data</Text></div>
                        </Card>
                      </Col>
                      <Col span={8}>
                        <Card bordered={false} style={{ textAlign: 'center' }}>
                          <Statistic title="Bureau Status" value={selected.bureau.status} valueStyle={{ color: selected.bureau.status === 'Clear' ? '#52c41a' : selected.bureau.status === 'Adverse' ? '#ff4d4f' : '#faad14', fontSize: 20 }} />
                          <Text type="secondary" style={{ fontSize: 11 }}>Report: {selected.bureau.reportDate}</Text>
                        </Card>
                      </Col>
                    </Row>

                    {/* DashDrive Internal Metrics */}
                    <Card title={<Space><GlobalOutlined /> DashDrive Platform Data</Space>} bordered={false} size="small" style={{ marginBottom: 16 }}>
                      <Descriptions bordered column={2} size="small">
                        {selected.userType === 'Driver' && (
                          <>
                            <Descriptions.Item label="DashDrive Earnings"><Text strong>${selected.monthlyEarnings}/mo</Text></Descriptions.Item>
                            <Descriptions.Item label="Avg Trips/Week">{selected.avgTripsPerWeek}</Descriptions.Item>
                            <Descriptions.Item label="Earnings Stability">
                              <Tag color={['Very Stable', 'Stable'].includes(selected.earningsStability) ? 'green' : selected.earningsStability === 'Moderate' ? 'orange' : 'red'}>{selected.earningsStability}</Tag>
                            </Descriptions.Item>
                          </>
                        )}
                        <Descriptions.Item label="Wallet Balance">${selected.walletBalance}</Descriptions.Item>
                        <Descriptions.Item label="Cancellation Rate">
                          <Tag color={selected.cancellationRate <= 5 ? 'green' : selected.cancellationRate <= 10 ? 'orange' : 'red'}>{selected.cancellationRate}%</Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Previous Loans (DashDrive)">{selected.previousLoans > 0 ? `${selected.previousLoans} loans` : 'None'}</Descriptions.Item>
                        <Descriptions.Item label="Repayment History">
                          <Tag color={selected.repaymentHistory.includes('On-time') ? 'green' : 'default'}>{selected.repaymentHistory}</Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Rating">{selected.rating} ⭐</Descriptions.Item>
                      </Descriptions>
                    </Card>

                    {/* External Bureau Report */}
                    <Card 
                      title={<Space><AuditOutlined /> {selected.bureau.bureau} — Credit Bureau Report</Space>} 
                      bordered={false} 
                      size="small" 
                      style={{ marginBottom: 16 }}
                      extra={
                        <Space>
                          {selected.bureau.hasReport && (
                            <Button size="small" type="link" icon={<EyeOutlined />} onClick={() => message.info('Opening FCB Credit Report PDF...')}>View Full Report</Button>
                          )}
                          <Upload showUploadList={false} beforeUpload={() => { message.success('Full Credit Report attached successfully'); return false; }}>
                            <Button size="small" icon={<UploadOutlined />} type={selected.bureau.hasReport ? 'default' : 'primary'} ghost={!selected.bureau.hasReport}>
                              {selected.bureau.hasReport ? 'Re-attach Report' : 'Attach Credit Report'}
                            </Button>
                          </Upload>
                        </Space>
                      }
                    >
                      <Descriptions bordered column={2} size="small">
                        <Descriptions.Item label="Bureau Score"><Text strong>{selected.bureau.bureauScore} / 900</Text></Descriptions.Item>
                        <Descriptions.Item label="Rating"><Tag color={selected.bureau.bureauScore >= 650 ? 'green' : selected.bureau.bureauScore >= 500 ? 'orange' : 'red'}>{selected.bureau.scoreRating}</Tag></Descriptions.Item>
                        <Descriptions.Item label="Active Credit Facilities">{selected.bureau.activeFacilities}</Descriptions.Item>
                        <Descriptions.Item label="Total Exposure">${selected.bureau.totalExposure.toLocaleString()}</Descriptions.Item>
                        <Descriptions.Item label="Current Delinquencies">
                          {selected.bureau.currentDelinquencies === 0 ? <Tag color="green">None</Tag> : <Tag color="red">{selected.bureau.currentDelinquencies}</Tag>}
                        </Descriptions.Item>
                        <Descriptions.Item label="Historical Defaults">
                          {selected.bureau.historicalDefaults === 0 ? <Tag color="green">None</Tag> : <Tag color="red">{selected.bureau.historicalDefaults}</Tag>}
                        </Descriptions.Item>
                        <Descriptions.Item label="Court Judgments">
                          {selected.bureau.judgments === 0 ? <Tag color="green">None</Tag> : <Tag color="red">{selected.bureau.judgments} judgment(s)</Tag>}
                        </Descriptions.Item>
                        <Descriptions.Item label="Enquiries (90 days)">
                          <Tag color={selected.bureau.enquiriesLast90Days <= 2 ? 'green' : selected.bureau.enquiriesLast90Days <= 4 ? 'orange' : 'red'}>{selected.bureau.enquiriesLast90Days}</Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Oldest Account">{selected.bureau.oldestAccount !== 'None' ? selected.bureau.oldestAccount : <Tag>No history</Tag>}</Descriptions.Item>
                        <Descriptions.Item label="Last Payment Status">
                          <Tag color={selected.bureau.lastPaymentStatus === 'Current' ? 'green' : selected.bureau.lastPaymentStatus === 'N/A' ? 'default' : 'red'}>{selected.bureau.lastPaymentStatus}</Tag>
                        </Descriptions.Item>
                      </Descriptions>
                    </Card>

                    {/* Bureau Alerts */}
                    {selected.bureau.alerts.length > 0 && (
                      <Alert type="error" showIcon icon={<WarningOutlined />}
                        message={`${selected.bureau.bureau} — ${selected.bureau.alerts.length} Alert(s)`}
                        description={<ul style={{ margin: '4px 0 0', paddingLeft: 16 }}>{selected.bureau.alerts.map((a, i) => <li key={i}>{a}</li>)}</ul>}
                      />
                    )}
                    {selected.bureau.status === 'Clear' && selected.bureau.alerts.length === 0 && (
                      <Alert type="success" showIcon message={`${selected.bureau.bureau} — No Adverse Findings`} description="Credit bureau report is clear. No delinquencies, defaults, or judgments found." />
                    )}
                  </div>
                ),
              },

              /* ---- TAB 3: DOCUMENTS ---- */
              {
                key: 'documents',
                label: <span><FileTextOutlined /> Documents</span>,
                children: selected && (
                  <div>
                    {/* Document Completeness Progress */}
                    {(() => {
                      const docs = selected.userType === 'Driver'
                        ? [selected.hasNationalId, selected.hasDriverLicense, selected.hasVehicleReg, selected.hasDashDriveEarnings, selected.hasOtherIncome, selected.hasPayslip]
                        : [selected.hasNationalId, selected.hasPayslip, selected.hasBankStatement, selected.hasEmploymentLetter, selected.hasOtherIncome];
                      const total = docs.length;
                      const uploaded = docs.filter(Boolean).length;
                      const pct = Math.round((uploaded / total) * 100);
                      return (
                        <Card bordered={false} style={{ marginBottom: 16, background: '#fafafa' }}>
                          <Row align="middle" gutter={16}>
                            <Col flex="auto">
                              <Text strong>Document Completeness</Text>
                              <Progress percent={pct} status={pct === 100 ? 'success' : 'active'} strokeColor={pct === 100 ? '#52c41a' : '#1890ff'} />
                            </Col>
                            <Col>
                              <Tag color={pct === 100 ? 'green' : pct >= 50 ? 'orange' : 'red'}>{uploaded} / {total} attached</Tag>
                            </Col>
                          </Row>
                        </Card>
                      );
                    })()}

                    <Row gutter={16}>
                      <Col span={12}>
                        <Card title={<Space><PaperClipOutlined /> Identity Documents</Space>} bordered={false} size="small">
                          {docRow(selected.hasNationalId, '🆔 National ID Copy', true)}
                          {selected.userType === 'Driver' && docRow(selected.hasDriverLicense, '🪪 Driver License Copy', true)}
                          {selected.userType === 'Driver' && docRow(selected.hasVehicleReg, '🚗 Vehicle Registration', false)}
                        </Card>
                      </Col>
                      <Col span={12}>
                        <Card title={<Space><PaperClipOutlined /> Income & Earnings</Space>} bordered={false} size="small">
                          {selected.userType === 'Driver' ? (
                            <>
                              {docRow(selected.hasDashDriveEarnings, '📊 DashDrive Earnings Data', false, true)}
                              {docRow(selected.hasOtherIncome, '💼 Other Source of Income', false)}
                              {docRow(selected.hasPayslip, '📄 Payslip (if applicable)', false)}
                            </>
                          ) : (
                            <>
                              {docRow(selected.hasPayslip, '📄 Payslip', true)}
                              {docRow(selected.hasBankStatement, '🏦 Bank Statement (3 months)', true)}
                              {docRow(selected.hasEmploymentLetter, '📋 Employment Letter', false)}
                              {docRow(selected.hasOtherIncome, '💼 Other Source of Income', false)}
                            </>
                          )}
                        </Card>
                      </Col>
                    </Row>

                    {/* Bulk upload area */}
                    <Card bordered={false} style={{ marginTop: 16 }}>
                      <Upload.Dragger
                        multiple
                        showUploadList={false}
                        beforeUpload={(file) => { message.success(`${file.name} attached`); return false; }}
                        style={{ padding: '16px 0' }}
                      >
                        <p><InboxOutlined style={{ fontSize: 36, color: '#1890ff' }} /></p>
                        <p><Text strong>Drag & drop files here or click to browse</Text></p>
                        <p><Text type="secondary">Supports PDF, JPG, PNG up to 10MB per file</Text></p>
                      </Upload.Dragger>
                    </Card>

                    {/* Missing docs warning */}
                    {(() => {
                      const missing: string[] = [];
                      if (!selected.hasNationalId) missing.push('National ID');
                      if (selected.userType === 'Driver' && !selected.hasDriverLicense) missing.push('Driver License');
                      if (selected.userType !== 'Driver') {
                        if (!selected.hasPayslip && !selected.hasBankStatement) missing.push('Payslip or Bank Statement');
                      }
                      if (missing.length > 0) {
                        return <Alert type="error" showIcon message="Missing Required Documents" description={`Please attach: ${missing.join(', ')}`} style={{ marginTop: 16 }} />;
                      }
                      return <Alert type="success" showIcon message="All Required Documents Attached" description="All mandatory documents have been uploaded." style={{ marginTop: 16 }} />;
                    })()}
                  </div>
                ),
              },

              /* ---- TAB 4: COLLATERAL PLEDGE ---- */
              {
                key: 'collateral',
                label: <span><CarOutlined /> Collateral</span>,
                children: (
                  <div>
                    {!selected.collateralRequired && selected.collateral.length === 0 ? (
                      <Alert type="info" showIcon message="No Collateral Required" description={`${selected.product} does not require collateral for this loan amount ($${selected.amount.toLocaleString()}).`} />
                    ) : (
                      <>
                        {selected.collateralRequired && selected.collateral.length === 0 && (
                          <Alert type="error" showIcon message="Collateral Required — None Pledged" description="This loan product requires collateral. The borrower has not submitted any collateral yet." style={{ marginBottom: 16 }} />
                        )}
                        {selected.collateral.length > 0 && (
                          <>
                            {selected.collateral.map((c, i) => (
                              <Card key={i} bordered style={{ marginBottom: 12 }}>
                                <Row gutter={16} align="middle">
                                  <Col span={3} style={{ textAlign: 'center', fontSize: 32, color: '#1890ff' }}>
                                    {collateralIcon(c.type)}
                                  </Col>
                                  <Col span={21}>
                                    <Descriptions bordered column={2} size="small">
                                      <Descriptions.Item label="Type"><Tag color="blue">{c.type}</Tag></Descriptions.Item>
                                      <Descriptions.Item label="Estimated Value"><Text strong style={{ color: '#52c41a' }}>${c.estimatedValue.toLocaleString()}</Text></Descriptions.Item>
                                      <Descriptions.Item label="Description" span={2}>{c.description}</Descriptions.Item>
                                      <Descriptions.Item label="Verification"><Tag color={collateralStatusColor(c.status)}>{c.status}</Tag></Descriptions.Item>
                                      <Descriptions.Item label="Proof of Ownership">{c.hasProof ? <Tag color="green">✓ Submitted</Tag> : <Tag color="red">✗ Not Submitted</Tag>}</Descriptions.Item>
                                    </Descriptions>
                                  </Col>
                                </Row>
                              </Card>
                            ))}

                            {/* Collateral-to-Loan ratio */}
                            {(() => {
                              const totalCollateralValue = selected.collateral.reduce((s, c) => s + c.estimatedValue, 0);
                              const ratio = totalCollateralValue > 0 ? ((totalCollateralValue / selected.amount) * 100).toFixed(0) : 0;
                              const ratioNum = Number(ratio);
                              return (
                                <Card bordered={false} style={{ background: '#fafafa', marginTop: 8 }}>
                                  <Row gutter={16} align="middle">
                                    <Col span={8}><Statistic title="Total Collateral Value" value={totalCollateralValue} prefix="$" valueStyle={{ color: '#52c41a' }} /></Col>
                                    <Col span={8}><Statistic title="Loan Amount" value={selected.amount} prefix="$" /></Col>
                                    <Col span={8}>
                                      <Statistic title="Cover Ratio" value={ratioNum} suffix="%" valueStyle={{ color: ratioNum >= 100 ? '#52c41a' : ratioNum >= 50 ? '#faad14' : '#ff4d4f' }} />
                                      <Text type="secondary" style={{ fontSize: 12 }}>{ratioNum >= 100 ? 'Fully covered' : ratioNum >= 50 ? 'Partially covered' : 'Under-collateralised'}</Text>
                                    </Col>
                                  </Row>
                                </Card>
                              );
                            })()}

                            {/* Unverified warning */}
                            {selected.collateral.some(c => c.status !== 'Verified') && (
                              <Alert type="warning" showIcon message="Collateral Verification Pending" description="One or more collateral items have not been verified yet. Do not approve until verification is complete." style={{ marginTop: 12 }} />
                            )}
                          </>
                        )}
                      </>
                    )}
                  </div>
                ),
              },

              /* ---- TAB 5: NEXT OF KIN ---- */
              {
                key: 'nextofkin',
                label: <span><TeamOutlined /> Next of Kin</span>,
                children: (
                  <div>
                    {selected.nextOfKin.length === 0 ? (
                      <Alert type="error" showIcon message="No Next of Kin Provided" description="The borrower has not submitted next of kin details. This is required before loan approval." />
                    ) : (
                      <>
                        <Row gutter={16}>
                          {selected.nextOfKin.map((nok, i) => (
                            <Col span={12} key={i}>
                              <Card
                                title={<Space><TeamOutlined /> {nok.relationship}</Space>}
                                bordered
                                size="small"
                                style={{ marginBottom: 12 }}
                                extra={<Tag color="purple">{i === 0 ? 'Primary' : 'Secondary'}</Tag>}
                              >
                                <Descriptions column={1} size="small" bordered>
                                  <Descriptions.Item label="Full Name"><Text strong>{nok.fullName}</Text></Descriptions.Item>
                                  <Descriptions.Item label="Relationship">{nok.relationship}</Descriptions.Item>
                                  <Descriptions.Item label="Phone">{nok.phone}</Descriptions.Item>
                                  <Descriptions.Item label="National ID"><Text code>{nok.nationalId}</Text></Descriptions.Item>
                                  <Descriptions.Item label="Address">{nok.address}</Descriptions.Item>
                                  <Descriptions.Item label="Employer">{nok.employer}</Descriptions.Item>
                                </Descriptions>
                              </Card>
                            </Col>
                          ))}
                        </Row>
                        {selected.nextOfKin.length < 2 && (
                          <Alert type="info" showIcon message="Only 1 Next of Kin" description="Some financiers require at least 2 next of kin contacts. Consider requesting a secondary contact." style={{ marginTop: 8 }} />
                        )}
                      </>
                    )}
                  </div>
                ),
              },

              /* ---- TAB 6: BANK & REPAYMENT ROUTING ---- */
              {
                key: 'banking',
                label: <span><BankOutlined /> Bank & Repayment</span>,
                children: (
                  <div>
                    <Card bordered={false} style={{ marginBottom: 16 }}>
                      <Descriptions bordered column={1} size="small" title="Bank Requirements">
                        <Descriptions.Item label="Partner Bank"><Tag color="blue" icon={<BankOutlined />}>{selected.partnerBank || 'No specific bank'}</Tag></Descriptions.Item>
                        <Descriptions.Item label="Bank Account Required">{selected.bankAccountRequired ? <Tag color="orange">Yes — Borrower must open account with {selected.partnerBank}</Tag> : <Tag color="green">Not Required</Tag>}</Descriptions.Item>
                        <Descriptions.Item label="Earnings Routing">{selected.earningsRoutingRequired ? <Tag color="orange">Yes — DashDrive payouts routed through {selected.partnerBank}</Tag> : <Tag color="green">Not Required</Tag>}</Descriptions.Item>
                        <Descriptions.Item label="Repayment Method"><Text strong>{selected.repaymentMethod}</Text></Descriptions.Item>
                      </Descriptions>
                    </Card>

                    {selected.earningsRoutingRequired && (
                      <Alert type="info" showIcon icon={<BankOutlined />} message="Payout Routing Active"
                        description={`Once approved, ${selected.borrower}'s DashDrive payouts will be routed to ${selected.partnerBank} for loan instalment obligations. Remaining balance credited to borrower's wallet.`}
                        style={{ marginBottom: 16 }} />
                    )}
                    {selected.bankAccountRequired && (
                      <Alert type="warning" showIcon message="Bank Account Requirement"
                        description={`${selected.partnerBank} requires an active bank account before disbursement.${selected.earningsRoutingRequired ? ' All future DashDrive earnings processed through this account.' : ''}`} />
                    )}

                    <Card title="Repayment Flow" bordered={false} style={{ marginTop: 16 }}>
                      <Steps direction="vertical" size="small" current={-1} items={
                        selected.earningsRoutingRequired ? [
                          { title: 'Loan Disbursed', description: `$${selected.amount.toLocaleString()} → ${selected.borrower}'s ${selected.partnerBank} account` },
                          { title: 'Earnings Routed', description: `DashDrive payouts → ${selected.partnerBank}` },
                          { title: 'Instalment Deducted', description: 'Bank deducts loan repayment from payout' },
                          { title: 'Balance Released', description: 'Remaining funds → borrower wallet' },
                        ] : [
                          { title: 'Loan Disbursed', description: `$${selected.amount.toLocaleString()} sent to borrower` },
                          { title: 'Repayment Due', description: 'Monthly instalment via ' + selected.repaymentMethod },
                          { title: 'Payment Collected', description: 'Auto-debit or manual payment' },
                        ]
                      } />
                    </Card>
                  </div>
                ),
              },
            ]} />

            {/* Action Buttons */}
            {['Submitted', 'Under Review'].includes(selected.status) && (
              <>
                <Divider />
                <Space style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button icon={<UploadOutlined />} onClick={() => { 
                    setSelectedDocsToRequest([]); 
                    setIsRequestDocsModalOpen(true); 
                  }}>Request Documents</Button>
                  <Button icon={<EditOutlined />} onClick={() => { 
                    setAdjustmentAmount(selected.proposedAmount || selected.amount); 
                    setAdjustmentRationale(selected.adjustmentNote || "");
                    setIsAdjustLoanModalOpen(true); 
                  }}>Adjust Loan Amount</Button>
                  <Button danger icon={<CloseCircleOutlined />} onClick={() => setIsRejectModalOpen(true)}>Reject Application</Button>
                  <Button type="primary" icon={<CheckCircleOutlined />} onClick={() => { updateApp(selected.id, 'Approved'); setIsDetailsOpen(false); }}>Approve Loan</Button>
                </Space>
              </>
            )}
            {selected.status === 'Approved' && (
              <>
                <Divider />
                <Space style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button type="primary" style={{ background: '#722ed1' }} icon={<DollarOutlined />} onClick={() => { updateApp(selected.id, 'Disbursed'); setIsDetailsOpen(false); }}>Disburse Loan</Button>
                </Space>
              </>
            )}
          </div>
        )}
      </Modal>

      {/* ========== REJECTION REASON MODAL ========== */}
      <Modal
        title={<Space><CloseCircleOutlined style={{ color: '#ff4d4f' }} /> Reject Application — {selected?.id}</Space>}
        open={isRejectModalOpen}
        onCancel={() => { setIsRejectModalOpen(false); setCustomReason(false); }}
        onOk={handleReject}
        okText="Confirm Rejection & Broadcast"
        okButtonProps={{ danger: true, disabled: !rejectionReason }}
        width={500}
      >
        <div style={{ marginBottom: 16 }}>
          <Text type="secondary">Provide a reason for rejecting this loan application. This reason will be broadcasted to the borrower's DashDrive app.</Text>
        </div>

        <div style={{ maxHeight: 300, overflowY: 'auto', marginBottom: 16 }}>
          {!customReason ? (
            <Space direction="vertical" style={{ width: '100%' }}>
              {suggestedReasons.map((reason, idx) => (
                <Button 
                  key={idx} 
                  block 
                  style={{ textAlign: 'left', whiteSpace: 'normal', height: 'auto', padding: '8px 12px' }}
                  type={rejectionReason === reason ? 'primary' : 'default'}
                  onClick={() => setRejectionReason(reason)}
                >
                  {reason}
                </Button>
              ))}
              <Button 
                block 
                type="dashed" 
                icon={<EditOutlined />} 
                onClick={() => { setCustomReason(true); setRejectionReason(""); }}
              >
                Other (Type custom reason)
              </Button>
            </Space>
          ) : (
            <div>
              <Text strong>Custom Reason:</Text>
              <textarea 
                className="ant-input" 
                rows={4} 
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Type the specific reason for rejection..."
                style={{ marginTop: 8 }}
              />
              <Button type="link" onClick={() => setCustomReason(false)} style={{ padding: 0, marginTop: 8 }}>
                Back to suggested reasons
              </Button>
            </div>
          )}
        </div>
      </Modal>

      {/* ========== REQUEST DOCUMENTS MODAL ========== */}
      <Modal
        title={<Space><UploadOutlined /> Request Missing Documents — {selected?.id}</Space>}
        open={isRequestDocsModalOpen}
        onCancel={() => setIsRequestDocsModalOpen(false)}
        onOk={handleRequestDocs}
        okText="Send Request"
        width={500}
      >
        <div style={{ marginBottom: 16 }}>
          <Text type="secondary">Select the documents you are requesting the borrower to upload. They will receive a notification in their DashDrive app.</Text>
        </div>
        
        <Card size="small" title="Identity & Legal" style={{ marginBottom: 12 }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            {['National ID Copy', 'Driver License Copy', 'Vehicle Registration', 'Proof of Residence'].map(doc => (
              <div key={doc} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>{doc}</Text>
                <Button 
                  size="small" 
                  type={selectedDocsToRequest.includes(doc) ? 'primary' : 'default'} 
                  onClick={() => setSelectedDocsToRequest(prev => prev.includes(doc) ? prev.filter(d => d !== doc) : [...prev, doc])}
                >
                  {selectedDocsToRequest.includes(doc) ? 'Selected' : 'Select'}
                </Button>
              </div>
            ))}
          </Space>
        </Card>

        <Card size="small" title="Financial & Income">
          <Space direction="vertical" style={{ width: '100%' }}>
            {['Payslip (latest)', 'Full Bank Statement (3-6 months)', 'Employment Letter', 'Tax Clearance', 'Alternative Income Proof'].map(doc => (
              <div key={doc} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>{doc}</Text>
                <Button 
                  size="small" 
                  type={selectedDocsToRequest.includes(doc) ? 'primary' : 'default'} 
                  onClick={() => setSelectedDocsToRequest(prev => prev.includes(doc) ? prev.filter(d => d !== doc) : [...prev, doc])}
                >
                  {selectedDocsToRequest.includes(doc) ? 'Selected' : 'Select'}
                </Button>
              </div>
            ))}
          </Space>
        </Card>
      </Modal>

      {/* ========== ADJUST LOAN MODAL ========== */}
      <Modal
        title={<Space><EditOutlined /> Adjust Loan Amount — {selected?.id}</Space>}
        open={isAdjustLoanModalOpen}
        onCancel={() => setIsAdjustLoanModalOpen(false)}
        onOk={handleAdjustLoan}
        okText="Propose Adjustment"
        width={500}
      >
        <div style={{ marginBottom: 24 }}>
          <Text type="secondary">Based on your risk assessment, you can propose a different loan amount to the borrower.</Text>
        </div>

        <Row align="middle" gutter={16} style={{ marginBottom: 16 }}>
          <Col span={10}><Text strong>Original Amount:</Text></Col>
          <Col span={14}><Text strong style={{ fontSize: 18 }}>${selected?.amount.toLocaleString()}</Text></Col>
        </Row>

        <Row align="middle" gutter={16} style={{ marginBottom: 24 }}>
          <Col span={10}><Text strong>Proposed Amount:</Text></Col>
          <Col span={14}>
            <input 
              type="number" 
              className="ant-input" 
              value={adjustmentAmount} 
              onChange={(e) => setAdjustmentAmount(Number(e.target.value))}
              placeholder="Enter new amount..."
              style={{ fontWeight: 'bold', color: '#1890ff', fontSize: 18 }}
            />
          </Col>
        </Row>

        <div style={{ marginBottom: 8 }}><Text strong>Rationale / Note to Borrower:</Text></div>
        <textarea 
          className="ant-input" 
          rows={3} 
          value={adjustmentRationale}
          onChange={(e) => setAdjustmentRationale(e.target.value)}
          placeholder="Explain why the amount was adjusted (e.g., Based on your monthly earnings, we recommend a lower instalment)..."
        />
      </Modal>
    </div>
  );
};
