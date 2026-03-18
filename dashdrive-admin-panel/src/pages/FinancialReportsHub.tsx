import React, { useState } from 'react';
import { 
  Typography, 
  Card, 
  Row, 
  Col, 
  Tabs, 
  Table, 
  Input, 
  Button, 
  Space, 
  Breadcrumb,
  Statistic,
  Tag,
  Modal,
  Descriptions,
  Divider,
  DatePicker,
  Select,
  Form,
  InputNumber,
  message,
  Alert,
  Dropdown,
  Flex,
  Drawer
} from 'antd';

const { RangePicker } = DatePicker;
import { 
  SearchOutlined, 
  DownloadOutlined, 
  FilterOutlined,
  DollarOutlined,
  CarOutlined,
  ClockCircleOutlined,
  PushpinOutlined,
  ArrowRightOutlined,
  BankOutlined,
  SafetyCertificateOutlined,
  BarChartOutlined,
  PrinterOutlined,
  FileProtectOutlined,
  CheckCircleOutlined,
  PlusOutlined,
  MoreOutlined,
  StopOutlined,
  UnlockOutlined,
  MinusOutlined,
  LineChartOutlined,
  PieChartOutlined,
  FileTextOutlined,
  PercentageOutlined,
  UndoOutlined,
  WalletOutlined,
  EditOutlined,
  AccountBookOutlined,
  ContainerOutlined,
  HistoryOutlined,
  AuditOutlined
} from '@ant-design/icons';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';
import { useNavigate, useLocation, Outlet, useSearchParams } from 'react-router-dom';

const { Title, Text } = Typography;
const { Option } = Select;

interface ReportData {
  key: string;
  sl: number;
  serviceId: string;
  date: string;
  zone: string;
  serviceType: string;
  totalCost: number;
  tripDiscount: number;
  couponDiscount: number;
  bookingFee: number;
  adminFee: number;
  platformFee: number;
  thirdPartyCosts: number;
  otherCosts: number;
  commission?: number;
  tax: number;
  amount: number;
  surgeFees?: number;
  cancellationFees?: number;
  tips?: number;
  expenseId?: string;
  earningId?: string;
  commissionRate?: number;
}

interface TransactionRecord {
  key: string;
  sl: number;
  transactionId: string;
  reference: string;
  date: string;
  to: string;
  credit: number;
  debit: number;
  balance: number;
  explanation: string;
}

interface SettlementRecord {
  key: string;
  sl: number;
  settlementId: string;
  providerName: string;
  payoutMethod: string;
  date: string;
  status: 'Paid' | 'Pending' | 'Processing';
  amount: number;
  linkedServiceIds: string[];
}

interface TaxRecord {
  key: string;
  sl: number;
  taxId: string;
  entityName: string;
  vatAmount: number;
  imttAmount: number;
  period: string;
  date: string;
  status: 'Remitted' | 'Pending';
  totalAmount: number;
}

interface RefundRecord {
  key: string;
  sl: number;
  refundId: string;
  serviceId: string;
  date: string;
  reason: string;
  method: string;
  status: 'Completed' | 'Requested' | 'Processing';
  amount: number;
}

interface WalletRecord {
  key: string;
  sl: number;
  walletId: string;
  holderName: string;
  type: 'Driver' | 'User' | 'Merchant';
  balance: number;
  status: 'Active' | 'Frozen';
}

interface AdjustmentRecord {
  key: string;
  sl: number;
  adjustmentId: string;
  date: string;
  amount: number;
  reason: string;
  type: 'Credit' | 'Debit';
  status: 'Approved' | 'Pending' | 'Rejected';
}

interface StatementItem {
  key: string;
  item: string;
  amount: number;
  type: 'Revenue' | 'Expense' | 'Asset' | 'Liability' | 'Equity' | 'Total';
  isHeader?: boolean;
}

interface TrialBalanceRecord {
  key: string;
  account: string;
  debit: number | null;
  credit: number | null;
}

interface ReconciliationRecord {
  key: string;
  sl: number;
  transactionId: string;
  internalAmount: number;
  externalAmount: number;
  difference: number;
  date: string;
  status: 'Matched' | 'Mismatched' | 'Pending';
  gateway: string;
}

interface FraudRecord {
  key: string;
  sl: number;
  entityId: string;
  entityType: 'User' | 'Driver' | 'Merchant';
  riskScore: number;
  reason: string;
  timestamp: string;
  status: 'Flagged' | 'Under Review' | 'Cleared' | 'Blocked';
}

interface TreasuryRecord {
  key: string;
  sl: number;
  bankName: string;
  accountNo: string;
  balance: number;
  reservedAmount: number;
  availableLiquidity: number;
  currency: string;
}

// Initial Data Assets (Outside component to avoid hoisting)
const initialEarningsData: ReportData[] = [
  { key: '1', sl: 1, serviceId: '#ORD-100047', earningId: '#ERN-88001', date: '20 July 2025, 04:58:12 pm', zone: 'North Zone', serviceType: 'Ride Hailing', totalCost: 1833369.89, tripDiscount: 150.00, couponDiscount: 50.00, bookingFee: 25.00, adminFee: 15.00, platformFee: 10.00, thirdPartyCosts: 45.50, otherCosts: 25.00, commission: 333339.98, tax: 166669.99, amount: 500009.97, commissionRate: 18.18, surgeFees: 500.00, cancellationFees: 20.00, tips: 15.00 },
  { key: '2', sl: 2, serviceId: '#ORD-100044', earningId: '#ERN-88002', date: '15 January 2025, 04:53:45 pm', zone: 'South Zone', serviceType: 'Food Delivery', totalCost: 85.50, tripDiscount: 5.00, couponDiscount: 2.50, bookingFee: 2.00, adminFee: 1.50, platformFee: 1.00, thirdPartyCosts: 3.20, otherCosts: 1.00, commission: 15.00, tax: 7.50, amount: 22.50, commissionRate: 17.5, surgeFees: 0, cancellationFees: 0, tips: 5.00 },
  { key: '3', sl: 3, serviceId: '#ORD-100043', earningId: '#ERN-88003', date: '15 January 2025, 04:51:22 pm', zone: 'East Zone', serviceType: 'Mart Delivery', totalCost: 120.50, tripDiscount: 0.00, couponDiscount: 5.00, bookingFee: 3.00, adminFee: 2.50, platformFee: 1.50, thirdPartyCosts: 4.10, otherCosts: 2.00, commission: 20.00, tax: 10.00, amount: 30.00, commissionRate: 16.6, surgeFees: 0, cancellationFees: 5.00, tips: 0 },
  { key: '4', sl: 4, serviceId: '#ORD-100042', earningId: '#ERN-88004', date: '15 January 2025, 04:50:08 pm', zone: 'West Zone', serviceType: 'Shopping', totalCost: 550.00, tripDiscount: 25.00, couponDiscount: 10.00, bookingFee: 15.00, adminFee: 10.00, platformFee: 8.00, thirdPartyCosts: 12.00, otherCosts: 5.00, commission: 55.00, tax: 27.50, amount: 82.50, commissionRate: 10.0, surgeFees: 0, cancellationFees: 0, tips: 0 },
  { key: '5', sl: 5, serviceId: '#ORD-100045', earningId: '#ERN-88005', date: '10 January 2025, 02:00:00 pm', zone: 'Central', serviceType: 'Hotel Booking', totalCost: 1200.00, tripDiscount: 0.00, couponDiscount: 100.00, bookingFee: 0.00, adminFee: 20.00, platformFee: 50.00, thirdPartyCosts: 0.00, otherCosts: 0.00, commission: 120.00, tax: 60.00, amount: 180.00, commissionRate: 10.0, surgeFees: 0, cancellationFees: 50.00, tips: 0 },
  { key: '6', sl: 6, serviceId: '#ORD-100046', earningId: '#ERN-88006', date: '11 January 2025, 03:30:00 pm', zone: 'North Zone', serviceType: 'Car Rental', totalCost: 450.00, tripDiscount: 0.00, couponDiscount: 0.00, bookingFee: 10.00, adminFee: 5.00, platformFee: 15.00, thirdPartyCosts: 20.00, otherCosts: 0.00, commission: 67.50, tax: 33.75, amount: 101.25, commissionRate: 15.0, surgeFees: 25.00, cancellationFees: 0, tips: 0 },
  { key: '7', sl: 7, serviceId: '#ORD-100047', earningId: '#ERN-88007', date: '12 January 2025, 10:15:00 am', zone: 'South Zone', serviceType: 'Parcel Delivery', totalCost: 35.00, tripDiscount: 2.00, couponDiscount: 0.00, bookingFee: 5.00, adminFee: 2.00, platformFee: 3.00, thirdPartyCosts: 5.00, otherCosts: 1.00, commission: 7.00, tax: 3.50, amount: 10.50, commissionRate: 20.0, surgeFees: 0, cancellationFees: 0, tips: 2.00 },
];

const initialExpensesData: ReportData[] = [
  { key: 'e1', sl: 1, serviceId: '#ORD-100047', expenseId: '#EXP-99001', date: '20 July 2025, 04:58 pm', zone: 'North Zone', serviceType: 'Driver Payout', totalCost: 0, tripDiscount: 0, couponDiscount: 0, bookingFee: 0, adminFee: 0, platformFee: 0, thirdPartyCosts: 0, otherCosts: 0, tax: 0, amount: 1500.00 },
  { key: 'e2', sl: 2, serviceId: '#ORD-100047', expenseId: '#EXP-99002', date: '20 July 2025, 04:58 pm', zone: 'North Zone', serviceType: 'Admin Fee', totalCost: 0, tripDiscount: 0, couponDiscount: 0, bookingFee: 0, adminFee: 0, platformFee: 0, thirdPartyCosts: 0, otherCosts: 0, tax: 0, amount: 15.00 },
  { key: 'e3', sl: 3, serviceId: '#ORD-100047', expenseId: '#EXP-99003', date: '20 July 2025, 04:58 pm', zone: 'North Zone', serviceType: '3rd Party Cost (Maps)', totalCost: 0, tripDiscount: 0, couponDiscount: 0, bookingFee: 0, adminFee: 0, platformFee: 0, thirdPartyCosts: 0, otherCosts: 0, tax: 0, amount: 45.50 },
  { key: 'e4', sl: 4, serviceId: '#ORD-100044', expenseId: '#EXP-99004', date: '15 January 2025, 04:53 pm', zone: 'South Zone', serviceType: 'Merchant Share', totalCost: 0, tripDiscount: 0, couponDiscount: 0, bookingFee: 0, adminFee: 0, platformFee: 0, thirdPartyCosts: 0, otherCosts: 0, tax: 0, amount: 2327.50 },
  { key: 'e5', sl: 5, serviceId: '#ORD-100044', expenseId: '#EXP-99005', date: '15 January 2025, 04:53 pm', zone: 'South Zone', serviceType: 'Booking Fee', totalCost: 0, tripDiscount: 0, couponDiscount: 0, bookingFee: 0, adminFee: 0, platformFee: 0, thirdPartyCosts: 0, otherCosts: 0, tax: 0, amount: 2.00 },
  { key: 'e6', sl: 6, serviceId: '#ORD-100042', expenseId: '#EXP-99006', date: '15 January 2025, 04:50 pm', zone: 'All Over The World', serviceType: 'Coupon Discount', totalCost: 0, tripDiscount: 0, couponDiscount: 0, bookingFee: 0, adminFee: 0, platformFee: 0, thirdPartyCosts: 0, otherCosts: 0, tax: 0, amount: 10.00 },
  { key: 'e7', sl: 7, serviceId: '#ORD-100042', expenseId: '#EXP-99007', date: '15 January 2025, 04:50 pm', zone: 'All Over The World', serviceType: 'Platform Operating Fee', totalCost: 0, tripDiscount: 0, couponDiscount: 0, bookingFee: 0, adminFee: 0, platformFee: 0, thirdPartyCosts: 0, otherCosts: 0, tax: 0, amount: 8.00 },
];

const initialTransactionsData: TransactionRecord[] = [
  { key: '1', sl: 1, transactionId: 'TRX-990422', reference: '#ORD-100047', date: '20 July 2025, 05:00 pm', to: 'Platform Earning Pool', credit: 500009.97, debit: 0, balance: 1250450.00, explanation: 'Commission Earning from Ride Request' },
  { key: '2', sl: 2, transactionId: 'TRX-990423', reference: '#EXP-100047', date: '20 July 2025, 05:10 pm', to: 'Driver Wallet', credit: 0, debit: 1500.00, balance: 1248950.00, explanation: 'Payout for Ride Request #ORD-100047' },
  { key: '3', sl: 3, transactionId: 'TRX-990424', reference: '#ORD-100044', date: '15 January 2025, 04:55 pm', to: 'Platform Earning Pool', credit: 22.50, debit: 0, balance: 1248972.50, explanation: 'Earning from Food Delivery' },
  { key: '4', sl: 4, transactionId: 'TRX-990425', reference: 'Google Maps API', date: '15 January 2025, 05:00 pm', to: 'Google Cloud Service', credit: 0, debit: 2450.00, balance: 1246522.50, explanation: 'Monthly API Usage Charge' },
];

const initialSettlementsData: SettlementRecord[] = [
  { key: '1', sl: 1, settlementId: 'SET-88001', providerName: 'John Doe (Driver)', payoutMethod: 'Bank Transfer', date: '21 July 2025', status: 'Paid', amount: 1500.00, linkedServiceIds: ['#ORD-100047', '#ORD-100052', '#ORD-100058'] },
  { key: '2', sl: 2, settlementId: 'SET-88002', providerName: 'QuickMart (Merchant)', payoutMethod: 'DashWallet', date: '22 July 2025', status: 'Pending', amount: 2327.50, linkedServiceIds: ['#FIN-100041', '#FIN-100045'] },
  { key: '3', sl: 3, settlementId: 'SET-88003', providerName: 'Alice Smith (Driver)', payoutMethod: 'Paypal', date: '23 July 2025', status: 'Processing', amount: 850.00, linkedServiceIds: ['#ORD-100061', '#ORD-100065', '#ORD-100072'] },
  { key: '4', sl: 4, settlementId: 'SET-88004', providerName: 'Burger King (Merchant)', payoutMethod: 'Bank Transfer', date: '24 July 2025', status: 'Paid', amount: 4500.00, linkedServiceIds: ['#FIN-100080', '#FIN-100085'] },
];

const initialTaxData: TaxRecord[] = [
  { key: 't1', sl: 1, taxId: 'TAX-101', entityName: 'Rides (Global)', vatAmount: 15400.00, imttAmount: 2050.00, period: 'Sep 2025', date: '30 Sep 2025', status: 'Pending', totalAmount: 17450.00 },
  { key: 't2', sl: 2, taxId: 'TAX-102', entityName: 'Food Delivery', vatAmount: 8200.50, imttAmount: 1100.20, period: 'Sep 2025', date: '25 Sep 2025', status: 'Remitted', totalAmount: 9300.70 },
  { key: 't3', sl: 3, taxId: 'TAX-103', entityName: 'Wallet P2P Transfers', vatAmount: 0, imttAmount: 4500.00, period: 'Sep 2025', date: '21 Sep 2025', status: 'Remitted', totalAmount: 4500.00 },
];

const initialRefundData: RefundRecord[] = [
  { key: 'r1', sl: 1, refundId: 'RFD-201', serviceId: '#ORD-100052', date: '22 July 2025', reason: 'Customer Cancellation', method: 'DashWallet', status: 'Completed', amount: 45.00 },
  { key: 'r2', sl: 2, refundId: 'RFD-202', serviceId: '#ORD-100058', date: '23 July 2025', reason: 'Late Delivery', method: 'Bank Transfer', status: 'Processing', amount: 12.50 },
];

const initialWalletsData: WalletRecord[] = [
  { key: 'w1', sl: 1, walletId: 'WLT-501', holderName: 'John Doe', type: 'Driver', balance: 1540.00, status: 'Active' },
  { key: 'w2', sl: 2, walletId: 'WLT-502', holderName: 'Sarah Smith', type: 'User', balance: 250.50, status: 'Active' },
  { key: 'w3', sl: 3, walletId: 'WLT-503', holderName: 'QuickMart', type: 'Merchant', balance: 4520.75, status: 'Active' },
  { key: 'w4', sl: 4, walletId: 'WLT-504', holderName: 'Mike Ross', type: 'Driver', balance: 0.00, status: 'Frozen' },
];

const initialAdjustmentsData: AdjustmentRecord[] = [
  { key: 'a1', sl: 1, adjustmentId: 'ADJ-901', date: '24 July 2025, 10:30:15 am', amount: 50.00, reason: 'Promotional Incentive', type: 'Credit', status: 'Approved' },
  { key: 'a2', sl: 2, adjustmentId: 'ADJ-902', date: '25 July 2025, 11:20:45 am', amount: 15.00, reason: 'Speeding Penalty', type: 'Debit', status: 'Approved' },
  { key: 'a3', sl: 3, adjustmentId: 'ADJ-903', date: '26 July 2025, 09:15:22 am', amount: 100.00, reason: 'Balance Correction', type: 'Credit', status: 'Pending' },
];


const initialReconciliationData: ReconciliationRecord[] = [
  { key: 'rec1', sl: 1, transactionId: 'TRX-990422', internalAmount: 500009.97, externalAmount: 500009.97, difference: 0, date: '20 July 2025', status: 'Matched', gateway: 'Stripe' },
  { key: 'rec2', sl: 2, transactionId: 'TRX-990423', internalAmount: 1500.00, externalAmount: 1500.00, difference: 0, date: '21 July 2025', status: 'Matched', gateway: 'PayPal' },
  { key: 'rec3', sl: 3, transactionId: 'TRX-990424', internalAmount: 22.50, externalAmount: 25.00, difference: -2.50, date: '22 July 2025', status: 'Mismatched', gateway: 'Stripe' },
  { key: 'rec4', sl: 4, transactionId: 'TRX-990425', internalAmount: 2450.00, externalAmount: 0, difference: 2450.00, date: '23 July 2025', status: 'Pending', gateway: 'Bank' },
];

const initialFraudData: FraudRecord[] = [
  { key: 'f1', sl: 1, entityId: '#USR-9901', entityType: 'User', riskScore: 88, reason: 'Rapid successive ride requests', timestamp: '20 July 2025, 10:30 am', status: 'Flagged' },
  { key: 'f2', sl: 2, entityId: '#DRV-5002', entityType: 'Driver', riskScore: 92, reason: 'GPS Spoofing detected', timestamp: '21 July 2025, 02:15 pm', status: 'Blocked' },
  { key: 'f3', sl: 3, entityId: '#MER-4403', entityType: 'Merchant', riskScore: 45, reason: 'Abnormal refund volume', timestamp: '22 July 2025, 09:00 am', status: 'Under Review' },
];

const initialTreasuryData: TreasuryRecord[] = [
  { key: 'tr1', sl: 1, bankName: 'Standard Chartered', accountNo: '**** 8829', balance: 2500000, reservedAmount: 500000, availableLiquidity: 2000000, currency: 'USD' },
  { key: 'tr2', sl: 2, bankName: 'CBZ Bank (Zim)', accountNo: '**** 1102', balance: 1200000, reservedAmount: 300000, availableLiquidity: 900000, currency: 'USD' },
];

export const FinancialReportsHub: React.FC = () => {
  const { isDark } = useTheme();
  const [searchText, setSearchText] = useState('');
  const [timeframe, setTimeframe] = useState('This Month');
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  
  // Map tab names to keys for deep linking
  const tabMap: Record<string, string> = {
    'earnings': '1',
    'expense': '2',
    'transactions': '3',
    'commission': '4',
    'refunds': '5',
    'wallets': '6',
    'adjustments': '7',
    'pnl': '8',
    'balance': '9',
    'trial': '10',
    'reconciliation': '11'
  };

  const initialTab = tabMap[tabParam || ''] || '1';
  const [activeTab, setActiveTab] = useState(initialTab);

  // Sync state if URL changes
  React.useEffect(() => {
    if (tabParam && tabMap[tabParam]) {
      setActiveTab(tabMap[tabParam]);
    }
  }, [tabParam]);

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    // Find name from key to update URL quietly
    const tabName = Object.keys(tabMap).find(name => tabMap[name] === key);
    if (tabName) {
      setSearchParams({ tab: tabName }, { replace: true });
    }
  };
  const [selectedSettlement, setSelectedSettlement] = useState<SettlementRecord | null>(null);
  const [isReceiptDrawerVisible, setIsReceiptDrawerVisible] = useState(false);
  const [isDetailsDrawerVisible, setIsDetailsDrawerVisible] = useState(false);
  const [isExpenseDrawerVisible, setIsExpenseDrawerVisible] = useState(false);
  const [isAdjustmentDrawerVisible, setIsAdjustmentDrawerVisible] = useState(false);
  const [isWalletActionDrawerVisible, setIsWalletActionDrawerVisible] = useState(false);
  const [walletActionType, setWalletActionType] = useState<'add' | 'debit' | 'freeze' | 'unfreeze'>('add');
  const [selectedWalletForAction, setSelectedWalletForAction] = useState<WalletRecord | null>(null);
  const [expenseForm] = Form.useForm();
  const [adjustmentForm] = Form.useForm();
  const [walletForm] = Form.useForm();

  // Reactive Financial States
  const [earnings, setEarnings] = useState<ReportData[]>(initialEarningsData);
  const [expenses, setExpenses] = useState<ReportData[]>(initialExpensesData);
  const [transactions, setTransactions] = useState<TransactionRecord[]>(initialTransactionsData);
  const [settlements, setSettlements] = useState<SettlementRecord[]>(initialSettlementsData);
  const [taxes, setTaxes] = useState<TaxRecord[]>(initialTaxData);
  const [refunds, setRefunds] = useState<RefundRecord[]>(initialRefundData);
  const [wallets, setWallets] = useState<WalletRecord[]>(initialWalletsData);
  const [adjustments, setAdjustments] = useState<AdjustmentRecord[]>(initialAdjustmentsData);
  const [reconciliations, setReconciliations] = useState<ReconciliationRecord[]>(initialReconciliationData);
  const [frauds, setFrauds] = useState<FraudRecord[]>(initialFraudData);
  const [treasuryData, setTreasuryData] = useState<TreasuryRecord[]>(initialTreasuryData);

  // Derived Metrics & Executive Logic
  const totalEarnings = earnings.reduce((sum, item) => sum + (item.amount || 0), 0);
  const totalExpenses = expenses.reduce((sum, item) => sum + (item.amount || 0), 0);
  const totalSettled = settlements.filter(s => s.status === 'Paid').reduce((sum, s) => sum + s.amount, 0);
  const totalTaxPayable = taxes.filter(t => t.status === 'Pending').reduce((sum, t) => sum + t.totalAmount, 0);
  const totalTaxRemitted = taxes.filter(t => t.status === 'Remitted').reduce((sum, t) => sum + t.totalAmount, 0);
  const totalIMTTPending = taxes.filter(t => t.status === 'Pending').reduce((sum, t) => sum + t.imttAmount, 0);
  const totalVATPending = taxes.filter(t => t.status === 'Pending').reduce((sum, t) => sum + t.vatAmount, 0);
  const totalReversals = refunds.reduce((sum, r) => sum + r.amount, 0);
  const platformLiquidity = wallets.reduce((sum, w) => sum + w.balance, 0);
  const driverEscrow = wallets.filter(w => w.type === 'Driver').reduce((sum, w) => sum + w.balance, 0);
  const userEscrow = wallets.filter(w => w.type === 'User').reduce((sum, w) => sum + w.balance, 0);

  // Dynamic P&L Data
  const pnLData: StatementItem[] = [
    { key: 'p1', item: 'Operating Revenue', amount: 0, type: 'Total', isHeader: true },
    { key: 'p2', item: 'Gross Service Revenue', amount: earnings.reduce((sum, e) => sum + (e.totalCost || 0), 0), type: 'Revenue' },
    { key: 'p3', item: 'Platform Fees Collected', amount: earnings.reduce((sum, e) => sum + (e.commission || 0), 0), type: 'Revenue' },
    { key: 'p4', item: 'Total Operating Revenue', amount: totalEarnings, type: 'Total' },
    { key: 'p5', item: 'Cost of Sales (COGS)', amount: 0, type: 'Total', isHeader: true },
    { key: 'p6', item: 'Provider Payments (Settled)', amount: totalSettled, type: 'Expense' },
    { key: 'p7', item: '3rd Party Service Costs', amount: earnings.reduce((sum, e) => sum + (e.thirdPartyCosts || 0), 0), type: 'Expense' },
    { key: 'p8', item: 'Gross Profit', amount: totalEarnings - totalSettled, type: 'Total' },
    { key: 'p9', item: 'Operating Expenses', amount: 0, type: 'Total', isHeader: true },
    { key: 'p10', item: 'Marketing & Discounts', amount: earnings.reduce((sum, e) => sum + (e.tripDiscount || 0) + (e.couponDiscount || 0), 0), type: 'Expense' },
    { key: 'p11', item: 'Administrative Fees', amount: earnings.reduce((sum, e) => sum + (e.adminFee || 0), 0), type: 'Expense' },
    { key: 'p12', item: 'Net Operating Income', amount: totalEarnings - totalExpenses, type: 'Total' },
  ];

  // Dynamic Balance Sheet
  const balanceSheetData: StatementItem[] = [
    { key: 'b1', item: 'Assets', amount: 0, type: 'Total', isHeader: true },
    { key: 'b2', item: 'Cash at Bank', amount: platformLiquidity * 1.5, type: 'Asset' },
    { key: 'b3', item: 'Digital Wallet Liquidity', amount: platformLiquidity, type: 'Asset' },
    { key: 'b4', item: 'Total Assets', amount: (platformLiquidity * 1.5) + platformLiquidity, type: 'Total' },
    { key: 'b5', item: 'Liabilities', amount: 0, type: 'Total', isHeader: true },
    { key: 'b6', item: 'Driver Escrow (Payable)', amount: driverEscrow, type: 'Liability' },
    { key: 'b7', item: 'User Wallet Balances (Payable)', amount: userEscrow, type: 'Liability' },
    { key: 'b8', item: 'Tax Liabilities (Unremitted)', amount: totalTaxPayable, type: 'Liability' },
    { key: 'b9', item: 'Total Liabilities', amount: driverEscrow + userEscrow + totalTaxPayable, type: 'Total' },
    { key: 'b10', item: 'Equity', amount: 0, type: 'Total', isHeader: true },
    { key: 'b11', item: 'Retained Earnings', amount: ((platformLiquidity * 1.5) + platformLiquidity) - (driverEscrow + userEscrow + totalTaxPayable), type: 'Equity' },
    { key: 'b12', item: 'Total Liabilities & Equity', amount: (platformLiquidity * 1.5) + platformLiquidity, type: 'Total' },
  ];

  // Dynamic Trial Balance
  const trialBalanceData: TrialBalanceRecord[] = [
    { key: 't1', account: 'Cash/Operating Account', debit: platformLiquidity * 1.5, credit: null },
    { key: 't2', account: 'Wallet Holding Account', debit: platformLiquidity, credit: null },
    { key: 't3', account: 'Driver Payout Pool', debit: null, credit: driverEscrow },
    { key: 't4', account: 'User Balance Pool', debit: null, credit: userEscrow },
    { key: 't5', account: 'Service Revenue Account', debit: null, credit: totalEarnings },
    { key: 't6', account: 'Administrative Expense', debit: pnLData.find(i => i.item === 'Administrative Fees')?.amount || 0, credit: null },
    { key: 't7', account: 'Tax Holding Account', debit: null, credit: totalTaxPayable },
    { key: 't8', account: 'Marketing Expense', debit: pnLData.find(i => i.item === 'Marketing & Discounts')?.amount || 0, credit: null },
    { key: 't9', account: 'Net Retained Earnings', debit: null, credit: balanceSheetData.find(i => i.item === 'Retained Earnings')?.amount || 0 },
  ];

  const handleWalletAction = (values: any) => {
    const amount = values.amount || 0;
    const actionDesc = walletActionType === 'add' ? 'Manual Fund Injection' : 
                      walletActionType === 'debit' ? 'Manual Fund Deduction' : 
                      walletActionType === 'freeze' ? 'Wallet Administrative Freeze' : 'Wallet Administrative Unfreeze';

    // 1. Update Wallets State
    setWallets(prev => prev.map(w => {
      if (w.walletId === selectedWalletForAction?.walletId) {
        if (walletActionType === 'add') return { ...w, balance: w.balance + amount };
        if (walletActionType === 'debit') return { ...w, balance: Math.max(0, w.balance - amount) };
        if (walletActionType === 'freeze') return { ...w, status: 'Frozen' };
        if (walletActionType === 'unfreeze') return { ...w, status: 'Active' };
      }
      return w;
    }));

    // 2. Update Master Transactions (only for money movement)
    if (walletActionType === 'add' || walletActionType === 'debit') {
      const newTrx: TransactionRecord = {
        key: `trx-${Date.now()}`,
        sl: transactions.length + 1,
        transactionId: `TRX-${Math.floor(Math.random() * 1000000)}`,
        reference: selectedWalletForAction?.walletId || 'N/A',
        date: new Date().toLocaleString(),
        to: selectedWalletForAction?.holderName || 'Platform',
        credit: walletActionType === 'add' ? amount : 0,
        debit: walletActionType === 'debit' ? amount : 0,
        balance: platformLiquidity + (walletActionType === 'add' ? amount : -amount),
        explanation: `${actionDesc} for ${selectedWalletForAction?.holderName}`
      };
      setTransactions([newTrx, ...transactions]);
    }

    message.success(`${actionDesc} completed successfully`);
  };
  
  const handleAddExpense = (values: any) => {
    const newExpense: ReportData = {
      key: `exp-${Date.now()}`,
      sl: expenses.length + 1,
      serviceId: '#MANUAL',
      expenseId: `EXP-${Math.floor(Math.random() * 1000000)}`,
      date: new Date().toLocaleString(),
      zone: values.zone || 'Central',
      serviceType: values.category,
      totalCost: 0,
      tripDiscount: 0,
      couponDiscount: 0,
      bookingFee: 0,
      adminFee: 0,
      platformFee: 0,
      thirdPartyCosts: 0,
      otherCosts: 0,
      tax: 0,
      amount: values.amount
    };
    
    setExpenses([newExpense, ...expenses]);
    
    setIsExpenseDrawerVisible(false);
    expenseForm.resetFields();
    message.success('Expense record added successfully');
  };

  const handleCreateAdjustment = (values: any) => {
    const newAdj: AdjustmentRecord = {
      key: `adj-${Date.now()}`,
      sl: adjustments.length + 1,
      adjustmentId: `ADJ-${Math.floor(Math.random() * 1000000)}`,
      date: new Date().toLocaleString(),
      amount: values.amount,
      reason: values.reason,
      type: values.type,
      status: 'Approved'
    };
    
    setAdjustments([newAdj, ...adjustments]);
    
    setIsAdjustmentDrawerVisible(false);
    adjustmentForm.resetFields();
    message.success('Ledger adjustment applied successfully');
  };

  // Dynamic Zone Statistics derived from state
  const zones = ['North Zone', 'South Zone', 'East Zone', 'West Zone', 'Central'];
  
  const getDynamicZoneStats = (data: any[], key: string) => {
    return zones.map(zone => ({
      name: zone,
      [key]: data.filter(item => item.zone === zone || zone === 'Central').reduce((sum, item) => sum + (item.amount || item.commission || 0), 0) / (zone === 'Central' ? 1 : 10) // Faking some variation for non-matching zones
    }));
  };

  const dynamicZoneStats = {
    'All Time': getDynamicZoneStats(earnings, 'earnings'),
    'This Month': getDynamicZoneStats(earnings, 'earnings'),
  };

  const dynamicZoneExpenseStats = {
    'All Time': getDynamicZoneStats(expenses, 'expense'),
    'This Month': getDynamicZoneStats(expenses, 'expense'),
  };

  const dynamicZoneCommissionStats = {
    'All Time': getDynamicZoneStats(earnings, 'commission'),
    'This Month': getDynamicZoneStats(earnings, 'commission'),
  };

  const zoneExpenseStats = {
    'All Time': [
      { name: 'North Zone', expense: 85000 },
      { name: 'South Zone', expense: 120000 },
      { name: 'East Zone', expense: 75000 },
      { name: 'West Zone', expense: 105000 },
      { name: 'Central', expense: 115450 },
    ],
    'Today': [
      { name: 'North Zone', expense: 1500 },
      { name: 'South Zone', expense: 2200 },
      { name: 'East Zone', expense: 1200 },
      { name: 'West Zone', expense: 1600 },
      { name: 'Central', expense: 2100 },
    ],
    'Previous Day': [
      { name: 'North Zone', expense: 3100 },
      { name: 'South Zone', expense: 4200 },
      { name: 'East Zone', expense: 2500 },
      { name: 'West Zone', expense: 3500 },
      { name: 'Central', expense: 3900 },
    ],
    'Last 7 Days': [
      { name: 'North Zone', expense: 22000 },
      { name: 'South Zone', expense: 31000 },
      { name: 'East Zone', expense: 19000 },
      { name: 'West Zone', expense: 25000 },
      { name: 'Central', expense: 28000 },
    ],
    'This Week': [
      { name: 'North Zone', expense: 15000 },
      { name: 'South Zone', expense: 21000 },
      { name: 'East Zone', expense: 12000 },
      { name: 'West Zone', expense: 17000 },
      { name: 'Central', expense: 19500 },
    ],
    'This Month': [
      { name: 'North Zone', expense: 75000 },
      { name: 'South Zone', expense: 95000 },
      { name: 'East Zone', expense: 62000 },
      { name: 'West Zone', expense: 82000 },
      { name: 'Central', expense: 91000 },
    ],
  };

  const zoneCommissionStats = {
    'All Time': [
      { name: 'North Zone', commission: 45000 },
      { name: 'South Zone', commission: 58000 },
      { name: 'East Zone', commission: 32000 },
      { name: 'West Zone', commission: 49000 },
      { name: 'Central', commission: 62000 },
    ],
    'Today': [
      { name: 'North Zone', commission: 850 },
      { name: 'South Zone', commission: 1200 },
      { name: 'East Zone', commission: 650 },
      { name: 'West Zone', commission: 980 },
      { name: 'Central', commission: 1100 },
    ],
    'Previous Day': [
      { name: 'North Zone', commission: 1600 },
      { name: 'South Zone', commission: 2100 },
      { name: 'East Zone', commission: 1300 },
      { name: 'West Zone', commission: 1850 },
      { name: 'Central', commission: 2200 },
    ],
    'Last 7 Days': [
      { name: 'North Zone', commission: 11000 },
      { name: 'South Zone', commission: 14500 },
      { name: 'East Zone', commission: 9200 },
      { name: 'West Zone', commission: 12800 },
      { name: 'Central', commission: 15400 },
    ],
    'This Week': [
      { name: 'North Zone', commission: 8200 },
      { name: 'South Zone', commission: 11000 },
      { name: 'East Zone', commission: 6800 },
      { name: 'West Zone', commission: 9100 },
      { name: 'Central', commission: 10500 },
    ],
    'This Month': [
      { name: 'North Zone', commission: 38000 },
      { name: 'South Zone', commission: 49000 },
      { name: 'East Zone', commission: 29000 },
      { name: 'West Zone', commission: 41000 },
      { name: 'Central', commission: 48000 },
    ],
  };

  const zoneTransactionStats = {
    'All Time': [
      { name: 'North Zone', transactions: 1250 },
      { name: 'South Zone', transactions: 1800 },
      { name: 'East Zone', transactions: 1100 },
      { name: 'West Zone', transactions: 1450 },
      { name: 'Central', transactions: 2160 },
    ],
    'Today': [
      { name: 'North Zone', transactions: 45 },
      { name: 'South Zone', transactions: 62 },
      { name: 'East Zone', transactions: 38 },
      { name: 'West Zone', transactions: 54 },
      { name: 'Central', transactions: 85 },
    ],
    'Previous Day': [
      { name: 'North Zone', transactions: 92 },
      { name: 'South Zone', transactions: 115 },
      { name: 'East Zone', transactions: 88 },
      { name: 'West Zone', transactions: 105 },
      { name: 'Central', transactions: 142 },
    ],
    'Last 7 Days': [
      { name: 'North Zone', transactions: 580 },
      { name: 'South Zone', transactions: 740 },
      { name: 'East Zone', transactions: 490 },
      { name: 'West Zone', transactions: 610 },
      { name: 'Central', transactions: 890 },
    ],
    'This Week': [
      { name: 'North Zone', transactions: 420 },
      { name: 'South Zone', transactions: 510 },
      { name: 'East Zone', transactions: 350 },
      { name: 'West Zone', transactions: 440 },
      { name: 'Central', transactions: 620 },
    ],
    'This Month': [
      { name: 'North Zone', transactions: 1100 },
      { name: 'South Zone', transactions: 1450 },
      { name: 'East Zone', transactions: 920 },
      { name: 'West Zone', transactions: 1180 },
      { name: 'Central', transactions: 1650 },
    ],
  };

  const zoneSettlementStats = {
    'All Time': [
      { name: 'North Zone', settlements: 85000 },
      { name: 'South Zone', settlements: 130000 },
      { name: 'East Zone', settlements: 72000 },
      { name: 'West Zone', settlements: 95000 },
      { name: 'Central', settlements: 115000 },
    ],
    'Today': [
      { name: 'North Zone', settlements: 1800 },
      { name: 'South Zone', settlements: 2400 },
      { name: 'East Zone', settlements: 1500 },
      { name: 'West Zone', settlements: 2100 },
      { name: 'Central', settlements: 2800 },
    ],
    'Previous Day': [
      { name: 'North Zone', settlements: 3500 },
      { name: 'South Zone', settlements: 4800 },
      { name: 'East Zone', settlements: 2900 },
      { name: 'West Zone', settlements: 4100 },
      { name: 'Central', settlements: 5200 },
    ],
    'Last 7 Days': [
      { name: 'North Zone', settlements: 21000 },
      { name: 'South Zone', settlements: 32000 },
      { name: 'East Zone', settlements: 18000 },
      { name: 'West Zone', settlements: 25000 },
      { name: 'Central', settlements: 29000 },
    ],
    'This Week': [
      { name: 'North Zone', settlements: 14000 },
      { name: 'South Zone', settlements: 21000 },
      { name: 'East Zone', settlements: 12000 },
      { name: 'West Zone', settlements: 17500 },
      { name: 'Central', settlements: 19000 },
    ],
    'This Month': [
      { name: 'North Zone', settlements: 75000 },
      { name: 'South Zone', settlements: 110000 },
      { name: 'East Zone', settlements: 62000 },
      { name: 'West Zone', settlements: 84000 },
      { name: 'Central', settlements: 91000 },
    ],
  };

  const chartColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const earningColumns = [
    { title: 'SL', dataIndex: 'sl', key: 'sl' },
    { title: 'Service ID', dataIndex: 'serviceId', key: 'serviceId', render: (text: string) => <Text strong>{text}</Text> },
    { title: 'Earning ID', dataIndex: 'earningId', key: 'earningId', render: (text: string) => <Text strong>{text}</Text> },
    { title: 'Date', dataIndex: 'date', key: 'date' },
    { 
      title: 'Service Type', 
      dataIndex: 'serviceType', 
      key: 'serviceType',
      render: (type: string) => (
        <Tag color={
          type.includes('Ride') ? 'blue' : 
          type.includes('Food') ? 'orange' :
          type.includes('Fintech') ? 'purple' :
          type.includes('Insurance') ? 'pink' :
          'green'
        }>{type}</Tag>
      )
    },
    { 
      title: 'Gross GBV ($)', 
      dataIndex: 'totalCost', 
      key: 'totalCost',
      render: (val: number) => `$${val.toLocaleString()}`
    },
    { 
      title: 'Surge/Fees ($)', 
      key: 'fees',
      render: (_: any, record: ReportData) => (
        <Space direction="vertical" size={0}>
          <Text style={{ fontSize: 12 }} type="secondary">Surge: ${(record.surgeFees || 0).toLocaleString()}</Text>
          <Text style={{ fontSize: 12 }} type="secondary">Cancel: ${(record.cancellationFees || 0).toLocaleString()}</Text>
        </Space>
      )
    },
    { 
      title: 'Platform Comm ($)', 
      dataIndex: 'commission', 
      key: 'commission',
      render: (val?: number) => val !== undefined ? `$${val.toLocaleString()}` : '-'
    },
    { 
      title: 'Tax Collected($)', 
      dataIndex: 'tax', 
      key: 'tax',
      render: (val: number) => `$${(val || 0).toLocaleString()}`
    },
    {
      title: 'Tips ($)',
      dataIndex: 'tips',
      key: 'tips',
      render: (val: number) => `$${(val || 0).toLocaleString()}`
    },
    { 
      title: 'Net Earning($)', 
      dataIndex: 'amount', 
      key: 'amount',
      render: (val: number) => <Text strong style={{ color: '#10b981' }}>${(val || 0).toLocaleString()}</Text>
    },
  ];

  const transactionColumns = [
    { title: 'SL', dataIndex: 'sl', key: 'sl' },
    { title: 'Transaction ID', dataIndex: 'transactionId', key: 'transactionId', render: (text: string) => <Text strong>{text}</Text> },
    { title: 'Reference', dataIndex: 'reference', key: 'reference' },
    { title: 'Date', dataIndex: 'date', key: 'date' },
    { title: 'To/From', dataIndex: 'to', key: 'to', render: (text: string) => <Tag color="blue">{text}</Tag> },
    { title: 'Credit ($)', dataIndex: 'credit', key: 'credit', render: (val: number) => val > 0 ? <Text strong style={{ color: '#10b981' }}>+${val.toLocaleString()}</Text> : '-' },
    { title: 'Debit ($)', dataIndex: 'debit', key: 'debit', render: (val: number) => val > 0 ? <Text strong style={{ color: '#ef4444' }}>-${val.toLocaleString()}</Text> : '-' },
    { title: 'Balance ($)', dataIndex: 'balance', key: 'balance', render: (val: number) => <Text strong>${val.toLocaleString()}</Text> },
    { title: 'Explanation', dataIndex: 'explanation', key: 'explanation', width: 250 },
  ];

  const settlementColumns = [
    { title: 'SL', dataIndex: 'sl', key: 'sl' },
    { title: 'Settlement ID', dataIndex: 'settlementId', key: 'settlementId', render: (text: string) => <Text strong>{text}</Text> },
    { title: 'Provider', dataIndex: 'providerName', key: 'providerName' },
    { title: 'Method', dataIndex: 'payoutMethod', key: 'payoutMethod', render: (text: string) => <Tag color="cyan">{text}</Tag> },
    { title: 'Date', dataIndex: 'date', key: 'date' },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'Paid' ? 'green' : (status === 'Processing' ? 'blue' : 'orange')}>
          {status}
        </Tag>
      )
    },
    { title: 'Amount ($)', dataIndex: 'amount', key: 'amount', render: (val: number) => <Text strong>${val.toLocaleString()}</Text> },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: SettlementRecord) => (
        <Space>
          <Button size="small" type="link" onClick={() => { setSelectedSettlement(record); setIsDetailsDrawerVisible(true); }}>Details</Button>
          <Button size="small" type="link" onClick={() => { setSelectedSettlement(record); setIsReceiptDrawerVisible(true); }}>Receipt</Button>
        </Space>
      )
    }
  ];

  const expenseColumns = [
    { title: 'SL', dataIndex: 'sl', key: 'sl' },
    { title: 'Expense ID', dataIndex: 'expenseId', key: 'expenseId', render: (text: string) => <Text strong>{text}</Text> },
    { title: 'Service ID', dataIndex: 'serviceId', key: 'serviceId' },
    { title: 'Date', dataIndex: 'date', key: 'date' },
    { title: 'Category', dataIndex: 'serviceType', key: 'serviceType', render: (text: string) => <Tag color="volcano">{text}</Tag> },
    { title: 'Zone', dataIndex: 'zone', key: 'zone' },
    { title: 'Amount ($)', dataIndex: 'amount', key: 'amount', render: (val: number) => <Text strong style={{ color: '#ef4444' }}>${(val || 0).toLocaleString()}</Text> },
  ];
  
  const commissionColumns = [
    { title: 'SL', dataIndex: 'sl', key: 'sl' },
    { title: 'Service ID', dataIndex: 'serviceId', key: 'serviceId', render: (id: string) => <Text strong>{id}</Text> },
    { title: 'Date', dataIndex: 'date', key: 'date' },
    { 
      title: 'Service Category', 
      dataIndex: 'serviceType', 
      key: 'serviceType',
      render: (type: string) => <Tag color="blue">{type}</Tag>
    },
    { 
      title: 'Gross GBV ($)', 
      dataIndex: 'totalCost', 
      key: 'totalCost',
      render: (val: number) => `$${val.toLocaleString()}`
    },
    { 
      title: 'Comm Rate (%)', 
      dataIndex: 'commissionRate', 
      key: 'commissionRate',
      render: (val: number) => `${val}%`
    },
    { 
      title: 'Platform Comm ($)', 
      dataIndex: 'commission', 
      key: 'commission',
      render: (val: number) => <Text strong style={{ color: '#10b981' }}>${val.toLocaleString()}</Text>
    },
  ];

  const taxColumns = [
    { title: 'SL', dataIndex: 'sl', key: 'sl' },
    { title: 'Tax ID', dataIndex: 'taxId', key: 'taxId', render: (text: string) => <Text strong>{text}</Text> },
    { title: 'Service/Category', dataIndex: 'entityName', key: 'entityName' },
    { title: 'VAT (15%) ($)', dataIndex: 'vatAmount', key: 'vatAmount', render: (val: number) => `$${val.toLocaleString()}` },
    { title: 'IMTT (2%) ($)', dataIndex: 'imttAmount', key: 'imttAmount', render: (val: number) => `$${val.toLocaleString()}` },
    { title: 'Due Date', dataIndex: 'date', key: 'date' },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'Remitted' ? 'green' : 'orange'}>
          {status === 'Remitted' ? 'Remitted to ZIMRA' : 'Pending Remittance'}
        </Tag>
      )
    },
    { title: 'Total ($)', dataIndex: 'totalAmount', key: 'totalAmount', render: (val: number) => <Text strong>${val.toLocaleString()}</Text> },
  ];

  const refundColumns = [
    { title: 'SL', dataIndex: 'sl', key: 'sl' },
    { title: 'Refund ID', dataIndex: 'refundId', key: 'refundId', render: (text: string) => <Text strong>{text}</Text> },
    { title: 'Service ID', dataIndex: 'serviceId', key: 'serviceId' },
    { title: 'Date', dataIndex: 'date', key: 'date' },
    { title: 'Reason', dataIndex: 'reason', key: 'reason' },
    { title: 'Method', dataIndex: 'method', key: 'method' },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status',
      render: (status: string) => <Tag color={status === 'Completed' ? 'green' : 'orange'}>{status}</Tag>
    },
    { 
      title: 'Refund Amount ($)', 
      dataIndex: 'amount', 
      key: 'amount',
      render: (val: number) => <Text strong style={{ color: '#ef4444' }}>-${val.toLocaleString()}</Text> 
    },
  ];

  const walletColumns = [
    { title: 'SL', dataIndex: 'sl', key: 'sl' },
    { title: 'Wallet ID', dataIndex: 'walletId', key: 'walletId', render: (text: string) => <Text strong>{text}</Text> },
    { title: 'Holder Name', dataIndex: 'holderName', key: 'holderName' },
    { 
      title: 'Type', 
      dataIndex: 'type', 
      key: 'type',
      render: (type: string) => (
        <Tag color={type === 'Driver' ? 'blue' : type === 'User' ? 'green' : 'orange'}>{type}</Tag>
      )
    },
    { title: 'Balance ($)', dataIndex: 'balance', key: 'balance', render: (val: number) => <Text strong>${val.toLocaleString()}</Text> },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status',
      render: (status: string) => <Tag color={status === 'Active' ? 'success' : 'error'}>{status}</Tag>
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: WalletRecord) => (
        <Dropdown
          menu={{
            items: [
              {
                key: 'add',
                label: 'Add Funds',
                icon: <PlusOutlined />,
                onClick: () => {
                  setSelectedWalletForAction(record);
                  setWalletActionType('add');
                  setIsWalletActionDrawerVisible(true);
                  walletForm.setFieldsValue({ amount: 100, reason: 'Manual Adjustment' });
                }
              },
              {
                key: 'debit',
                label: 'Debit Funds',
                icon: <MinusOutlined />,
                onClick: () => {
                  setSelectedWalletForAction(record);
                  setWalletActionType('debit');
                  setIsWalletActionDrawerVisible(true);
                  walletForm.setFieldsValue({ amount: 100, reason: 'Fee Deduction' });
                }
              },
              {
                type: 'divider'
              },
              {
                key: 'toggle',
                label: record.status === 'Active' ? 'Freeze Wallet' : 'Unfreeze Wallet',
                danger: record.status === 'Active',
                icon: record.status === 'Active' ? <StopOutlined /> : <UnlockOutlined />,
                onClick: () => {
                  setSelectedWalletForAction(record);
                  setWalletActionType(record.status === 'Active' ? 'freeze' : 'unfreeze');
                  setIsWalletActionDrawerVisible(true);
                  walletForm.setFieldsValue({ reason: 'Governance Policy' });
                }
              }
            ]
          }}
          trigger={['click']}
        >
          <Button size="small" icon={<MoreOutlined />} />
        </Dropdown>
      )
    },
  ];

  const adjustmentColumns = [
    { title: 'SL', dataIndex: 'sl', key: 'sl' },
    { title: 'Adjustment ID', dataIndex: 'adjustmentId', key: 'adjustmentId', render: (text: string) => <Text strong>{text}</Text> },
    { title: 'Date', dataIndex: 'date', key: 'date' },
    { title: 'Reason', dataIndex: 'reason', key: 'reason' },
    { 
      title: 'Type', 
      dataIndex: 'type', 
      key: 'type',
      render: (type: string) => <Tag color={type === 'Credit' ? 'green' : 'red'}>{type}</Tag>
    },
    { 
      title: 'Amount ($)', 
      dataIndex: 'amount', 
      key: 'amount', 
      render: (val: number, record: AdjustmentRecord) => (
        <Text strong style={{ color: record.type === 'Credit' ? '#10b981' : '#ef4444' }}>
          {record.type === 'Credit' ? '+' : '-'}${val.toLocaleString()}
        </Text>
      ) 
    },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'Approved' ? 'green' : status === 'Pending' ? 'orange' : 'red'}>{status}</Tag>
      )
    },
  ];

  const reconciliationColumns = [
    { title: 'SL', dataIndex: 'sl', key: 'sl' },
    { title: 'Transaction ID', dataIndex: 'transactionId', key: 'transactionId', render: (text: string) => <Text strong>{text}</Text> },
    { title: 'Date', dataIndex: 'date', key: 'date' },
    { title: 'Gateway', dataIndex: 'gateway', key: 'gateway', render: (text: string) => <Tag color="blue">{text}</Tag> },
    { title: 'Internal Amount ($)', dataIndex: 'internalAmount', key: 'internalAmount', render: (val: number) => `$${val.toLocaleString()}` },
    { title: 'External Amount ($)', dataIndex: 'externalAmount', key: 'externalAmount', render: (val: number) => `$${val.toLocaleString()}` },
    { 
      title: 'Difference ($)', 
      dataIndex: 'difference', 
      key: 'difference', 
      render: (val: number) => (
        <Text strong style={{ color: val === 0 ? '#10b981' : '#ef4444' }}>
          {val > 0 ? '+' : ''}${val.toLocaleString()}
        </Text>
      )
    },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'Matched' ? 'green' : (status === 'Mismatched' ? 'red' : 'orange')}>
          {status}
        </Tag>
      )
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: ReconciliationRecord) => (
        record.status !== 'Matched' && (
          <Button 
            size="small" 
            type="primary" 
            ghost
            onClick={() => handleReconcile(record.key)}
          >
            Match Manually
          </Button>
        )
      )
    }
  ];

  const fraudColumns = [
    { title: 'SL', dataIndex: 'sl', key: 'sl' },
    { title: 'Entity ID', dataIndex: 'entityId', key: 'entityId', render: (text: string) => <Text strong>{text}</Text> },
    { title: 'Type', dataIndex: 'entityType', key: 'entityType', render: (type: string) => <Tag color="blue">{type}</Tag> },
    { 
      title: 'Risk Score', 
      dataIndex: 'riskScore', 
      key: 'riskScore',
      render: (score: number) => (
        <Space direction="vertical" size={0}>
          <Text strong style={{ color: score > 80 ? '#ef4444' : score > 50 ? '#f59e0b' : '#10b981' }}>{score}</Text>
          <div style={{ width: 80, height: 4, background: '#eee', borderRadius: 2 }}>
            <div style={{ width: `${score}%`, height: '100%', background: score > 80 ? '#ef4444' : score > 50 ? '#f59e0b' : '#10b981', borderRadius: 2 }} />
          </div>
        </Space>
      )
    },
    { title: 'Reason', dataIndex: 'reason', key: 'reason' },
    { title: 'Timestamp', dataIndex: 'timestamp', key: 'timestamp' },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'Blocked' ? 'red' : status === 'Flagged' ? 'orange' : status === 'Under Review' ? 'blue' : 'green'}>
          {status}
        </Tag>
      )
    },
  ];

  const treasuryColumns = [
    { title: 'SL', dataIndex: 'sl', key: 'sl' },
    { title: 'Bank/Account', dataIndex: 'bankName', key: 'bankName', render: (text: string, record: TreasuryRecord) => (
      <Space direction="vertical" size={0}>
        <Text strong>{text}</Text>
        <Text style={{ fontSize: 12 }} type="secondary">{record.accountNo}</Text>
      </Space>
    )},
    { title: 'Total Balance ($)', dataIndex: 'balance', key: 'balance', render: (val: number) => <Text strong>${val.toLocaleString()}</Text> },
    { title: 'Reserved ($)', dataIndex: 'reservedAmount', key: 'reservedAmount', render: (val: number) => <Text style={{ color: '#f59e0b' }}>-${val.toLocaleString()}</Text> },
    { title: 'Available ($)', dataIndex: 'availableLiquidity', key: 'availableLiquidity', render: (val: number) => <Text strong style={{ color: '#10b981' }}>${val.toLocaleString()}</Text> },
  ];

  const handleReconcile = (key: string) => {
    setReconciliations(prev => prev.map(r => r.key === key ? { ...r, status: 'Matched', difference: 0, externalAmount: r.internalAmount } : r));

    message.success('Transaction reconciled successfully');
  };

  const handleExport = () => {
    const dataToExport = (
      activeTab === '3' ? transactions :
      activeTab === '4' ? earnings :
      activeTab === '5' ? refunds :
      activeTab === '6' ? wallets :
      activeTab === '7' ? adjustments :
      activeTab === '11' ? reconciliations :
      activeTab === '2' ? expenses :
      earnings
    );

    // Generic CSV Export Logic
    const headers = Object.keys(dataToExport[0] || {}).join(',');
    const rows = dataToExport.map(item => Object.values(item).map(v => `"${v}"`).join(','));
    const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + rows.join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `finance_report_${activeTab}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    message.success('Report exported to CSV successfully');
  };

  const pnLColumns = [
    {
      title: 'Accounting Item',
      dataIndex: 'item',
      key: 'item',
      render: (text: string, record: StatementItem) => (
        <Text strong={record.isHeader} style={{ fontSize: record.isHeader ? 16 : 14, color: record.isHeader ? '#3b82f6' : 'inherit' }}>
          {text}
        </Text>
      )
    },
    {
      title: 'Amount ($)',
      dataIndex: 'amount',
      key: 'amount',
      align: 'right' as const,
      render: (val: number, record: StatementItem) => (
        <Text strong={record.type === 'Total'} style={{ color: record.type === 'Expense' ? '#ef4444' : (record.type === 'Revenue' ? '#10b981' : 'inherit') }}>
          {val === 0 && record.isHeader ? '' : `$${val.toLocaleString()}`}
        </Text>
      )
    },
  ];

  const balanceSheetColumns = [
    {
      title: 'Classification',
      dataIndex: 'item',
      key: 'item',
      render: (text: string, record: StatementItem) => (
        <Text strong={record.isHeader} style={{ fontSize: record.isHeader ? 16 : 14, color: record.isHeader ? '#f59e0b' : 'inherit' }}>
          {text}
        </Text>
      )
    },
    {
      title: 'Value ($)',
      dataIndex: 'amount',
      key: 'amount',
      align: 'right' as const,
      render: (val: number, record: StatementItem) => (
        <Text strong={record.type === 'Total'}>
          {val === 0 && record.isHeader ? '' : `$${val.toLocaleString()}`}
        </Text>
      )
    },
  ];

  const trialBalanceColumns = [
    { title: 'Account Name', dataIndex: 'account', key: 'account', render: (text: string) => <Text strong>{text}</Text> },
    {
      title: 'Debit ($)',
      dataIndex: 'debit',
      key: 'debit',
      align: 'right' as const,
      render: (val: number | null) => val ? `$${val.toLocaleString()}` : '-'
    },
    {
      title: 'Credit ($)',
      dataIndex: 'credit',
      key: 'credit',
      align: 'right' as const,
      render: (val: number | null) => val ? `$${val.toLocaleString()}` : '-'
    },
  ];

  // Executive Summary Post-Derivation Logic
  const activeData = (activeTab === '1') ? earnings : expenses;

  const filteredData = activeData.filter((item: any) =>
    (item.serviceId || '').toLowerCase().includes(searchText.toLowerCase()) ||
    (item.serviceType || '').toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div style={{ padding: '0 0 24px 0' }}>
      <div style={{ marginBottom: 24 }}>
        <Breadcrumb
          items={[
            { title: 'Finance' },
            { title: 'Financial Reports Hub' }
          ]}
          style={{ marginBottom: 16 }}
        />
        <Title level={4} style={{ margin: 0 }}>Financial Reports Hub</Title>
      </div>

      {/* EXECUTIVE KPI DASHBOARD */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card variant="borderless" className="shadow-sm" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', borderRadius: 16 }}>
            <Statistic
              title={<Text style={{ color: 'rgba(255,255,255,0.8)' }}>Gross Booking Value</Text>}
              value={earnings.reduce((sum, e) => sum + (e.totalCost || 0), 0)}
              prefix={<span style={{ color: '#fff' }}>$</span>}
              precision={2}
              styles={{ content: { color: '#fff', fontWeight: 800 } }}
            />
            <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>Across all verticals</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card variant="borderless" className="shadow-sm" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', borderRadius: 16 }}>
            <Statistic
              title={<Text style={{ color: 'rgba(255,255,255,0.8)' }}>Net Platform Profit</Text>}
              value={totalEarnings - totalExpenses}
              prefix={<span style={{ color: '#fff' }}>$</span>}
              precision={2}
              styles={{ content: { color: '#fff', fontWeight: 800 } }}
            />
            <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>Total Earning - Expenses</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card variant="borderless" className="shadow-sm" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', borderRadius: 16 }}>
            <Statistic
              title={<Text style={{ color: 'rgba(255,255,255,0.8)' }}>Tax Liability (ZIMRA)</Text>}
              value={totalTaxPayable}
              prefix={<span style={{ color: '#fff' }}>$</span>}
              precision={2}
              styles={{ content: { color: '#fff', fontWeight: 800 } }}
            />
            <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>Pending IMTT & VAT</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card variant="borderless" className="shadow-sm" style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', borderRadius: 16 }}>
            <Statistic
              title={<Text style={{ color: 'rgba(255,255,255,0.8)' }}>Active Partners</Text>}
              value={1250}
              suffix={<span style={{ color: '#fff', fontSize: 14, marginLeft: 4 }}>Live</span>}
              styles={{ content: { color: '#fff', fontWeight: 800 } }}
            />
            <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>Drivers & Merchants</Text>
          </Card>
        </Col>
      </Row>

      {/* GLOBAL HUB FILTERS */}
      <Card variant="borderless" className="shadow-sm" style={{ borderRadius: 16, marginBottom: 24 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={6}>
            <Text strong type="secondary" style={{ display: 'block', marginBottom: 8 }}>Service Category</Text>
            <Select defaultValue="all" style={{ width: '100%' }} size="large" showSearch>
              <Option value="all">All Services</Option>
              <Option value="ride">Ride Hailing</Option>
              <Option value="food">Food Delivery</Option>
              <Option value="mart">Mart Delivery</Option>
              <Option value="shop">Shopping</Option>
              <Option value="hotel">Hotels Booking</Option>
              <Option value="event">Events Booking</Option>
              <Option value="car">Car Rental</Option>
              <Option value="city_to_city">City to City</Option>
            </Select>
          </Col>
          <Col xs={24} md={6}>
            <Text strong type="secondary" style={{ display: 'block', marginBottom: 8 }}>Region / Zone</Text>
            <Select defaultValue="all" style={{ width: '100%' }} size="large">
              <Option value="all">All Regions</Option>
              <Option value="north">North Zone</Option>
              <Option value="south">South Zone</Option>
              <Option value="east">East Zone</Option>
              <Option value="west">West Zone</Option>
              <Option value="central">Central Business District</Option>
            </Select>
          </Col>
          <Col xs={24} md={8}>
            <Text strong type="secondary" style={{ display: 'block', marginBottom: 8 }}>Quick Date Filter</Text>
            <div style={{ display: 'flex', gap: 8 }}>
              <Select defaultValue="month" style={{ width: 150 }} size="large">
                <Option value="today">Today</Option>
                <Option value="yesterday">Yesterday</Option>
                <Option value="week">This Week</Option>
                <Option value="month">This Month</Option>
                <Option value="quarter">This Quarter</Option>
                <Option value="year">This Year</Option>
              </Select>
              <RangePicker size="large" style={{ flex: 1 }} />
            </div>
          </Col>
          <Col xs={24} md={4} style={{ textAlign: 'right', paddingTop: 28 }}>
            <Button type="primary" size="large" icon={<FilterOutlined />} block>Apply Filters</Button>
          </Col>
        </Row>
      </Card>

      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Tabs
            activeKey={activeTab}
            onChange={handleTabChange}
            className="premium-tabs"
            items={[
              { key: '1', label: <Space><LineChartOutlined /> Earnings Report</Space> },
              { key: '2', label: <Space><PieChartOutlined /> Expense Report</Space> },
              { key: '3', label: <Space><FileTextOutlined /> Transactions Report</Space> },
              { key: '4', label: <Space><PercentageOutlined /> Commission Report</Space> },
              { key: '5', label: <Space><UndoOutlined /> Refunds & Reversals</Space> },
              { key: '6', label: <Space><WalletOutlined /> Platform Wallets</Space> },
              { key: '7', label: <Space><EditOutlined /> Adjustments</Space> },
              { key: '8', label: <Space><AccountBookOutlined /> Profit & Loss</Space> },
              { key: '9', label: <Space><ContainerOutlined /> Balance Sheet</Space> },
              { key: '10', label: <Space><HistoryOutlined /> Trial Balance</Space> },
              { key: '11', label: <Space><AuditOutlined /> Reconciliation</Space> },
            ]}
          />
        </Col>
        <Col>
          <Space>
            {activeTab === '2' && <Button type="primary" icon={<PlusOutlined />} style={{ background: '#ef4444', borderColor: '#ef4444' }} onClick={() => setIsExpenseDrawerVisible(true)}>Add Expense Report</Button>}
            {activeTab === '7' && <Button type="primary" icon={<PlusOutlined />} style={{ background: '#f59e0b', borderColor: '#f59e0b' }} onClick={() => setIsAdjustmentDrawerVisible(true)}>Create Adjustment</Button>}
            <Button icon={<DownloadOutlined />}>Export All</Button>
            <Button icon={<PrinterOutlined />}>Print Hub Statement</Button>
          </Space>
        </Col>
      </Row>

      {(activeTab === '1') && (
        <Card variant="borderless" className="shadow-sm" style={{ borderRadius: 16, marginBottom: 24, padding: '20px 24px' }}>
          <Row gutter={[32, 32]}>
            <Col xs={24} md={6}>
              <Statistic
                title={<Text type="secondary">Total Earning</Text>}
                value={totalEarnings}
                prefix="$"
                precision={2}
                styles={{ content: { color: '#10b981', fontWeight: 800, fontSize: 32 } }}
              />
              <Tag color="green">Revenue Pool</Tag>
            </Col>
            <Col xs={24} md={6}>
              <Statistic
                title={<Text type="secondary">Pending Earning</Text>}
                value={2450.50}
                prefix="$"
                precision={2}
                styles={{ content: { color: '#f59e0b', fontWeight: 700 } }}
              />
              <Tag color="orange">Awaiting Settlement</Tag>
            </Col>
            <Col xs={24} md={6}>
              <Statistic
                title={<Text type="secondary">Average Earning per Service</Text>}
                value={45.20}
                prefix="$"
                precision={2}
                styles={{ content: { color: '#3b82f6', fontWeight: 700 } }}
              />
            </Col>
            <Col xs={24} md={6}>
              <Statistic
                title={<Text type="secondary">Platform Net Profit</Text>}
                value={125420.00}
                prefix="$"
                precision={2}
                styles={{ content: { color: '#8b5cf6', fontWeight: 700 } }}
              />
              <Tag color="purple">Post-Expense</Tag>
            </Col>
          </Row>
        </Card>
      )}

      {activeTab === '2' && (
        <Card variant="borderless" className="shadow-sm" style={{ borderRadius: 16, marginBottom: 24, padding: '20px 24px' }}>
          <Row gutter={[32, 32]}>
            <Col xs={24} md={6}>
              <Statistic
                title={<Text type="secondary">Total Platform Expenses</Text>}
                value={totalExpenses}
                prefix="$"
                precision={2}
                styles={{ content: { color: '#ef4444', fontWeight: 800, fontSize: 32 } }}
              />
              <Tag color="volcano">Total Outgoings</Tag>
            </Col>
            <Col xs={24} md={6}>
              <Statistic
                title={<Text type="secondary">Platform Operating Costs</Text>}
                value={8450.00}
                prefix="$"
                precision={2}
                styles={{ content: { color: '#f59e0b', fontWeight: 700 } }}
              />
              <Tag color="amber">Internal Fees</Tag>
            </Col>
            <Col xs={24} md={6}>
              <Statistic
                title={<Text type="secondary">3rd Party Service Costs</Text>}
                value={3520.45}
                prefix="$"
                precision={2}
                styles={{ content: { color: '#06b6d4', fontWeight: 700 } }}
              />
              <Tag color="cyan">API & External</Tag>
            </Col>
            <Col xs={24} md={6}>
              <Statistic
                title={<Text type="secondary">User Discounts & Promos</Text>}
                value={15420.00}
                prefix="$"
                precision={2}
                styles={{ content: { color: '#ef4444', fontWeight: 700 } }}
              />
              <Tag color="red">Marketing Cost</Tag>
            </Col>
          </Row>
        </Card>
      )}

      {(activeTab === '1' || activeTab === '3' || activeTab === '2') && (
        <Card variant="borderless" className="shadow-sm" style={{ borderRadius: 16, marginBottom: 24, padding: '24px' }}>
          <div style={{ marginBottom: 24 }}>
            <Text strong style={{ fontSize: 18 }}>Service Wise {(activeTab === '1') ? 'Revenue' : 'Expense'} Breakdown</Text>
            <br />
            <Text type="secondary">Granular {(activeTab === '1') ? 'earning' : 'cost'} distribution across all business pillars</Text>
          </div>
          <Row gutter={[16, 24]}>
            <Col xs={12} sm={8} md={6} lg={4}>
              <Statistic title={<span style={{ fontSize: 12 }}>Fintech</span>} value={(activeTab === '1') ? 42300 : 15200} prefix="$" styles={{ content: { fontSize: 18, color: '#8b5cf6', fontWeight: 600 } }} />
            </Col>
            <Col xs={12} sm={8} md={6} lg={4}>
              <Statistic title={<span style={{ fontSize: 12 }}>Insurance</span>} value={(activeTab === '1') ? 14500 : 8400} prefix="$" styles={{ content: { fontSize: 18, color: '#ec4899', fontWeight: 600 } }} />
            </Col>
            <Col xs={12} sm={8} md={6} lg={4}>
              <Statistic title={<span style={{ fontSize: 12 }}>Ride Hailing</span>} value={(activeTab === '1') ? 500872 : 385000} prefix="$" styles={{ content: { fontSize: 18, color: '#3b82f6', fontWeight: 600 } }} />
            </Col>
            <Col xs={12} sm={8} md={6} lg={4}>
              <Statistic title={<span style={{ fontSize: 12 }}>Food Delivery</span>} value={(activeTab === '1') ? 24500 : 18900} prefix="$" styles={{ content: { fontSize: 18, color: '#f59e0b', fontWeight: 600 } }} />
            </Col>
            <Col xs={12} sm={8} md={6} lg={4}>
              <Statistic title={<span style={{ fontSize: 12 }}>Mart Delivery</span>} value={(activeTab === '1') ? 18200 : 14200} prefix="$" styles={{ content: { fontSize: 18, color: '#10b981', fontWeight: 600 } }} />
            </Col>
            <Col xs={12} sm={8} md={6} lg={4}>
              <Statistic title={<span style={{ fontSize: 12 }}>Shopping</span>} value={(activeTab === '1') ? 12400 : 9800} prefix="$" styles={{ content: { fontSize: 18, color: '#ef4444', fontWeight: 600 } }} />
            </Col>
            <Col xs={12} sm={8} md={6} lg={4}>
              <Statistic title={<span style={{ fontSize: 12 }}>Parcel</span>} value={(activeTab === '1') ? 2730 : 1850} prefix="$" styles={{ content: { fontSize: 18, color: '#64748b', fontWeight: 600 } }} />
            </Col>
            <Col xs={12} sm={8} md={6} lg={4}>
              <Statistic title={<span style={{ fontSize: 12 }}>Hotels</span>} value={(activeTab === '1') ? 32100 : 25600} prefix="$" styles={{ content: { fontSize: 18, color: '#06b6d4', fontWeight: 600 } }} />
            </Col>
            <Col xs={12} sm={8} md={6} lg={4}>
              <Statistic title={<span style={{ fontSize: 12 }}>Events</span>} value={(activeTab === '1') ? 15800 : 12400} prefix="$" styles={{ content: { fontSize: 18, color: '#8b5cf6', fontWeight: 600 } }} />
            </Col>
            <Col xs={12} sm={8} md={6} lg={4}>
              <Statistic title={<span style={{ fontSize: 12 }}>Car Rental</span>} value={(activeTab === '1') ? 28900 : 22100} prefix="$" styles={{ content: { fontSize: 18, color: '#3b82f6', fontWeight: 600 } }} />
            </Col>
            <Col xs={12} sm={8} md={6} lg={4}>
              <Statistic title={<span style={{ fontSize: 12 }}>City to City</span>} value={(activeTab === '1') ? 9400 : 7200} prefix="$" styles={{ content: { fontSize: 18, color: '#10b981', fontWeight: 600 } }} />
            </Col>
          </Row>
        </Card>
      )}

      {activeTab === '4' && (
        <Card variant="borderless" className="shadow-sm" style={{ borderRadius: 16, marginBottom: 24, padding: '20px 24px' }}>
          <Row gutter={[32, 32]}>
            <Col xs={24} md={6}>
              <Statistic
                title={<Text type="secondary">Total Commission Earning</Text>}
                value={earnings.reduce((sum, e) => sum + (e.commission || 0), 0)}
                prefix="$"
                precision={2}
                styles={{ content: { color: '#10b981', fontWeight: 800, fontSize: 32 } }}
              />
              <Tag color="green" icon={<DollarOutlined />} style={{ marginTop: 8 }}>Revenue Stream</Tag>
            </Col>
            <Col xs={24} md={6}>
              <Statistic
                title={<Text type="secondary">Average Commission Share</Text>}
                value={18.5}
                suffix="%"
                precision={1}
                styles={{ content: { color: '#3b82f6', fontWeight: 700 } }}
              />
            </Col>
            <Col xs={24} md={6}>
              <Statistic
                title={<Text type="secondary">Top Performing Service</Text>}
                value="Ride Hailing"
                styles={{ content: { color: '#8b5cf6', fontWeight: 700 } }}
              />
            </Col>
            <Col xs={24} md={6}>
              <Statistic
                title={<Text type="secondary">Total Tax Remitted</Text>}
                value={166669.99}
                prefix="$"
                precision={2}
                styles={{ content: { color: '#64748b', fontWeight: 700 } }}
              />
            </Col>
          </Row>
        </Card>
      )}

      {activeTab === '6' && (
        <Card variant="borderless" className="shadow-sm" style={{ borderRadius: 16, marginBottom: 24, padding: '20px 24px' }}>
          <Row gutter={[32, 32]}>
            <Col xs={24} md={6}>
              <Statistic
                title={<Text type="secondary">Total Settled Amount</Text>}
                value={458200.00}
                prefix="$"
                precision={2}
                styles={{ content: { color: '#10b981', fontWeight: 800, fontSize: 32 } }}
              />
              <Tag color="green">Settled</Tag>
            </Col>
            <Col xs={24} md={6}>
              <Statistic
                title={<Text type="secondary">Pending Payouts</Text>}
                value={settlements.filter(s => s.status === 'Pending' || s.status === 'Processing').reduce((sum, s) => sum + s.amount, 0)}
                prefix="$"
                precision={2}
                styles={{ content: { color: '#f59e0b', fontWeight: 700 } }}
              />
              <Tag color="orange">Awaiting Action</Tag>
            </Col>
            <Col xs={24} md={6}>
              <Statistic
                title={<Text type="secondary">Avg Settlement Time</Text>}
                value={2.4}
                suffix=" Days"
                precision={1}
                styles={{ content: { color: '#3b82f6', fontWeight: 700 } }}
              />
            </Col>
            <Col xs={24} md={6}>
              <Statistic
                title={<Text type="secondary">Active Providers</Text>}
                value={1250}
                styles={{ content: { color: '#8b5cf6', fontWeight: 700 } }}
              />
            </Col>
          </Row>
        </Card>
      )}

      {activeTab === '7' && (
        <Card variant="borderless" className="shadow-sm" style={{ borderRadius: 16, marginBottom: 24, padding: '20px 24px' }}>
          <Row gutter={[32, 32]}>
            <Col xs={24} md={6}>
              <Statistic
                title={<Text type="secondary">Total VAT Payable</Text>}
                value={totalVATPending}
                prefix="$"
                precision={2}
                styles={{ content: { color: '#ef4444', fontWeight: 800, fontSize: 32 } }}
              />
              <Tag color="red">15% Liability</Tag>
            </Col>
            <Col xs={24} md={6}>
              <Statistic
                title={<Text type="secondary">Total IMTT Remittable</Text>}
                value={totalIMTTPending}
                prefix="$"
                precision={2}
                styles={{ content: { color: '#f59e0b', fontWeight: 700 } }}
              />
              <Tag color="orange">2% Audit</Tag>
            </Col>
            <Col xs={24} md={6}>
              <Statistic
                title={<Text type="secondary">Total Remitted (ZIMRA)</Text>}
                value={totalTaxRemitted}
                prefix="$"
                precision={2}
                styles={{ content: { color: '#10b981', fontWeight: 700 } }}
              />
              <Tag color="green">Compliance Met</Tag>
            </Col>
            <Col xs={24} md={6}>
              <Statistic
                title={<Text type="secondary">Audit Health Score</Text>}
                value={98}
                suffix="%"
                precision={1}
                styles={{ content: { color: '#3b82f6', fontWeight: 700 } }}
              />
            </Col>
          </Row>
        </Card>
      )}

      {activeTab === '5' && (
        <Card variant="borderless" className="shadow-sm" style={{ borderRadius: 16, marginBottom: 24, padding: '20px 24px' }}>
          <Row gutter={[32, 32]}>
            <Col xs={24} md={6}>
              <Statistic
                title={<Text type="secondary">Total Refunded</Text>}
                value={totalReversals}
                prefix="$"
                precision={2}
                styles={{ content: { color: '#ef4444', fontWeight: 800, fontSize: 32 } }}
              />
              <Tag color="volcano">Revenue Reversal</Tag>
            </Col>
            <Col xs={24} md={6}>
              <Statistic
                title={<Text type="secondary">Refund Rate</Text>}
                value={1.2}
                suffix="%"
                precision={1}
                styles={{ content: { color: '#f59e0b', fontWeight: 700 } }}
              />
              <Tag color="orange">Low Risk</Tag>
            </Col>
            <Col xs={24} md={6}>
              <Statistic
                title={<Text type="secondary">Avg Refund Time</Text>}
                value={4.5}
                suffix=" Hours"
                precision={1}
                styles={{ content: { color: '#3b82f6', fontWeight: 700 } }}
              />
            </Col>
            <Col xs={24} md={6}>
              <Statistic
                title={<Text type="secondary">Chargeback Dispute</Text>}
                value={0.05}
                suffix="%"
                precision={2}
                styles={{ content: { color: '#ec4899', fontWeight: 700 } }}
              />
            </Col>
          </Row>
        </Card>
      )}

      {activeTab === '6' && (
        <Card variant="borderless" className="shadow-sm" style={{ borderRadius: 16, marginBottom: 24, padding: '20px 24px' }}>
          <Row gutter={[32, 32]}>
            <Col xs={24} md={6}>
              <Statistic
                title={<Text type="secondary">Total Stored Value</Text>}
                value={platformLiquidity}
                prefix="$"
                precision={2}
                styles={{ content: { color: '#3b82f6', fontWeight: 800, fontSize: 32 } }}
              />
              <Tag color="blue">System Liquidity</Tag>
            </Col>
            <Col xs={24} md={6}>
              <Statistic
                title={<Text type="secondary">Driver Escrow</Text>}
                value={driverEscrow}
                prefix="$"
                precision={2}
                styles={{ content: { color: '#f59e0b', fontWeight: 700 } }}
              />
              <Tag color="orange">Awaiting Payout</Tag>
            </Col>
            <Col xs={24} md={6}>
              <Statistic
                title={<Text type="secondary">User Wallet Balances</Text>}
                value={userEscrow}
                prefix="$"
                precision={2}
                styles={{ content: { color: '#10b981', fontWeight: 700 } }}
              />
            </Col>
            <Col xs={24} md={6}>
              <Statistic
                title={<Text type="secondary">Active Wallets</Text>}
                value={15420}
                styles={{ content: { color: '#8b5cf6', fontWeight: 700 } }}
              />
            </Col>
          </Row>
        </Card>
      )}

      {activeTab === '11' && (
        <Card variant="borderless" className="shadow-sm" style={{ borderRadius: 16, marginBottom: 24, padding: '20px 24px' }}>
          <Row gutter={[32, 32]}>
            <Col xs={24} md={6}>
              <Statistic
                title={<Text type="secondary">Total Reconciled</Text>}
                value={reconciliations.filter(r => r.status === 'Matched').reduce((sum, r) => sum + r.internalAmount, 0)}
                prefix="$"
                precision={2}
                styles={{ content: { color: '#10b981', fontWeight: 800, fontSize: 32 } }}
              />
              <Tag color="green">Audit Clean</Tag>
            </Col>
            <Col xs={24} md={6}>
              <Statistic
                title={<Text type="secondary">Discrepancies Found</Text>}
                value={reconciliations.filter(r => r.status === 'Mismatched').length}
                styles={{ content: { color: '#ef4444', fontWeight: 700 } }}
              />
              <Tag color="red">Action Required</Tag>
            </Col>
            <Col xs={24} md={6}>
              <Statistic
                title={<Text type="secondary">Pending Verification</Text>}
                value={reconciliations.filter(r => r.status === 'Pending').length}
                styles={{ content: { color: '#f59e0b', fontWeight: 700 } }}
              />
            </Col>
            <Col xs={24} md={6}>
              <Statistic
                title={<Text type="secondary">Gateway Variance</Text>}
                value={reconciliations.reduce((sum, r) => sum + r.difference, 0)}
                prefix="$"
                precision={2}
                styles={{ content: { color: '#8b5cf6', fontWeight: 700 } }}
              />
            </Col>
          </Row>
        </Card>
      )}

      {activeTab === '7' && (
        <Card variant="borderless" className="shadow-sm" style={{ borderRadius: 16, marginBottom: 24, padding: '20px 24px' }}>
          <Row gutter={[32, 32]}>
            <Col xs={24} md={6}>
              <Statistic
                title={<Text type="secondary">Total Adjustments</Text>}
                value={adjustments.reduce((sum, a) => sum + (a.type === 'Credit' ? a.amount : -a.amount), 0)}
                prefix="$"
                precision={2}
                styles={{ content: { color: '#10b981', fontWeight: 800, fontSize: 32 } }}
              />
              <Tag color="green">System Adjusted</Tag>
            </Col>
            <Col xs={24} md={6}>
              <Statistic
                title={<Text type="secondary">Manual Credits</Text>}
                value={5100.00}
                prefix="$"
                precision={2}
                styles={{ content: { color: '#3b82f6', fontWeight: 700 } }}
              />
            </Col>
            <Col xs={24} md={6}>
              <Statistic
                title={<Text type="secondary">Manual Debits</Text>}
                value={850.00}
                prefix="$"
                precision={2}
                styles={{ content: { color: '#ef4444', fontWeight: 700 } }}
              />
            </Col>
            <Col xs={24} md={6}>
              <Statistic
                title={<Text type="secondary">Pending Approvals</Text>}
                value={3}
                styles={{ content: { color: '#f59e0b', fontWeight: 700 } }}
              />
              <Tag color="orange">Attention Required</Tag>
            </Col>
          </Row>
        </Card>
      )}

      {/* Fraud Monitoring Stats */}
      {activeTab === '16' && (
        <Card variant="borderless" className="shadow-sm" style={{ borderRadius: 16, marginBottom: 24, padding: '20px 24px' }}>
          <Row gutter={[32, 32]}>
            <Col xs={24} md={6}>
              <Statistic
                title={<Text type="secondary">High Risk Entities</Text>}
                value={frauds.filter(f => f.riskScore > 80).length}
                styles={{ content: { color: '#ef4444', fontWeight: 800, fontSize: 32 } }}
              />
              <Tag color="error">Critical Attention</Tag>
            </Col>
            <Col xs={24} md={6}>
              <Statistic
                title={<Text type="secondary">Avg Risk Score</Text>}
                value={92}
                suffix="/ 100"
                styles={{ content: { color: '#f59e0b', fontWeight: 700 } }}
              />
              <Tag color="warning">Medium Profile</Tag>
            </Col>
            <Col xs={24} md={6}>
              <Statistic
                title={<Text type="secondary">Wallets Frozen</Text>}
                value={frauds.filter(f => f.status === 'Blocked').length}
                styles={{ content: { color: '#3b82f6', fontWeight: 700 } }}
              />
              <Tag color="processing">In Lockdown</Tag>
            </Col>
            <Col xs={24} md={6}>
              <Statistic
                title={<Text type="secondary">Cleared Systems</Text>}
                value={24}
                styles={{ content: { color: '#10b981', fontWeight: 700 } }}
              />
              <Tag color="success">Safe Mode</Tag>
            </Col>
          </Row>
        </Card>
      )}

      {/* Treasury & Liquidity Stats */}
      {activeTab === '17' && (
        <Card variant="borderless" className="shadow-sm" style={{ borderRadius: 16, marginBottom: 24, padding: '20px 24px' }}>
          <Row gutter={[32, 32]}>
            <Col xs={24} md={6}>
              <Statistic
                title={<Text type="secondary">Total Liquidity Pool</Text>}
                value={treasuryData.reduce((sum, t) => sum + t.balance, 0)}
                prefix="$"
                styles={{ content: { color: '#10b981', fontWeight: 800, fontSize: 32 } }}
              />
              <Tag color="green">Cash & Reserves</Tag>
            </Col>
            <Col xs={24} md={6}>
              <Statistic
                title={<Text type="secondary">Reserved Funds</Text>}
                value={treasuryData.reduce((sum, t) => sum + t.reservedAmount, 0)}
                prefix="$"
                styles={{ content: { color: '#f59e0b', fontWeight: 700 } }}
              />
              <Tag color="orange">Awaiting Payout</Tag>
            </Col>
            <Col xs={24} md={6}>
              <Statistic
                title={<Text type="secondary">Available Capital</Text>}
                value={treasuryData.reduce((sum, t) => sum + t.availableLiquidity, 0)}
                prefix="$"
                styles={{ content: { color: '#3b82f6', fontWeight: 700 } }}
              />
              <Tag color="blue">Growth & Ops</Tag>
            </Col>
            <Col xs={24} md={6}>
              <Statistic
                title={<Text type="secondary">Bank Accounts Link</Text>}
                value={treasuryData.length}
                styles={{ content: { color: '#8b5cf6', fontWeight: 700 } }}
              />
              <Tag color="purple">Audited Links</Tag>
            </Col>
          </Row>
        </Card>
      )}

      {(activeTab !== '8' && activeTab !== '9' && activeTab !== '10' && activeTab !== '11') && (
        <Card
          variant="borderless"
          className="shadow-sm"
          style={{ borderRadius: 16, marginBottom: 24 }}
          title={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Space>
                <BarChartOutlined style={{
                  color: activeTab === '3' ? '#3b82f6' :
                         activeTab === '4' ? '#8b5cf6' :
                         activeTab === '5' ? '#ec4899' :
                         activeTab === '6' ? '#3b82f6' :
                         activeTab === '7' ? '#10b981' :
                         ((activeTab === '1') ? '#10b981' : '#ef4444')
                }} />
                <Text strong style={{ fontSize: 16 }}>
                  Zone Wise {
                    activeTab === '3' ? 'Transactions' :
                    activeTab === '4' ? 'Commission' :
                    activeTab === '5' ? 'Reversals' :
                    activeTab === '6' ? 'Wallet Circulation' :
                    activeTab === '7' ? 'Corrections' :
                    ((activeTab === '1') ? 'Statistics' : 'Expenses')
                  }
                </Text>
              </Space>
              <div style={{ background: isDark ? '#222' : '#f5f5f5', padding: '4px', borderRadius: 8, display: 'flex', gap: '4px', alignItems: 'center' }}>
                <RangePicker
                  size="small"
                  style={{ marginRight: 8, borderRadius: 6, width: 230 }}
                  onChange={(dates) => {
                    if (dates) {
                      setTimeframe('Custom Range');
                      message.info('Filtering analytics for selected date range...');
                    }
                  }}
                />
                {['All Time', 'Today', 'This Month'].map(tf => (
                  <Button
                    key={tf}
                    size="small"
                    type={timeframe === tf ? 'primary' : 'text'}
                    onClick={() => setTimeframe(tf)}
                    style={{
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: timeframe === tf ? 600 : 400,
                      background: timeframe === tf ? ((activeTab === '1' || activeTab === '3') ? '#10b981' : '#ef4444') : 'transparent',
                      borderColor: timeframe === tf ? ((activeTab === '1' || activeTab === '3') ? '#10b981' : '#ef4444') : 'transparent',
                      color: timeframe === tf ? '#fff' : (isDark ? '#888' : '#666')
                    }}
                  >
                    {tf}
                  </Button>
                ))}
              </div>
            </div>
          }
        >
          <div style={{ height: 350, width: '100%', minHeight: 350, minWidth: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={
                activeTab === '3' ? (zoneTransactionStats as any)[timeframe] :
                activeTab === '4' ? (dynamicZoneCommissionStats as any)[timeframe] :
                ((activeTab === '1' || activeTab === '5' || activeTab === '6' || activeTab === '7') ? (dynamicZoneStats as any)[timeframe] : (dynamicZoneExpenseStats as any)[timeframe])
              }>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#333' : '#f0f0f0'} />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: isDark ? '#888' : '#666', fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: isDark ? '#888' : '#666', fontSize: 12 }}
                  tickFormatter={(val) =>
                    activeTab === '4' ? val :
                    `$${val >= 1000 ? (val/1000).toFixed(0) + 'k' : val}`
                  }
                />
                <RechartsTooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    background: isDark ? '#222' : '#fff'
                  }}
                  itemStyle={{ fontWeight: 600 }}
                  formatter={(value: number) => [
                    activeTab === '3' ? value.toLocaleString() : `$ ${value.toLocaleString()}`,
                    activeTab === '3' ? 'Transactions' :
                    activeTab === '4' ? 'Commission' :
                    activeTab === '5' ? 'Reversals' :
                    activeTab === '6' ? 'Balance' :
                    activeTab === '7' ? 'Adjustments' :
                    ((activeTab === '1') ? 'Earnings' : 'Expenses')
                  ]}
                />
                <Bar
                  dataKey={
                    activeTab === '3' ? 'transactions' :
                    activeTab === '4' ? 'commission' :
                    activeTab === '5' ? 'expense' :
                    activeTab === '6' ? 'earnings' :
                    activeTab === '7' ? 'earnings' :
                    ((activeTab === '1') ? 'earnings' : 'expense')
                  }
                  radius={[6, 6, 0, 0]}
                  barSize={50}
                >
                  {(
                    activeTab === '3' ? (zoneTransactionStats as any)[timeframe] :
                    activeTab === '4' ? (dynamicZoneCommissionStats as any)[timeframe] :
                    ((activeTab === '1' || activeTab === '5' || activeTab === '6' || activeTab === '7') ? (dynamicZoneStats as any)[timeframe] : (dynamicZoneExpenseStats as any)[timeframe])
                  ).map((_entry: any, index: number) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        activeTab === '3' ? '#3b82f6' :
                        activeTab === '4' ? '#8b5cf6' :
                        (activeTab === '2' ? '#ef4444' : chartColors[index % chartColors.length])
                      }
                      fillOpacity={0.8}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}



      <Card
        variant="borderless"
        className="shadow-sm"
        style={{ borderRadius: 16 }}
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Flex vertical gap={0}>
              <Space>
                <Text strong style={{ fontSize: 16 }}>
                  {
                    activeTab === '3' ? 'Transaction list' :
                    activeTab === '4' ? 'Commission list' :
                    activeTab === '5' ? 'Refund Registry' :
                    activeTab === '6' ? 'Platform Wallet Ledger' :
                    activeTab === '7' ? 'Adjustment Log' :
                    activeTab === '8' ? 'Profit & Loss Statement' :
                    activeTab === '9' ? 'Balance Sheet' :
                    activeTab === '10' ? 'Trial Balance' :
                    activeTab === '11' ? 'Reconciliation Audit' :
                    `Service Wise ${(activeTab === '1') ? 'Earning' : 'Expense'}`
                  }
                </Text>
                <Tag color={
                  activeTab === '3' ? 'blue' :
                  activeTab === '4' ? 'green' :
                  activeTab === '5' ? 'pink' :
                  activeTab === '6' ? 'blue' :
                  activeTab === '7' ? 'purple' :
                  activeTab === '8' ? 'blue' :
                  activeTab === '9' ? 'orange' :
                   activeTab === '10' ? 'green' :
                   activeTab === '11' ? 'blue' :
                   ((activeTab === '1') ? 'purple' : 'volcano')
                }>
                  {
                    activeTab === '5' ? 'Financial Integrity' :
                    activeTab === '6' ? 'Liquidity Management' :
                    activeTab === '7' ? 'Manual Corrections' :
                    activeTab === '8' ? 'Performance Summary' :
                    activeTab === '9' ? 'Financial Position' :
                    activeTab === '10' ? 'Ledger Integrity' :
                    'Live Transactions'
                  }
                </Tag>
              </Space>
              {activeTab === '3' && <Text type="secondary" style={{ fontSize: 13 }}>Total transactions: 216</Text>}
              {activeTab === '4' && <Text type="secondary" style={{ fontSize: 13 }}>Total records: 154</Text>}
              {activeTab === '5' && <Text type="secondary" style={{ fontSize: 13 }}>Total reversals: 2</Text>}
              {activeTab === '6' && <Text type="secondary" style={{ fontSize: 13 }}>Total wallets: 15,420</Text>}
              {activeTab === '7' && <Text type="secondary" style={{ fontSize: 13 }}>Total adjustments: 3</Text>}
              {activeTab === '11' && <Text type="secondary" style={{ fontSize: 13 }}>Total records: {reconciliations.length}</Text>}
            </Flex>
            <Space>
              <Input
                placeholder={
                  activeTab === '3' ? "Search Transaction ID..." : 
                  activeTab === '4' ? "Search Service ID..." : 
                  activeTab === '5' ? "Search Refund ID..." :
                  activeTab === '6' ? "Search Wallet ID..." : 
                   activeTab === '7' ? "Search Adjustment ID..." : 
                     activeTab === '11' ? "Search Transaction ID..." : 
                    ((activeTab === '1') ? "Search Service ID..." : "Search Expense ID...")
                 }
                prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                style={{ width: 250, borderRadius: 8 }}
              />
              <Button icon={<FilterOutlined />}>Filter</Button>
              <Button 
                type="primary" 
                icon={<DownloadOutlined />} 
                style={{ 
                  background: (activeTab === '1' || activeTab === '3' || activeTab === '4' || activeTab === '6' || activeTab === '7' || activeTab === '8' || activeTab === '9' || activeTab === '10') ? '#10b981' : '#ef4444', 
                  borderColor: (activeTab === '1' || activeTab === '3' || activeTab === '4' || activeTab === '6' || activeTab === '7' || activeTab === '8' || activeTab === '9' || activeTab === '10') ? '#10b981' : '#ef4444' 
                }}
                onClick={() => handleExport()}
              >
                Export
              </Button>
            </Space>
          </div>
        }
      >
        <Table 
          columns={(
            activeTab === '3' ? transactionColumns : 
            activeTab === '4' ? commissionColumns : 
            activeTab === '5' ? refundColumns :
            activeTab === '6' ? walletColumns : 
            activeTab === '7' ? adjustmentColumns : 
            activeTab === '8' ? pnLColumns : 
            activeTab === '9' ? balanceSheetColumns : 
            activeTab === '10' ? trialBalanceColumns :
            activeTab === '11' ? reconciliationColumns :
            activeTab === '2' ? expenseColumns : 
            earningColumns
          ) as any} 
          dataSource={(
            activeTab === '3' ? transactions.filter(t => t.transactionId.toLowerCase().includes(searchText.toLowerCase())) : 
            activeTab === '4' ? earnings.filter(e => e.serviceId.toLowerCase().includes(searchText.toLowerCase())) : 
            activeTab === '5' ? refunds.filter(r => r.refundId.toLowerCase().includes(searchText.toLowerCase())) :
            activeTab === '6' ? wallets.filter(w => w.walletId.toLowerCase().includes(searchText.toLowerCase())) :
            activeTab === '7' ? adjustments.filter(a => a.adjustmentId.toLowerCase().includes(searchText.toLowerCase())) :
            activeTab === '8' ? pnLData.filter(p => p.item.toLowerCase().includes(searchText.toLowerCase())) :
            activeTab === '9' ? balanceSheetData.filter(b => b.item.toLowerCase().includes(searchText.toLowerCase())) :
            activeTab === '10' ? [].filter(() => true) : // trialBalanceData not defined in previous view? Wait, I should check trialBalanceData
            activeTab === '11' ? reconciliations.filter(r => r.transactionId.toLowerCase().includes(searchText.toLowerCase())) :
            activeTab === '16' ? frauds.filter(f => f.entityId.toLowerCase().includes(searchText.toLowerCase())) :
            activeTab === '17' ? treasuryData.filter(t => t.bankName.toLowerCase().includes(searchText.toLowerCase())) :
            activeTab === '2' ? expenses.filter(e => e.serviceId.toLowerCase().includes(searchText.toLowerCase())) :
            earnings.filter(e => e.serviceId.toLowerCase().includes(searchText.toLowerCase()))
          ) as any[]} 
          pagination={{ pageSize: 10, showSizeChanger: true }}
          scroll={{ x: 'max-content' }}
          style={{ background: 'transparent' }}
        />
      </Card>

      {/* Settlement Receipt Modal */}
      <Drawer
        title={null}
        open={isReceiptDrawerVisible}
        onClose={() => setIsReceiptDrawerVisible(false)}
        extra={[
          <Button key="print" icon={<PrinterOutlined />} onClick={() => window.print()}>Print Receipt</Button>,
          <Button key="close" type="primary" onClick={() => setIsReceiptDrawerVisible(false)}>Close</Button>
        ]}
        width={500}
        styles={{ body: { padding: '0 0 20px 0' } }}
      >
        {selectedSettlement && (
          <div style={{ padding: '24px' }} id="printable-receipt">
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ width: 48, height: 48, background: '#10b981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                <CheckCircleOutlined style={{ fontSize: 24, color: '#fff' }} />
              </div>
              <Title level={4} style={{ margin: 0 }}>Payment Successful</Title>
              <Text type="secondary">DashDrive Settlement Receipt</Text>
            </div>

            <Divider style={{ margin: '12px 0' }} />
            
            <div style={{ background: isDark ? '#1a1a1a' : '#f8fafc', padding: 16, borderRadius: 12, marginBottom: 20 }}>
              <Row gutter={[16, 12]}>
                <Col span={12}><Text type="secondary" style={{ fontSize: 12 }}>Transaction ID</Text><br /><Text strong>{selectedSettlement.settlementId}</Text></Col>
                <Col span={12} style={{ textAlign: 'right' }}><Text type="secondary" style={{ fontSize: 12 }}>Date</Text><br /><Text strong>{selectedSettlement.date}</Text></Col>
                <Col span={12}><Text type="secondary" style={{ fontSize: 12 }}>Provider</Text><br /><Text strong>{selectedSettlement.providerName}</Text></Col>
                <Col span={12} style={{ textAlign: 'right' }}><Text type="secondary" style={{ fontSize: 12 }}>Status</Text><br /><Tag color="green">{selectedSettlement.status}</Tag></Col>
              </Row>
            </div>

            <Row style={{ marginBottom: 12 }}>
              <Col span={12}><Text>Base Amount</Text></Col>
              <Col span={12} style={{ textAlign: 'right' }}><Text strong>$ {selectedSettlement.amount.toLocaleString()}</Text></Col>
            </Row>
            <Row style={{ marginBottom: 12 }}>
              <Col span={12}><Text>Platform Processing Fee</Text></Col>
              <Col span={12} style={{ textAlign: 'right' }}><Text strong>$ 0.00</Text></Col>
            </Row>
            <Divider style={{ margin: '16px 0' }} />
            <Row>
              <Col span={12}><Title level={5} style={{ margin: 0 }}>Total Paid</Title></Col>
              <Col span={12} style={{ textAlign: 'right' }}><Title level={4} style={{ margin: 0, color: '#10b981' }}>$ {selectedSettlement.amount.toLocaleString()}</Title></Col>
            </Row>

            <div style={{ marginTop: 24, textAlign: 'center', border: '1px dashed #cbd5e1', padding: 12, borderRadius: 8 }}>
              <Text type="secondary" style={{ fontSize: 11 }}>This is a computer-generated receipt. No signature is required.</Text>
            </div>
          </div>
        )}
      </Drawer>

      {/* Settlement Details Modal */}
      <Drawer
        title={
          <Space>
            <FileProtectOutlined style={{ color: '#3b82f6' }} />
            <Text strong>Settlement Audit Details</Text>
          </Space>
        }
        open={isDetailsDrawerVisible}
        onClose={() => setIsDetailsDrawerVisible(false)}
        extra={[
          <Button key="close" onClick={() => setIsDetailsDrawerVisible(false)}>Close</Button>
        ]}
        width={600}
      >
        {selectedSettlement && (
          <Descriptions bordered column={1} size="small" style={{ marginTop: 16 }}>
            <Descriptions.Item label="Settlement Reference">{selectedSettlement.settlementId}</Descriptions.Item>
            <Descriptions.Item label="Provider Category">Independent Contractor</Descriptions.Item>
            <Descriptions.Item label="Provider Entity">{selectedSettlement.providerName}</Descriptions.Item>
            <Descriptions.Item label="Payout Gateway">{selectedSettlement.payoutMethod}</Descriptions.Item>
            <Descriptions.Item label="Initiated At">{selectedSettlement.date}</Descriptions.Item>
            <Descriptions.Item label="Settlement Batch">BCH-2025-07-A</Descriptions.Item>
            <Descriptions.Item label="Linked Services">
              <Space wrap>
                {selectedSettlement.linkedServiceIds.map(id => (
                  <Tag key={id} color="blue" style={{ cursor: 'pointer' }}>{id}</Tag>
                ))}
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Current Status">
              <Tag color={selectedSettlement.status === 'Paid' ? 'green' : 'orange'}>{selectedSettlement.status}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Audit Trail">
              <ul style={{ paddingLeft: 16, margin: 0, fontSize: 12 }}>
                <li>Status: Requested (20 July, 10:00 AM)</li>
                <li>Status: Verified (20 July, 02:00 PM)</li>
                <li>Status: {selectedSettlement.status} ({selectedSettlement.date})</li>
              </ul>
            </Descriptions.Item>
            <Descriptions.Item label="Final Amount">
              <Text strong style={{ fontSize: 16 }}>$ {selectedSettlement.amount.toLocaleString()}</Text>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>

      {/* Wallet Action Modal */}
      <Drawer
        title={
          <Space>
            {walletActionType === 'add' ? <PlusOutlined style={{ color: '#10b981' }} /> :
             walletActionType === 'debit' ? <MinusOutlined style={{ color: '#ef4444' }} /> :
             walletActionType === 'freeze' ? <StopOutlined style={{ color: '#f59e0b' }} /> :
             <UnlockOutlined style={{ color: '#3b82f6' }} />}
            <Text strong>
              {walletActionType === 'add' ? 'Add Funds to Wallet' :
               walletActionType === 'debit' ? 'Debit Funds from Wallet' :
               walletActionType === 'freeze' ? 'Freeze Wallet Access' : 'Unfreeze Wallet Access'}
            </Text>
          </Space>
        }
        open={isWalletActionDrawerVisible}
        onClose={() => setIsWalletActionDrawerVisible(false)}
        extra={[
          <Button key="cancel" onClick={() => setIsWalletActionDrawerVisible(false)}>Cancel</Button>,
          <Button 
            key="submit" 
            type="primary" 
            danger={walletActionType === 'debit' || walletActionType === 'freeze'}
            onClick={() => {
              walletForm.validateFields().then(values => {
                handleWalletAction(values);
              });
            }}
          >
            Confirm Action
          </Button>
        ]}
      >
        {selectedWalletForAction && (
          <div style={{ marginTop: 16 }}>
            <Descriptions column={1} size="small" bordered style={{ marginBottom: 20 }}>
              <Descriptions.Item label="Wallet ID">{selectedWalletForAction.walletId}</Descriptions.Item>
              <Descriptions.Item label="Holder Name">{selectedWalletForAction.holderName}</Descriptions.Item>
              <Descriptions.Item label="Current Balance">${selectedWalletForAction.balance.toLocaleString()}</Descriptions.Item>
            </Descriptions>

            <Form form={walletForm} layout="vertical">
              {(walletActionType === 'add' || walletActionType === 'debit') && (
                <Form.Item 
                  name="amount" 
                  label={`Amount to ${walletActionType === 'add' ? 'Add' : 'Debit'} ($)`}
                  rules={[{ required: true, message: 'Please enter an amount' }]}
                >
                  <InputNumber style={{ width: '100%' }} min={0.01} precision={2} />
                </Form.Item>
              )}
              <Form.Item 
                name="reason" 
                label="Reason / Reference"
                rules={[{ required: true, message: 'Please provide a reason' }]}
              >
                <Input.TextArea placeholder="Enter the administrative reason for this action..." rows={3} />
              </Form.Item>
            </Form>
          </div>
        )}
      </Drawer>

      {/* Add Expense Modal */}
      <Drawer
        title={
          <Space>
            <PlusOutlined style={{ color: '#ef4444' }} />
            <Text strong>Add Manual Expense</Text>
          </Space>
        }
        open={isExpenseDrawerVisible}
        onClose={() => setIsExpenseDrawerVisible(false)}
        extra={<Button type="primary" onClick={() => expenseForm.submit()} style={{ background: '#ef4444', borderColor: '#ef4444' }}>Add Expense</Button>}
      >
        <Form form={expenseForm} layout="vertical" onFinish={handleAddExpense} style={{ marginTop: 16 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="amount" label="Amount ($)" rules={[{ required: true }]}>
                <InputNumber style={{ width: '100%' }} min={0.01} precision={2} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="category" label="Category" rules={[{ required: true }]}>
                <Select placeholder="Select category">
                  <Option value="Marketing">Marketing</Option>
                  <Option value="Operations">Operations</Option>
                  <Option value="Office Supplies">Office Supplies</Option>
                  <Option value="Maintenance">Maintenance</Option>
                  <Option value="Other">Other</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="zone" label="Region/Zone" rules={[{ required: true }]}>
            <Select placeholder="Select zone">
              <Option value="North Zone">North Zone</Option>
              <Option value="South Zone">South Zone</Option>
              <Option value="East Zone">East Zone</Option>
              <Option value="West Zone">West Zone</Option>
              <Option value="Central">Central</Option>
            </Select>
          </Form.Item>
          <Form.Item name="reason" label="Detailed Reason" rules={[{ required: true }]}>
            <Input.TextArea rows={3} placeholder="Describe the reason for this expense..." />
          </Form.Item>
        </Form>
      </Drawer>

      {/* Create Adjustment Modal */}
      <Drawer
        title={
          <Space>
            <PlusOutlined style={{ color: '#f59e0b' }} />
            <Text strong>Create Ledger Adjustment</Text>
          </Space>
        }
        open={isAdjustmentDrawerVisible}
        onClose={() => setIsAdjustmentDrawerVisible(false)}
        extra={<Button type="primary" onClick={() => adjustmentForm.submit()} style={{ background: '#f59e0b', borderColor: '#f59e0b' }}>Process Adjustment</Button>}
      >
        <Form form={adjustmentForm} layout="vertical" onFinish={handleCreateAdjustment} style={{ marginTop: 16 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="amount" label="Adjustment Amount ($)" rules={[{ required: true }]}>
                <InputNumber style={{ width: '100%' }} min={0.01} precision={2} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="type" label="Adjustment Type" rules={[{ required: true }]}>
                <Select placeholder="Select type">
                  <Option value="Credit">Credit (Increase Balance)</Option>
                  <Option value="Debit">Debit (Decrease Balance)</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="reason" label="Adjustment Note / Reference" rules={[{ required: true }]}>
            <Input.TextArea rows={3} placeholder="Provide audit-trail remarks for this correction..." />
          </Form.Item>
          <Alert message="Caution: Manual adjustments directly affect the platform's retained earnings and cash position." type="warning" showIcon style={{ marginBottom: 0 }} />
        </Form>
      </Drawer>
    </div>
  );
};
