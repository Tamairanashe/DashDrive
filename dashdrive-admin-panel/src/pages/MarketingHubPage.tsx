import React, { useState, useEffect } from 'react';
import { 
  Typography, Card, Row, Col, Tabs, Table, Button, Tag, Space, 
  Form, Input, message, Upload, DatePicker, Segmented, Badge,
  Switch, Tooltip, Empty, Drawer, List, Popconfirm, Avatar,
  Timeline, Statistic, Select, Modal
} from 'antd';
import { 
  PlusOutlined, EditOutlined, DeleteOutlined, PictureOutlined, 
  UploadOutlined, SearchOutlined, CalendarOutlined, LinkOutlined,
  EyeOutlined, InfoCircleOutlined, DollarOutlined, NotificationOutlined,
  SyncOutlined, DeleteColumnOutlined, DownloadOutlined, CloudDownloadOutlined,
  HistoryOutlined, MailOutlined, UndoOutlined, RestOutlined, CheckCircleOutlined
} from '@ant-design/icons';
import { useTheme } from '../context/ThemeContext';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, 
  ResponsiveContainer 
} from 'recharts';

const { Title, Text, Paragraph } = Typography;
const { RangePicker } = DatePicker;

interface BannerRecord {
  key: string;
  title: string;
  image: string;
  link: string;
  clicks: number;
  timePeriod: string;
  status: 'Active' | 'Inactive';
}

interface CouponRecord {
  key: string;
  title: string;
  code: string;
  type: string;
  zone: string;
  customerLevel: string;
  customer: string;
  category: string;
  amount: string;
  start: string;
  end: string;
  duration: string;
  usageCount: number;
  totalAmount: number;
  avgAmount: number;
  couponStatus: 'Expired' | 'Running' | 'Currently off';
  status: 'Active' | 'Inactive';
}

interface DiscountRecord {
  key: string;
  title: string;
  image: string;
  zone: string;
  customerLevel: string;
  customer: string;
  category: string;
  amount: string;
  start: string;
  end: string;
  duration: string;
  usageCount: number;
  totalAmount: number;
  discountStatus: 'Running' | 'Expired' | 'Paused';
  status: 'Active' | 'Inactive';
}

interface NotificationRecord {
  key: string;
  title: string;
  description: string;
  image: string;
  zone: string;
  target: 'All' | 'Customer' | 'Driver' | 'Merchant';
  status: 'Active' | 'Inactive';
  sentAt: string;
  clicks: number;
}

interface NewsletterRecord {
  key: string;
  title: string;
  description: string;
  target: 'All' | 'Customer' | 'Driver' | 'Merchant';
  status: 'Active' | 'Inactive';
  sentAt: string;
  totalSent: number;
}

export const MarketingHubPage: React.FC = () => {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState('1'); // Main Module Tabs
  const [bannerFilter, setBannerFilter] = useState('All');
  const [couponFilter, setCouponFilter] = useState('All');
  const [searchText, setSearchText] = useState('');
  const [couponSearch, setCouponSearch] = useState('');
  const [discountFilter, setDiscountFilter] = useState('All');
  const [discountSearch, setDiscountSearch] = useState('');
  const [notificationFilter, setNotificationFilter] = useState('All');
  const [notificationSearch, setNotificationSearch] = useState('');
  const [newsletterFilter, setNewsletterFilter] = useState('All');
  const [newsletterSearch, setNewsletterSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [logDrawerVisible, setLogDrawerVisible] = useState(false);
  const [notificationDrawerVisible, setNotificationDrawerVisible] = useState(false);
  const [newsletterDrawerVisible, setNewsletterDrawerVisible] = useState(false);
  const [newsletterPreviewVisible, setNewsletterPreviewVisible] = useState(false);
  const [previewMode, setPreviewMode] = useState<'Desktop' | 'Mobile'>('Desktop');
  const [selectedNotification, setSelectedNotification] = useState<NotificationRecord | null>(null);
  const [selectedNewsletter, setSelectedNewsletter] = useState<NewsletterRecord | null>(null);
  const [editingNotification, setEditingNotification] = useState<NotificationRecord | null>(null);
  const [editingNewsletter, setEditingNewsletter] = useState<NewsletterRecord | null>(null);
  const [selectedBanner, setSelectedBanner] = useState<BannerRecord | null>(null);
  const [selectedCoupon, setSelectedCoupon] = useState<CouponRecord | null>(null);
  const [editingBanner, setEditingBanner] = useState<BannerRecord | null>(null);
  const [editingCoupon, setEditingCoupon] = useState<CouponRecord | null>(null);
  const [bannerDrawerVisible, setBannerDrawerVisible] = useState(false);
  const [couponDrawerVisible, setCouponDrawerVisible] = useState(false);
  const [discountDrawerVisible, setDiscountDrawerVisible] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState<DiscountRecord | null>(null);
  const [editingDiscount, setEditingDiscount] = useState<DiscountRecord | null>(null);
  const [newsletterForm] = Form.useForm();
  
  // Standardization State
  const [isTrashOpen, setIsTrashOpen] = useState(false);
  const [rejectionModalVisible, setRejectionModalVisible] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [pendingAction, setPendingAction] = useState<{ id: string, name: string, type: 'banner' | 'coupon' | 'discount' } | null>(null);

  const [banners, setBanners] = useState<BannerRecord[]>([
    {
      key: '1',
      title: 'DELIVERY PARCEL WITH HAPPINESS',
      image: 'https://via.placeholder.com/300x100?text=Parcel+Happiness',
      link: 'https://drivemond.app/',
      clicks: 0,
      timePeriod: 'all time',
      status: 'Active'
    },
    {
      key: '2',
      title: 'Enjoy Safe Ride',
      image: 'https://via.placeholder.com/300x100?text=Safe+Ride',
      link: 'https://drivemond.app/',
      clicks: 0,
      timePeriod: 'all time',
      status: 'Active'
    },
    {
      key: '3',
      title: '30% off',
      image: 'https://via.placeholder.com/300x100?text=30%+Off',
      link: 'https://codemond.com',
      clicks: 0,
      timePeriod: 'all time',
      status: 'Inactive'
    }
  ]);

  const [coupons, setCoupons] = useState<CouponRecord[]>([
    {
      key: '1',
      title: 'Parcel Refund Coupon For Test User',
      code: 'jV608323tF',
      type: 'default',
      zone: 'all',
      customerLevel: 'all',
      customer: 'Test',
      category: 'all',
      amount: '$ 500.00',
      start: '2024-11-06',
      end: '2025-11-06',
      duration: '-364 Days',
      usageCount: 0,
      totalAmount: 0.00,
      avgAmount: 0.00,
      couponStatus: 'Expired',
      status: 'Inactive'
    },
    {
      key: '2',
      title: 'Parcel Refund Coupon For Jhon Jack',
      code: '3JIL9E55xN',
      type: 'default',
      zone: 'all',
      customerLevel: 'all',
      customer: 'Jhon',
      category: 'all',
      amount: '$ 150.00',
      start: '2024-11-05',
      end: '2025-11-05',
      duration: '-364 Days',
      usageCount: 0,
      totalAmount: 0.00,
      avgAmount: 0.00,
      couponStatus: 'Expired',
      status: 'Inactive'
    },
    {
      key: '3',
      title: '30% Off',
      code: 'c16vw4roi7',
      type: 'default',
      zone: 'all',
      customerLevel: 'all',
      customer: 'all',
      category: 'all',
      amount: '30.00%',
      start: '2024-09-26',
      end: '2026-09-30',
      duration: '-733 Days',
      usageCount: 5,
      totalAmount: 802.20,
      avgAmount: 160.44,
      couponStatus: 'Running',
      status: 'Active'
    },
    {
      key: '4',
      title: 'First Use Coupon',
      code: 'firstride',
      type: 'default',
      zone: 'all',
      customerLevel: 'all',
      customer: 'all',
      category: 'all',
      amount: '50.00%',
      start: '2023-11-20',
      end: '2025-08-28',
      duration: '-646 Days',
      usageCount: 0,
      totalAmount: 0.00,
      avgAmount: 0.00,
      couponStatus: 'Expired',
      status: 'Inactive'
    },
    {
      key: '5',
      title: '30% Off',
      code: '1234',
      type: 'default',
      zone: 'all',
      customerLevel: 'all',
      customer: 'all',
      category: 'all',
      amount: '30.00%',
      start: '2023-11-20',
      end: '2027-04-01',
      duration: '-1227 Days',
      usageCount: 1,
      totalAmount: 121.44,
      avgAmount: 121.44,
      couponStatus: 'Currently off',
      status: 'Inactive'
    }
  ]);

  const [discounts, setDiscounts] = useState<DiscountRecord[]>([
    {
      key: '1',
      title: '35% Discount on Parcel',
      image: 'https://via.placeholder.com/300x100?text=35%+Parcel',
      zone: 'all',
      customerLevel: 'all',
      customer: 'all',
      category: 'all',
      amount: '35%',
      start: '2024-09-26',
      end: '2026-07-24',
      duration: '-665 Days',
      usageCount: 2,
      totalAmount: 5045.50,
      discountStatus: 'Running',
      status: 'Active'
    },
    {
      key: '2',
      title: 'Ride share with 50% discount',
      image: 'https://via.placeholder.com/300x100?text=50%+Ride',
      zone: 'all',
      customerLevel: 'all',
      customer: 'all',
      category: 'all',
      amount: '50%',
      start: '2024-09-26',
      end: '2026-10-16',
      duration: '-749 Days',
      usageCount: 26,
      totalAmount: 3574.50,
      discountStatus: 'Running',
      status: 'Active'
    }
  ]);

  const [notifications, setNotifications] = useState<NotificationRecord[]>([
    {
      key: '1',
      title: 'New Year Mega Sale!',
      description: 'Get up to 50% off on all city rides today.',
      image: 'https://via.placeholder.com/300x100?text=Mega+Sale',
      zone: 'all',
      target: 'Customer',
      status: 'Active',
      sentAt: '2026-01-01 09:00 AM',
      clicks: 1250
    },
    {
      key: '2',
      title: 'Driver Rewards Update',
      description: 'Complete 10 trips to earn extra bonuses this weekend.',
      image: 'https://via.placeholder.com/300x100?text=Rewards',
      zone: 'all',
      target: 'Driver',
      status: 'Active',
      sentAt: '2026-03-10 14:30 PM',
      clicks: 450
    }
  ]);

  const [newsletters, setNewsletters] = useState<NewsletterRecord[]>([
    {
      key: '1',
      title: 'Weekly Community Round-up',
      description: 'Check out the latest news and updates from the DashDrive community.',
      target: 'All',
      status: 'Active',
      sentAt: '2026-03-12 10:00 AM',
      totalSent: 5000
    },
    {
      key: '2',
      title: 'Exclusive Driver Partner Perks',
      description: 'New fuel discounts and insurance benefits available this month.',
      target: 'Driver',
      status: 'Active',
      sentAt: '2026-03-13 11:30 AM',
      totalSent: 1200
    }
  ]);

  const chartData = [
    { year: '2023', amount: 120 },
    { year: '2024', amount: 800 },
    { year: '2025', amount: 30 },
    { year: '2026', amount: 20 },
  ];

  const filteredBanners = banners.filter(b => {
    const matchesFilter = bannerFilter === 'All' || b.status === bannerFilter;
    const matchesSearch = b.title.toLowerCase().includes(searchText.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleCreateBanner = (values: any) => {
    setLoading(true);
    const actionType = editingBanner ? 'Updating' : 'Creating';
    message.loading(`${actionType} banner...`, 1).then(() => {
      if (editingBanner) {
        setBanners(prev => prev.map(b => b.key === editingBanner.key ? {
          ...b,
          title: values.title,
          link: values.link,
          timePeriod: values.period ? `${values.period[0].format('DD MMM')} - ${values.period[1].format('DD MMM')}` : 'all time',
        } : b));
        setEditingBanner(null);
        message.success('Banner updated successfully');
      } else {
        const newBanner: BannerRecord = {
          key: Date.now().toString(),
          title: values.title,
          image: 'https://via.placeholder.com/300x100?text=New+Banner',
          link: values.link,
          clicks: 0,
          timePeriod: values.period ? `${values.period[0].format('DD MMM')} - ${values.period[1].format('DD MMM')}` : 'all time',
          status: 'Active'
        };
        setBanners([newBanner, ...banners]);
        message.success('Banner added successfully');
      }
      form.resetFields();
      setBannerDrawerVisible(false);
      setLoading(false);
    });
  };

  const initiateSoftDelete = (id: string, name: string, type: 'banner' | 'coupon' | 'discount') => {
    setPendingAction({ id, name, type });
    setRejectionReason('');
    setRejectionModalVisible(true);
  };

  const handleConfirmDeletion = () => {
    if (!rejectionReason.trim()) {
      message.warning('Audit reason is required for deletion');
      return;
    }
    
    const { id, type } = pendingAction!;
    if (type === 'banner') {
      setBanners(prev => prev.map(b => b.key === id ? { ...b, status: 'Inactive' } : b));
    } else if (type === 'coupon') {
      setCoupons(prev => prev.map(c => c.key === id ? { ...c, status: 'Inactive' } : c));
    } else if (type === 'discount') {
      setDiscounts(prev => prev.map(d => d.key === id ? { ...d, status: 'Inactive' } : d));
    }
    
    message.error(`${type.charAt(0).toUpperCase() + type.slice(1)} trashed. Reason: ${rejectionReason}`);
    setRejectionModalVisible(false);
    setPendingAction(null);
  };

  const handleRestore = (id: string, type: 'banner' | 'coupon' | 'discount') => {
    if (type === 'banner') {
      setBanners(prev => prev.map(b => b.key === id ? { ...b, status: 'Active' } : b));
    } else if (type === 'coupon') {
      setCoupons(prev => prev.map(c => c.key === id ? { ...c, status: 'Active' } : c));
    } else if (type === 'discount') {
      setDiscounts(prev => prev.map(d => d.key === id ? { ...d, status: 'Active' } : d));
    }
    message.success(`${type.charAt(0).toUpperCase() + type.slice(1)} restored to active status`);
  };

  const handleEdit = (record: BannerRecord) => {
    setEditingBanner(record);
    form.setFieldsValue({
      title: record.title,
      link: record.link,
    });
    setBannerDrawerVisible(true);
  };

  const handleRefresh = () => {
    setLoading(true);
    message.loading('Refreshing banner data...', 1).then(() => {
      setLoading(false);
      message.success('Banners updated');
    });
  };

  const handleDownload = () => {
    message.success('Exporting list to CSV...');
  };

  const handleCreateCoupon = (values: any) => {
    setLoading(true);
    message.loading(editingCoupon ? 'Updating coupon...' : 'Creating coupon...', 1).then(() => {
      if (editingCoupon) {
        setCoupons(prev => prev.map(c => c.key === editingCoupon.key ? {
          ...c,
          title: values.title,
          code: values.code,
          type: values.type || 'default',
          zone: Array.isArray(values.zones) ? values.zones.join(', ') : 'all',
          customerLevel: values.customerLevel || 'all',
          category: values.category || 'all',
          amount: `$ ${values.amount}`,
          start: values.startDate?.format('YYYY-MM-DD') || 'N/A',
          end: values.endDate?.format('YYYY-MM-DD') || 'N/A',
        } : c));
        message.success('Coupon updated successfully');
      } else {
        const newCoupon: CouponRecord = {
          key: Date.now().toString(),
          title: values.title,
          code: values.code,
          type: values.type || 'default',
          zone: Array.isArray(values.zones) ? values.zones.join(', ') : 'all',
          customerLevel: values.customerLevel || 'all',
          customer: 'New',
          category: values.category || 'all',
          amount: `$ ${values.amount}`,
          start: values.startDate?.format('YYYY-MM-DD') || 'N/A',
          end: values.endDate?.format('YYYY-MM-DD') || 'N/A',
          duration: '365 Days',
          usageCount: 0,
          totalAmount: 0,
          avgAmount: 0,
          couponStatus: 'Running',
          status: 'Active'
        };
        setCoupons([newCoupon, ...coupons]);
        message.success('Coupon created successfully');
      }
      setCouponDrawerVisible(false);
      setEditingCoupon(null);
      couponForm.resetFields();
      setLoading(false);
    });
  };

  const handleEditCoupon = (record: CouponRecord) => {
    setEditingCoupon(record);
    couponForm.setFieldsValue({
      title: record.title,
      code: record.code,
      type: record.type,
      // Simplified: just setting basic fields for mock
    });
    setCouponDrawerVisible(true);
  };

  const generateCode = () => {
    const code = Math.random().toString(36).substring(2, 10).toUpperCase();
    couponForm.setFieldsValue({ code });
  };

  const columns = [
    {
      title: 'SL',
      dataIndex: 'sl',
      key: 'sl',
      render: (_: any, __: any, index: number) => index + 1
    },
    {
      title: 'Banner title',
      dataIndex: 'title',
      key: 'title',
      render: (text: string) => <Text strong>{text}</Text>
    },
    {
      title: 'Banner image',
      dataIndex: 'image',
      key: 'image',
      render: (img: string) => (
        <img src={img} alt="banner" style={{ width: 100, height: 33, borderRadius: 4, objectFit: 'cover', border: '1px solid #eee' }} />
      )
    },
    {
      title: 'Redirect link',
      dataIndex: 'link',
      key: 'link',
      render: (link: string) => <a href={link} target="_blank" rel="noopener noreferrer">{link}</a>
    },
    {
      title: 'Number of Total Clicks',
      dataIndex: 'clicks',
      key: 'clicks',
      align: 'center' as const
    },
    {
      title: 'Time period',
      dataIndex: 'timePeriod',
      key: 'timePeriod'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string, record: BannerRecord) => (
        <Space orientation="vertical" size={0}>
          <Switch 
            size="small" 
            checked={status === 'Active'} 
            onChange={(checked) => {
              setBanners(prev => prev.map(b => b.key === record.key ? { ...b, status: checked ? 'Active' : 'Inactive' } : b));
              message.success(`Banner ${checked ? 'enabled' : 'disabled'}`);
            }}
          />
          <Tag color={status === 'Active' ? 'green' : 'error'} style={{ marginTop: 4, fontSize: 10 }}>
            {status.toUpperCase()}
          </Tag>
        </Space>
      )
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: BannerRecord) => (
        <Space>
          <Tooltip title="Activity Log">
            <Button 
              size="small" 
              type="text" 
              icon={<HistoryOutlined style={{ color: '#1890ff' }} />} 
              onClick={() => {
                setSelectedBanner(record);
                setLogDrawerVisible(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button 
              size="small" 
              type="text" 
              icon={<EditOutlined style={{ color: '#faad14' }} />} 
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button 
                size="small" 
                type="text" 
                danger 
                icon={<DeleteOutlined />} 
                onClick={() => initiateSoftDelete(record.key, record.title, 'banner')}
            />
          </Tooltip>
        </Space>
      )
    }
  ];

  const renderBannerSetup = () => (
    <div style={{ padding: 16 }}>
      <Row gutter={[24, 24]}>
        {/* List Section */}
        <Col span={24}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => {
              setEditingBanner(null);
              form.resetFields();
              setBannerDrawerVisible(true);
            }}>
              Add New Banner
            </Button>
          </div>
          <Card variant="borderless" className="shadow-sm" style={{ borderRadius: 16 }}>
            <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Space size="large" align="center">
                <Title level={5} style={{ margin: 0 }}>Banner list</Title>
                <Segmented 
                  options={['All', 'Active', 'Inactive']} 
                  value={bannerFilter} 
                  onChange={(v) => setBannerFilter(v as any)}
                />
                <Space size={8}>
                  <Text type="secondary">Total banners</Text>
                  <Badge 
                    count={banners.length} 
                    overflowCount={999}
                    style={{ backgroundColor: '#1890ff' }}
                  />
                </Space>
              </Space>
              
              <Space>
                <Input 
                  placeholder="Search here by Banner Title" 
                  prefix={<SearchOutlined />} 
                  style={{ width: 250 }}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
                <Tooltip title="Refresh">
                  <Button icon={<SyncOutlined />} onClick={handleRefresh} />
                </Tooltip>
                <Tooltip title="Manage Trashed Data">
                  <Button icon={<DeleteColumnOutlined />} onClick={() => setIsTrashOpen(true)} />
                </Tooltip>
                <Tooltip title="Download Banner List">
                  <Button icon={<CloudDownloadOutlined />} onClick={handleDownload} />
                </Tooltip>
                <Tooltip title="Activity Log">
                  <Button icon={<HistoryOutlined />} onClick={() => message.info('Opening Banner Activity Log...')} />
                </Tooltip>
              </Space>
            </div>

            <Table 
              size="middle"
              loading={loading}
              columns={columns}
              dataSource={filteredBanners}
              pagination={{ pageSize: 5 }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );

  const couponColumns = [
    {
      title: 'SL',
      dataIndex: 'sl',
      key: 'sl',
      width: 50,
      render: (_: any, __: any, index: number) => index + 1
    },
    {
      title: 'Coupon title',
      dataIndex: 'title',
      key: 'title',
      width: 200,
      render: (text: string) => <Text strong>{text}</Text>
    },
    {
      title: 'Coupon code',
      dataIndex: 'code',
      key: 'code',
      render: (code: string) => <Tag color="blue">{code}</Tag>
    },
    { title: 'Coupon type', dataIndex: 'type', key: 'type' },
    { title: 'Zone', dataIndex: 'zone', key: 'zone' },
    { title: 'Customer level', dataIndex: 'customerLevel', key: 'customerLevel' },
    { title: 'Customer', dataIndex: 'customer', key: 'customer' },
    { title: 'Category', dataIndex: 'category', key: 'category' },
    { title: 'Coupon amount', dataIndex: 'amount', key: 'amount' },
    {
      title: 'Duration',
      key: 'duration',
      width: 200,
      render: (_: any, record: CouponRecord) => (
        <div style={{ fontSize: 11 }}>
          <Text type="secondary">Start: </Text><Text>{record.start}</Text><br />
          <Text type="secondary">End: </Text><Text>{record.end}</Text><br />
          <Text type="secondary">Duration: </Text><Text strong>{record.duration}</Text>
        </div>
      )
    },
    { title: 'Total times used', dataIndex: 'usageCount', key: 'usageCount', align: 'center' as const },
    { 
      title: 'Total coupon Amount ($)', 
      dataIndex: 'totalAmount', 
      key: 'totalAmount',
      render: (val: number) => `$ ${val.toFixed(2)}`
    },
    { 
      title: 'Average coupon amount', 
      dataIndex: 'avgAmount', 
      key: 'avgAmount',
      render: (val: number) => `$ ${val.toFixed(2)}`
    },
    {
      title: 'Coupon status',
      dataIndex: 'couponStatus',
      key: 'couponStatus',
      render: (s: string) => (
        <Tag color={s === 'Running' ? 'green' : s === 'Expired' ? 'error' : 'default'}>
          {s.toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string, record: CouponRecord) => (
        <Switch 
          size="small" 
          checked={status === 'Active'} 
          onChange={(checked) => {
            setCoupons(prev => prev.map(c => c.key === record.key ? { ...c, status: checked ? 'Active' : 'Inactive' } : c));
            message.success(`Coupon ${checked ? 'enabled' : 'disabled'}`);
          }}
        />
      )
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: CouponRecord) => (
        <Space>
          <Tooltip title="Activity Log">
            <Button size="small" type="text" icon={<HistoryOutlined style={{ color: '#1890ff' }} />} onClick={() => { setSelectedCoupon(record); setLogDrawerVisible(true); }} />
          </Tooltip>
          <Tooltip title="Edit">
            <Button size="small" type="text" icon={<EditOutlined style={{ color: '#faad14' }} />} onClick={() => handleEditCoupon(record)} />
          </Tooltip>
          <Tooltip title="Delete">
            <Button 
              size="small" 
              type="text" 
              danger 
              icon={<DeleteOutlined />} 
              onClick={() => initiateSoftDelete(record.key, record.title, 'coupon')}
            />
          </Tooltip>
        </Space>
      )
    }
  ];

  const discountColumns = [
    {
      title: 'SL',
      dataIndex: 'sl',
      key: 'sl',
      width: 50,
      render: (_: any, __: any, index: number) => index + 1
    },
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (img: string) => (
        <img src={img} alt="discount" style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover' }} />
      )
    },
    {
      title: 'Discount title',
      dataIndex: 'title',
      key: 'title',
      width: 200,
      render: (text: string) => <Text strong>{text}</Text>
    },
    { title: 'Zone', dataIndex: 'zone', key: 'zone' },
    { title: 'Customer level', dataIndex: 'customerLevel', key: 'customerLevel' },
    { title: 'Customer', dataIndex: 'customer', key: 'customer' },
    { title: 'Category', dataIndex: 'category', key: 'category' },
    { title: 'Discount amount', dataIndex: 'amount', key: 'amount', render: (val: string) => <Tag color="orange">{val}</Tag> },
    {
      title: 'Duration',
      key: 'duration',
      width: 200,
      render: (_: any, record: DiscountRecord) => (
        <div style={{ fontSize: 11 }}>
          <Text type="secondary">Start : </Text><Text>{record.start}</Text><br />
          <Text type="secondary">End : </Text><Text>{record.end}</Text><br />
          <Text type="secondary">Duration : </Text><Text strong>{record.duration}</Text>
        </div>
      )
    },
    { title: 'Total times used', dataIndex: 'usageCount', key: 'usageCount', align: 'center' as const },
    { 
      title: 'Total discount Amount ($)', 
      dataIndex: 'totalAmount', 
      key: 'totalAmount',
      render: (val: number) => <Text strong>$ {val.toLocaleString(undefined, { minimumFractionDigits: 2 })}</Text>
    },
    {
      title: 'Discount status',
      dataIndex: 'discountStatus',
      key: 'discountStatus',
      render: (s: string) => (
        <Tag color={s === 'Running' ? 'green' : s === 'Expired' ? 'error' : 'default'}>
          {s.toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string, record: DiscountRecord) => (
        <Switch 
          size="small" 
          checked={status === 'Active'} 
          onChange={(checked) => {
            setDiscounts(prev => prev.map(d => d.key === record.key ? { ...d, status: checked ? 'Active' : 'Inactive' } : d));
            message.success(`Discount ${checked ? 'enabled' : 'disabled'}`);
          }}
        />
      )
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: DiscountRecord) => (
        <Space>
          <Tooltip title="Activity Log">
            <Button 
              size="small" 
              type="text" 
              icon={<HistoryOutlined style={{ color: '#1890ff' }} />} 
              onClick={() => {
                setSelectedDiscount(record);
                setLogDrawerVisible(true);
              }} 
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button size="small" type="text" icon={<EditOutlined style={{ color: '#faad14' }} />} onClick={() => handleEditDiscount(record)} />
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm title="Delete discount?" onConfirm={() => setDiscounts(prev => prev.filter(d => d.key !== record.key))} okButtonProps={{ danger: true }}>
              <Button size="small" type="text" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      )
    }
  ];

  const handleEditDiscount = (record: DiscountRecord) => {
    setEditingDiscount(record);
    discountForm.setFieldsValue({
      title: record.title,
      amount: record.amount,
    });
    setDiscountDrawerVisible(true);
  };

  const handleCreateDiscount = (values: any) => {
    setLoading(true);
    message.loading(editingDiscount ? 'Updating discount...' : 'Creating discount...', 1).then(() => {
      if (editingDiscount) {
        setDiscounts(prev => prev.map(d => d.key === editingDiscount.key ? {
          ...d,
          title: values.title,
          amount: values.amount,
        } : d));
        message.success('Discount updated');
      } else {
        const newDiscount: DiscountRecord = {
          key: Date.now().toString(),
          title: values.title,
          image: 'https://via.placeholder.com/300x100?text=Discount',
          zone: 'all',
          customerLevel: 'all',
          customer: 'all',
          category: 'all',
          amount: values.amount,
          start: '2024-03-14',
          end: '2026-03-14',
          duration: '730 Days',
          usageCount: 0,
          totalAmount: 0,
          discountStatus: 'Running',
          status: 'Active'
        };
        setDiscounts([newDiscount, ...discounts]);
        message.success('Discount created');
      }
      setDiscountDrawerVisible(false);
      setEditingDiscount(null);
      discountForm.resetFields();
      setLoading(false);
    });
  };

  const notificationColumns = [
    {
      title: 'SL',
      dataIndex: 'sl',
      key: 'sl',
      width: 50,
      render: (_: any, __: any, index: number) => index + 1
    },
    {
      title: 'Icon',
      dataIndex: 'image',
      key: 'image',
      render: (img: string) => (
        <Avatar src={img} shape="square" size={40} icon={<NotificationOutlined />} />
      )
    },
    {
      title: 'Notification title',
      dataIndex: 'title',
      key: 'title',
      width: 200,
      render: (text: string) => <Text strong>{text}</Text>
    },
    { 
      title: 'Description', 
      dataIndex: 'description', 
      key: 'description',
      ellipsis: true,
      width: 250
    },
    { title: 'Zone', dataIndex: 'zone', key: 'zone' },
    { 
      title: 'Target Audience', 
      dataIndex: 'target', 
      key: 'target',
      render: (target: string) => (
        <Tag color={target === 'All' ? 'blue' : target === 'Customer' ? 'green' : 'orange'}>
          {target.toUpperCase()}
        </Tag>
      )
    },
    { title: 'Sent At', dataIndex: 'sentAt', key: 'sentAt' },
    { 
      title: 'Clicks', 
      dataIndex: 'clicks', 
      key: 'clicks',
      align: 'center' as const,
      render: (val: number) => <Badge count={val} overflowCount={9999} style={{ backgroundColor: '#1890ff' }} />
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string, record: NotificationRecord) => (
        <Switch 
          size="small" 
          checked={status === 'Active'} 
          onChange={(checked) => {
            setNotifications(prev => prev.map(n => n.key === record.key ? { ...n, status: checked ? 'Active' : 'Inactive' } : n));
            message.success(`Notification ${checked ? 'enabled' : 'disabled'}`);
          }}
        />
      )
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: NotificationRecord) => (
        <Space>
          <Tooltip title="Edit">
            <Button size="small" type="text" icon={<EditOutlined style={{ color: '#faad14' }} />} onClick={() => handleEditNotification(record)} />
          </Tooltip>
          <Tooltip title="Resend">
            <Button size="small" type="text" icon={<SyncOutlined style={{ color: '#00b894' }} />} onClick={() => message.success('Notification queued for resending')} />
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm title="Delete notification?" onConfirm={() => setNotifications(prev => prev.filter(n => n.key !== record.key))} okButtonProps={{ danger: true }}>
              <Button size="small" type="text" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      )
    }
  ];

  const handleEditNotification = (record: NotificationRecord) => {
    setEditingNotification(record);
    notificationForm.setFieldsValue({
      title: record.title,
      description: record.description,
      target: record.target,
      zone: record.zone
    });
    setNotificationDrawerVisible(true);
  };

  const handleCreateNotification = (values: any) => {
    setLoading(true);
    message.loading(editingNotification ? 'Updating notification...' : 'Sending notification...', 1).then(() => {
      if (editingNotification) {
        setNotifications(prev => prev.map(n => n.key === editingNotification.key ? {
          ...n,
          title: values.title,
          description: values.description,
          target: values.target,
          zone: values.zone
        } : n));
        message.success('Notification updated');
      } else {
        const newNotification: NotificationRecord = {
          key: Date.now().toString(),
          title: values.title,
          description: values.description,
          image: 'https://via.placeholder.com/100?text=Notif',
          zone: values.zone || 'all',
          target: values.target || 'All',
          status: 'Active',
          sentAt: new Date().toLocaleString(),
          clicks: 0
        };
        setNotifications([newNotification, ...notifications]);
        message.success('Notification sent successfully');
      }
      setNotificationDrawerVisible(false);
      setEditingNotification(null);
      notificationForm.resetFields();
      setLoading(false);
    });
  };

  const newsletterColumns = [
    {
      title: 'SL',
      dataIndex: 'sl',
      key: 'sl',
      width: 50,
      render: (_: any, __: any, index: number) => index + 1
    },
    {
      title: 'Icon',
      key: 'icon',
      render: () => <Avatar shape="square" size={40} icon={<MailOutlined />} style={{ backgroundColor: '#1890ff' }} />
    },
    {
      title: 'Newsletter Title',
      dataIndex: 'title',
      key: 'title',
      width: 250,
      render: (text: string) => <Text strong>{text}</Text>
    },
    { 
      title: 'Target', 
      dataIndex: 'target', 
      key: 'target',
      render: (target: string) => (
        <Tag color={target === 'All' ? 'blue' : 'green'}>{target.toUpperCase()}</Tag>
      )
    },
    { 
      title: 'Sent At', 
      dataIndex: 'sentAt', 
      key: 'sentAt' 
    },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status',
      render: (status: string) => (
        <Badge status={status === 'Active' ? 'success' : 'default'} text={status} />
      )
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: NewsletterRecord) => (
        <Space>
          <Tooltip title="Preview">
            <Button 
              size="small" 
              type="text" 
              icon={<EyeOutlined style={{ color: '#1890ff' }} />} 
              onClick={() => {
                setSelectedNewsletter(record);
                setNewsletterPreviewVisible(true);
              }} 
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button size="small" type="text" icon={<EditOutlined style={{ color: '#faad14' }} />} onClick={() => handleEditNewsletter(record)} />
          </Tooltip>
          <Tooltip title="Resend">
            <Button size="small" type="text" icon={<SyncOutlined style={{ color: '#00b894' }} />} onClick={() => message.success('Newsletter queued for resending')} />
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm title="Delete newsletter?" onConfirm={() => setNewsletters(prev => prev.filter(n => n.key !== record.key))} okButtonProps={{ danger: true }}>
              <Button size="small" type="text" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      )
    }
  ];

  const handleEditNewsletter = (record: NewsletterRecord) => {
    setEditingNewsletter(record);
    newsletterForm.setFieldsValue({
      title: record.title,
      description: record.description,
      target: record.target
    });
    setNewsletterDrawerVisible(true);
  };

  const handleCreateNewsletter = (values: any) => {
    setLoading(true);
    message.loading(editingNewsletter ? 'Updating newsletter...' : 'Sending newsletter...', 1).then(() => {
      if (editingNewsletter) {
        setNewsletters(prev => prev.map(n => n.key === editingNewsletter.key ? {
          ...n,
          title: values.title,
          description: values.description,
          target: values.target
        } : n));
        message.success('Newsletter updated');
      } else {
        const newNewsletter: NewsletterRecord = {
          key: Date.now().toString(),
          title: values.title,
          description: values.description,
          target: values.target || 'All',
          status: 'Active',
          sentAt: new Date().toLocaleString(),
          totalSent: 1200
        };
        setNewsletters([newNewsletter, ...newsletters]);
        message.success('Newsletter sent successfully');
      }
      setNewsletterDrawerVisible(false);
      setEditingNewsletter(null);
      newsletterForm.resetFields();
      setLoading(false);
    });
  };

  const renderCouponSetup = () => {
    const filteredCoupons = coupons.filter(c => {
      const matchesFilter = couponFilter === 'All' || c.status === couponFilter;
      const matchesSearch = c.title.toLowerCase().includes(couponSearch.toLowerCase()) || c.code.toLowerCase().includes(couponSearch.toLowerCase());
      return matchesFilter && matchesSearch;
    });

    return (
      <div style={{ padding: 16 }}>
        <Row gutter={[24, 24]}>
          {/* Overview and Graph Row */}
          <Col span={24}>
            <Row gutter={24}>
              {/* Left Side: Stats Cards */}
              <Col span={10}>
                <Title level={5} style={{ marginBottom: 16 }}>Coupon overview</Title>
                <Space orientation="vertical" size={16} style={{ width: '100%' }}>
                  <Card variant="borderless" style={{ background: isDark ? '#1a1a3a' : '#fff9f0', borderRadius: 16, height: 160, display: 'flex', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <Text type="secondary" style={{ fontSize: 12 }}>All time <InfoCircleOutlined /></Text>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 12 }}>
                        <div style={{ width: 48, height: 48, borderRadius: 12, background: '#00b894', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                          <span style={{ fontSize: 20, fontWeight: 'bold' }}>%</span>
                        </div>
                        <Statistic title="Total Coupon Amount Given" value={923.64} prefix="$" valueStyle={{ fontSize: 28, fontWeight: 700 }} />
                      </div>
                    </div>
                  </Card>
                  <Card variant="borderless" style={{ background: isDark ? '#1a1a3a' : '#f0faff', borderRadius: 16, height: 160, display: 'flex', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <Text type="secondary" style={{ fontSize: 12 }}>All time <InfoCircleOutlined /></Text>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 12 }}>
                        <div style={{ width: 48, height: 48, borderRadius: 12, background: '#00d2d3', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                          <PlusOutlined style={{ fontSize: 20 }} />
                        </div>
                        <Statistic title="Active Coupon Offer Running" value={1} valueStyle={{ fontSize: 28, fontWeight: 700 }} />
                      </div>
                    </div>
                  </Card>
                </Space>
              </Col>

              {/* Right Side: Graph */}
              <Col span={14}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div>
                    <Title level={5} style={{ margin: 0 }}>Coupon analytics</Title>
                    <Text type="secondary">Monitor coupon statistics</Text>
                  </div>
                  <DatePicker picker="year" defaultValue={null} placeholder="All time" style={{ width: 120 }} />
                </div>
                <Card variant="borderless" style={{ background: isDark ? '#1a1a3a' : '#ffffff', borderRadius: 16 }}>
                  <div style={{ height: 280, width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#444' : '#f0f0f0'} />
                        <XAxis 
                          dataKey="year" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fill: isDark ? '#888' : '#555', fontSize: 12 }}
                        />
                        <YAxis 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fill: isDark ? '#888' : '#555', fontSize: 12 }}
                          domain={[0, 1000]}
                        />
                        <ChartTooltip 
                          cursor={{ fill: 'transparent' }}
                          contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        />
                        <Bar 
                          dataKey="amount" 
                          fill="#00b894" 
                          radius={[6, 6, 0, 0]} 
                          barSize={40}
                          isAnimationActive={false}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </Col>
            </Row>
          </Col>
          <Col span={24}>
            <Card variant="borderless" className="shadow-sm" style={{ borderRadius: 16 }}>
              <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                <Space size="large" align="center">
                  <Title level={5} style={{ margin: 0, whiteSpace: 'nowrap' }}>All coupons</Title>
                  <Segmented 
                    options={['All', 'Active', 'Inactive']} 
                    value={couponFilter} 
                    onChange={(v) => setCouponFilter(v as any)}
                  />
                  <Space size={8}>
                    <Text type="secondary" style={{ whiteSpace: 'nowrap' }}>Total coupons</Text>
                    <Badge count={coupons.length} overflowCount={999} style={{ backgroundColor: '#1890ff' }} />
                  </Space>
                </Space>
                <Space>
                  <Input 
                    placeholder="Search here by Coupon Title" 
                    prefix={<SearchOutlined />} 
                    style={{ width: 250 }}
                    value={couponSearch}
                    onChange={(e) => setCouponSearch(e.target.value)}
                  />
                  <Tooltip title="Refresh">
                    <Button icon={<SyncOutlined />} onClick={handleRefresh} />
                  </Tooltip>
                  <Tooltip title="Manage Trashed Data">
                    <Button icon={<DeleteColumnOutlined />} />
                  </Tooltip>
                  <Tooltip title="Download Coupon Data">
                    <Button icon={<CloudDownloadOutlined />} onClick={handleDownload} />
                  </Tooltip>
                  <Tooltip title="Activity Log">
                    <Button icon={<HistoryOutlined />} onClick={() => message.info('Opening Coupon Activity Log...')} />
                  </Tooltip>
                  <Button 
                    type="primary" 
                    icon={<PlusOutlined />} 
                    onClick={() => setCouponDrawerVisible(true)}
                    style={{ backgroundColor: '#00b894', borderColor: '#00b894' }}
                  >
                    Add Coupon
                  </Button>
                </Space>
              </div>

              <Table 
                size="small"
                columns={couponColumns}
                dataSource={filteredCoupons}
                pagination={{ pageSize: 10 }}
                scroll={{ x: 1500 }}
              />
            </Card>
          </Col>
        </Row>
      </div>
    );
  };

  const renderDiscountSetup = () => {
    const filteredDiscounts = discounts.filter(d => {
      const matchesFilter = discountFilter === 'All' || d.status === discountFilter;
      const matchesSearch = d.title.toLowerCase().includes(discountSearch.toLowerCase());
      return matchesFilter && matchesSearch;
    });

    return (
      <div style={{ padding: 16 }}>
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Card variant="borderless" className="shadow-sm" style={{ borderRadius: 16 }}>
              <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                <Space size="large" align="center">
                  <Title level={5} style={{ margin: 0, whiteSpace: 'nowrap' }}>All discount</Title>
                  <Segmented 
                    options={['All', 'Active', 'Inactive']} 
                    value={discountFilter} 
                    onChange={(v) => setDiscountFilter(v as any)}
                  />
                  <Space size={8}>
                    <Text type="secondary" style={{ whiteSpace: 'nowrap' }}>Total discounts :</Text>
                    <Badge count={discounts.length} overflowCount={999} style={{ backgroundColor: '#1890ff' }} />
                  </Space>
                </Space>
                <Space>
                  <Input 
                    placeholder="Search here by title" 
                    prefix={<SearchOutlined />} 
                    style={{ width: 250 }}
                    value={discountSearch}
                    onChange={(e) => setDiscountSearch(e.target.value)}
                  />
                  <Tooltip title="Refresh">
                    <Button icon={<SyncOutlined />} onClick={handleRefresh} />
                  </Tooltip>
                  <Tooltip title="Manage Trashed Data">
                    <Button icon={<DeleteColumnOutlined />} />
                  </Tooltip>
                  <Tooltip title="Download Discount Data">
                    <Button icon={<CloudDownloadOutlined />} onClick={handleDownload} />
                  </Tooltip>
                  <Tooltip title="Activity Log">
                    <Button icon={<HistoryOutlined />} onClick={() => message.info('Opening Discount Activity Log...')} />
                  </Tooltip>
                  <Button 
                    type="primary" 
                    icon={<PlusOutlined />} 
                    onClick={() => {
                      setEditingDiscount(null);
                      discountForm.resetFields();
                      setDiscountDrawerVisible(true);
                    }}
                    style={{ backgroundColor: '#00b894', borderColor: '#00b894' }}
                  >
                    Add Discount
                  </Button>
                </Space>
              </div>

              <Table 
                size="small"
                columns={discountColumns}
                dataSource={filteredDiscounts}
                pagination={{ pageSize: 10 }}
                scroll={{ x: 1600 }}
              />
            </Card>
          </Col>
        </Row>
      </div>
    );
  };

  const renderNotificationSetup = () => {
    const filteredNotifications = notifications.filter(n => {
      const matchesFilter = notificationFilter === 'All' || n.status === notificationFilter;
      const matchesSearch = n.title.toLowerCase().includes(notificationSearch.toLowerCase());
      return matchesFilter && matchesSearch;
    });

    return (
      <div style={{ padding: 16 }}>
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Card variant="borderless" className="shadow-sm" style={{ borderRadius: 16 }}>
              <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                <Space size="large" align="center">
                  <Title level={5} style={{ margin: 0, whiteSpace: 'nowrap' }}>Push Notifications</Title>
                  <Segmented 
                    options={['All', 'Active', 'Inactive']} 
                    value={notificationFilter} 
                    onChange={(v) => setNotificationFilter(v as any)}
                  />
                  <Space size={8}>
                    <Text type="secondary" style={{ whiteSpace: 'nowrap' }}>Total Sent:</Text>
                    <Badge count={notifications.length} overflowCount={999} style={{ backgroundColor: '#1890ff' }} />
                  </Space>
                </Space>
                <Space>
                  <Input 
                    placeholder="Search by title..." 
                    prefix={<SearchOutlined />} 
                    style={{ width: 250 }}
                    value={notificationSearch}
                    onChange={(e) => setNotificationSearch(e.target.value)}
                  />
                  <Button 
                    type="primary" 
                    icon={<PlusOutlined />} 
                    onClick={() => {
                      setEditingNotification(null);
                      notificationForm.resetFields();
                      setNotificationDrawerVisible(true);
                    }}
                    style={{ backgroundColor: '#00b894', borderColor: '#00b894' }}
                  >
                    Send Notification
                  </Button>
                </Space>
              </div>

              <Table 
                size="small"
                columns={notificationColumns}
                dataSource={filteredNotifications}
                pagination={{ pageSize: 10 }}
                scroll={{ x: 1200 }}
              />
            </Card>
          </Col>
        </Row>
      </div>
    );
  };

  const renderNewsletterSetup = () => {
    const filteredNewsletters = newsletters.filter(n => {
      const matchesFilter = newsletterFilter === 'All' || n.status === newsletterFilter;
      const matchesSearch = n.title.toLowerCase().includes(newsletterSearch.toLowerCase());
      return matchesFilter && matchesSearch;
    });

    return (
      <div style={{ padding: 16 }}>
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Card variant="borderless" className="shadow-sm" style={{ borderRadius: 16 }}>
              <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                <Space size="large" align="center">
                  <Title level={5} style={{ margin: 0, whiteSpace: 'nowrap' }}>Newsletter Management</Title>
                  <Segmented 
                    options={['All', 'Active', 'Inactive']} 
                    value={newsletterFilter} 
                    onChange={(v) => setNewsletterFilter(v as any)}
                  />
                  <Space size={8}>
                    <Text type="secondary" style={{ whiteSpace: 'nowrap' }}>Total Campaigns:</Text>
                    <Badge count={newsletters.length} overflowCount={999} style={{ backgroundColor: '#1890ff' }} />
                  </Space>
                </Space>
                <Space>
                  <Input 
                    placeholder="Search campaigns..." 
                    prefix={<SearchOutlined />} 
                    style={{ width: 250 }}
                    value={newsletterSearch}
                    onChange={(e) => setNewsletterSearch(e.target.value)}
                  />
                  <Button 
                    type="primary" 
                    icon={<PlusOutlined />} 
                    onClick={() => {
                      setEditingNewsletter(null);
                      newsletterForm.resetFields();
                      setNewsletterDrawerVisible(true);
                    }}
                    style={{ backgroundColor: '#00b894', borderColor: '#00b894' }}
                  >
                    Create Newsletter
                  </Button>
                </Space>
              </div>

              <Table 
                size="small"
                columns={newsletterColumns}
                dataSource={filteredNewsletters}
                pagination={{ pageSize: 10 }}
                scroll={{ x: 1000 }}
              />
            </Card>
          </Col>
        </Row>
      </div>
    );
  };

  const renderNewsletterPreview = () => {
    if (!selectedNewsletter) return <Empty description="No newsletter selected" />;
    
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        background: isDark ? '#141414' : '#f0f2f5', 
        padding: previewMode === 'Mobile' ? '40px 0' : 24, 
        borderRadius: 12, 
        border: '1px solid ' + (isDark ? '#303030' : '#d9d9d9'),
        transition: 'all 0.3s ease'
      }}>
        <div style={{ 
          width: previewMode === 'Mobile' ? 375 : '100%', 
          maxWidth: previewMode === 'Mobile' ? 375 : 800,
          background: isDark ? '#1f1f1f' : '#fff',
          boxShadow: previewMode === 'Mobile' ? '0 20px 50px rgba(0,0,0,0.3)' : 'none',
          borderRadius: previewMode === 'Mobile' ? 32 : 8,
          border: previewMode === 'Mobile' ? '8px solid #222' : 'none',
          overflow: 'hidden',
          transition: 'all 0.3s ease'
        }}>
          {/* Email Header Simulation */}
          <div style={{ 
            background: isDark ? '#1f1f1f' : '#fff', 
            padding: previewMode === 'Mobile' ? 12 : 16, 
            borderBottom: '1px solid ' + (isDark ? '#303030' : '#f0f0f0') 
          }}>
            <div style={{ display: 'flex', gap: 4, marginBottom: 4, fontSize: previewMode === 'Mobile' ? 12 : 14 }}>
              <Text type="secondary">From:</Text>
              <Text strong ellipsis>DashDrive &lt;notification@dashdrive.com&gt;</Text>
            </div>
            <div style={{ display: 'flex', gap: 4, marginBottom: 4, fontSize: previewMode === 'Mobile' ? 12 : 14 }}>
              <Text type="secondary">To:</Text>
              <Text strong ellipsis>{selectedNewsletter.target === 'All' ? 'All Community' : selectedNewsletter.target + ' Partners'}</Text>
            </div>
            <div style={{ display: 'flex', gap: 4, fontSize: previewMode === 'Mobile' ? 12 : 14 }}>
              <Text type="secondary">Subj:</Text>
              <Text strong ellipsis>{selectedNewsletter.title}</Text>
            </div>
          </div>

          {/* Email Body */}
          <div style={{ background: '#fff', padding: previewMode === 'Mobile' ? '24px 16px' : '40px 24px', color: '#333', textAlign: 'center' }}>
            <div style={{ maxWidth: '100%', margin: '0 auto' }}>
              <div style={{ 
                width: previewMode === 'Mobile' ? 48 : 60, 
                height: previewMode === 'Mobile' ? 48 : 60, 
                background: '#00b894', 
                borderRadius: 12, 
                display: 'inline-flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                color: '#fff', 
                marginBottom: 24 
              }}>
                <MailOutlined style={{ fontSize: previewMode === 'Mobile' ? 24 : 32 }} />
              </div>
              <Title level={previewMode === 'Mobile' ? 4 : 2} style={{ color: '#000', marginBottom: 16 }}>{selectedNewsletter.title}</Title>
              <Paragraph style={{ 
                fontSize: previewMode === 'Mobile' ? 14 : 16, 
                lineHeight: 1.6, 
                textAlign: 'left', 
                color: '#555' 
              }}>
                {selectedNewsletter.description || 'No content provided.'}
              </Paragraph>
              <Button type="primary" size={previewMode === 'Mobile' ? 'middle' : 'large'} style={{ backgroundColor: '#00b894', borderColor: '#00b894', height: previewMode === 'Mobile' ? 40 : 48, padding: '0 32px', borderRadius: 8, marginTop: 24, width: previewMode === 'Mobile' ? '100%' : 'auto' }}>
                Learn More
              </Button>
              
              <div style={{ marginTop: 48, paddingTop: 24, borderTop: '1px solid #eee' }}>
                <Text type="secondary" style={{ fontSize: 10 }}>
                  You are receiving this email because you are a valued member of the DashDrive ecosystem.
                </Text>
                <div style={{ marginTop: 8 }}>
                  <Space split={<Text type="secondary">|</Text>} size={previewMode === 'Mobile' ? 4 : 8}>
                    <Text type="secondary" style={{ cursor: 'pointer', fontSize: 10 }}>Unsubscribe</Text>
                    <Text type="secondary" style={{ cursor: 'pointer', fontSize: 10 }}>Privacy</Text>
                    <Text type="secondary" style={{ cursor: 'pointer', fontSize: 10 }}>Support</Text>
                  </Space>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ padding: '0 24px 24px 24px' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={3}><DollarOutlined /> Promotion & Marketing</Title>
        <Text type="secondary">Central hub for campaign management, customer incentives, and brand messaging.</Text>
      </div>

      <Card variant="borderless" className="premium-tabs shadow-sm" style={{ borderRadius: 16 }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: '1',
              label: <Space><PictureOutlined /> Banner Setup</Space>,
              children: renderBannerSetup()
            },
            {
              key: '2',
              label: <Space><DollarOutlined /> Coupon Setup</Space>,
              children: renderCouponSetup()
            },
            {
              key: '3',
              label: <Space><Tag color="orange" style={{ marginRight: 0 }} /> Discount Setup</Space>,
              children: renderDiscountSetup()
            },
            {
              key: '4',
              label: <Space><NotificationOutlined /> Push Notifications</Space>,
              children: renderNotificationSetup()
            },
            {
              key: '5',
              label: <Space><MailOutlined /> Newsletters</Space>,
              children: renderNewsletterSetup()
            }
          ]}
        />
      </Card>

      {/* Activity Log Drawer */}
      <Drawer
        title={<Space><HistoryOutlined /> Activity Log: {selectedBanner?.title || selectedCoupon?.title || selectedDiscount?.title}</Space>}
        placement="right"
        width={400}
        onClose={() => {
          setLogDrawerVisible(false);
          setSelectedBanner(null);
          setSelectedCoupon(null);
          setSelectedDiscount(null);
        }}
        open={logDrawerVisible}
      >
        {/* ... existing Timeline ... */}
        <Timeline
          items={[
            {
              color: 'green',
              children: (
                <>
                  <Text strong>Created</Text><br />
                  <Text type="secondary" style={{ fontSize: 12 }}>14 Mar 2026, 02:45 AM</Text><br />
                  <Text style={{ fontSize: 12 }}>By Admin User</Text>
                </>
              ),
            },
            // ... more items
          ]}
        />
      </Drawer>

      {/* Banner Drawer */}
      <Drawer
        title={<Space><PictureOutlined /> {editingBanner ? 'Edit Banner' : 'Add New Banner'}</Space>}
        placement="right"
        width={600}
        onClose={() => {
          setBannerDrawerVisible(false);
          setEditingBanner(null);
          form.resetFields();
        }}
        open={bannerDrawerVisible}
        extra={
          <Space>
            <Button onClick={() => setBannerDrawerVisible(false)}>Cancel</Button>
            <Button type="primary" onClick={() => form.submit()} loading={loading}>
              {editingBanner ? 'Update' : 'Submit'}
            </Button>
          </Space>
        }
      >
        <Form form={form} layout="vertical" onFinish={handleCreateBanner}>
          <Form.Item name="title" label="Banner title *" rules={[{ required: true }]}>
            <Input placeholder="Ex: 50% Off" />
          </Form.Item>
          <Form.Item name="description" label="Short description *" rules={[{ required: true, max: 800 }]}>
            <Input.TextArea placeholder="Type Here..." rows={4} showCount={{ formatter: ({ count }) => `${count}/800` }} />
          </Form.Item>
          <Form.Item label="Banner image *" required>
            <Card style={{ background: isDark ? '#1a1a1a' : '#fafafa', borderStyle: 'dashed', textAlign: 'center' }}>
              <PictureOutlined style={{ fontSize: 40, color: '#bfbfbf', marginBottom: 16 }} />
              <div style={{ marginBottom: 16 }}>
                <Text type="secondary">Click or drag to upload</Text>
              </div>
              <Upload showUploadList={false}>
                <Button icon={<UploadOutlined />}>Choose File</Button>
              </Upload>
            </Card>
          </Form.Item>
          <Form.Item name="link" label="Redirect link *" rules={[{ required: true, type: 'url' }]}>
            <Input placeholder="Ex: www.google.com" prefix={<LinkOutlined />} />
          </Form.Item>
          <Form.Item name="period" label="Time period *">
            <RangePicker style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Drawer>

      <Drawer
        title={<Space><DollarOutlined /> {editingCoupon ? 'Edit Coupon' : 'Add New Coupon'}</Space>}
        placement="right"
        width={700}
        onClose={() => {
          setCouponDrawerVisible(false);
          setEditingCoupon(null);
          couponForm.resetFields();
        }}
        open={couponDrawerVisible}
        extra={
          <Space>
            <Button onClick={() => setCouponDrawerVisible(false)}>Cancel</Button>
            <Button type="primary" onClick={() => couponForm.submit()} loading={loading}>
              {editingCoupon ? 'Update' : 'Submit'}
            </Button>
          </Space>
        }
      >
        <Form form={couponForm} layout="vertical" onFinish={handleCreateCoupon}>
          <div style={{ marginBottom: 24 }}>
            <Title level={5}>Coupon information</Title>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item name="title" label="Coupon title *" rules={[{ required: true }]}>
                  <Input placeholder="Ex: 20% Coupon" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item name="description" label="Short description *" rules={[{ required: true, max: 800 }]}>
                  <Input.TextArea placeholder="Type here..." rows={3} showCount={{ formatter: ({ count }) => `${count}/800` }} />
                </Form.Item>
              </Col>
            </Row>
          </div>

          <div style={{ marginBottom: 24 }}>
            <Title level={5}>Coupon logics</Title>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="type" label="Coupon type *" rules={[{ required: true }]}>
                  <Select placeholder="Select type" options={[{ value: 'default', label: 'Default' }, { value: 'first_trip', label: 'First Trip' }]} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Coupon code *" required>
                  <Space.Compact style={{ width: '100%' }}>
                    <Form.Item name="code" noStyle rules={[{ required: true }]}>
                      <Input placeholder="Ex: New Year 23" />
                    </Form.Item>
                    <Button type="primary" onClick={generateCode}>Generate</Button>
                  </Space.Compact>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="limit" label="Limit for the same user *" rules={[{ required: true }]}>
                  <Input placeholder="Ex: 10" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="startDate" label="Start date *" rules={[{ required: true }]}>
                  <DatePicker style={{ width: '100%' }} placeholder="yyyy/mm/dd" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="endDate" label="End date *" rules={[{ required: true }]}>
                  <DatePicker style={{ width: '100%' }} placeholder="yyyy/mm/dd" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="minAmount" label="Minimum trip amount ($) *" rules={[{ required: true }]}>
                  <Input placeholder="Ex: 100" prefix="$" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="amount" label="Coupon Amount ($) *" rules={[{ required: true }]}>
                  <Input placeholder="Ex: 500" prefix="$" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="maxLimit" label="Maximum discount limit ($)">
                  <Input placeholder="0" prefix="$" defaultValue="0" />
                </Form.Item>
              </Col>
            </Row>
          </div>

          <div>
            <Title level={5}>Coupon Availability</Title>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="customerLevel" label="Customer level *" rules={[{ required: true }]}>
                  <Select 
                    mode="multiple"
                    placeholder="Select levels" 
                    options={[
                      { value: 'all', label: 'ALL' },
                      { value: 'new', label: 'New User' },
                      { value: 'power', label: 'Power Customer' },
                      { value: 'level1', label: 'Level 1' },
                      { value: 'level2', label: 'Level 2' },
                      { value: 'loyal', label: 'Loyal User' }
                    ]} 
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="customer" label="Customer *" rules={[{ required: true }]}>
                  <Select mode="multiple" placeholder="Select customer" options={[{ value: 'all', label: 'All Customers' }]} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="category" label="Category *" rules={[{ required: true }]}>
                  <Select 
                    mode="multiple"
                    placeholder="Select category" 
                    options={[
                      { value: 'all', label: 'ALL' },
                      { value: 'bike', label: 'Bike' },
                      { value: 'car', label: 'Car' },
                      { value: 'parcel', label: 'Parcel' }
                    ]} 
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="zones" label="Zones *" rules={[{ required: true }]}>
                  <Select 
                    mode="multiple"
                    placeholder="Select zones" 
                    options={[
                      { value: 'all', label: 'ALL' },
                      { value: 'asia', label: 'Asia' },
                      { value: 'egypt', label: 'Egypt' }
                    ]} 
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>
        </Form>
      </Drawer>

      <Drawer
        title={<Space><Tag color="orange" /> {editingDiscount ? 'Edit Discount' : 'Add New Discount'}</Space>}
        placement="right"
        width={700}
        onClose={() => {
          setDiscountDrawerVisible(false);
          setEditingDiscount(null);
          discountForm.resetFields();
        }}
        open={discountDrawerVisible}
        extra={
          <Space>
            <Button onClick={() => setDiscountDrawerVisible(false)}>Cancel</Button>
            <Button type="primary" onClick={() => discountForm.submit()} loading={loading}>
              {editingDiscount ? 'Update' : 'Submit'}
            </Button>
          </Space>
        }
      >
        <Form form={discountForm} layout="vertical" onFinish={handleCreateDiscount}>
          <div style={{ marginBottom: 24 }}>
            <Title level={5}>Discount information</Title>
            <Form.Item name="title" label="Discount title *" rules={[{ required: true }]}>
              <Input placeholder="Ex: 50% Holiday Discount" />
            </Form.Item>
            <Form.Item label="Discount image *" required>
              <Card style={{ background: isDark ? '#1a1a1a' : '#fafafa', borderStyle: 'dashed', textAlign: 'center' }}>
                <PictureOutlined style={{ fontSize: 40, color: '#bfbfbf', marginBottom: 16 }} />
                <Upload showUploadList={false}><Button icon={<UploadOutlined />}>Choose File</Button></Upload>
              </Card>
            </Form.Item>
          </div>

          <div style={{ marginBottom: 24 }}>
            <Title level={5}>Discount logics</Title>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="amount" label="Discount Amount (%) *" rules={[{ required: true }]}>
                  <Input placeholder="Ex: 50%" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="startDate" label="Start date *" rules={[{ required: true }]}>
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="endDate" label="End date *" rules={[{ required: true }]}>
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>
          </div>

          <div>
            <Title level={5}>Discount Availability</Title>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="zone" label="Zone *" initialValue="all">
                  <Select options={[{ value: 'all', label: 'All Zones' }]} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="customerLevel" label="Customer Level *" initialValue="all">
                  <Select options={[{ value: 'all', label: 'All Levels' }]} />
                </Form.Item>
              </Col>
            </Row>
          </div>
        </Form>
      </Drawer>
      <Drawer
        title={<Space><NotificationOutlined /> {editingNotification ? 'Edit Notification' : 'Send New Notification'}</Space>}
        placement="right"
        width={600}
        onClose={() => {
          setNotificationDrawerVisible(false);
          setEditingNotification(null);
          notificationForm.resetFields();
        }}
        open={notificationDrawerVisible}
        extra={
          <Space>
            <Button onClick={() => setNotificationDrawerVisible(false)}>Cancel</Button>
            <Button type="primary" onClick={() => notificationForm.submit()} loading={loading}>
              {editingNotification ? 'Update' : 'Send Now'}
            </Button>
          </Space>
        }
      >
        <Form form={notificationForm} layout="vertical" onFinish={handleCreateNotification}>
          <Form.Item name="title" label="Notification title *" rules={[{ required: true }]}>
            <Input placeholder="Ex: New Year Offer!" />
          </Form.Item>
          <Form.Item name="description" label="Description *" rules={[{ required: true, max: 500 }]}>
            <Input.TextArea placeholder="Type your message here..." rows={4} showCount={{ formatter: ({ count }) => `${count}/500` }} />
          </Form.Item>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="target" label="Target Audience *" rules={[{ required: true }]} initialValue="All">
                <Select options={[
                  { value: 'All', label: 'All Users' },
                  { value: 'Customer', label: 'Customers Only' },
                  { value: 'Driver', label: 'Drivers Only' },
                  { value: 'Merchant', label: 'Merchants Only' }
                ]} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="zone" label="Zone *" initialValue="all">
                <Select options={[{ value: 'all', label: 'All Zones' }, { value: 'asia', label: 'Asia' }]} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Notification Image (Optional)">
            <Card style={{ background: isDark ? '#1a1a1a' : '#fafafa', borderStyle: 'dashed', textAlign: 'center' }}>
              <PictureOutlined style={{ fontSize: 32, color: '#bfbfbf', marginBottom: 8 }} />
              <Upload showUploadList={false}><Button size="small" icon={<UploadOutlined />}>Upload Icon</Button></Upload>
            </Card>
          </Form.Item>
        </Form>
      </Drawer>
      <Drawer
        title={<Space><MailOutlined /> {editingNewsletter ? 'Edit Newsletter' : 'Create Newsletter'}</Space>}
        placement="right"
        width={700}
        onClose={() => {
          setNewsletterDrawerVisible(false);
          setEditingNewsletter(null);
          newsletterForm.resetFields();
        }}
        open={newsletterDrawerVisible}
        extra={
          <Space>
            <Button onClick={() => setNewsletterDrawerVisible(false)}>Cancel</Button>
            <Button type="primary" onClick={() => newsletterForm.submit()} loading={loading}>
              {editingNewsletter ? 'Update' : 'Send Newsletter'}
            </Button>
          </Space>
        }
      >
        <Form form={newsletterForm} layout="vertical" onFinish={handleCreateNewsletter}>
          <Form.Item name="title" label="Newsletter Title *" rules={[{ required: true }]}>
            <Input placeholder="Ex: Monthly Community Digest" />
          </Form.Item>
          
          <Form.Item name="target" label="Target Audience *" rules={[{ required: true }]} initialValue="All">
            <Select options={[
              { value: 'All', label: 'All Subscribers' },
              { value: 'Customer', label: 'Customers Only' },
              { value: 'Driver', label: 'Driver Partners Only' },
              { value: 'Merchant', label: 'Merchants Only' }
            ]} />
          </Form.Item>

          <Form.Item name="description" label="Newsletter Content *" rules={[{ required: true }]}>
            <Input.TextArea 
              placeholder="Type your newsletter content here..." 
              rows={12} 
              showCount 
            />
          </Form.Item>

          <Form.Item label="Newsletter Header Image">
            <Card style={{ background: isDark ? '#1a1a1a' : '#fafafa', borderStyle: 'dashed', textAlign: 'center' }}>
              <PictureOutlined style={{ fontSize: 32, color: '#bfbfbf', marginBottom: 8 }} />
              <Upload showUploadList={false}>
                <Button size="small" icon={<UploadOutlined />}>Upload Image</Button>
              </Upload>
            </Card>
          </Form.Item>
        </Form>
      </Drawer>
      <Drawer
        title={<Space><EyeOutlined /> Newsletter Preview: {selectedNewsletter?.title}</Space>}
        placement="bottom"
        height="90%"
        onClose={() => {
          setNewsletterPreviewVisible(false);
          setSelectedNewsletter(null);
        }}
        open={newsletterPreviewVisible}
        extra={
          <Space>
            <Segmented 
              options={['Desktop', 'Mobile']} 
              value={previewMode}
              onChange={(v) => setPreviewMode(v as any)}
            />
            <Button icon={<CloudDownloadOutlined />}>Export HTML</Button>
            <Button type="primary" icon={<MailOutlined />} onClick={() => message.success('Live test email sent to your inbox!')}>Send Test</Button>
          </Space>
        }
      >
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          {renderNewsletterPreview()}
        </div>
      </Drawer>

      {/* Standardization Modals & Drawers */}
      <Modal
        title="Campaign Deletion Reason"
        open={rejectionModalVisible}
        onOk={handleConfirmDeletion}
        onCancel={() => setRejectionModalVisible(false)}
        okText="Trash Campaign"
        okButtonProps={{ danger: true }}
      >
        <div style={{ marginBottom: 16 }}>
          <Text type="secondary">
            Provide a reason for trashing <Text strong>{pendingAction?.name}</Text>. 
            This action will move the campaign to the trash storage.
          </Text>
        </div>
        <Form layout="vertical">
          <Form.Item label="Reason" required>
            <Input.TextArea 
              rows={4} 
              placeholder="e.g. Budget reallocation, seasonal campaign end, errors in creative..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />
          </Form.Item>
        </Form>
      </Modal>

      <Drawer
        title={<span><RestOutlined /> Trashed Marketing Campaigns</span>}
        width={720}
        onClose={() => setIsTrashOpen(false)}
        open={isTrashOpen}
      >
        <Tabs
          defaultActiveKey="1"
          items={[
            {
              key: '1',
              label: 'Banners',
              children: (
                <Table
                  size="small"
                  dataSource={banners.filter(b => b.status === 'Inactive')}
                  rowKey="key"
                  columns={[
                    { title: 'Banner', dataIndex: 'title', key: 'title' },
                    { 
                      title: 'Actions', 
                      key: 'actions', 
                      render: (_, r) => (
                        <Button size="small" icon={<UndoOutlined />} onClick={() => handleRestore(r.key, 'banner')}>Restore</Button>
                      )
                    }
                  ]}
                  locale={{ emptyText: <Empty description="No trashed banners" /> }}
                />
              )
            },
            {
              key: '2',
              label: 'Coupons',
              children: (
                <Table
                  size="small"
                  dataSource={coupons.filter(c => c.status === 'Inactive')}
                  rowKey="key"
                  columns={[
                    { title: 'Coupon Code', dataIndex: 'code', key: 'code' },
                    { 
                      title: 'Actions', 
                      key: 'actions', 
                      render: (_, r) => (
                        <Button size="small" icon={<UndoOutlined />} onClick={() => handleRestore(r.key, 'coupon')}>Restore</Button>
                      )
                    }
                  ]}
                  locale={{ emptyText: <Empty description="No trashed coupons" /> }}
                />
              )
            }
          ]}
        />
      </Drawer>
    </div>
  );
};

