import React, { useState, useEffect } from 'react';
import { adminApi } from '../api/adminApi';
import { Typography, Card, Form, Input, Select, Button, Space, Divider, Row, Col, Switch, Upload, message, Tooltip, InputNumber, Tabs, Alert, Collapse, Table, Tag, Checkbox } from 'antd';
import {
  SaveOutlined, ShopOutlined, EnvironmentOutlined, ClockCircleOutlined,
  DollarOutlined, SettingOutlined, PictureOutlined, LoadingOutlined,
  PlusOutlined, InfoCircleOutlined, PushpinOutlined, SearchOutlined,
  BgColorsOutlined, LinkOutlined, GlobalOutlined, FormOutlined, PhoneOutlined, MailOutlined,
  ControlOutlined, PercentageOutlined, SafetyCertificateOutlined, InteractionOutlined, UnorderedListOutlined, RadarChartOutlined, UndoOutlined,
  CarOutlined, StarOutlined, GiftOutlined, TrophyOutlined, CheckCircleOutlined, AppstoreAddOutlined, AuditOutlined, WalletOutlined,
  TagsOutlined, DeleteOutlined, IdcardOutlined, UserOutlined, CreditCardOutlined,
  InstagramOutlined, TwitterOutlined, FacebookOutlined, YoutubeOutlined, WhatsAppOutlined,
  MobileOutlined, AndroidOutlined, AppleOutlined, SafetyOutlined, AimOutlined, ShareAltOutlined,
  FieldTimeOutlined, SolutionOutlined, RocketOutlined, ScheduleOutlined, StopOutlined, QuestionCircleOutlined, EditOutlined,
  InboxOutlined, RollbackOutlined, SwapOutlined, ExportOutlined, VerticalAlignBottomOutlined,
  CoffeeOutlined, ShoppingOutlined, HomeOutlined, CalendarOutlined, KeyOutlined,
  NodeIndexOutlined, ThunderboltOutlined, BankOutlined,
  AlertOutlined, CustomerServiceOutlined, FileProtectOutlined, SecurityScanOutlined,
  TeamOutlined, UserAddOutlined, MessageOutlined, CommentOutlined
} from '@ant-design/icons';

const { Option } = Select;

export const EnterpriseSetupPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const verifyPeriodically = Form.useWatch('verifyPeriodically', form);
  const enableScheduledTrips = Form.useWatch('enableScheduledTrips', form);
  const enableParcelReturn = Form.useWatch('enableParcelReturn', form);
  const enableParcelWeightLimit = Form.useWatch('enableParcelWeightLimit', form);
  const enableParcelRefund = Form.useWatch('enableParcelRefund', form);
  const enableServiceReturns = Form.useWatch('enableServiceReturns', form);
  const enableSafetyAlert = Form.useWatch('enableSafetyAlert', form);
  const enableSafetyAfterTrip = Form.useWatch('enableSafetyAfterTrip', form);
  const enableSafetyAlertReasons = Form.useWatch('enableSafetyAlertReasons', form);
  const enableCustomerReferral = Form.useWatch('enableCustomerReferral', form);
  const enableDriverReferral = Form.useWatch('enableDriverReferral', form);
  const enableCustomerReferralDiscount = Form.useWatch('enableCustomerReferralDiscount', form);
  const enableDriverChatting = Form.useWatch('enableDriverChatting', form);

  // Mock initial values combining both tabs
  const initialValues = {
    // Business Info
    businessName: 'DashDrive Global',
    contactName: 'Admin User',
    contactEmail: 'admin@dashdrive.app',
    supportPhone: '+263 77 123 4567',
    supportEmail: 'support@dashdrive.app',
    country: 'Zimbabwe',
    businessAddress: '42 Samora Machel Ave, Harare',
    timeZone: 'Africa/Harare',
    timeFormat: '24h',
    currency: 'USD',
    currencyPosition: 'left',
    decimalPoints: 2,
    tradeLicense: 'DL-2024-987654',
    copyright: 'Â© 2024 DashDrive. All rights reserved.',
    primaryColor: '#0e172a',
    secondaryColor: '#3b82f6',
    textDark: '#1e293b',
    textLight: '#f8fafc',
    textSmall: '#94a3b8',
    textMedium: '#64748b',
    background: '#f1f5f9',
    
    // Settings
    tripCommission: 15,
    vat: 15,
    imttTax: 2,
    imttResponsibility: 'Customer',
    imttOnWalletTransfer: true,
    vatTreatment: 'Exclusive',
    vatOnCommission: false,
    thirdPartyFees: 1.5,
    searchRadius: 5,
    completionRadius: 50,
    websocketUrl: 'wss://api.dashdrive.app/ws',
    websocketPort: 6001,
    maxLoginAttempts: 5,
    maxOtpAttempts: 3,
    otpResendWait: 60,
    tempOtpBlock: 300,
    tempLoginBlock: 900,
    enableFareBidding: true,
    paginationLimit: 20,
    
    // Driver Module Settings
    driverSelfRegistration: true,
    driverVerification: true,
    driverReviews: true,
    driverRewards: true,
    loyaltyPointsValue: 10,
    leaderboardRewards: true,
    enableParcelLimit: true,
    maxParcelLimit: 5,
    requireVehicleUpdateApproval: true,
    approvalVehicleBrand: true,
    approvalVehicleCategory: true,
    approvalLicencePlate: true,
    approvalLicenceExpiry: true,
    enableCashInHand: true,
    maxAmountToHold: 100,
    maxAmountToPay: 50,
    enableWalletBundles: true,
    walletBundles: [
      { price: 10, rides: 9, expiryDays: 30 },
      { price: 20, rides: 20, expiryDays: 30 },
      { price: 50, rides: 55, expiryDays: 60 },
      { price: 100, rides: 120, expiryDays: 90 },
    ],
    minWalletBalance: 0,
    enableIdentityVerification: true,
    verifyAtSignup: true,
    verifyPeriodically: false,
    verifyTimePeriod: 30,
    verifySwitchOnline: true,

    // Customer Module Settings
    customerVerification: false,
    customerReviews: true,
    customerLevel: true,
    customerLoyaltyPoints: true,
    customerMinAddAmount: 10,
    customerPaymentMethods: ['cash', 'mobile_money', 'wallet'],

    // Social & Links
    facebookLink: 'https://facebook.com/dashdrive',
    twitterLink: 'https://twitter.com/dashdrive',
    instagramLink: 'https://instagram.com/dashdrive',
    youtubeLink: 'https://youtube.com/dashdrive',
    whatsappSupport: '+263771112223',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.dashdrive.app',
    appStoreUrl: 'https://apps.apple.com/app/dashdrive/id123456789',

    // Safety & Payments
    sosNumber: '911',
    enableRealTimeTracking: true,
    trackingInterval: 10,
    ecocashMerchantName: '',
    ecocashMerchantNumber: '',
    onemoneyMerchantName: '',
    onemoneyMerchantNumber: '',
    omariMerchantName: '',
    omariMerchantNumber: '',

    // Referral
    enableReferral: true,
    referralAmount: 5,

    // Fare & Penalties
    idleFeeStartMin: 5,
    delayFeeStartMin: 10,
    rideModel: 'bidding',
    parcelModel: 'bidding',
    foodModel: 'standard',
    martModel: 'standard',
    shoppingModel: 'standard',

    // Trip Settings
    enableExtraStops: true,
    tripActiveTime: 5,
    driverOtpConfirmation: true,
    enableScheduledTrips: true,
    minScheduleTime: 5,
    advanceScheduleDays: 7,
    driverNotifyBefore: 4,
    increaseFareForScheduled: true,
    scheduledFareIncreasePercent: 50,
    cancellationReasons: [
      { key: '1', reason: 'Couldnâ€™t find or contact customer', type: 'Before Pickup', user: 'Driver', status: true },
      { key: '2', reason: 'Customer asked to cancel', type: 'Ongoing Ride', user: 'Driver', status: true },
      { key: '3', reason: 'Couldnâ€™t reach to the customer for heavy jam', type: 'Before Pickup', user: 'Driver', status: true },
      { key: '4', reason: 'Customer didnâ€™t arrived at pickup point', type: 'Before Pickup', user: 'Driver', status: true },
      { key: '5', reason: 'Vehicle problem', type: 'Ongoing Ride', user: 'Driver', status: true },
      { key: '6', reason: 'Driver asked me to cancel', type: 'Ongoing Ride', user: 'Customer', status: true },
      { key: '7', reason: 'Driver want extra fare', type: 'Ongoing Ride', user: 'Customer', status: true },
      { key: '8', reason: 'Waiting time is high', type: 'Before Pickup', user: 'Customer', status: true },
      { key: '9', reason: 'Driver is taking long time to reach pickup point', type: 'Before Pickup', user: 'Customer', status: true },
      { key: '10', reason: 'Selected wrong location', type: 'Before Pickup', user: 'Customer', status: true },
    ],

    // Parcel Settings
    enableParcelTrackingLink: true,
    enableParcelReturn: true,
    driverReturnTimeLimit: 2,
    driverLateReturnPenalty: 500,
    noChargeReturnIfDriverCancels: true,
    parcelWeightUnit: 'kg',
    enableParcelWeightLimit: true,
    maxParcelWeightLimit: 100,
    parcelCancellationReasons: [
      { key: '1', reason: 'Couldnâ€™t reach to the destination for heavy jam', type: 'Ongoing Ride', user: 'Customer', status: true },
      { key: '2', reason: 'Driver want extra fare', type: 'Before Pickup', user: 'Customer', status: true },
      { key: '3', reason: 'Driver asked me to cancel', type: 'Before Pickup', user: 'Customer', status: true },
      { key: '4', reason: 'Couldnâ€™t reach to the customer for heavy jam', type: 'Ongoing Ride', user: 'Driver', status: true },
      { key: '5', reason: 'Customer asked to cancel', type: 'Ongoing Ride', user: 'Driver', status: true },
      { key: '6', reason: 'Couldnâ€™t find or contact customer', type: 'Before Pickup', user: 'Driver', status: true },
    ],

    // Ecommerce Settings
    foodMinOrderValue: 5,
    foodVendorCommission: 10,
    foodMaxPrepTime: 45,
    martInStockBuffer: 5,
    martCategoryFees: 2,
    martDeliveryPriority: 'Standard',
    shoppingReturnWindow: 7,
    shoppingExchangeEnabled: true,

    // Lifestyle & Travel
    hotelCancellationWindow: 24,
    hotelCheckInTime: '14:00',
    hotelCheckOutTime: '11:00',
    eventTicketFee: 2,
    eventQrValidity: 12, // hours
    eventSeatMapEnabled: true,
    rentalDamageWaiver: 15,
    rentalFuelPolicy: 'Full to Full',
    rentalMileageLimit: 200,

    // Urban Hub
    publicTransportZoneRates: true,
    publicTransportPassValidity: 30, // days
    fuelUnitPriceMode: 'Auto',
    fuelLoyaltyMultiplier: 1.5,

    // Fintech & Payments
    kycLevel1Limit: 100,
    kycLevel2Limit: 1000,
    kycLevel3Limit: 10000,
    fintechIntraLedgerFee: 0.5,
    fintechBankTransferLimit: 500,
    fintechInterestEnabled: false,
    gatewayDefaultProvider: 'EcoCash',
    gatewaySettlementCycle: 'T+1',

    // Refund & Returns Settings
    enableParcelRefund: true,
    parcelRefundValidity: 2,
    parcelRefundReasons: [
      { key: '1', reason: 'Packaging Issues', status: true },
      { key: '2', reason: 'Defective Product', status: true },
      { key: '3', reason: 'Product Does Not Match Description', status: true },
      { key: '4', reason: 'Missing Items in Parcel', status: true },
      { key: '5', reason: 'Incorrect Item Sent', status: true },
      { key: '6', reason: 'Damaged Parcel', status: true },
    ],
    enableServiceReturns: true,
    serviceReturnValidity: 7,

    // School Run Monitor Settings
    schoolRunGuardianPinRequired: true,
    schoolRunVerificationMode: 'Photo & PIN',
    schoolRunRecurringGracePeriod: 3,
    schoolRunBackgroundCheckFrequency: 3, // months
    schoolRunAutoRenewMonthly: true,

    // Safety & Emergency Settings
    enableSafetyAlert: true,
    safetyMinDelayTime: 15,
    enableSafetyAfterTrip: true,
    safetyAfterTripTime: 3,
    emergencyNumberType: 'Hotline',
    emergencyHotline: '999',
    emergencyContacts: [
      { key: '1', title: 'Medical', phone: '+8801122334455' },
      { key: '2', title: 'Police', phone: '+8801122334477' },
    ],
    enableSafetyAlertReasons: true,
    safetyAlertReasons: [
      { key: '1', reason: "Lost item reported: Passenger's phone left on the backseat", user: 'Driver', status: true },
      { key: '2', reason: "Driver stopped to pick up items unrelated to the trip.", user: 'Customer', status: true },
      { key: '3', reason: "System flagged that a passenger may have been left at the wrong location.", user: 'Customer', status: true },
      { key: '4', reason: "Vehicle entered a construction zone without proper notification.", user: 'Driver', status: true },
      { key: '5', reason: "Driver allowed an additional rider without authorization.", user: 'Customer', status: true },
      { key: '6', reason: "Abrupt braking was recorded by the system, indicating a risk", user: 'Driver', status: true },
      { key: '7', reason: "Abrupt braking was recorded by the system, indicating a risk", user: 'Customer', status: true },
      { key: '8', reason: "The vehicle exceeded the predefined speed limits", user: 'Customer', status: true },
      { key: '9', reason: "The vehicle has remained stationary for an unusual period", user: 'Driver', status: true },
      { key: '10', reason: "The driver strayed significantly from the assigned route", user: 'Customer', status: true },
    ],
    safetyPrecautions: [
      { key: '1', user: 'Driver', title: 'Check Trip Route Regularly', description: 'Keep an eye on the route within the app to ensure youâ€™re heading in the right direction.', status: true },
      { key: '2', user: 'Customer, Driver', title: 'Trust Your Instincts', description: 'Safety is priority. If you feel unsafe, cancel the trip and alert the admin.', status: true },
      { key: '3', user: 'Customer', title: 'Verify Driver and Vehicle Details', description: 'Double-check the driverâ€™s name, vehicle model, and license plate before starting.', status: true },
    ],

    // Referral Settings
    enableCustomerReferral: true,
    customerReferralSharingReward: 100,
    enableCustomerReferralDiscount: true,
    customerReferralDiscountPercent: 30,
    customerReferralDiscountValidity: 10,
    enableDriverReferral: true,
    driverReferralSharingReward: 500,
    driverReferralWalletBonus: 1000,

    // Chatting Setup
    enableDriverChatting: true,
    predefinedQA: [
      { key: '1', question: 'How long is the refund validity?', answer: 'Admin can set the time period from business settings, during which customers can request a refund for their parcel after completing an order.', status: true },
      { key: '2', question: 'How to setup Referral Earning?', answer: 'Setup Driver Referral Earning from business management.', status: true },
      { key: '3', question: 'When driver want to cancel a ongoing trip', answer: "If you need to cancel an ongoing trip, please ensure the reason is valid (such as a safety concern, vehicle issue, or emergency). You can cancel the trip through the app by selecting the 'Cancel Ride' option and choosing a reason.", status: true },
    ],
    supportSavedReplies: [
      { key: '1', topic: 'Refund validity?', answer: 'Admin can set the time period from business settings, during which customers can request a refund for their parcel after completing an order.', status: true },
      { key: '2', topic: 'Referral Earning', answer: 'Setup Driver Referral Earning from business management.', status: true },
      { key: '3', topic: 'Cancel ongoing trip', answer: "If you need to cancel an ongoing trip, please ensure the reason is valid (such as a safety concern, vehicle issue, or emergency). You can cancel the trip through the app by selecting the 'Cancel Ride' option and choosing a reason.", status: true },
    ],
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await adminApi.settings.get();
        if (response.data.success) {
          const setupConfig = response.data.data.find((c: any) => c.key === 'enterprise_setup');
          if (setupConfig) {
            form.setFieldsValue(setupConfig.value);
          }
        }
      } catch (err) {
        console.error('Failed to fetch settings:', err);
      }
    };
    fetchSettings();
  }, [form]);

  const handleSave = async (values: any) => {
    setLoading(true);
    try {
      await adminApi.settings.update('enterprise_setup', values, 'Main platform configuration');
      message.success('Business settings saved successfully');
    } catch (err) {
      console.error('Save failed:', err);
      message.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    form.resetFields();
    message.info('Form cleared to initial values');
  };

  const UploadDragger = ({ title, hint, accept = 'image/*' }: { title: string, hint: string, accept?: string }) => (
    <div style={{ textAlign: 'center', padding: '20px', border: '1px dashed #cbd5e1', borderRadius: 8, background: '#f8fafc' }}>
      <Upload
        name="file"
        showUploadList={false}
        beforeUpload={(file) => {
          if (file.size > 1024 * 1024) {
            message.error('File must be smaller than 1MB');
            return Upload.LIST_IGNORE;
          }
          message.success(`${title} uploaded successfully`);
          return false;
        }}
        accept={accept}
      >
        <div style={{ cursor: 'pointer' }}>
          <PictureOutlined style={{ fontSize: 32, color: '#94a3b8', marginBottom: 8 }} />
          <div><Typography.Text strong>{title}</Typography.Text></div>
          <Typography.Text type="secondary" style={{ fontSize: 11 }}>{hint}</Typography.Text>
        </div>
      </Upload>
    </div>
  );

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <Typography.Title level={3} style={{ margin: 0, fontWeight: 700 }}>Business Setup</Typography.Title>
          <Typography.Text type="secondary">Configure your company's core information, operations, and system settings.</Typography.Text>
        </div>
        <Space>
          <Button size="large" icon={<UndoOutlined />} onClick={handleReset}>
            Reset
          </Button>
          <Button type="primary" size="large" icon={<SaveOutlined />} loading={loading} onClick={() => form.submit()} style={{ background: '#0e172a' }}>
            Save Information
          </Button>
        </Space>
      </div>

      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        onFinish={handleSave}
      >
        <Tabs defaultActiveKey="info" className="premium-tabs" style={{ marginBottom: 24 }}>
          {/* ============================================================ */}
          {/* TAB 1: BUSINESS INFO                                         */}
          {/* ============================================================ */}
          <Tabs.TabPane tab={<Space><ShopOutlined /> Business Info</Space>} key="info">
            <div style={{ padding: '16px 0' }}>
              <Row gutter={[24, 24]}>
                <Col xs={24} lg={14}>
                  {/* BASIC INFO */}
                  <Card
                    title={<Space><ShopOutlined /> Basic Information about DashDrive</Space>}
                    style={{ borderRadius: 12, marginBottom: 24 }}
                    styles={{ header: { background: '#fafafa', borderRadius: '12px 12px 0 0', fontWeight: 600 } }}
                  >
                    <Row gutter={16}>
                      <Col span={24}>
                        <Form.Item label="Business Name" name="businessName" rules={[{ required: true }]} tooltip="The official registered name of your company.">
                          <Input prefix={<ShopOutlined />} placeholder="Enter business name" />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Contact Person Name" name="contactName" rules={[{ required: true }]} tooltip="The primary administrative contact for the platform.">
                          <Input prefix={<FormOutlined />} />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Contact Email" name="contactEmail" rules={[{ required: true, type: 'email' }]} tooltip="Email address for administrative and official system communications.">
                          <Input prefix={<MailOutlined />} />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Support Phone" name="supportPhone" rules={[{ required: true }]} tooltip="The main customer support contact number shown to users.">
                          <Input prefix={<PhoneOutlined />} />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Support Email" name="supportEmail" rules={[{ required: true, type: 'email' }]} tooltip="The main customer support email address shown to users.">
                          <Input prefix={<MailOutlined />} />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Country" name="country" rules={[{ required: true }]} tooltip="The primary operating country for this business instance.">
                          <Select showSearch>
                            <Option value="Zimbabwe">Zimbabwe</Option>
                            <Option value="South Africa">South Africa</Option>
                            <Option value="Nigeria">Nigeria</Option>
                            <Option value="Kenya">Kenya</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Business Address" name="businessAddress" rules={[{ required: true }]} tooltip="The physical operating address of the main business office.">
                          <Input prefix={<EnvironmentOutlined />} />
                        </Form.Item>
                      </Col>
                    </Row>

                    {/* MAP FEATURE */}
                    <div style={{ border: '1px solid #e2e8f0', borderRadius: 8, overflow: 'hidden', marginTop: 8 }}>
                      {/* Map Toolbar */}
                      <div style={{ padding: '8px 12px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', gap: 12, alignItems: 'center' }}>
                        <Input 
                          placeholder="Search location..." 
                          prefix={<SearchOutlined />} 
                          style={{ width: 250 }} 
                          size="small"
                        />
                        <Switch 
                          unCheckedChildren="Map" 
                          checkedChildren="Satellite" 
                          size="small"
                        />
                        <div style={{ flex: 1 }} />
                        <Space size="small">
                          <Tooltip title="Zoom In"><Button size="small" icon={<PlusOutlined />} /></Tooltip>
                          <Tooltip title="Zoom Out"><Button size="small">-</Button></Tooltip>
                          <Divider orientation="vertical" />
                          <Tooltip title="Move Up"><Button size="small">â†‘</Button></Tooltip>
                          <Tooltip title="Move Down"><Button size="small">â†“</Button></Tooltip>
                          <Tooltip title="Move Left"><Button size="small">â†</Button></Tooltip>
                          <Tooltip title="Move Right"><Button size="small">â†’</Button></Tooltip>
                          <Divider orientation="vertical" />
                          <Tooltip title="Expand Map"><Button size="small" icon={<GlobalOutlined />} /></Tooltip>
                        </Space>
                      </div>
                      {/* Map Area Mock */}
                      <div style={{ 
                        height: 300, 
                        background: '#e2e8f0', 
                        backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', 
                        backgroundSize: '20px 20px',
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        position: 'relative'
                      }}>
                        <div style={{ textAlign: 'center' }}>
                          <PushpinOutlined style={{ fontSize: 36, color: '#ef4444' }} />
                          <div style={{ 
                            background: 'white', 
                            padding: '4px 8px', 
                            borderRadius: 4, 
                            fontSize: 12, 
                            fontWeight: 500,
                            marginTop: 4,
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                          }}>
                            Business Location Marker
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* APP STORE LINKS */}
                  <Card
                    title={<Space><MobileOutlined /> App Store Links</Space>}
                    style={{ borderRadius: 12, marginBottom: 24 }}
                    styles={{ header: { background: '#fafafa', borderRadius: '12px 12px 0 0', fontWeight: 600 } }}
                  >
                    <Form.Item label="Google Play Store URL" name="playStoreUrl" tooltip="Link to the Android application.">
                      <Input prefix={<AndroidOutlined style={{ color: '#3DDC84' }} />} placeholder="https://play.google.com/..." />
                    </Form.Item>
                    <Form.Item label="Apple App Store URL" name="appStoreUrl" tooltip="Link to the iOS application." style={{ marginBottom: 0 }}>
                      <Input prefix={<AppleOutlined />} placeholder="https://apps.apple.com/..." />
                    </Form.Item>
                  </Card>

                  {/* ADMIN PANEL COLORS */}
                  <Card
                    title={<Space><BgColorsOutlined /> Admin Panel Colors</Space>}
                    style={{ borderRadius: 12 }}
                    styles={{ header: { background: '#fafafa', borderRadius: '12px 12px 0 0', fontWeight: 600 } }}
                  >
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                      <Form.Item label="Primary Color" name="primaryColor">
                        <Input type="color" style={{ padding: 4, height: 40 }} />
                      </Form.Item>
                      <Form.Item label="Secondary Color" name="secondaryColor">
                        <Input type="color" style={{ padding: 4, height: 40 }} />
                      </Form.Item>
                      
                      <Form.Item label="Text Dark" name="textDark">
                        <Input type="color" style={{ padding: 4, height: 40 }} />
                      </Form.Item>
                      <Form.Item label="Text Light" name="textLight">
                        <Input type="color" style={{ padding: 4, height: 40 }} />
                      </Form.Item>
                      
                      <Form.Item label="Text Small" name="textSmall">
                        <Input type="color" style={{ padding: 4, height: 40 }} />
                      </Form.Item>
                      <Form.Item label="Text Medium" name="textMedium">
                        <Input type="color" style={{ padding: 4, height: 40 }} />
                      </Form.Item>
                      
                      <Form.Item label="Background Color" name="background" style={{ gridColumn: 'span 2' }}>
                        <Input type="color" style={{ padding: 4, height: 40 }} />
                      </Form.Item>
                    </div>
                  </Card>
                </Col>

                <Col xs={24} lg={10}>
                  {/* GENERAL SETTINGS */}
                  <Card
                    title={<Space><SettingOutlined /> General Settings</Space>}
                    style={{ borderRadius: 12, marginBottom: 24 }}
                    styles={{ header: { background: '#fafafa', borderRadius: '12px 12px 0 0', fontWeight: 600 } }}
                  >
                    {/* Time Setup */}
                    <Divider style={{ margin: '0 0 16px 0', fontSize: 13 }}><ClockCircleOutlined /> Time Setup</Divider>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item label="Time Zone" name="timeZone" tooltip="The primary operational time zone for the entire platform.">
                          <Select showSearch>
                            <Option value="Africa/Harare">Africa/Harare (CAT)</Option>
                            <Option value="Africa/Johannesburg">Africa/Johannesburg (SAST)</Option>
                            <Option value="UTC">UTC</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Time Format" name="timeFormat" tooltip="The global time display format (12-hour AM/PM or 24-hour).">
                          <Select>
                            <Option value="12h">12-hour (1:00 PM)</Option>
                            <Option value="24h">24-hour (13:00)</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>

                    {/* Currency Setup */}
                    <Divider style={{ margin: '16px 0', fontSize: 13 }}><DollarOutlined /> Currency Setup</Divider>
                    <Row gutter={16}>
                      <Col span={24}>
                        <Form.Item label="Currency Selection" name="currency" tooltip="The base currency used for all system calculations, wallets, and user displays.">
                          <Select showSearch>
                            <Option value="USD">US Dollar (USD / $)</Option>
                            <Option value="ZIG">ZWG / ZiG (ZIG)</Option>
                            <Option value="ZAR">South African Rand (ZAR / R)</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Symbol Position" name="currencyPosition" tooltip="Determines if the currency symbol ($) is shown before or after the amount.">
                          <Select>
                            <Option value="left">Left ($100)</Option>
                            <Option value="right">Right (100$)</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Decimals Limit" name="decimalPoints" tooltip="Number of decimal places to show for all currency amounts (e.g., 2 for $10.00).">
                          <InputNumber min={0} max={4} style={{ width: '100%' }} />
                        </Form.Item>
                      </Col>
                    </Row>

                    {/* Trade License */}
                    <Divider style={{ margin: '16px 0', fontSize: 13 }}><LinkOutlined /> Legal & Compliance</Divider>
                    <Form.Item label="Trade License Number" name="tradeLicense" 
                      tooltip="This may be required by local government regulations for operations.">
                      <Input />
                    </Form.Item>
                    <Form.Item label="Copyright Content" name="copyright" style={{ marginBottom: 0 }}>
                      <Input />
                    </Form.Item>
                  </Card>

                  {/* SOCIAL MEDIA PRESENCE */}
                  <Card
                    title={<Space><GlobalOutlined /> Social Media & Support</Space>}
                    style={{ borderRadius: 12, marginBottom: 24 }}
                    styles={{ header: { background: '#fafafa', borderRadius: '12px 12px 0 0', fontWeight: 600 } }}
                  >
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item label="Facebook" name="facebookLink">
                          <Input prefix={<FacebookOutlined style={{ color: '#1877F2' }} />} />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Twitter (X)" name="twitterLink">
                          <Input prefix={<TwitterOutlined />} />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Instagram" name="instagramLink">
                          <Input prefix={<InstagramOutlined style={{ color: '#E4405F' }} />} />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="YouTube" name="youtubeLink">
                          <Input prefix={<YoutubeOutlined style={{ color: '#FF0000' }} />} />
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                        <Form.Item label="WhatsApp Support Number" name="whatsappSupport" style={{ marginBottom: 0 }}>
                          <Input prefix={<WhatsAppOutlined style={{ color: '#25D366' }} />} placeholder="+263..." />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>

                  {/* LOGOS & ICONS */}
                  <Card
                    title={<Space><PictureOutlined /> Logo and Icons</Space>}
                    style={{ borderRadius: 12 }}
                    styles={{ header: { background: '#fafafa', borderRadius: '12px 12px 0 0', fontWeight: 600 } }}
                    extra={<Typography.Text type="secondary" style={{ fontSize: 11 }}>Max size 1MB</Typography.Text>}
                  >
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
                      <UploadDragger title="Business Logo" hint="Supported formats: PNG, JPG, WEBP" />
                      
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <UploadDragger title="Website Favicon" hint="PNG or ICO" />
                        <UploadDragger title="Footer Logo" hint="For dark backgrounds" />
                      </div>
                      
                      <UploadDragger title="Loading Animation" hint="Supported format: GIF only" accept=".gif" />
                    </div>
                  </Card>
                </Col>
              </Row>
            </div>
          </Tabs.TabPane>

          {/* ============================================================ */}
          {/* TAB 2: SETTINGS                                              */}
          {/* ============================================================ */}
          <Tabs.TabPane tab={<Space><ControlOutlined /> Settings</Space>} key="settings">
            <div style={{ padding: '16px 0' }}>
              <Row gutter={[24, 24]}>
                <Col xs={24} lg={12}>
                  {/* BUSINESS CONFIGURATION */}
                  <Card
                    title={<Space><PercentageOutlined /> Business Configuration</Space>}
                    style={{ borderRadius: 12, marginBottom: 24 }}
                    styles={{ header: { background: '#fafafa', borderRadius: '12px 12px 0 0', fontWeight: 600 } }}
                  >
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item label="Trip Commission (%)" name="tripCommission" rules={[{ required: true }]} tooltip="Percentage of each trip fare DashDrive takes as commission.">
                          <InputNumber suffix="%" style={{ width: '100%' }} min={0} max={100} />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="VAT (%)" name="vat" rules={[{ required: true }]} tooltip="Value Added Tax applied to trip fares or services.">
                          <InputNumber suffix="%" style={{ width: '100%' }} min={0} max={100} />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="IMTT Tax (%)" name="imttTax" rules={[{ required: true }]} tooltip="Intermediated Money Transfer Tax applied to transactions.">
                          <InputNumber suffix="%" style={{ width: '100%' }} min={0} max={100} />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="3rd Party Fees" name="thirdPartyFees" tooltip="Fixed fee amount directed to third-party services (e.g., payment gateways).">
                          <InputNumber prefix="$" style={{ width: '100%' }} min={0} />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Divider style={{ margin: '16px 0', fontSize: 13 }}><SafetyCertificateOutlined /> Taxation Responsibility (Zimbabwe Compliance)</Divider>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item label="IMTT Responsibility" name="imttResponsibility" tooltip="Who pays the 2% IMTT tax on transactions.">
                          <Select>
                            <Option value="Customer">Customer</Option>
                            <Option value="Driver">Driver</Option>
                            <Option value="Platform">Platform</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="VAT Treatment" name="vatTreatment" tooltip="Whether VAT is included in the fare or added on top.">
                          <Select>
                            <Option value="Inclusive">Inclusive (In-Fare)</Option>
                            <Option value="Exclusive">Exclusive (Add-on)</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="IMTT on Wallet Xfer" name="imttOnWalletTransfer" valuePropName="checked">
                          <Switch checkedChildren="ON" unCheckedChildren="OFF" />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="VAT on Commission Only" name="vatOnCommission" valuePropName="checked">
                          <Switch checkedChildren="YES" unCheckedChildren="NO" />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>

                  {/* REAL TIME AND LOCATION SETTINGS */}
                  <Card
                    title={<Space><RadarChartOutlined /> Real-Time & Location Settings</Space>}
                    style={{ borderRadius: 12 }}
                    styles={{ header: { background: '#fafafa', borderRadius: '12px 12px 0 0', fontWeight: 600 } }}
                  >
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item label="Search Radius (km)" name="searchRadius" tooltip="Radius to search for available drivers">
                          <InputNumber addonAfter="km" style={{ width: '100%' }} min={1} />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Completion Radius (m)" name="completionRadius" tooltip="Distance threshold for trip completion">
                          <InputNumber addonAfter="meters" style={{ width: '100%' }} min={10} />
                        </Form.Item>
                      </Col>
                      <Col span={16}>
                        <Form.Item label="Websocket URL" name="websocketUrl" tooltip="The primary WebSocket connection URL for real-time tracking and events.">
                          <Input prefix={<GlobalOutlined />} />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item label="Port" name="websocketPort" tooltip="The specific port number used for the WebSocket connection.">
                          <InputNumber style={{ width: '100%' }} />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>

                  {/* ZIMBABWEAN MOBILE MONEY CONFIG */}
                  <Card
                    title={<Space><WalletOutlined /> Zimbabwean Mobile Money Config</Space>}
                    style={{ borderRadius: 12, marginTop: 24 }}
                    styles={{ header: { background: '#fafafa', borderRadius: '12px 12px 0 0', fontWeight: 600 } }}
                  >
                    <Alert 
                      type="info" 
                      showIcon 
                      message="Merchant Credentials" 
                      description="Configure your official merchant details for external wallet integrations."
                      style={{ marginBottom: 16, borderRadius: 8 }}
                    />
                    
                    <Collapse ghost expandIconPosition="end">
                      <Collapse.Panel header={<Typography.Text strong>EcoCash Integration</Typography.Text>} key="1">
                        <Row gutter={12}>
                          <Col span={12}>
                            <Form.Item label="Merchant Name" name="ecocashMerchantName">
                              <Input placeholder="e.g. DashDrive Pvt Ltd" />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item label="Merchant Number / ID" name="ecocashMerchantNumber">
                              <Input placeholder="Enter eco-merchant ID" />
                            </Form.Item>
                          </Col>
                        </Row>
                      </Collapse.Panel>
                      <Collapse.Panel header={<Typography.Text strong>OneMoney Integration</Typography.Text>} key="2">
                        <Row gutter={12}>
                          <Col span={12}>
                            <Form.Item label="Merchant Name" name="onemoneyMerchantName">
                              <Input />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item label="Merchant ID" name="onemoneyMerchantNumber">
                              <Input />
                            </Form.Item>
                          </Col>
                        </Row>
                      </Collapse.Panel>
                      <Collapse.Panel header={<Typography.Text strong>Omari Integration</Typography.Text>} key="3">
                        <Row gutter={12}>
                          <Col span={12}>
                            <Form.Item label="Merchant Name" name="omariMerchantName">
                              <Input />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item label="Merchant Code" name="omariMerchantNumber">
                              <Input />
                            </Form.Item>
                          </Col>
                        </Row>
                      </Collapse.Panel>
                    </Collapse>
                  </Card>
                </Col>

                <Col xs={24} lg={12}>
                  {/* LOGIN & SECURITY SETTINGS */}
                  <Card
                    title={<Space><SafetyCertificateOutlined /> Login & Security Settings</Space>}
                    style={{ borderRadius: 12, marginBottom: 24 }}
                    styles={{ header: { background: '#fafafa', borderRadius: '12px 12px 0 0', fontWeight: 600 } }}
                  >
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item label="Max Login Attempts" name="maxLoginAttempts" tooltip="Number of failed login attempts before a temporary block is applied.">
                          <InputNumber style={{ width: '100%' }} min={1} />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Max OTP Submit Attempts" name="maxOtpAttempts" tooltip="Number of incorrect OTP entries allowed before blocking.">
                          <InputNumber style={{ width: '100%' }} min={1} />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item label="OTP Resend Time" name="otpResendWait" tooltip="Wait time required before a user can request a new OTP.">
                          <InputNumber addonAfter="sec" style={{ width: '100%' }} min={10} />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item label="Temp OTP Block Time" name="tempOtpBlock" tooltip="Duration a user is blocked from requesting OTPs after max attempts.">
                          <InputNumber addonAfter="sec" style={{ width: '100%' }} min={60} />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item label="Temp Login Block Time" name="tempLoginBlock" tooltip="Duration a user is blocked from logging in after max failed attempts.">
                          <InputNumber addonAfter="sec" style={{ width: '100%' }} min={60} />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>

                  {/* FARE BIDDING */}
                  <Card
                    title={<Space><InteractionOutlined /> Fare Bidding</Space>}
                    style={{ borderRadius: 12, marginBottom: 24 }}
                    styles={{ header: { background: '#fafafa', borderRadius: '12px 12px 0 0', fontWeight: 600 } }}
                    extra={
                      <Form.Item name="enableFareBidding" valuePropName="checked" style={{ marginBottom: 0 }}>
                        <Switch />
                      </Form.Item>
                    }
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <Typography.Text strong>Allow Drivers & Customers to Bid</Typography.Text><br/>
                        <Typography.Text type="secondary" style={{ fontSize: 13 }}>Enable fare negotiation directly between drivers and customers for trip fares.</Typography.Text>
                      </div>
                    </div>
                  </Card>

                  {/* PAGINATION SETTINGS */}
                  <Card
                    title={<Space><UnorderedListOutlined /> Pagination Settings</Space>}
                    style={{ borderRadius: 12 }}
                    styles={{ header: { background: '#fafafa', borderRadius: '12px 12px 0 0', fontWeight: 600 } }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ flex: 1, paddingRight: 24 }}>
                        <Typography.Text strong>Define items per page limit</Typography.Text><br/>
                        <Typography.Text type="secondary" style={{ fontSize: 13 }}>Set the default number of list items (users, drivers, trips) shown per page across the dashboard.</Typography.Text>
                      </div>
                      <Form.Item name="paginationLimit" style={{ marginBottom: 0, width: 120 }}>
                        <Select>
                          <Option value={10}>10 Items</Option>
                          <Option value={20}>20 Items</Option>
                          <Option value={50}>50 Items</Option>
                          <Option value={100}>100 Items</Option>
                        </Select>
                      </Form.Item>
                    </div>
                  </Card>

                  {/* SAFETY & SOS */}
                  <Card
                    title={<Space><SafetyOutlined /> Safety & SOS Settings</Space>}
                    style={{ borderRadius: 12, marginTop: 24 }}
                    styles={{ header: { background: '#fafafa', borderRadius: '12px 12px 0 0', fontWeight: 600 } }}
                  >
                    <Form.Item label="Emergency SOS Number" name="sosNumber" tooltip="The number dialed when a user or driver triggers the SOS button.">
                      <Input prefix={<PhoneOutlined />} placeholder="Emergency number" />
                    </Form.Item>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                      <div style={{ paddingRight: 24 }}>
                        <Typography.Text strong>Real-time Location Tracking <Tooltip title="Continuously track driver location during active trips for safety."><InfoCircleOutlined style={{ color: '#94a3b8' }} /></Tooltip></Typography.Text><br/>
                        <Typography.Text type="secondary" style={{ fontSize: 13 }}>Enable live GPS updates on the map.</Typography.Text>
                      </div>
                      <Form.Item name="enableRealTimeTracking" valuePropName="checked" style={{ marginBottom: 0 }}>
                        <Switch />
                      </Form.Item>
                    </div>

                    <Form.Item label="Tracking Update Interval (Seconds)" name="trackingInterval" tooltip="How often the app sends the GPS coordinates to the server.">
                      <InputNumber min={5} max={60} addonAfter="sec" style={{ width: '100%' }} />
                    </Form.Item>
                  </Card>
                </Col>
              </Row>
            </div>
          </Tabs.TabPane>

          {/* ============================================================ */}
          {/* TAB 3: DRIVER                                                */}
          {/* ============================================================ */}
          <Tabs.TabPane tab={<Space><CarOutlined /> Driver Settings</Space>} key="driver">
            <div style={{ padding: '16px 0' }}>
              <Row gutter={[24, 24]}>
                <Col xs={24} lg={12}>
                  {/* ONBOARDING & VERIFICATION */}
                  <Card
                    title={<Space><CheckCircleOutlined /> Onboarding & Verification</Space>}
                    style={{ borderRadius: 12, marginBottom: 24 }}
                    styles={{ header: { background: '#fafafa', borderRadius: '12px 12px 0 0', fontWeight: 600 } }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                      <div style={{ paddingRight: 24 }}>
                        <Typography.Text strong>Driver Self-Registration <Tooltip title="Allow users to register as drivers directly from the User App using the User/Driver toggle switch."><InfoCircleOutlined style={{ color: '#94a3b8' }} /></Tooltip></Typography.Text><br/>
                        <Typography.Text type="secondary" style={{ fontSize: 13 }}>Enables the dual-function app mode, allowing seamless switching between user and driver modes.</Typography.Text>
                      </div>
                      <Form.Item name="driverSelfRegistration" valuePropName="checked" style={{ marginBottom: 0 }}>
                        <Switch />
                      </Form.Item>
                    </div>

                    <Divider style={{ margin: '16px 0' }} />

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ paddingRight: 24 }}>
                        <Typography.Text strong>Enable Driver Verification <Tooltip title="Enforce a mandatory identity and document verification process before a driver can accept trips."><InfoCircleOutlined style={{ color: '#94a3b8' }} /></Tooltip></Typography.Text><br/>
                        <Typography.Text type="secondary" style={{ fontSize: 13 }}>Require manual admin approval of driver documents before activating their account.</Typography.Text>
                      </div>
                      <Form.Item name="driverVerification" valuePropName="checked" style={{ marginBottom: 0 }}>
                        <Switch />
                      </Form.Item>
                    </div>
                  </Card>

                  {/* IDENTITY VERIFICATION */}
                  <Card
                    title={<Space><IdcardOutlined /> Identity Verification</Space>}
                    style={{ borderRadius: 12, marginBottom: 24 }}
                    styles={{ header: { background: '#fafafa', borderRadius: '12px 12px 0 0', fontWeight: 600 } }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                      <div style={{ paddingRight: 24 }}>
                        <Typography.Text strong>Driver Identity Verification <Tooltip title="Activate face verification to ensure that only authorized drivers can access the platform."><InfoCircleOutlined style={{ color: '#94a3b8' }} /></Tooltip></Typography.Text><br/>
                        <Typography.Text type="secondary" style={{ fontSize: 13 }}>Use active liveness and facial recognition to prevent account sharing.</Typography.Text>
                      </div>
                      <Form.Item name="enableIdentityVerification" valuePropName="checked" style={{ marginBottom: 0 }}>
                        <Switch />
                      </Form.Item>
                    </div>

                    <div style={{ background: '#f8fafc', padding: 16, borderRadius: 8, border: '1px solid #e2e8f0' }}>
                      <Typography.Text strong style={{ display: 'block', marginBottom: 4 }}>When to Initiate Face Verification</Typography.Text>
                      <Typography.Text type="secondary" style={{ fontSize: 13, display: 'block', marginBottom: 16 }}>Define when identity verification will be required for drivers.</Typography.Text>

                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                        <div>
                          <Typography.Text>Initiate Verification During Sign-Up</Typography.Text><br/>
                          <Typography.Text type="secondary" style={{ fontSize: 12 }}>Drivers need to verify their identity as part of the registration process.</Typography.Text>
                        </div>
                        <Form.Item name="verifyAtSignup" valuePropName="checked" style={{ marginBottom: 0 }}>
                          <Switch size="small" />
                        </Form.Item>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                          <Typography.Text>Trigger Verification at Intervals</Typography.Text><br/>
                          <Typography.Text type="secondary" style={{ fontSize: 12 }}>Drivers need to confirm their identity again after a set period of time or event.</Typography.Text>
                        </div>
                        <Form.Item name="verifyPeriodically" valuePropName="checked" style={{ marginBottom: 0 }}>
                          <Switch size="small" />
                        </Form.Item>
                      </div>

                      {verifyPeriodically && (
                        <div style={{ marginTop: 16, paddingLeft: 16, borderLeft: '2px solid #e2e8f0' }}>
                          <Typography.Text strong style={{ fontSize: 13, display: 'block', marginBottom: 12 }}>Choose When to Trigger Periodically</Typography.Text>
                          
                          <div style={{ marginBottom: 16 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                              <div>
                                <Typography.Text style={{ fontSize: 13 }}>Trigger Within a Time Period</Typography.Text><br/>
                                <Typography.Text type="secondary" style={{ fontSize: 12 }}>Verify identity again after a specific time frame.</Typography.Text>
                              </div>
                            </div>
                            <Form.Item name="verifyTimePeriod" style={{ marginBottom: 0 }}>
                              <InputNumber addonAfter="Days" min={1} style={{ width: 150 }} />
                            </Form.Item>
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div>
                              <Typography.Text style={{ fontSize: 13 }}>Trigger when switching to online</Typography.Text><br/>
                              <Typography.Text type="secondary" style={{ fontSize: 12 }}>Verify identity when switching from offline to online.</Typography.Text>
                            </div>
                            <Form.Item name="verifySwitchOnline" valuePropName="checked" style={{ marginBottom: 0 }}>
                              <Switch size="small" />
                            </Form.Item>
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>

                  {/* PARCEL LIMIT SETUP */}
                  <Card
                    title={<Space><AppstoreAddOutlined /> Parcel Limit Setup</Space>}
                    style={{ borderRadius: 12, marginBottom: 24 }}
                    styles={{ header: { background: '#fafafa', borderRadius: '12px 12px 0 0', fontWeight: 600 } }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                      <div style={{ paddingRight: 24 }}>
                        <Typography.Text strong>Enable Parcel Limit <Tooltip title="Control if there is a cap on how many parcels a driver can accept at once."><InfoCircleOutlined style={{ color: '#94a3b8' }} /></Tooltip></Typography.Text><br/>
                        <Typography.Text type="secondary" style={{ fontSize: 13 }}>Activate to restrict the maximum number of concurrent parcel requests a driver can handle.</Typography.Text>
                      </div>
                      <Form.Item name="enableParcelLimit" valuePropName="checked" style={{ marginBottom: 0 }}>
                        <Switch />
                      </Form.Item>
                    </div>

                    <Form.Item label="Max. Parcel Req. Accept Limit" name="maxParcelLimit" tooltip="The absolute maximum number of parcels a driver is allowed to pickup and deliver in a single batch.">
                      <InputNumber style={{ width: '100%' }} min={1} max={50} addonBefore="Up to" addonAfter="Parcels" />
                    </Form.Item>
                  </Card>

                  {/* VEHICLE UPDATE CHECK */}
                  <Card
                    title={<Space><AuditOutlined /> Vehicle Update Validation</Space>}
                    style={{ borderRadius: 12, marginBottom: 24 }}
                    styles={{ header: { background: '#fafafa', borderRadius: '12px 12px 0 0', fontWeight: 600 } }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                      <div style={{ paddingRight: 24 }}>
                        <Typography.Text strong>Require Vehicle Update Approval <Tooltip title="Require admin approval when an existing driver attempts to update their vehicle details."><InfoCircleOutlined style={{ color: '#94a3b8' }} /></Tooltip></Typography.Text><br/>
                        <Typography.Text type="secondary" style={{ fontSize: 13 }}>Pending updates will be placed in an approval queue instead of applying instantly.</Typography.Text>
                      </div>
                      <Form.Item name="requireVehicleUpdateApproval" valuePropName="checked" style={{ marginBottom: 0 }}>
                        <Switch />
                      </Form.Item>
                    </div>

                    <div style={{ background: '#f8fafc', padding: 16, borderRadius: 8, border: '1px solid #e2e8f0' }}>
                      <Typography.Text strong style={{ display: 'block', marginBottom: 12 }}>Fields Requiring Validation:</Typography.Text>
                      <Row gutter={[16, 16]}>
                        <Col span={24}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography.Text>Vehicle Brand / Model</Typography.Text>
                            <Form.Item name="approvalVehicleBrand" valuePropName="checked" style={{ marginBottom: 0 }}>
                              <Switch size="small" />
                            </Form.Item>
                          </div>
                        </Col>
                        <Col span={24}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography.Text>Vehicle Category</Typography.Text>
                            <Form.Item name="approvalVehicleCategory" valuePropName="checked" style={{ marginBottom: 0 }}>
                              <Switch size="small" />
                            </Form.Item>
                          </div>
                        </Col>
                        <Col span={24}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography.Text>License Number Plate</Typography.Text>
                            <Form.Item name="approvalLicencePlate" valuePropName="checked" style={{ marginBottom: 0 }}>
                              <Switch size="small" />
                            </Form.Item>
                          </div>
                        </Col>
                        <Col span={24}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography.Text>License Expiry Date</Typography.Text>
                            <Form.Item name="approvalLicenceExpiry" valuePropName="checked" style={{ marginBottom: 0 }}>
                              <Switch size="small" />
                            </Form.Item>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </Card>

                  {/* REVIEWS & RATINGS */}
                  <Card
                    title={<Space><StarOutlined /> Reviews & Ratings</Space>}
                    style={{ borderRadius: 12 }}
                    styles={{ header: { background: '#fafafa', borderRadius: '12px 12px 0 0', fontWeight: 600 } }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ paddingRight: 24 }}>
                        <Typography.Text strong>Enable Trip Reviews <Tooltip title="Allow customers to provide a star rating and written review after completing a trip."><InfoCircleOutlined style={{ color: '#94a3b8' }} /></Tooltip></Typography.Text><br/>
                        <Typography.Text type="secondary" style={{ fontSize: 13 }}>Customers will be prompted to rate their driver and give feedback at the end of their ride.</Typography.Text>
                      </div>
                      <Form.Item name="driverReviews" valuePropName="checked" style={{ marginBottom: 0 }}>
                        <Switch />
                      </Form.Item>
                    </div>
                  </Card>
                </Col>

                <Col xs={24} lg={12}>
                  {/* DRIVER REWARDS & RETENTION */}
                  <Card
                    title={<Space><GiftOutlined /> Driver Rewards Program</Space>}
                    style={{ borderRadius: 12 }}
                    styles={{ header: { background: '#fafafa', borderRadius: '12px 12px 0 0', fontWeight: 600 } }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                      <div style={{ paddingRight: 24 }}>
                        <Typography.Text strong>Manage Driver Rewards <Tooltip title="Enable the entire driver loyalty and rewards ecosystem."><InfoCircleOutlined style={{ color: '#94a3b8' }} /></Tooltip></Typography.Text><br/>
                        <Typography.Text type="secondary" style={{ fontSize: 13 }}>Activate the master switch for driver levels, loyalty points, and leaderboard mechanisms.</Typography.Text>
                      </div>
                      <Form.Item name="driverRewards" valuePropName="checked" style={{ marginBottom: 0 }}>
                        <Switch />
                      </Form.Item>
                    </div>

                    <div style={{ background: '#f8fafc', padding: 16, borderRadius: 8, border: '1px solid #e2e8f0' }}>
                      <Divider style={{ margin: '0 0 16px 0', fontSize: 13 }}><Space><TrophyOutlined /> Level Features</Space></Divider>
                      
                      <div style={{ marginBottom: 24 }}>
                        <Typography.Text strong>Loyalty Points Value <Tooltip title="Define how many points equal $1.00 USD in real currency value."><InfoCircleOutlined style={{ color: '#94a3b8' }} /></Tooltip></Typography.Text><br/>
                        <Typography.Text type="secondary" style={{ fontSize: 13, display: 'block', marginBottom: 8 }}>Reward drivers with points for completed rides or actions.</Typography.Text>
                        <Row align="middle" gutter={12}>
                          <Col><Typography.Text strong>$1.00 = </Typography.Text></Col>
                          <Col>
                            <Form.Item name="loyaltyPointsValue" style={{ marginBottom: 0 }}>
                              <InputNumber addonAfter="Points" min={1} style={{ width: 140 }} />
                            </Form.Item>
                          </Col>
                        </Row>
                      </div>

                      <Divider style={{ margin: '16px 0' }} />

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ paddingRight: 24 }}>
                          <Typography.Text strong>Leaderboard Rewards <Tooltip title="Enable competitive leaderboards where top performing drivers receive bonus points or cash."><InfoCircleOutlined style={{ color: '#94a3b8' }} /></Tooltip></Typography.Text><br/>
                          <Typography.Text type="secondary" style={{ fontSize: 13 }}>Display rankings in the driver app to gamify performance and increase engagement.</Typography.Text>
                        </div>
                        <Form.Item name="leaderboardRewards" valuePropName="checked" style={{ marginBottom: 0 }}>
                          <Switch />
                        </Form.Item>
                      </div>
                    </div>
                  </Card>

                  {/* CASH IN HAND SETUP */}
                  <Card
                    title={<Space><WalletOutlined /> Driver Cash in Hand Setup</Space>}
                    style={{ borderRadius: 12, marginTop: 24 }}
                    styles={{ header: { background: '#fafafa', borderRadius: '12px 12px 0 0', fontWeight: 600 } }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                      <div style={{ paddingRight: 24 }}>
                        <Typography.Text strong>Enable Cash in Hand <Tooltip title="Allow drivers to collect and hold cash from customers for rides."><InfoCircleOutlined style={{ color: '#94a3b8' }} /></Tooltip></Typography.Text><br/>
                        <Typography.Text type="secondary" style={{ fontSize: 13 }}>Drivers can accept cash payments directly from customers.</Typography.Text>
                      </div>
                      <Form.Item name="enableCashInHand" valuePropName="checked" style={{ marginBottom: 0 }}>
                        <Switch />
                      </Form.Item>
                    </div>

                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item label="Max Amount to Hold" name="maxAmountToHold" tooltip="The maximum amount of cash a driver can hold before they are required to remit to the platform.">
                          <InputNumber prefix="$" style={{ width: '100%' }} min={0} />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Max Amount to Pay" name="maxAmountToPay" tooltip="The maximum cash amount a customer is allowed to pay a driver for a single trip.">
                          <InputNumber prefix="$" style={{ width: '100%' }} min={0} />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>

                  {/* WALLET BUNDLES SETUP */}
                  <Card
                    title={<Space><TagsOutlined /> Driver Ride Bundles (Wallet)</Space>}
                    style={{ borderRadius: 12, marginTop: 24 }}
                    styles={{ header: { background: '#fafafa', borderRadius: '12px 12px 0 0', fontWeight: 600 } }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                      <div style={{ paddingRight: 24 }}>
                        <Typography.Text strong>Enable Ride Bundles <Tooltip title="Allow drivers to deposit money into their wallet to purchase discounted ride bundles."><InfoCircleOutlined style={{ color: '#94a3b8' }} /></Tooltip></Typography.Text><br/>
                        <Typography.Text type="secondary" style={{ fontSize: 13 }}>Drivers can buy packages like $10 for 9 rides with an expiration timeframe.</Typography.Text>
                      </div>
                      <Form.Item name="enableWalletBundles" valuePropName="checked" style={{ marginBottom: 0 }}>
                        <Switch />
                      </Form.Item>
                    </div>

                    <div style={{ marginBottom: 24, padding: 16, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8 }}>
                       <Row gutter={16} align="middle">
                         <Col span={16}>
                           <Typography.Text strong>Minimum Wallet Balance for Trips <Tooltip title="If a driver's wallet balance falls below this amount, they will stop receiving ride requests."><InfoCircleOutlined style={{ color: '#94a3b8' }} /></Tooltip></Typography.Text><br/>
                           <Typography.Text type="secondary" style={{ fontSize: 13 }}>Forces drivers to top-up their pre-paid wallet to continue working.</Typography.Text>
                         </Col>
                         <Col span={8}>
                           <Form.Item name="minWalletBalance" style={{ marginBottom: 0 }}>
                             <InputNumber prefix="$" style={{ width: '100%' }} />
                           </Form.Item>
                         </Col>
                       </Row>
                    </div>

                    <Typography.Text strong style={{ display: 'block', marginBottom: 12 }}>Configure Bundle Packages</Typography.Text>
                    <Form.List name="walletBundles">
                      {(fields, { add, remove }) => (
                        <>
                          {fields.map(({ key, name, ...restField }) => (
                            <div key={key} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 16, background: '#f8fafc', padding: '16px 16px 0 16px', border: '1px solid #e2e8f0', borderRadius: 8 }}>
                              <Form.Item
                                {...restField}
                                name={[name, 'price']}
                                label="Bundle Price"
                                rules={[{ required: true, message: 'Required' }]}
                                style={{ flex: 1 }}
                              >
                                <InputNumber prefix="$" min={1} style={{ width: '100%' }} />
                              </Form.Item>
                              <Form.Item
                                {...restField}
                                name={[name, 'rides']}
                                label="Number of Rides"
                                rules={[{ required: true, message: 'Required' }]}
                                style={{ flex: 1 }}
                              >
                                <InputNumber style={{ width: '100%' }} min={1} />
                              </Form.Item>
                              <Form.Item
                                {...restField}
                                name={[name, 'expiryDays']}
                                label="Expiry (Days)"
                                rules={[{ required: true, message: 'Required' }]}
                                style={{ flex: 1 }}
                              >
                                <InputNumber style={{ width: '100%' }} min={1} />
                              </Form.Item>
                              <div style={{ paddingTop: 30 }}>
                                <Button type="text" danger icon={<DeleteOutlined />} onClick={() => remove(name)} />
                              </div>
                            </div>
                          ))}
                          <Form.Item>
                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                              Add New Bundle
                            </Button>
                          </Form.Item>
                        </>
                      )}
                    </Form.List>
                  </Card>
                </Col>
              </Row>
            </div>
          </Tabs.TabPane>

          {/* ============================================================ */}
          {/* TAB 4: CUSTOMER                                              */}
          {/* ============================================================ */}
          <Tabs.TabPane tab={<Space><UserOutlined /> Customer Settings</Space>} key="customer">
            <div style={{ padding: '16px 0' }}>
              <Row gutter={[24, 24]}>
                <Col xs={24} lg={12}>
                  {/* ONBOARDING & VERIFICATION */}
                  <Card
                    title={<Space><CheckCircleOutlined /> Onboarding & Identity</Space>}
                    style={{ borderRadius: 12, marginBottom: 24 }}
                    styles={{ header: { background: '#fafafa', borderRadius: '12px 12px 0 0', fontWeight: 600 } }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ paddingRight: 24 }}>
                        <Typography.Text strong>Customer Verification <Tooltip title="If enabled, customers will be required to verify their identity during the registration process."><InfoCircleOutlined style={{ color: '#94a3b8' }} /></Tooltip></Typography.Text><br/>
                        <Typography.Text type="secondary" style={{ fontSize: 13 }}>Enforce identity checks for new rider accounts.</Typography.Text>
                      </div>
                      <Form.Item name="customerVerification" valuePropName="checked" style={{ marginBottom: 0 }}>
                        <Switch />
                      </Form.Item>
                    </div>
                  </Card>

                  {/* PAYMENT METHODS */}
                  <Card
                    title={<Space><CreditCardOutlined /> Payment Methods</Space>}
                    style={{ borderRadius: 12, marginBottom: 24 }}
                    styles={{ header: { background: '#fafafa', borderRadius: '12px 12px 0 0', fontWeight: 600 } }}
                  >
                     <div style={{ marginBottom: 16 }}>
                        <Typography.Text strong>Accepted Customer Payment Options <Tooltip title="Select the payment channels available for customers to settle trip fares."><InfoCircleOutlined style={{ color: '#94a3b8' }} /></Tooltip></Typography.Text><br/>
                        <Typography.Text type="secondary" style={{ fontSize: 13 }}>Allow passengers to pay via physical cash or digital means.</Typography.Text>
                     </div>
                     <Form.Item name="customerPaymentMethods">
                       <Select mode="multiple" style={{ width: '100%' }} placeholder="Select payment methods">
                         <Option value="cash">Cash in Hand</Option>
                         <Option value="mobile_money">Mobile Money (Ecocash, OneMoney, Omari)</Option>
                         <Option value="wallet">In-App Digital Wallet</Option>
                         <Option value="card">Credit / Debit Card</Option>
                       </Select>
                     </Form.Item>
                  </Card>

                  {/* REVIEWS & RATINGS */}
                  <Card
                    title={<Space><StarOutlined /> Reviews & Ratings</Space>}
                    style={{ borderRadius: 12, marginBottom: 24 }}
                    styles={{ header: { background: '#fafafa', borderRadius: '12px 12px 0 0', fontWeight: 600 } }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ paddingRight: 24 }}>
                        <Typography.Text strong>Customer Review <Tooltip title="Allow customers to give a review to a driver after trips."><InfoCircleOutlined style={{ color: '#94a3b8' }} /></Tooltip></Typography.Text><br/>
                        <Typography.Text type="secondary" style={{ fontSize: 13 }}>Customers can rate and provide written feedback on drivers.</Typography.Text>
                      </div>
                      <Form.Item name="customerReviews" valuePropName="checked" style={{ marginBottom: 0 }}>
                        <Switch />
                      </Form.Item>
                    </div>
                  </Card>
                </Col>

                <Col xs={24} lg={12}>
                  {/* CUSTOMER REWARDS & TIERS */}
                  <Card
                    title={<Space><GiftOutlined /> Customer Rewards & Tiers</Space>}
                    style={{ borderRadius: 12, marginBottom: 24 }}
                    styles={{ header: { background: '#fafafa', borderRadius: '12px 12px 0 0', fontWeight: 600 } }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                      <div style={{ paddingRight: 24 }}>
                        <Typography.Text strong>Customer Level <Tooltip title="Manage customer level features like experience or performance."><InfoCircleOutlined style={{ color: '#94a3b8' }} /></Tooltip></Typography.Text><br/>
                        <Typography.Text type="secondary" style={{ fontSize: 13 }}>Active level feature to rank customers.</Typography.Text>
                      </div>
                      <Form.Item name="customerLevel" valuePropName="checked" style={{ marginBottom: 0 }}>
                        <Switch />
                      </Form.Item>
                    </div>

                    <Divider style={{ margin: '16px 0' }} />

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                      <div style={{ paddingRight: 24 }}>
                        <Typography.Text strong>Loyalty Point <Tooltip title="Manage customer loyalty points and conversion rate."><InfoCircleOutlined style={{ color: '#94a3b8' }} /></Tooltip></Typography.Text><br/>
                        <Typography.Text type="secondary" style={{ fontSize: 13 }}>Customer can earn loyalty points on trips.</Typography.Text>
                      </div>
                      <Form.Item name="customerLoyaltyPoints" valuePropName="checked" style={{ marginBottom: 0 }}>
                        <Switch />
                      </Form.Item>
                    </div>

                    <div style={{ background: '#f8fafc', padding: 16, borderRadius: 8, border: '1px solid #e2e8f0' }}>
                      <Typography.Text strong>Conversion Rate</Typography.Text><br/>
                      <Typography.Text type="secondary" style={{ fontSize: 13, display: 'block', marginBottom: 8 }}>Set the cash equivalent for loyalty points.</Typography.Text>
                      <Row align="middle" gutter={12}>
                        <Col><Typography.Text strong>$1.00 = </Typography.Text></Col>
                        <Col>
                          <Form.Item name="customerLoyaltyPointsValue" style={{ marginBottom: 0 }}>
                            <InputNumber addonAfter="Points" min={1} style={{ width: 140 }} />
                          </Form.Item>
                        </Col>
                      </Row>
                    </div>
                  </Card>

                  {/* WALLET */}
                  <Card
                    title={<Space><WalletOutlined /> Wallet</Space>}
                    style={{ borderRadius: 12 }}
                    styles={{ header: { background: '#fafafa', borderRadius: '12px 12px 0 0', fontWeight: 600 } }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                      <div style={{ paddingRight: 24 }}>
                        <Typography.Text strong>Add funds to wallet <Tooltip title="Manage wallet funds and minimum deposit limit."><InfoCircleOutlined style={{ color: '#94a3b8' }} /></Tooltip></Typography.Text><br/>
                        <Typography.Text type="secondary" style={{ fontSize: 13 }}>Allow customers to pre-load money into their digital wallet.</Typography.Text>
                      </div>
                      <Form.Item name="customerWallet" valuePropName="checked" style={{ marginBottom: 0 }}>
                        <Switch />
                      </Form.Item>
                    </div>

                    <div style={{ background: '#f8fafc', padding: 16, borderRadius: 8, border: '1px solid #e2e8f0' }}>
                      <Form.Item label="Minimum Add Amount ($)" name="customerMinAddAmount" style={{ marginBottom: 0 }} rules={[{ required: true, message: 'Please enter a minimum amount' }]}>
                        <InputNumber prefix="$" min={1} style={{ width: '100%' }} />
                      </Form.Item>
                    </div>
                  </Card>
                </Col>
              </Row>
            </div>
          </Tabs.TabPane>

          {/* ============================================================ */}
          {/* TAB 5: FARE & PENALTY                                        */}
          {/* ============================================================ */}
          <Tabs.TabPane tab={<Space><FieldTimeOutlined /> Fare & Penalty</Space>} key="fare">
            <div style={{ padding: '16px 0' }}>
              <Alert
                message="Fare Workflow & Penalty Rules"
                description="Configure how fares are calculated (Bidding vs Standard) and how penalties for delays or idle time are applied."
                type="info"
                showIcon
                style={{ marginBottom: 24, borderRadius: 12 }}
              />

              <Row gutter={[24, 24]}>
                <Col xs={24} lg={12}>
                  {/* TRIP PENALTIES */}
                  <Card
                    title={<Space><FieldTimeOutlined /> Trip Penalties (Ongoing Trips)</Space>}
                    style={{ borderRadius: 12, marginBottom: 24 }}
                    styles={{ header: { background: '#fafafa', borderRadius: '12px 12px 0 0', fontWeight: 600 } }}
                  >
                    <div style={{ marginBottom: 20 }}>
                      <Typography.Text strong>Idle Fee Configuration</Typography.Text><br/>
                      <Typography.Text type="secondary" style={{ fontSize: 13 }}>Applied when the driver pauses an ongoing trip (e.g., waiting for passenger at a stop).</Typography.Text>
                    </div>
                    
                    <Form.Item label="Start count idle fee after (Min) *" name="idleFeeStartMin" tooltip="Grace period allowed before idle fees begin accumulating.">
                      <InputNumber addonAfter="Minutes" min={0} style={{ width: '100%' }} />
                    </Form.Item>

                    <Divider style={{ margin: '24px 0' }} />

                    <div style={{ marginBottom: 20 }}>
                      <Typography.Text strong>Delay Fee Configuration</Typography.Text><br/>
                      <Typography.Text type="secondary" style={{ fontSize: 13 }}>Applied when a trip duration exceeds the estimated completion time by a significant margin.</Typography.Text>
                    </div>
                    
                    <Form.Item label="Start count delay fee after (Min) *" name="delayFeeStartMin" tooltip="Buffer time added to the estimated trip duration before delay penalties are triggered.">
                      <InputNumber addonAfter="Minutes" min={0} style={{ width: '100%' }} />
                    </Form.Item>
                  </Card>
                </Col>

                <Col xs={24} lg={12}>
                  {/* SERVICE WORKFLOW MODELS */}
                  <Card
                    title={<Space><SolutionOutlined /> Service Workflow Models</Space>}
                    style={{ borderRadius: 12 }}
                    styles={{ header: { background: '#fafafa', borderRadius: '12px 12px 0 0', fontWeight: 600 } }}
                  >
                    <Alert 
                      type="warning" 
                      message="Revenue Model Selection" 
                      description="Switching between 'Bidding' and 'Standard' models fundamentally changes how customers and drivers interact."
                      style={{ marginBottom: 20, borderRadius: 8 }}
                    />

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
                      <Form.Item label="Ride-Hailing Model" name="rideModel" tooltip="Bidding allows drivers/customers to negotiate; Standard follows a fixed/metered fare.">
                        <Select>
                          <Option value="bidding">Bidding Model (inDrive Style)</Option>
                          <Option value="standard">Standard Model (Uber/Metered)</Option>
                        </Select>
                      </Form.Item>

                      <Form.Item label="Parcel Delivery Model" name="parcelModel">
                        <Select>
                          <Option value="bidding">Bidding Model (Price Negotiation)</Option>
                          <Option value="standard">Standard Model (Distance Based)</Option>
                        </Select>
                      </Form.Item>

                      <Divider style={{ margin: '8px 0' }}>Ecommerce & Food (Standard Uber Model)</Divider>

                      <Form.Item label="Food Delivery Workflow" name="foodModel">
                        <Select>
                          <Option value="bidding">Bidding Model</Option>
                          <Option value="standard">Standard Model (Recommended)</Option>
                        </Select>
                      </Form.Item>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <Form.Item label="Mart Model" name="martModel">
                          <Select>
                            <Option value="standard">Standard</Option>
                            <Option value="bidding">Bidding</Option>
                          </Select>
                        </Form.Item>
                        <Form.Item label="Shopping Model" name="shoppingModel">
                          <Select>
                            <Option value="standard">Standard</Option>
                            <Option value="bidding">Bidding</Option>
                          </Select>
                        </Form.Item>
                      </div>
                    </div>
                  </Card>
                </Col>
              </Row>
            </div>
          </Tabs.TabPane>

          {/* ============================================================ */}
          {/* TAB 6: TRIPS                                                 */}
          {/* ============================================================ */}
          <Tabs.TabPane tab={<Space><RocketOutlined /> Trips</Space>} key="trips">
            <div style={{ padding: '16px 0' }}>
              <Row gutter={[24, 24]}>
                <Col xs={24} lg={12}>
                  {/* JOURNEY & SECURITY */}
                  <Card
                    title={<Space><RocketOutlined /> Journey & Security</Space>}
                    style={{ borderRadius: 12, marginBottom: 24 }}
                    styles={{ header: { background: '#fafafa', borderRadius: '12px 12px 0 0', fontWeight: 600 } }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                      <div style={{ paddingRight: 24 }}>
                        <Typography.Text strong>Enable Extra Stops <Tooltip title="Allow customers to add extra stops during a booking journey."><InfoCircleOutlined style={{ color: '#94a3b8' }} /></Tooltip></Typography.Text><br/>
                        <Typography.Text type="secondary" style={{ fontSize: 13 }}>Customers can add multiple destinations in a single trip request.</Typography.Text>
                      </div>
                      <Form.Item name="enableExtraStops" valuePropName="checked" style={{ marginBottom: 0 }}>
                        <Switch />
                      </Form.Item>
                    </div>

                    <Form.Item label="Trip Request Active Time (Mins) *" name="tripActiveTime" tooltip="Duration before a trip request expires if no driver accepts it.">
                      <InputNumber addonAfter="Minutes" min={1} style={{ width: '100%' }} />
                    </Form.Item>

                    <Divider style={{ margin: '24px 0' }} />

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ paddingRight: 24 }}>
                        <Typography.Text strong>Driver OTP Confirmation <Tooltip title="Require the driver to enter an OTP from the customer before starting the trip."><InfoCircleOutlined style={{ color: '#94a3b8' }} /></Tooltip></Typography.Text><br/>
                        <Typography.Text type="secondary" style={{ fontSize: 13 }}>Adds an extra layer of security to ensure the correct passenger is picked up.</Typography.Text>
                      </div>
                      <Form.Item name="driverOtpConfirmation" valuePropName="checked" style={{ marginBottom: 0 }}>
                        <Switch />
                      </Form.Item>
                    </div>
                  </Card>

                  {/* SCHEDULED TRIP SETUP */}
                  <Card
                    title={<Space><ScheduleOutlined /> Scheduled Trip Setup</Space>}
                    style={{ borderRadius: 12 }}
                    styles={{ header: { background: '#fafafa', borderRadius: '12px 12px 0 0', fontWeight: 600 } }}
                    extra={
                      <Form.Item name="enableScheduledTrips" valuePropName="checked" style={{ marginBottom: 0 }}>
                        <Switch />
                      </Form.Item>
                    }
                  >
                    {!enableScheduledTrips ? (
                      <Alert 
                        message="Scheduled trips are currently disabled." 
                        type="info" 
                        showIcon 
                      />
                    ) : (
                      <div style={{ opacity: enableScheduledTrips ? 1 : 0.5 }}>
                        <Typography.Text strong style={{ display: 'block', marginBottom: 16 }}>Trip Scheduling Constraints</Typography.Text>
                        
                        <Row gutter={16}>
                          <Col span={12}>
                            <Form.Item label="Minimum Schedule lead-time *" name="minScheduleTime">
                              <InputNumber addonAfter="Minutes" min={1} style={{ width: '100%' }} />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item label="Advance Schedule Limit *" name="advanceScheduleDays">
                              <InputNumber addonAfter="Days" min={1} style={{ width: '100%' }} />
                            </Form.Item>
                          </Col>
                          <Col span={24}>
                            <Form.Item label="Driver Notification Time *" name="driverNotifyBefore" tooltip="Notify drivers X minutes before the scheduled pickup time.">
                              <InputNumber addonAfter="Minutes Before" min={1} style={{ width: '100%' }} />
                            </Form.Item>
                          </Col>
                        </Row>

                        <Divider style={{ margin: '16px 0' }} />
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                          <div>
                            <Typography.Text strong>Enable Fare Increase for Scheduled Trips</Typography.Text><br/>
                            <Typography.Text type="secondary" style={{ fontSize: 13 }}>Charge a premium for pre-booked trips.</Typography.Text>
                          </div>
                          <Form.Item name="increaseFareForScheduled" valuePropName="checked" style={{ marginBottom: 0 }}>
                            <Switch size="small" />
                          </Form.Item>
                        </div>

                        <Form.Item label="Increase Fare Amount (%) *" name="scheduledFareIncreasePercent" tooltip="Percentage increase applied to the base fare for scheduled trips.">
                          <InputNumber prefix="+" addonAfter="%" min={0} style={{ width: '100%' }} />
                        </Form.Item>
                      </div>
                    )}
                  </Card>
                </Col>

                <Col xs={24} lg={12}>
                  {/* CANCELLATION REASONS */}
                  <Card
                    title={<Space><StopOutlined /> Cancellation Reasons & Logic</Space>}
                    style={{ borderRadius: 12 }}
                    styles={{ header: { background: '#fafafa', borderRadius: '12px 12px 0 0', fontWeight: 600 } }}
                  >
                    <div style={{ background: '#f8fafc', padding: 16, borderRadius: 8, border: '1px solid #e2e8f0', marginBottom: 24 }}>
                      <Typography.Text strong>Add New Cancellation Reason</Typography.Text>
                      <Row gutter={[12, 12]} style={{ marginTop: 12 }}>
                        <Col span={24}>
                          <Form.Item label="Trip Cancellation Reason" style={{ marginBottom: 0 }}>
                            <Input.TextArea placeholder="Ex: Vehicle problem" maxLength={255} showCount />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item label="Cancellation Type" style={{ marginBottom: 0 }}>
                            <Select placeholder="Select type">
                              <Option value="Before Pickup">Before Pickup</Option>
                              <Option value="Ongoing Ride">Ongoing Ride</Option>
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item label="User Type" style={{ marginBottom: 0 }}>
                            <Select placeholder="Select user">
                              <Option value="Driver">Driver</Option>
                              <Option value="Customer">Customer</Option>
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col span={24}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, marginBottom: 16, padding: '8px 12px', background: '#fff', borderRadius: 6, border: '1px solid #e2e8f0' }}>
                            <Typography.Text>Initial Status</Typography.Text>
                            <Form.Item label="Status" name="newReasonStatus" valuePropName="checked" noStyle initialValue={true}>
                              <Switch size="small" />
                            </Form.Item>
                          </div>
                          <Button type="primary" ghost block icon={<PlusOutlined />}>Add Reason</Button>
                        </Col>
                      </Row>
                    </div>

                    <Typography.Text strong style={{ display: 'block', marginBottom: 12 }}>Trip Cancellation Reason List</Typography.Text>
                    <Table 
                      size="small"
                      pagination={{ pageSize: 5 }}
                      dataSource={initialValues.cancellationReasons}
                      columns={[
                        { title: 'SL', dataIndex: 'key', width: 40 },
                        { title: 'Reason', dataIndex: 'reason', ellipsis: true },
                        { 
                          title: 'Type', 
                          dataIndex: 'type',
                          render: (type) => <Tag style={{ fontSize: 10 }}>{type}</Tag>
                        },
                        { 
                          title: 'User', 
                          dataIndex: 'user',
                          render: (user) => <Tag color={user === 'Driver' ? 'blue' : 'green'} style={{ fontSize: 10 }}>{user}</Tag>
                        },
                        { 
                          title: 'Status', 
                          dataIndex: 'status', 
                          render: (status) => <Switch size="small" checked={status} /> 
                        },
                        {
                          title: 'Action',
                          render: () => (
                            <Space>
                              <Button type="text" size="small" icon={<EditOutlined />} />
                              <Button type="text" size="small" danger icon={<DeleteOutlined />} />
                            </Space>
                          )
                        }
                      ]}
                    />
                  </Card>
                </Col>
              </Row>
            </div>
          </Tabs.TabPane>

          {/* ============================================================ */}
          {/* TAB 7: PARCEL                                                */}
          {/* ============================================================ */}
          <Tabs.TabPane tab={<Space><InboxOutlined /> Parcel</Space>} key="parcel">
            <div style={{ padding: '16px 0' }}>
              <Row gutter={[24, 24]}>
                <Col xs={24} lg={12}>
                  {/* GENERAL CONFIGURATION */}
                  <Card
                    title={<Space><InboxOutlined /> Parcel General Config</Space>}
                    style={{ borderRadius: 12, marginBottom: 24 }}
                    styles={{ header: { background: '#fafafa', borderRadius: '12px 12px 0 0', fontWeight: 600 } }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                      <div style={{ paddingRight: 24 }}>
                        <Typography.Text strong>Send Tracking Link to Customer <Tooltip title="Send parcel tracking link via SMS upon booking."><InfoCircleOutlined style={{ color: '#94a3b8' }} /></Tooltip></Typography.Text><br/>
                        <Typography.Text type="secondary" style={{ fontSize: 13 }}>Automatically notify the sender/receiver with a live map link.</Typography.Text>
                      </div>
                      <Form.Item name="enableParcelTrackingLink" valuePropName="checked" style={{ marginBottom: 0 }}>
                        <Switch />
                      </Form.Item>
                    </div>

                    <Divider />

                    <div style={{ marginBottom: 16 }}>
                      <Typography.Text strong>Parcel Weight Unit</Typography.Text><br/>
                      <Typography.Text type="secondary" style={{ fontSize: 13 }}>Primary unit used for all parcel weight calculations.</Typography.Text>
                    </div>
                    <Form.Item name="parcelWeightUnit">
                      <Select style={{ width: '100%' }}>
                        <Option value="kg">Kilogram (kg)</Option>
                        <Option value="lb">Pound (lb)</Option>
                        <Option value="g">Gram (g)</Option>
                      </Select>
                    </Form.Item>
                  </Card>

                  {/* RETURN POLICY */}
                  <Card
                    title={<Space><RollbackOutlined /> Parcel Return Policy</Space>}
                    style={{ borderRadius: 12, marginBottom: 24 }}
                    styles={{ header: { background: '#fafafa', borderRadius: '12px 12px 0 0', fontWeight: 600 } }}
                    extra={
                      <Form.Item name="enableParcelReturn" valuePropName="checked" style={{ marginBottom: 0 }}>
                        <Switch />
                      </Form.Item>
                    }
                  >
                    {!enableParcelReturn ? (
                      <Alert message="Parcel return logic is currently deactivated." type="info" showIcon />
                    ) : (
                      <>
                        <Row gutter={16}>
                          <Col span={12}>
                            <Form.Item label="Limit Return Time (Days)" name="driverReturnTimeLimit" tooltip="Maximum days allowed for driver to return undelivered parcel.">
                              <InputNumber addonAfter="Days" min={1} style={{ width: '100%' }} />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item label="Late Return Penalty ($)" name="driverLateReturnPenalty">
                              <InputNumber prefix="$" min={0} style={{ width: '100%' }} />
                            </Form.Item>
                          </Col>
                        </Row>
                        <Form.Item name="noChargeCustomerReturnIfDriverCancels" valuePropName="checked">
                          <Checkbox>Do Not Charge Customer Return Fee If Deliveryman Cancels</Checkbox>
                        </Form.Item>
                      </>
                    )}
                  </Card>

                  {/* WEIGHT MANAGEMENT */}
                  <Card
                    title={<Space><VerticalAlignBottomOutlined /> Weight Management</Space>}
                    style={{ borderRadius: 12 }}
                    styles={{ header: { background: '#fafafa', borderRadius: '12px 12px 0 0', fontWeight: 600 } }}
                    extra={
                      <Form.Item name="enableParcelWeightLimit" valuePropName="checked" style={{ marginBottom: 0 }}>
                        <Switch />
                      </Form.Item>
                    }
                  >
                    {!enableParcelWeightLimit ? (
                      <Alert message="Weight limits are not enforced." type="warning" showIcon />
                    ) : (
                      <Form.Item label="Max Parcel Weight Limit" name="maxParcelWeightLimit" tooltip="Warn/Block customers if requested weight exceeds this value.">
                        <InputNumber addonAfter={initialValues.parcelWeightUnit || 'kg'} min={1} style={{ width: '100%' }} />
                      </Form.Item>
                    )}
                  </Card>
                </Col>

                <Col xs={24} lg={12}>
                  {/* CANCELLATION REASONS */}
                  <Card
                    title={<Space><StopOutlined /> Parcel Cancellation Reasons</Space>}
                    style={{ borderRadius: 12 }}
                    styles={{ header: { background: '#fafafa', borderRadius: '12px 12px 0 0', fontWeight: 600 } }}
                  >
                    <div style={{ background: '#f8fafc', padding: 16, borderRadius: 8, border: '1px solid #e2e8f0', marginBottom: 24 }}>
                      <Typography.Text strong>Add New Parcel Cancellation Reason</Typography.Text>
                      <Row gutter={[12, 12]} style={{ marginTop: 12 }}>
                        <Col span={24}>
                          <Form.Item label="Reason" style={{ marginBottom: 0 }}>
                            <Input.TextArea placeholder="Ex: Customer reachable" maxLength={255} showCount />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item label="Cancellation Type" style={{ marginBottom: 0 }}>
                            <Select placeholder="Select type">
                              <Option value="Before Pickup">Before Pickup</Option>
                              <Option value="Ongoing Ride">Ongoing Ride</Option>
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item label="User Type" style={{ marginBottom: 0 }}>
                            <Select placeholder="Select user">
                              <Option value="Driver">Driver</Option>
                              <Option value="Customer">Customer</Option>
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col span={24}>
                           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, marginBottom: 16, padding: '8px 12px', background: '#fff', borderRadius: 6, border: '1px solid #e2e8f0' }}>
                            <Typography.Text>Initial Status</Typography.Text>
                            <Switch checked size="small" />
                          </div>
                          <Button type="primary" ghost block icon={<PlusOutlined />}>Add Reason</Button>
                        </Col>
                      </Row>
                    </div>

                    <Table 
                      size="small"
                      pagination={{ pageSize: 6 }}
                      dataSource={initialValues.parcelCancellationReasons}
                      columns={[
                        { title: 'SL', dataIndex: 'key', width: 40 },
                        { title: 'Reason', dataIndex: 'reason', ellipsis: true },
                        { title: 'Type', dataIndex: 'type', render: (t) => <Tag style={{fontSize: 10}}>{t}</Tag> },
                        { title: 'User', dataIndex: 'user', render: (u) => <Tag color={u === 'Driver' ? 'blue' : 'green'} style={{fontSize: 10}}>{u}</Tag> },
                        { title: 'Status', dataIndex: 'status', render: (s) => <Switch size="small" checked={s} /> },
                        {
                          title: 'Action',
                          render: () => (
                            <Space>
                              <Button type="text" size="small" icon={<EditOutlined />} />
                              <Button type="text" size="small" danger icon={<DeleteOutlined />} />
                            </Space>
                          )
                        }
                      ]}
                    />
                  </Card>
                </Col>
              </Row>
            </div>
          </Tabs.TabPane>

          {/* ============================================================ */}
          {/* TAB 8: ECOMMERCE                                            */}
          {/* ============================================================ */}
          <Tabs.TabPane tab={<Space><ShoppingOutlined /> Ecommerce</Space>} key="ecommerce">
            <div style={{ padding: '16px 0' }}>
              <Row gutter={[24, 24]}>
                <Col xs={24} lg={12}>
                  {/* FOOD DELIVERY */}
                  <Card
                    title={<Space><CoffeeOutlined /> Food Delivery Settings</Space>}
                    style={{ borderRadius: 12, marginBottom: 24 }}
                    styles={{ header: { background: '#fafafa', borderRadius: '12px 12px 0 0', fontWeight: 600 } }}
                  >
                    <Form.Item label="Minimum Order Value ($)" name="foodMinOrderValue" tooltip="Minimum order amount required for customers to checkout from food vendors.">
                      <InputNumber prefix="$" min={0} style={{ width: '100%' }} />
                    </Form.Item>
                    
                    <Form.Item label="Vendor Commission (%)" name="foodVendorCommission" tooltip="Default commission percentage taken from each food order.">
                      <InputNumber suffix="%" min={0} max={100} style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item label="Max Preparation Time (Mins)" name="foodMaxPrepTime" tooltip="Expected time frame for restaurants to prepare orders before pickup.">
                      <InputNumber addonAfter="Minutes" min={1} style={{ width: '100%' }} />
                    </Form.Item>
                  </Card>

                  {/* SHOPPING & RETAIL */}
                  <Card
                    title={<Space><ShoppingOutlined /> Shopping & Retail</Space>}
                    style={{ borderRadius: 12 }}
                    styles={{ header: { background: '#fafafa', borderRadius: '12px 12px 0 0', fontWeight: 600 } }}
                  >
                    <Form.Item label="Global Return Window (Days)" name="shoppingReturnWindow" tooltip="How many days a customer has to initiate a return for retail items.">
                      <InputNumber addonAfter="Days" min={0} style={{ width: '100%' }} />
                    </Form.Item>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ paddingRight: 24 }}>
                        <Typography.Text strong>Enable Item Exchange</Typography.Text><br/>
                        <Typography.Text type="secondary" style={{ fontSize: 13 }}>Allow customers to request size/color exchanges directly in-app.</Typography.Text>
                      </div>
                      <Form.Item name="shoppingExchangeEnabled" valuePropName="checked" style={{ marginBottom: 0 }}>
                        <Switch />
                      </Form.Item>
                    </div>
                  </Card>
                </Col>

                <Col xs={24} lg={12}>
                  {/* MART DELIVERY */}
                  <Card
                    title={<Space><InboxOutlined /> Mart & Grocery Settings</Space>}
                    style={{ borderRadius: 12 }}
                    styles={{ header: { background: '#fafafa', borderRadius: '12px 12px 0 0', fontWeight: 600 } }}
                  >
                    <Form.Item label="Low Stock Buffer" name="martInStockBuffer" tooltip="Notify vendors when item quantity falls below this number.">
                      <InputNumber addonAfter="Items" min={1} style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item label="Basic Category Fee ($)" name="martCategoryFees" tooltip="Platform fee applied to grocery/mart categories.">
                      <InputNumber prefix="$" min={0} style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item label="Default Delivery Priority" name="martDeliveryPriority">
                      <Select>
                        <Option value="Standard">Standard (Within 2 Hours)</Option>
                        <Option value="Express">Express (Within 45 Mins)</Option>
                        <Option value="Scheduled">Scheduled Windows</Option>
                      </Select>
                    </Form.Item>

                    <Alert 
                      type="info" 
                      message="Inventory Sync" 
                      description="Mart inventory is automatically synced with the delivery fleet based on zone capacity."
                      style={{ marginTop: 20, borderRadius: 8 }}
                    />
                  </Card>
                </Col>
              </Row>
            </div>
          </Tabs.TabPane>

          {/* ============================================================ */}
          {/* TAB 9: MARKETPLACE & STAYS                                  */}
          {/* ============================================================ */}
          <Tabs.TabPane tab={<Space><HomeOutlined /> Marketplace & Stays</Space>} key="lifestyle">
            <div style={{ padding: '16px 0' }}>
              <Row gutter={[24, 24]}>
                <Col xs={24} lg={12}>
                  {/* HOTELS & STAYS */}
                  <Card
                    title={<Space><HomeOutlined /> Hotels & Accommodations</Space>}
                    style={{ borderRadius: 12, marginBottom: 24 }}
                    styles={{ header: { background: '#fafafa', borderRadius: '12px 12px 0 0', fontWeight: 600 } }}
                  >
                    <Form.Item label="Cancellation Window (Hours)" name="hotelCancellationWindow" tooltip="Free cancellation period before check-in time.">
                      <InputNumber addonAfter="Hours" min={0} style={{ width: '100%' }} />
                    </Form.Item>
                    
                    <Row gutter={12}>
                      <Col span={12}>
                        <Form.Item label="Check-in Time" name="hotelCheckInTime">
                          <Input placeholder="e.g. 14:00" />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Check-out Time" name="hotelCheckOutTime">
                          <Input placeholder="e.g. 11:00" />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>

                  {/* CAR RENTALS */}
                  <Card
                    title={<Space><CarOutlined /> Car Rentals</Space>}
                    style={{ borderRadius: 12 }}
                    styles={{ header: { background: '#fafafa', borderRadius: '12px 12px 0 0', fontWeight: 600 } }}
                  >
                    <Form.Item label="Damage Waiver Fee ($)" name="rentalDamageWaiver" tooltip="Daily fee for comprehensive insurance coverage.">
                      <InputNumber prefix="$" min={0} style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item label="Daily Mileage Limit" name="rentalMileageLimit">
                      <InputNumber addonAfter="km / Day" min={1} style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item label="Fuel Policy" name="rentalFuelPolicy">
                      <Select>
                        <Option value="Full to Full">Full to Full (Recommended)</Option>
                        <Option value="Same to Same">Same to Same</Option>
                        <Option value="Pre-paid">Pre-paid</Option>
                      </Select>
                    </Form.Item>
                  </Card>
                </Col>

                <Col xs={24} lg={12}>
                  {/* EVENTS & TICKETING */}
                  <Card
                    title={<Space><CalendarOutlined /> Events & Ticketing</Space>}
                    style={{ borderRadius: 12 }}
                    styles={{ header: { background: '#fafafa', borderRadius: '12px 12px 0 0', fontWeight: 600 } }}
                  >
                    <Form.Item label="Platform Ticket Fee ($)" name="eventTicketFee" tooltip="Booking fee applied per ticket sold.">
                      <InputNumber prefix="$" min={0} style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item label="QR Code Validity (Hours)" name="eventQrValidity" tooltip="Number of hours before the event that the QR ticket becomes active.">
                      <InputNumber addonAfter="Hours Before" min={1} style={{ width: '100%' }} />
                    </Form.Item>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
                      <div style={{ paddingRight: 24 }}>
                        <Typography.Text strong>Interactive Seat Mapping</Typography.Text><br/>
                        <Typography.Text type="secondary" style={{ fontSize: 13 }}>Enable visual seat selection for venue-based events.</Typography.Text>
                      </div>
                      <Form.Item name="eventSeatMapEnabled" valuePropName="checked" style={{ marginBottom: 0 }}>
                        <Switch />
                      </Form.Item>
                    </div>

                    <Divider />
                    
                    <Alert 
                      type="success" 
                      message="Payout Automation" 
                      description="Event organizers receive automated settlements 48h after event completion."
                      style={{ borderRadius: 8 }}
                    />
                  </Card>
                </Col>
              </Row>
            </div>
          </Tabs.TabPane>

          {/* ============================================================ */}
          {/* TAB 10: CITY TO CITY                                        */}
          {/* ============================================================ */}
          <Tabs.TabPane tab={<Space><NodeIndexOutlined /> City to City</Space>} key="urban">
            <div style={{ padding: '16px 0' }}>
              <Row gutter={[24, 24]}>
                <Col xs={24} lg={24}>
                  {/* CITY TO CITY */}
                  <Card
                    title={<Space><NodeIndexOutlined /> City to City Logistics</Space>}
                    style={{ borderRadius: 12, marginBottom: 24 }}
                    styles={{ header: { background: '#fafafa', borderRadius: '12px 12px 0 0', fontWeight: 600 } }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                      <div style={{ paddingRight: 24 }}>
                        <Typography.Text strong>Multi-Zone Rate System</Typography.Text><br/>
                        <Typography.Text type="secondary" style={{ fontSize: 13 }}>Calculate fares based on cross-city zone boundaries.</Typography.Text>
                      </div>
                      <Form.Item name="publicTransportZoneRates" valuePropName="checked" style={{ marginBottom: 0 }}>
                        <Switch />
                      </Form.Item>
                    </div>

                    <Form.Item label="Default Pass Validity" name="publicTransportPassValidity" tooltip="Standard number of days for city-wide transport passes.">
                      <InputNumber addonAfter="Days" min={1} style={{ width: '100%' }} />
                    </Form.Item>

                    <Alert 
                      type="warning" 
                      message="GTFS Integration" 
                      description="Ensure GTFS feeds are configured in System Settings for live schedule sync."
                      style={{ marginTop: 16, borderRadius: 8 }}
                    />
                  </Card>
                </Col>
              </Row>
            </div>
          </Tabs.TabPane>

          {/* ============================================================ */}
          {/* TAB 11: FINTECH & PAYMENTS                                  */}
          {/* ============================================================ */}
          <Tabs.TabPane tab={<Space><BankOutlined /> Fintech & Payments</Space>} key="fintech">
            <div style={{ padding: '16px 0' }}>
              <Row gutter={[24, 24]}>
                <Col xs={24} lg={12}>
                  {/* KYC MANAGEMENT */}
                  <Card
                    title={<Space><AuditOutlined /> KYC & Compliance Management</Space>}
                    style={{ borderRadius: 12, marginBottom: 24 }}
                    styles={{ header: { background: '#fafafa', borderRadius: '12px 12px 0 0', fontWeight: 600 } }}
                  >
                    <Alert 
                      type="info" 
                      message="Tiered KYC Verification" 
                      description="Set transaction limits for different verification levels (Tiers)."
                      style={{ marginBottom: 20, borderRadius: 8 }}
                    />
                    
                    <Form.Item label="Tier 1 Limit (Daily max wallet balance)" name="kycLevel1Limit" tooltip="Max balance for users with only phone/email verified.">
                      <InputNumber prefix="$" min={0} style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item label="Tier 2 Limit (Daily disbursement max)" name="kycLevel2Limit" tooltip="Max balance for users with verified Gov ID.">
                      <InputNumber prefix="$" min={0} style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item label="Tier 3 Limit (Unlimited storage)" name="kycLevel3Limit" tooltip="Max balance for users with verified Proof of Residence and Biometrics.">
                      <InputNumber prefix="$" min={0} style={{ width: '100%' }} />
                    </Form.Item>
                  </Card>

                  {/* GATEWAY SETTINGS */}
                  <Card
                    title={<Space><CreditCardOutlined /> Payment Gateway & Settlement</Space>}
                    style={{ borderRadius: 12 }}
                    styles={{ header: { background: '#fafafa', borderRadius: '12px 12px 0 0', fontWeight: 600 } }}
                  >
                    <Form.Item label="Primary Payment Gateway" name="gatewayDefaultProvider">
                      <Select>
                        <Option value="EcoCash">EcoCash (Mobile Money)</Option>
                        <Option value="Stripe">Stripe (Global Card)</Option>
                        <Option value="Paystack">Paystack (African Multi-channel)</Option>
                      </Select>
                    </Form.Item>

                    <Form.Item label="Standard Settlement Cycle" name="gatewaySettlementCycle" tooltip="When funds are released to vendor bank accounts.">
                      <Select>
                        <Option value="T+0">T+0 (Instant - High Fee)</Option>
                        <Option value="T+1">T+1 (Next Day - Default)</Option>
                        <Option value="T+3">T+3 (3 Business Days)</Option>
                        <Option value="T+7">T+7 (Weekly Batch)</Option>
                      </Select>
                    </Form.Item>
                  </Card>
                </Col>

                <Col xs={24} lg={12}>
                  {/* FINTECH CONTROLS */}
                  <Card
                    title={<Space><BankOutlined /> Central Ledger Controls</Space>}
                    style={{ borderRadius: 12 }}
                    styles={{ header: { background: '#fafafa', borderRadius: '12px 12px 0 0', fontWeight: 600 } }}
                  >
                    <Form.Item label="Intraledger Transfer Fee (%)" name="fintechIntraLedgerFee" tooltip="Platform fee for P2P transfers between DashWallets.">
                      <InputNumber suffix="%" step={0.1} min={0} style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item label="Max Bank Transfer Limit (Daily)" name="fintechBankTransferLimit" tooltip="Maximum amount a user can withdraw to an external bank account per day.">
                      <InputNumber prefix="$" min={0} style={{ width: '100%' }} />
                    </Form.Item>

                    <Divider />

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ paddingRight: 24 }}>
                        <Typography.Text strong>Enable Wallet Interest <Tag color="blue" style={{ marginLeft: 8 }}>Tier 3 Only</Tag></Typography.Text><br/>
                        <Typography.Text type="secondary" style={{ fontSize: 13 }}>Incentivize long-term deposits by offering annual percentage yield (APY).</Typography.Text>
                      </div>
                      <Form.Item name="fintechInterestEnabled" valuePropName="checked" style={{ marginBottom: 0 }}>
                        <Switch />
                      </Form.Item>
                    </div>

                    <div style={{ marginTop: 20, background: '#f8fafc', padding: '12px 16px', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                       <Typography.Text type="secondary">Revenue Dashboard Integration</Typography.Text><br/>
                       <Typography.Link>View full ledger logs <ExportOutlined style={{ fontSize: 12 }} /></Typography.Link>
                    </div>
                  </Card>
                </Col>
              </Row>
            </div>
          </Tabs.TabPane>

          {/* ============================================================ */}
          {/* TAB 12: REFUND & RETURNS                                    */}
          {/* ============================================================ */}
          <Tabs.TabPane tab={<Space><UndoOutlined /> Refund & Returns</Space>} key="refunds">
            <div style={{ padding: '16px 0' }}>
              <Row gutter={[24, 24]}>
                <Col xs={24} lg={12}>
                  {/* PARCEL REFUND SETTINGS */}
                  <Card
                    title={<Space><InboxOutlined /> Parcel Refund Configuration</Space>}
                    style={{ borderRadius: 12, marginBottom: 24 }}
                    styles={{ header: { background: '#fafafa', borderRadius: '12px 12px 0 0', fontWeight: 600 } }}
                    extra={
                      <Form.Item name="enableParcelRefund" valuePropName="checked" style={{ marginBottom: 0 }}>
                        <Switch />
                      </Form.Item>
                    }
                  >
                    {!enableParcelRefund ? (
                      <Alert message="Parcel refund requests are currently disabled for customers." type="info" showIcon />
                    ) : (
                      <>
                        <div style={{ marginBottom: 16 }}>
                          <Typography.Text strong>Refund Request Validity</Typography.Text><br/>
                          <Typography.Text type="secondary" style={{ fontSize: 13 }}>Set how many days after delivery a customer can still request a refund.</Typography.Text>
                        </div>
                        <Form.Item name="parcelRefundValidity">
                          <InputNumber addonAfter="Days" min={1} style={{ width: '100%' }} />
                        </Form.Item>
                      </>
                    )}
                  </Card>

                  {/* GLOBAL SERVICE RETURNS */}
                  <Card
                    title={<Space><ShoppingOutlined /> Service Returns (Ecommerce/Food)</Space>}
                    style={{ borderRadius: 12 }}
                    styles={{ header: { background: '#fafafa', borderRadius: '12px 12px 0 0', fontWeight: 600 } }}
                    extra={
                      <Form.Item name="enableServiceReturns" valuePropName="checked" style={{ marginBottom: 0 }}>
                        <Switch />
                      </Form.Item>
                    }
                  >
                     {!enableServiceReturns ? (
                      <Alert message="General service returns are deactivated." type="warning" showIcon />
                    ) : (
                      <Form.Item label="Global Service Return Validity" name="serviceReturnValidity">
                        <InputNumber addonAfter="Days" min={1} style={{ width: '100%' }} />
                      </Form.Item>
                    )}
                    
                    <Alert 
                      type="success" 
                      message="Super App Policy" 
                      description="Refunds for Digital Services (Fintech/Energy) are managed via the Central Ledger for audit purposes."
                      style={{ marginTop: 20, borderRadius: 8 }}
                    />
                  </Card>
                </Col>

                <Col xs={24} lg={12}>
                  {/* REFUND REASONS MANAGEMENT */}
                  <Card
                    title={<Space><UndoOutlined /> Refund Reasons Management</Space>}
                    style={{ borderRadius: 12 }}
                    styles={{ header: { background: '#fafafa', borderRadius: '12px 12px 0 0', fontWeight: 600 } }}
                  >
                    <div style={{ background: '#f8fafc', padding: 16, borderRadius: 8, border: '1px solid #e2e8f0', marginBottom: 24 }}>
                      <Typography.Text strong>Add New Refund Reason</Typography.Text>
                      <Row gutter={[12, 12]} style={{ marginTop: 12 }}>
                        <Col span={24}>
                          <Form.Item label="Reason Description" style={{ marginBottom: 0 }}>
                            <Input.TextArea placeholder="Ex: Item not as described" maxLength={200} showCount />
                          </Form.Item>
                        </Col>
                        <Col span={24}>
                          <Button type="primary" ghost block icon={<PlusOutlined />} style={{ marginTop: 8 }}>Add Reason</Button>
                        </Col>
                      </Row>
                    </div>

                    <Table 
                      size="small"
                      pagination={{ pageSize: 6 }}
                      dataSource={initialValues.parcelRefundReasons}
                      columns={[
                        { title: 'SL', dataIndex: 'key', width: 50 },
                        { title: 'Reason', dataIndex: 'reason', ellipsis: true },
                        { title: 'Status', dataIndex: 'status', render: (s) => <Switch size="small" checked={s} /> },
                        {
                          title: 'Action',
                          render: () => (
                            <Space>
                              <Button type="text" size="small" icon={<EditOutlined />} />
                              <Button type="text" size="small" danger icon={<DeleteOutlined />} />
                            </Space>
                          )
                        }
                      ]}
                    />
                  </Card>
                </Col>
              </Row>
            </div>
          </Tabs.TabPane>

          {/* ============================================================ */}
          {/* TAB 13: SAFETY & EMERGENCY                                 */}
          {/* ============================================================ */}
          <Tabs.TabPane tab={<Space><SafetyCertificateOutlined /> Safety</Space>} key="safety">
            <div style={{ padding: '16px 0' }}>
              <Row gutter={[24, 24]}>
                <Col xs={24} lg={12}>
                  {/* SAFETY ALERT PRECAUTIONS */}
                  <Card
                    title={<Space><AlertOutlined /> Safety Alert Precautions</Space>}
                    style={{ borderRadius: 12, marginBottom: 24 }}
                    styles={{ header: { background: '#fafafa', borderRadius: '12px 12px 0 0', fontWeight: 600 } }}
                    extra={
                      <Form.Item name="enableSafetyAlert" valuePropName="checked" style={{ marginBottom: 0 }}>
                        <Switch />
                      </Form.Item>
                    }
                  >
                    {!enableSafetyAlert ? (
                      <Alert message="Safety alerts are currently disabled." type="info" showIcon />
                    ) : (
                      <>
                        <Typography.Paragraph>Enabling this allows Customers & Drivers to send safety alerts directly to administrators and given Emergency numbers.</Typography.Paragraph>
                        
                        <Divider plain style={{ fontSize: 13, color: '#64748b' }}>Trip Delay Logic</Divider>
                        <Form.Item label="Minimum Delay Time (Minutes)" name="safetyMinDelayTime" tooltip="Wait time before sending safety notifications if trip is delayed.">
                          <InputNumber addonAfter="Minutes" min={1} style={{ width: '100%' }} />
                        </Form.Item>

                        <Divider plain style={{ fontSize: 13, color: '#64748b' }}>Post-Trip Coverage</Divider>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                          <div>
                            <Typography.Text strong>Safety Feature After Trip Completed</Typography.Text><br/>
                            <Typography.Text type="secondary" style={{ fontSize: 12 }}>Allow using safety features for a limited time after arrival.</Typography.Text>
                          </div>
                          <Form.Item name="enableSafetyAfterTrip" valuePropName="checked" style={{ marginBottom: 0 }}>
                            <Switch size="small" />
                          </Form.Item>
                        </div>
                        
                        {enableSafetyAfterTrip && (
                          <Form.Item label="Follow-up Validity Time" name="safetyAfterTripTime">
                            <InputNumber addonAfter="Minutes" min={1} style={{ width: '100%' }} />
                          </Form.Item>
                        )}
                      </>
                    )}
                  </Card>

                  {/* EMERGENCY NUMBERS */}
                  <Card
                    title={<Space><PhoneOutlined /> Emergency Number for Call</Space>}
                    style={{ borderRadius: 12, marginBottom: 24 }}
                    styles={{ header: { background: '#fafafa', borderRadius: '12px 12px 0 0', fontWeight: 600 } }}
                  >
                    <Form.Item label="Hotline Number Type" name="emergencyNumberType">
                      <Select>
                        <Option value="Phone">Phone</Option>
                        <Option value="Telephone">Telephone</Option>
                        <Option value="Hotline">Hotline</Option>
                      </Select>
                    </Form.Item>
                    <Form.Item label="Primary Hotline Number" name="emergencyHotline">
                      <Input prefix={<PhoneOutlined />} />
                    </Form.Item>

                    <Divider plain style={{ fontSize: 13, color: '#64748b' }}>Additional Contacts</Divider>
                    <Table 
                      size="small"
                      pagination={false}
                      dataSource={initialValues.emergencyContacts}
                      columns={[
                        { title: 'Title', dataIndex: 'title' },
                        { title: 'Phone Number', dataIndex: 'phone' },
                        { 
                          title: 'Action', 
                          render: () => <Button type="text" size="small" danger icon={<DeleteOutlined />} />
                        }
                      ]}
                    />
                    <Button type="dashed" block icon={<PlusOutlined />} style={{ marginTop: 12 }}>Add Other Number</Button>
                  </Card>

                  {/* SAFETY PRECAUTIONS MANAGEMENT */}
                   <Card
                    title={<Space><FileProtectOutlined /> Safety Precautions Management</Space>}
                    style={{ borderRadius: 12 }}
                    styles={{ header: { background: '#fafafa', borderRadius: '12px 12px 0 0', fontWeight: 600 } }}
                  >
                    <div style={{ background: '#f8fafc', padding: 16, borderRadius: 8, border: '1px solid #e2e8f0', marginBottom: 24 }}>
                      <Typography.Text strong>Create Safety Precaution</Typography.Text>
                      <Row gutter={[12, 12]} style={{ marginTop: 12 }}>
                        <Col span={24}>
                          <Form.Item label="Title" style={{ marginBottom: 0 }}>
                            <Input placeholder="Ex: Check Trip Route" maxLength={80} showCount />
                          </Form.Item>
                        </Col>
                        <Col span={24}>
                          <Form.Item label="Description" style={{ marginBottom: 0 }}>
                            <Input.TextArea placeholder="Description of precaution..." maxLength={250} showCount />
                          </Form.Item>
                        </Col>
                        <Col span={24}>
                          <Form.Item label="For Whom" style={{ marginBottom: 0 }}>
                            <Checkbox.Group options={['Customer', 'Driver']} />
                          </Form.Item>
                        </Col>
                        <Col span={24}>
                          <Button type="primary" ghost block icon={<PlusOutlined />} style={{ marginTop: 8 }}>Add Precaution</Button>
                        </Col>
                      </Row>
                    </div>

                    <Table 
                      size="small"
                      dataSource={initialValues.safetyPrecautions}
                      pagination={{ pageSize: 5 }}
                      columns={[
                        { title: 'For Whom', dataIndex: 'user', width: 100 },
                        { title: 'Title', dataIndex: 'title', ellipsis: true },
                        { title: 'Status', dataIndex: 'status', width: 60, render: (s) => <Switch size="small" checked={s} /> },
                        {
                          title: 'Action',
                          width: 80,
                          render: () => (
                            <Space>
                              <Button type="text" size="small" icon={<EditOutlined />} />
                              <Button type="text" size="small" danger icon={<DeleteOutlined />} />
                            </Space>
                          )
                        }
                      ]}
                    />
                  </Card>
                </Col>

                <Col xs={24} lg={12}>
                  {/* SAFETY ALERT REASONS */}
                  <Card
                    title={<Space><SecurityScanOutlined /> Safety Alert Reason Management</Space>}
                    style={{ borderRadius: 12 }}
                    styles={{ header: { background: '#fafafa', borderRadius: '12px 12px 0 0', fontWeight: 600 } }}
                    extra={
                      <Form.Item name="enableSafetyAlertReasons" valuePropName="checked" style={{ marginBottom: 0 }}>
                        <Switch />
                      </Form.Item>
                    }
                  >
                    <div style={{ background: '#f8fafc', padding: 16, borderRadius: 8, border: '1px solid #e2e8f0', marginBottom: 24 }}>
                      <Typography.Text strong>Add New Reason</Typography.Text>
                      <Row gutter={[12, 12]} style={{ marginTop: 12 }}>
                        <Col span={24}>
                          <Form.Item label="Reason" style={{ marginBottom: 0 }}>
                            <Input.TextArea placeholder="Ex: Abrupt braking recorded" maxLength={150} showCount />
                          </Form.Item>
                        </Col>
                        <Col span={24}>
                          <Form.Item label="User Type" style={{ marginBottom: 0 }}>
                            <Select placeholder="Select user">
                              <Option value="Driver">Driver</Option>
                              <Option value="Customer">Customer</Option>
                              <Option value="All">All Users</Option>
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col span={24}>
                          <Button type="primary" ghost block icon={<PlusOutlined />} style={{ marginTop: 8 }}>Add Reason</Button>
                        </Col>
                      </Row>
                    </div>

                    <Table 
                      size="small"
                      pagination={{ pageSize: 12 }}
                      dataSource={initialValues.safetyAlertReasons}
                      columns={[
                        { title: 'SL', dataIndex: 'key', width: 40 },
                        { title: 'Reason', dataIndex: 'reason', ellipsis: true },
                        { title: 'Whom', dataIndex: 'user', width: 80, render: (u) => <Tag color={u === 'Driver' ? 'blue' : 'green'} style={{fontSize: 10}}>{u}</Tag> },
                        { title: 'Status', dataIndex: 'status', width: 60, render: (s) => <Switch size="small" checked={s} /> },
                        {
                          title: 'Action',
                          width: 80,
                          render: () => (
                            <Space>
                              <Button type="text" size="small" icon={<EditOutlined />} />
                              <Button type="text" size="small" danger icon={<DeleteOutlined />} />
                            </Space>
                          )
                        }
                      ]}
                    />
                  </Card>
                </Col>
              </Row>
            </div>
          </Tabs.TabPane>

          {/* ============================================================ */}
          {/* TAB 14: REFERRAL SETTINGS                                   */}
          {/* ============================================================ */}
          <Tabs.TabPane tab={<Space><TeamOutlined /> Referral Settings</Space>} key="referral">
            <div style={{ padding: '16px 0' }}>
              <Row gutter={[24, 24]}>
                <Col xs={24} lg={12}>
                  {/* CUSTOMER REFERRAL */}
                  <Card
                    title={<Space><UserAddOutlined /> Customer Referral Earning</Space>}
                    style={{ borderRadius: 12, marginBottom: 24 }}
                    styles={{ header: { background: '#fafafa', borderRadius: '12px 12px 0 0', fontWeight: 600 } }}
                    extra={
                      <Form.Item name="enableCustomerReferral" valuePropName="checked" style={{ marginBottom: 0 }}>
                        <Switch />
                      </Form.Item>
                    }
                  >
                    {!enableCustomerReferral ? (
                      <Alert message="Customer referral program is currently deactivated." type="info" showIcon />
                    ) : (
                      <>
                        <Typography.Paragraph>Allow customers to refer your app to friends and family using a unique code and earn rewards.</Typography.Paragraph>
                        
                        <div style={{ background: '#f8fafc', padding: 16, borderRadius: 8, border: '1px solid #e2e8f0', marginBottom: 20 }}>
                          <Typography.Text strong>Reward for Sharer</Typography.Text><br/>
                          <Typography.Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 12 }}>
                            Set the reward for the customer who is sharing the code.
                          </Typography.Text>
                          <Form.Item label="Earnings to Each Referral ($)" name="customerReferralSharingReward" style={{ marginBottom: 0 }}>
                            <InputNumber prefix="$" min={0} style={{ width: '100%' }} />
                          </Form.Item>
                        </div>

                        <div style={{ background: '#fffbeb', padding: 16, borderRadius: 8, border: '1px solid #fef3c7' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                            <Typography.Text strong>Reward for Sign-up (New Customer)</Typography.Text>
                            <Form.Item name="enableCustomerReferralDiscount" valuePropName="checked" style={{ marginBottom: 0 }}>
                              <Switch size="small" />
                            </Form.Item>
                          </div>
                          
                          {enableCustomerReferralDiscount && (
                            <Row gutter={12}>
                              <Col span={12}>
                                <Form.Item label="Discount Percent (%)" name="customerReferralDiscountPercent">
                                  <InputNumber suffix="%" min={0} max={100} style={{ width: '100%' }} />
                                </Form.Item>
                              </Col>
                              <Col span={12}>
                                <Form.Item label="Validity (Days)" name="customerReferralDiscountValidity">
                                  <InputNumber addonAfter="Days" min={1} style={{ width: '100%' }} />
                                </Form.Item>
                              </Col>
                            </Row>
                          )}
                          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                            Discount applied on their first ride/order.
                          </Typography.Text>
                        </div>
                      </>
                    )}
                  </Card>
                </Col>

                <Col xs={24} lg={12}>
                  {/* DRIVER REFERRAL */}
                  <Card
                    title={<Space><CarOutlined /> Driver Referral Earning</Space>}
                    style={{ borderRadius: 12 }}
                    styles={{ header: { background: '#fafafa', borderRadius: '12px 12px 0 0', fontWeight: 600 } }}
                    extra={
                      <Form.Item name="enableDriverReferral" valuePropName="checked" style={{ marginBottom: 0 }}>
                        <Switch />
                      </Form.Item>
                    }
                  >
                    {!enableDriverReferral ? (
                      <Alert message="Driver referral program is currently deactivated." type="info" showIcon />
                    ) : (
                      <>
                        <Typography.Paragraph>Allow Drivers to refer your app to friends and family using a unique code and earn rewards.</Typography.Paragraph>

                        <div style={{ background: '#f0f9ff', padding: 16, borderRadius: 8, border: '1px solid #e0f2fe', marginBottom: 20 }}>
                          <Typography.Text strong>Reward for Referral Sharer (Existing Driver)</Typography.Text><br/>
                          <Typography.Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 12 }}>
                            Reward given per successful driver sign-up.
                          </Typography.Text>
                          <Form.Item label="Sharing Reward ($)" name="driverReferralSharingReward" style={{ marginBottom: 0 }}>
                            <InputNumber prefix="$" min={0} style={{ width: '100%' }} />
                          </Form.Item>
                        </div>

                        <div style={{ background: '#f0fdf4', padding: 16, borderRadius: 8, border: '1px solid #dcfce7' }}>
                          <Typography.Text strong>Reward for New Joiner (New Driver)</Typography.Text><br/>
                          <Typography.Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 12 }}>
                            Bonus added to user wallet after account verification.
                          </Typography.Text>
                          <Form.Item label="Bonus in Wallet ($)" name="driverReferralWalletBonus" style={{ marginBottom: 0 }}>
                            <InputNumber prefix="$" min={0} style={{ width: '100%' }} />
                          </Form.Item>
                        </div>
                        
                        <Alert 
                          style={{ marginTop: 24 }}
                          type="warning" 
                          message="Fraud Check" 
                          description="Referral bonuses are subject to administrative review before final wallet credit."
                          showIcon
                        />
                      </>
                    )}
                  </Card>
                </Col>
              </Row>
            </div>
          </Tabs.TabPane>

          {/* ============================================================ */}
          {/* TAB 15: CHATTING SETUP                                      */}
          {/* ============================================================ */}
          <Tabs.TabPane tab={<Space><MessageOutlined /> Chatting</Space>} key="chatting">
            <div style={{ padding: '16px 0' }}>
              <Row gutter={[24, 24]}>
                <Col xs={24} lg={12}>
                  {/* CHATTING TOGGLE */}
                  <Card
                    title={<Space><CommentOutlined /> Chatting Infrastructure</Space>}
                    style={{ borderRadius: 12, marginBottom: 24 }}
                    styles={{ header: { background: '#fafafa', borderRadius: '12px 12px 0 0', fontWeight: 600 } }}
                    extra={
                      <Form.Item name="enableDriverChatting" valuePropName="checked" style={{ marginBottom: 0 }}>
                        <Switch />
                      </Form.Item>
                    }
                  >
                    {!enableDriverChatting ? (
                      <Alert message="Driver chatting is currently disabled. Drivers will not see any chat options." type="warning" showIcon />
                    ) : (
                      <Typography.Paragraph>
                        When enabled, drivers can communicate with customers and the support team directly through the application.
                      </Typography.Paragraph>
                    )}
                  </Card>
                </Col>

                <Col xs={24} lg={12}>
                  {/* SUPPORT CENTER / PREDEFINED Q&A */}
                  <Card
                    title={<Space><CustomerServiceOutlined /> Support Center</Space>}
                    style={{ borderRadius: 12 }}
                    styles={{ header: { background: '#fafafa', borderRadius: '12px 12px 0 0', fontWeight: 600 } }}
                  >
                    <Tabs defaultActiveKey="qa" className="premium-tabs" size="small">
                      <Tabs.TabPane tab="Predefined Q&A" key="qa">
                        <div style={{ background: '#f8fafc', padding: '16px 12px', borderRadius: 8, border: '1px solid #e2e8f0', marginBottom: 20, marginTop: 12 }}>
                          <Typography.Text strong>Add New Q&A</Typography.Text>
                          <Row gutter={[12, 12]} style={{ marginTop: 12 }}>
                            <Col span={24}>
                              <Form.Item label="Question" style={{ marginBottom: 0 }}>
                                <Input placeholder="Ex: How to cancel a trip?" maxLength={150} showCount />
                              </Form.Item>
                            </Col>
                            <Col span={24}>
                              <Form.Item label="Answer" style={{ marginBottom: 0 }}>
                                <Input.TextArea placeholder="Type answer here..." maxLength={250} showCount />
                              </Form.Item>
                            </Col>
                            <Col span={24}>
                              <Button type="primary" ghost block icon={<PlusOutlined />} style={{ marginTop: 8 }}>Add Q&A</Button>
                            </Col>
                          </Row>
                        </div>

                        <Table 
                          size="small"
                          dataSource={initialValues.predefinedQA}
                          pagination={{ pageSize: 5 }}
                          columns={[
                            { title: 'SL', dataIndex: 'key', width: 40 },
                            { title: 'Question', dataIndex: 'question', ellipsis: true },
                            { title: 'Status', dataIndex: 'status', width: 60, render: (s) => <Switch size="small" checked={s} /> },
                            {
                              title: 'Action',
                              width: 80,
                              render: () => (
                                <Space>
                                  <Button type="text" size="small" icon={<EditOutlined />} />
                                  <Button type="text" size="small" danger icon={<DeleteOutlined />} />
                                </Space>
                              )
                            }
                          ]}
                        />
                      </Tabs.TabPane>

                      <Tabs.TabPane tab="Saved Replies" key="replies">
                        <div style={{ background: '#f0f9ff', padding: '16px 12px', borderRadius: 8, border: '1px solid #e0f2fe', marginBottom: 20, marginTop: 12 }}>
                          <Typography.Text strong>Add Saved Reply</Typography.Text>
                          <Row gutter={[12, 12]} style={{ marginTop: 12 }}>
                            <Col span={24}>
                              <Form.Item label="Topic" style={{ marginBottom: 0 }}>
                                <Input placeholder="Ex: Cancel ongoing trip" maxLength={150} showCount />
                              </Form.Item>
                            </Col>
                            <Col span={24}>
                              <Form.Item label="Answer" style={{ marginBottom: 0 }}>
                                <Input.TextArea placeholder="Type answer here..." maxLength={250} showCount />
                              </Form.Item>
                            </Col>
                            <Col span={24}>
                              <Button type="primary" ghost block icon={<PlusOutlined />} style={{ marginTop: 8 }}>Save Reply</Button>
                            </Col>
                          </Row>
                        </div>

                        <Table 
                          size="small"
                          dataSource={initialValues.supportSavedReplies}
                          pagination={{ pageSize: 5 }}
                          columns={[
                            { title: 'SL', dataIndex: 'key', width: 40 },
                            { title: 'Topic', dataIndex: 'topic', ellipsis: true },
                            { title: 'Status', dataIndex: 'status', width: 60, render: (s) => <Switch size="small" checked={s} /> },
                            {
                              title: 'Action',
                              width: 80,
                              render: () => (
                                <Space>
                                  <Button type="text" size="small" icon={<EditOutlined />} />
                                  <Button type="text" size="small" danger icon={<DeleteOutlined />} />
                                </Space>
                              )
                            }
                          ]}
                        />
                      </Tabs.TabPane>
                    </Tabs>
                  </Card>
                </Col>
              </Row>
            </div>
          </Tabs.TabPane>

          {/* ============================================================ */}
          {/* TAB 16: SCHOOL RUN MONITOR                                  */}
          {/* ============================================================ */}
          <Tabs.TabPane tab={<Space><SafetyOutlined /> School Run</Space>} key="schoolrun">
            <div style={{ padding: '16px 0' }}>
              <Row gutter={[24, 24]}>
                <Col xs={24} lg={12}>
                  {/* GUARDIAN VERIFICATION */}
                  <Card
                    title={<Space><SafetyOutlined /> Guardian & Student Verification</Space>}
                    style={{ borderRadius: 12, marginBottom: 24 }}
                    styles={{ header: { background: '#fafafa', borderRadius: '12px 12px 0 0', fontWeight: 600 } }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                      <div style={{ paddingRight: 24 }}>
                        <Typography.Text strong>Mandatory Guardian PIN</Typography.Text><br/>
                        <Typography.Text type="secondary" style={{ fontSize: 13 }}>Require the guardian to provide a secure PIN to the driver for every pickup/dropoff.</Typography.Text>
                      </div>
                      <Form.Item name="schoolRunGuardianPinRequired" valuePropName="checked" style={{ marginBottom: 0 }}>
                        <Switch />
                      </Form.Item>
                    </div>

                    <Form.Item label="Identity Verification Mode" name="schoolRunVerificationMode">
                      <Select>
                        <Option value="PIN Only">PIN Only</Option>
                        <Option value="Photo Only">Photo Verification Only</Option>
                        <Option value="Photo & PIN">Advanced (Photo & PIN)</Option>
                        <Option value="Biometric">Biometric (Thumbprint)</Option>
                      </Select>
                    </Form.Item>
                  </Card>

                  {/* SUBSCRIPTION & RENEWAL */}
                  <Card
                    title={<Space><CalendarOutlined /> Recurring Booking Logic</Space>}
                    style={{ borderRadius: 12 }}
                    styles={{ header: { background: '#fafafa', borderRadius: '12px 12px 0 0', fontWeight: 600 } }}
                  >
                    <Form.Item label="Payment Grace Period (Days)" name="schoolRunRecurringGracePeriod" tooltip="Number of days to keep the booking active if payment fails.">
                      <InputNumber addonAfter="Days" min={0} style={{ width: '100%' }} />
                    </Form.Item>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
                      <div style={{ paddingRight: 24 }}>
                        <Typography.Text strong>Automated Monthly Renewal</Typography.Text><br/>
                        <Typography.Text type="secondary" style={{ fontSize: 13 }}>Automatically generate a new invoice 7 days before the current month ends.</Typography.Text>
                      </div>
                      <Form.Item name="schoolRunAutoRenewMonthly" valuePropName="checked" style={{ marginBottom: 0 }}>
                        <Switch />
                      </Form.Item>
                    </div>
                  </Card>
                </Col>

                <Col xs={24} lg={12}>
                  {/* DRIVER COMPLIANCE */}
                  <Card
                    title={<Space><AuditOutlined /> Driver Compliance for School Runs</Space>}
                    style={{ borderRadius: 12 }}
                    styles={{ header: { background: '#fafafa', borderRadius: '12px 12px 0 0', fontWeight: 600 } }}
                  >
                    <Form.Item label="Background Check Frequency" name="schoolRunBackgroundCheckFrequency" tooltip="How often drivers assigned to school runs must undergo criminal record checks.">
                      <Select>
                        <Option value={1}>Every Month</Option>
                        <Option value={3}>Quarterly (3 Months)</Option>
                        <Option value={6}>Bi-Annually (6 Months)</Option>
                        <Option value={12}>Annually (12 Months)</Option>
                      </Select>
                    </Form.Item>

                    <Divider />

                    <Alert 
                      type="warning" 
                      message="Enhanced Safeguarding" 
                      description="School run drivers are restricted from accepting standard ride requests while children are on board (Live Telemetry Enforcement)."
                      style={{ borderRadius: 8 }}
                    />
                  </Card>
                </Col>
              </Row>
            </div>
          </Tabs.TabPane>
        </Tabs>
      </Form>
    </div>
  );
};

