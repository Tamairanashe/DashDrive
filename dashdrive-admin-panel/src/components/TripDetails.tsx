import React, { useState } from 'react';
import { RouteMapDrawer } from './RouteMapDrawer';
import {
  Drawer,
  Tag,
  Divider,
  Button,
  Tabs,
  Timeline,
  Card,
  Descriptions,
  Space,
  Typography,
  Avatar,
  Row,
  Col,
  Statistic,
  Alert,
  Steps,
  Flex,
  Tooltip,
  Badge,
} from 'antd';
import {
  PrinterOutlined,
  DownloadOutlined,
  CloseOutlined,
  EnvironmentOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  SafetyCertificateOutlined,
  ClockCircleOutlined,
  CarOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  ScheduleOutlined,
  RollbackOutlined,
  AimOutlined,
  SendOutlined,
  InfoCircleOutlined,
  CustomerServiceOutlined,
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

interface TripDetailsProps {
  visible: boolean;
  onClose: () => void;
  trip: any;
}

export const TripDetails: React.FC<TripDetailsProps> = ({ visible, onClose, trip }) => {
  const [activeTab, setActiveTab] = useState('summary');
  const [isMapOpen, setIsMapOpen] = useState(false);

  if (!trip) return null;

  const tripId = trip.id.replace('TRIP-', '').replace('RIDE-', '');
  const isTrip53 = tripId === '100053';
  const isTrip23 = tripId === '100023';
  const isTrip46 = tripId === '100046';

  const isCancelled = trip.status === 'Cancelled';
  const isReturned = trip.status === 'Returned';
  const isScheduled = trip.status === 'Scheduled';
  const isCompleted = trip.status === 'Completed';

  // ── Pricing ─────────────────────────────────────────────
  let pricing = {
    tripAmount: 100.00, delayFee: 1671569.90, idleFee: 0, cancellationFee: 0,
    discountAmount: 5000.00, couponDiscount: 0, extraFare: 30.00,
    vatPercent: 10, vatTax: 166669.99, total: 1833369.89,
    paymentStatus: 'Paid' as string, priceLabel: 'Total (Paid)',
  };
  if (isTrip53) pricing = { ...pricing, tripAmount: 2922.75, delayFee: 0, discountAmount: 1681.23, extraFare: 775.95, vatPercent: 0, vatTax: 0, total: 0, paymentStatus: 'Unpaid', priceLabel: 'Total (Unpaid)' };
  else if (isTrip23) pricing = { ...pricing, tripAmount: 233.50, delayFee: 0, discountAmount: 0, extraFare: 0, vatPercent: 10, vatTax: 23.35, total: 256.85, paymentStatus: 'Paid', priceLabel: 'Total (Paid)' };
  else if (isTrip46) pricing = { ...pricing, tripAmount: 0, delayFee: 0, discountAmount: 0, extraFare: 0, vatPercent: 0, vatTax: 0, total: 652.08, paymentStatus: 'Pending', priceLabel: 'Total estimated price' };

  // ── Customer ────────────────────────────────────────────
  let customer = { name: 'Jonathon Ken', level: 'Level 1', phone: '+8****', email: 'k*****@gmail.com' };
  if (isTrip53) customer = { name: 'RAJEEV Kr', level: 'New User', phone: '+9****', email: '' };
  else if (isTrip23) customer = { name: 'Jhon Jack', level: 'New User', phone: '+8****', email: 'c********@customer.com' };
  else if (isTrip46) customer = { name: 'Test User', level: 'Level 1', phone: '+8****', email: 't*****@gmail.com' };

  const hasDriver = !isTrip53 && !isTrip46;

  // ── Trajectory (Harare, Zimbabwe) ───────────────────────
  let traj = { pickup: 'Harare Central, Zimbabwe', dropoff: 'Epworth, Harare, Zimbabwe', distance: '12.4 Km' };
  if (isTrip53) traj = { pickup: 'Avondale, Harare, Zimbabwe', dropoff: 'Harare Central, Zimbabwe', distance: '4.5 Km' };
  else if (isTrip23) traj = { pickup: 'Borrowdale, Harare, Zimbabwe', dropoff: 'Mount Pleasant, Harare, Zimbabwe', distance: '6.2 Km' };
  else if (isTrip46) traj = { pickup: 'Belvedere, Harare, Zimbabwe', dropoff: 'Milton Park, Harare, Zimbabwe', distance: '3.1 Km' };

  // ── Coordinates for map (Harare, Zimbabwe) ──────────────
  let coords = { origin: { lat: -17.8248, lng: 31.0530, label: traj.pickup }, destination: { lat: -17.8625, lng: 30.9220, label: traj.dropoff } };
  if (isTrip53) coords = { origin: { lat: -17.8042, lng: 31.0371, label: traj.pickup }, destination: { lat: -17.8248, lng: 31.0530, label: traj.dropoff } };
  else if (isTrip23) coords = { origin: { lat: -17.7562, lng: 31.1077, label: traj.pickup }, destination: { lat: -17.7831, lng: 31.0494, label: traj.dropoff } };
  else if (isTrip46) coords = { origin: { lat: -17.8315, lng: 31.0124, label: traj.pickup }, destination: { lat: -17.8189, lng: 31.0305, label: traj.dropoff } };


  const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

  const tripDate = isTrip53 ? '20 March 2026, 05:29 am' : isTrip23 ? '26 September 2024, 11:28 am' : isTrip46 ? '20 July 2025, 04:57 pm' : '20 July 2025, 04:58 pm';
  const tripType = isTrip23 ? 'Parcel' : isTrip46 ? 'Ride request (Scheduled)' : 'Ride request';

  // ── Activity log ────────────────────────────────────────
  const activityLog = isTrip46 ? [
    { time: '04:57 pm', title: 'Ride Scheduled', desc: 'Ride scheduled for 20 July 2025 by Test User.', color: 'blue' as const },
    { time: '04:55 pm', title: 'Searching for Driver', desc: 'System waiting to broadcast to nearby drivers.', color: 'gray' as const },
  ] : isTrip53 ? [
    { time: '05:35 am', title: 'Trip Cancelled', desc: 'Customer cancelled the trip before driver acceptance.', color: 'red' as const },
    { time: '05:29 am', title: 'Searching for Driver', desc: 'System searching for nearby drivers.', color: 'gray' as const },
    { time: '05:29 am', title: 'Ride Requested', desc: 'Customer RAJEEV Kr placed a ride request.', color: 'green' as const },
  ] : isTrip23 ? [
    { time: '12:15 pm', title: 'Item Returned', desc: 'Parcel was returned to sender location.', color: 'orange' as const },
    { time: '11:50 am', title: 'Delivery Attempt Failed', desc: 'Recipient was unavailable at the location.', color: 'red' as const },
    { time: '11:28 am', title: 'Out for Delivery', desc: 'Parcel is out for delivery with Test Driver.', color: 'blue' as const },
    { time: '11:20 am', title: 'Parcel Picked Up', desc: 'Driver picked up the parcel from Mirpur-9.', color: 'green' as const },
    { time: '11:15 am', title: 'Request Accepted', desc: 'Driver Test Driver accepted the parcel request.', color: 'green' as const },
  ] : [
    { time: '04:58 pm', title: 'Trip Completed', desc: 'Driver reached drop-off point and ended the trip.', color: 'green' as const },
    { time: '04:45 pm', title: 'Trip Started', desc: 'Trip started from 1005 Avenue 11.', color: 'blue' as const },
    { time: '04:35 pm', title: 'Trip Accepted', desc: 'Driver Test Driver accepted the ride request.', color: 'green' as const },
  ];

  // ── Status helpers ──────────────────────────────────────
  const statusColor = isCancelled ? 'error' : isReturned ? 'warning' : isScheduled ? 'processing' : 'success';
  const payColor = pricing.paymentStatus === 'Unpaid' ? 'warning' : pricing.paymentStatus === 'Pending' ? 'default' : 'processing';

  // ── Pricing rows for Descriptions ──────────────────────
  const pricingRows: { label: string; value: string; type?: 'add' | 'sub' }[] = [];
  pricingRows.push({ label: 'Trip amount', value: fmt(pricing.tripAmount) });
  if (pricing.delayFee > 0) pricingRows.push({ label: 'Delay fee', value: `+ ${fmt(pricing.delayFee)}`, type: 'add' });
  if (pricing.extraFare > 0) pricingRows.push({ label: 'Extra fare', value: `+ ${fmt(pricing.extraFare)}`, type: 'add' });
  if (pricing.discountAmount > 0) pricingRows.push({ label: 'Discount amount', value: `- ${fmt(pricing.discountAmount)}`, type: 'sub' });
  if (pricing.couponDiscount > 0) pricingRows.push({ label: 'Coupon discount', value: `- ${fmt(pricing.couponDiscount)}`, type: 'sub' });
  pricingRows.push({ label: `VAT/Tax (${pricing.vatPercent} %)`, value: `+ ${fmt(pricing.vatTax)}`, type: 'add' });

  // ── Drawer title ────────────────────────────────────────
  const drawerTitle = (
    <Flex justify="space-between" align="center" style={{ width: '100%', paddingRight: 8 }}>
      <Space direction="vertical" size={0}>
        <Title level={4} style={{ margin: 0 }}>Trip #{tripId}</Title>
        <Text type="secondary" style={{ fontSize: 12 }}>{tripDate}</Text>
      </Space>
      <Space>
        <Button icon={<PrinterOutlined />}>Print</Button>
        <Button icon={<DownloadOutlined />}>Invoice download</Button>
      </Space>
    </Flex>
  );

  // ── Summary tab ─────────────────────────────────────────
  const summaryContent = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Status Header Cards */}
      <Row gutter={[12, 12]}>
        <Col span={6}>
          <Card size="small" styles={{ body: { padding: '12px 16px' } }}>
            <Text type="secondary" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1 }}>Total</Text>
            <div>
              <Text strong style={{ fontSize: 18 }}>{fmt(pricing.total)}</Text>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small" styles={{ body: { padding: '12px 16px' } }}>
            <Text type="secondary" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1 }}>Order</Text>
            <div><Badge status={statusColor} text={<Text strong style={{ fontSize: 12 }}>{trip.status}</Text>} /></div>
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small" styles={{ body: { padding: '12px 16px' } }}>
            <Text type="secondary" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1 }}>Payment</Text>
            <div><Badge status={payColor} text={<Text strong style={{ fontSize: 12 }}>{pricing.paymentStatus}</Text>} /></div>
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small" styles={{ body: { padding: '12px 16px' } }}>
            <Text type="secondary" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1 }}>Type</Text>
            <div><Text strong style={{ fontSize: 12 }}>{tripType}</Text></div>
          </Card>
        </Col>
      </Row>

      {/* Alert banners */}
      {isCancelled && (
        <Alert
          message="Trip was cancelled before driver accepted"
          description="This ride was automatically cancelled because no driver accepted the request within the timeout window."
          type="error"
          showIcon
          icon={<CloseCircleOutlined />}
        />
      )}
      {isScheduled && (
        <Alert
          message="Scheduled Ride — Awaiting Driver Assignment"
          description="This ride is scheduled for a future time. The system will broadcast to nearby drivers closer to the pickup time."
          type="info"
          showIcon
          icon={<ScheduleOutlined />}
        />
      )}
      {isReturned && (
        <Alert
          message="Parcel Returned to Sender"
          description="The delivery attempt was unsuccessful and the parcel has been returned to the original sender."
          type="warning"
          showIcon
          icon={<RollbackOutlined />}
        />
      )}

      {/* Driver & Customer */}
      <Row gutter={16}>
        <Col span={12}>
          <Card
            size="small"
            title={
              <Space><SafetyCertificateOutlined style={{ color: '#8c8c8c' }} /><Text strong style={{ fontSize: 12 }}>Driver Details</Text></Space>
            }
            styles={{ body: { padding: hasDriver ? 16 : '24px 16px' } }}
          >
            {hasDriver ? (
              <Space direction="vertical" size={8} style={{ width: '100%' }}>
                <Space>
                  <Avatar style={{ backgroundColor: '#faad14' }} icon={<UserOutlined />} />
                  <div>
                    <Text strong>Test Driver</Text>
                    <br />
                    <Tag color="default" style={{ fontSize: 10 }}>Level 1</Tag>
                  </div>
                </Space>
                <Divider style={{ margin: '4px 0' }} />
                <Space size={4}><PhoneOutlined style={{ color: '#8c8c8c' }} /><Text type="secondary" style={{ fontSize: 12 }}>+8****</Text></Space>
                <Space size={4}><MailOutlined style={{ color: '#8c8c8c' }} /><Text type="secondary" style={{ fontSize: 12 }}>t******@driver.com</Text></Space>
              </Space>
            ) : (
              <Flex vertical align="center" gap={8} style={{ padding: '12px 0' }}>
                <Avatar size={40} icon={<UserOutlined />} style={{ backgroundColor: '#f0f0f0', color: '#bfbfbf' }} />
                <Text type="secondary" italic style={{ fontSize: 12 }}>{isTrip46 ? 'No Driver Assigned Yet' : 'No driver assigned'}</Text>
              </Flex>
            )}
          </Card>
        </Col>

        <Col span={12}>
          <Card
            size="small"
            title={
              <Space><UserOutlined style={{ color: '#8c8c8c' }} /><Text strong style={{ fontSize: 12 }}>Customer Details</Text></Space>
            }
            styles={{ body: { padding: 16 } }}
          >
            <Space direction="vertical" size={8} style={{ width: '100%' }}>
              <Space>
                <Avatar style={{ backgroundColor: '#1677ff' }} icon={<UserOutlined />} />
                <div>
                  <Text strong>{customer.name}</Text>
                  <br />
                  <Tag color="default" style={{ fontSize: 10 }}>{customer.level}</Tag>
                </div>
              </Space>
              <Divider style={{ margin: '4px 0' }} />
              <Space size={4}><PhoneOutlined style={{ color: '#8c8c8c' }} /><Text type="secondary" style={{ fontSize: 12 }}>{customer.phone}</Text></Space>
              {customer.email && <Space size={4}><MailOutlined style={{ color: '#8c8c8c' }} /><Text type="secondary" style={{ fontSize: 12 }}>{customer.email}</Text></Space>}
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Pricing */}
      {!isScheduled && (
        <Card
          size="small"
          title={
            <Space><DollarOutlined style={{ color: '#8c8c8c' }} /><Text strong style={{ fontSize: 12 }}>Pricing</Text></Space>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
            {pricingRows.map((row, i) => (
              <Flex key={i} justify="space-between">
                <Text type="secondary" style={{ fontSize: 13 }}>{row.label}</Text>
                <Text
                  strong={!row.type}
                  type={row.type === 'sub' ? 'danger' : undefined}
                  style={{ fontSize: 13, color: row.type === 'add' ? '#52c41a' : undefined }}
                >
                  {row.value}
                </Text>
              </Flex>
            ))}
          </div>
          <Divider style={{ margin: '8px 0' }} />
          <Flex justify="space-between" align="center">
            <Text strong style={{ fontSize: 13 }}>{pricing.priceLabel}</Text>
            <Title level={4} style={{ margin: 0, color: isCancelled ? '#bfbfbf' : undefined }}>
              {fmt(pricing.total)}
            </Title>
          </Flex>
        </Card>
      )}

      {/* Scheduled — show estimated price only */}
      {isScheduled && (
        <Card size="small" title={<Space><DollarOutlined style={{ color: '#8c8c8c' }} /><Text strong style={{ fontSize: 12 }}>Estimated Pricing</Text></Space>}>
          <Flex justify="space-between" align="center">
            <Text type="secondary">Total estimated price</Text>
            <Title level={4} style={{ margin: 0 }}>{fmt(pricing.total)}</Title>
          </Flex>
          <Text type="secondary" style={{ fontSize: 11 }}>Estimation based on route distance. Final fare may vary.</Text>
        </Card>
      )}

      {/* Route */}
      <Card
        size="small"
        title={
          <Flex justify="space-between" align="center">
            <Space><EnvironmentOutlined style={{ color: '#8c8c8c' }} /><Text strong style={{ fontSize: 12 }}>Route</Text></Space>
            <Button type="primary" size="small" icon={<AimOutlined />} onClick={() => setIsMapOpen(true)}>View In Map</Button>
          </Flex>
        }
      >
        <Steps
          direction="vertical"
          size="small"
          current={isCancelled ? 0 : 1}
          status={isCancelled ? 'error' : undefined}
          items={[
            {
              title: <Text type="secondary" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1 }}>Pickup Point</Text>,
              description: <Text strong style={{ fontSize: 13 }}>{traj.pickup}</Text>,
              icon: <EnvironmentOutlined style={{ color: '#1677ff' }} />,
            },
            {
              title: <Text type="secondary" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1 }}>Dropoff Point {isReturned ? '(Returned to Origin)' : ''}</Text>,
              description: <Text strong style={isCancelled ? { fontSize: 13, opacity: 0.4 } : { fontSize: 13 }}>{traj.dropoff}</Text>,
              icon: <SendOutlined style={{ color: isCancelled ? '#bfbfbf' : '#52c41a' }} />,
            },
          ]}
        />
        <Divider style={{ margin: '8px 0' }} />
        <Flex align="center" gap={8}>
          <CarOutlined style={{ color: '#8c8c8c' }} />
          <Text type="secondary" style={{ fontSize: 12 }}>Total distance —</Text>
          <Text strong>{traj.distance}</Text>
        </Flex>
      </Card>
    </div>
  );

  // ── Activity log tab ────────────────────────────────────
  const activityContent = (
    <Card size="small" title={<Space><ClockCircleOutlined style={{ color: '#8c8c8c' }} /><Text strong style={{ fontSize: 12 }}>Activity Timeline</Text></Space>}>
      <Timeline
        items={activityLog.map((entry) => ({
          color: entry.color,
          children: (
            <div style={{ paddingBottom: 8 }}>
              <Flex justify="space-between" align="baseline">
                <Text strong>{entry.title}</Text>
                <Text type="secondary" style={{ fontSize: 11 }}>{entry.time}</Text>
              </Flex>
              <Text type="secondary" style={{ fontSize: 12 }}>{entry.desc}</Text>
            </div>
          ),
        }))}
      />
    </Card>
  );

  return (
    <>
    <Drawer
      title={drawerTitle}
      placement="right"
      onClose={onClose}
      open={visible}
      width={560}
      closeIcon={<CloseOutlined />}
      styles={{
        header: { borderBottom: '1px solid #f0f0f0', paddingBottom: 12 },
        body: { padding: 0, background: '#fafafa' },
        footer: { borderTop: '1px solid #f0f0f0' },
      }}
      footer={
        <Flex justify="space-between" align="center">
          <Space size="large">
            <Space direction="vertical" size={0}>
              <Text type="secondary" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1 }}>Trip Status</Text>
              <Badge status={statusColor} text={<Text strong>{trip.status}</Text>} />
            </Space>
            <Space direction="vertical" size={0}>
              <Text type="secondary" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1 }}>Payment</Text>
              <Badge status={payColor} text={<Text strong>{pricing.paymentStatus}</Text>} />
            </Space>
          </Space>
          <Button icon={<CustomerServiceOutlined />} size="large">Support Ticket</Button>
        </Flex>
      }
    >
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        centered
        style={{ padding: '0 20px' }}
        items={[
          {
            key: 'summary',
            label: 'Trip Summary',
            children: <div style={{ padding: '4px 0 20px' }}>{summaryContent}</div>,
          },
          {
            key: 'activity',
            label: 'Activity Log',
            children: <div style={{ padding: '4px 0 20px' }}>{activityContent}</div>,
          },
        ]}
      />
    </Drawer>

    {/* Route Map Drawer */}
    <RouteMapDrawer
      visible={isMapOpen}
      onClose={() => setIsMapOpen(false)}
      origin={coords.origin}
      destination={coords.destination}
      tripId={tripId}
    />
    </>
  );
};
