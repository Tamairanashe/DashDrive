import React, { useState, useEffect } from 'react';
import { Card, Typography, Row, Col, Input, Button, Space, Divider, message, Steps, Statistic, Tag, Alert, Select, Result, Spin } from 'antd';
import { 
  ThunderboltOutlined, 
  GlobalOutlined, 
  PhoneOutlined, 
  EnvironmentOutlined, 
  CheckCircleOutlined, 
  ArrowRightOutlined, 
  WalletOutlined,
  LoadingOutlined,
  QrcodeOutlined
} from '@ant-design/icons';
import { fintechHubApi } from '../../api/fintechHubApi';

const { Title, Text } = Typography;

const ICON_MAP: Record<string, any> = {
    'ThunderboltOutlined': <ThunderboltOutlined />,
    'EnvironmentOutlined': <EnvironmentOutlined />,
    'GlobalOutlined': <GlobalOutlined />,
    'PhoneOutlined': <PhoneOutlined />,
};

export const UtilityPaymentHub: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedProvider, setSelectedProvider] = useState<any>(null);
  const [billers, setBillers] = useState<any[]>([]);
  const [loadingBillers, setLoadingBillers] = useState(false);
  const [accountNumber, setAccountNumber] = useState('');

  useEffect(() => {
    fetchBillers();
  }, []);

  const fetchBillers = async () => {
    setLoadingBillers(true);
    try {
      const res = await fintechHubApi.bills.getBillers();
      if (res.data.length === 0) {
        // Automatically seed if empty for this demo session
        await fintechHubApi.bills.seedBillers();
        const reRes = await fintechHubApi.bills.getBillers();
        setBillers(reRes.data);
      } else {
        setBillers(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch billers:', err);
      message.error('Failed to load biller list');
    } finally {
      setLoadingBillers(false);
    }
  };
  const [loading, setLoading] = useState(false);
  const [verifiedAccount, setVerifiedAccount] = useState<any>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const [transactionData, setTransactionData] = useState<any>(null);
  const [polling, setPolling] = useState(false);

  const startPolling = (transactionId: string) => {
    setPolling(true);
    let attempts = 0;
    const interval = setInterval(async () => {
      attempts++;
      if (attempts > 30) { // 2.5 minutes
        clearInterval(interval);
        setPolling(false);
        return;
      }

      try {
        const res = await fintechHubApi.payments.getStatus(transactionId);
        if (res.data.status === 'SUCCESS') {
          setTransactionData(res.data);
          setPaymentStatus('success');
          setPolling(false);
          clearInterval(interval);
        } else if (res.data.status === 'FAILED') {
          setPaymentStatus('failed');
          setPolling(false);
          clearInterval(interval);
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    }, 5000);
  };

  const handleVerify = async () => {
    if (!accountNumber) return message.warning('Please enter an account number');
    setLoading(true);
    try {
      const res = await fintechHubApi.bills.verify({
        provider: selectedProvider.billerCode || selectedProvider.id,
        account_number: accountNumber
      });
      setVerifiedAccount(res.data);
      setCurrentStep(1);
      message.success('Account verified successfully');
    } catch (err) {
      console.error(err);
      message.error('Failed to verify account. Please check the number.');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (paymentAmount <= 0) return message.warning('Please enter a valid amount');
    setPaymentStatus('processing');
    try {
      const res = await fintechHubApi.bills.pay({
        provider: selectedProvider.billerCode || selectedProvider.id,
        account_number: accountNumber,
        amount: paymentAmount
      });
      
      setTransactionData(res.data);
      if (res.data.gatewayTransactionId) {
          // Redirect to Paynow
          window.open(res.data.gatewayTransactionId, '_blank');
          setPaymentStatus('processing');
          startPolling(res.data.id);
      }
    } catch (err) {
      console.error(err);
      setPaymentStatus('failed');
      message.error('Payment initiation failed');
    }
  };

  const renderProviderSelection = () => (
    <Row gutter={[20, 20]}>
      {loadingBillers ? (
          <Col span={24} style={{ textAlign: 'center', padding: 40 }}><Spin tip="Loading Providers..." /></Col>
      ) : billers.map(p => (
        <Col xs={24} sm={12} md={6} key={p.id}>
          <Card 
            hoverable 
            onClick={() => setSelectedProvider(p)}
            style={{ 
              borderRadius: 16, 
              border: selectedProvider?.id === p.id ? `2px solid ${p.color || '#10b981'}` : '1px solid #f1f5f9',
              background: selectedProvider?.id === p.id ? `${p.color || '#10b981'}05` : '#fff',
              textAlign: 'center',
              transition: 'all 0.3s ease'
            }}
          >
            <div style={{ 
              fontSize: 32, 
              color: p.color || '#10b981', 
              background: `${p.color || '#10b981'}15`, 
              width: 64, 
              height: 64, 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              {ICON_MAP[p.icon] || <ThunderboltOutlined />}
            </div>
            <Title level={5} style={{ margin: 0 }}>{p.name}</Title>
            <Text type="secondary" style={{ fontSize: 12 }}>{p.category}</Text>
          </Card>
        </Col>
      ))}
    </Row>
  );

  return (
    <div style={{ padding: '40px', background: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <Title level={2} style={{ fontWeight: 800, marginBottom: 8 }}>Utility Payment Hub</Title>
        <Text type="secondary" style={{ display: 'block', marginBottom: 32 }}>
          Securely pay for electricity, water, and top-up airtime via Paynow Zimbabwe.
        </Text>

        <Card style={{ borderRadius: 24, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)', border: 'none', padding: '12px' }}>
          <Steps 
            current={currentStep} 
            style={{ marginBottom: 40, padding: '0 20px' }}
            items={[
              { title: 'Provider', description: 'Select service' },
              { title: 'Verification', description: 'Account details' },
              { title: 'Payment', description: polling ? 'Polling...' : 'Checkout' },
            ]}
          />

          {paymentStatus === 'processing' && (
             <div style={{ textAlign: 'center', padding: '40px' }}>
                <LoadingOutlined style={{ fontSize: 48, color: '#10b981', marginBottom: 16 }} />
                <Title level={4}>Waiting for Payment Confirmation...</Title>
                <Text type="secondary">We are polling Paynow for your transaction status. Please complete the payment in the new window.</Text>
             </div>
          )}

          {currentStep === 0 && paymentStatus !== 'processing' && (
            <div>
              <Title level={4} style={{ marginBottom: 24 }}>Select a Service Provider</Title>
              {renderProviderSelection()}
              
              <Divider style={{ margin: '32px 0' }} />
              
              <div style={{ maxWidth: 400, margin: '0 auto' }}>
                <Text strong style={{ display: 'block', marginBottom: 8 }}>Enter Account / Meter Number</Text>
                <Input 
                  size="large" 
                  placeholder="e.g. 14256385961" 
                  value={accountNumber}
                  onChange={e => setAccountNumber(e.target.value)}
                  style={{ borderRadius: 12, marginBottom: 20 }}
                  suffix={loading ? <LoadingOutlined /> : null}
                />
                <Button 
                  type="primary" 
                  size="large" 
                  block 
                  disabled={!selectedProvider || !accountNumber}
                  loading={loading}
                  onClick={handleVerify}
                  style={{ borderRadius: 12, height: 50, fontWeight: 700, background: '#0f172a' }}
                >
                  Verify Account <ArrowRightOutlined />
                </Button>
              </div>
            </div>
          )}

          {currentStep === 1 && verifiedAccount && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ background: '#f0fdf4', border: '1px solid #dcfce7', borderRadius: 20, padding: '32px', marginBottom: 32 }}>
                <CheckCircleOutlined style={{ fontSize: 48, color: '#10b981', marginBottom: 16 }} />
                <Title level={3} style={{ margin: 0 }}>{verifiedAccount.customer_name}</Title>
                <Text type="secondary">Account Number: {verifiedAccount.account_number}</Text>
                
                <Row gutter={32} style={{ marginTop: 24 }}>
                  <Col span={12}>
                    <Statistic title="Provider" value={selectedProvider?.name} valueStyle={{ fontSize: 16 }} />
                  </Col>
                  <Col span={12}>
                    <Statistic title="Balance Due" value={verifiedAccount.outstanding_amount} prefix="$" valueStyle={{ fontSize: 16, color: '#ef4444' }} />
                  </Col>
                </Row>
              </div>

              <div style={{ maxWidth: 400, margin: '0 auto' }}>
                <Text strong style={{ display: 'block', marginBottom: 8 }}>Enter Payment Amount (USD)</Text>
                <Input 
                  size="large" 
                  type="number"
                  placeholder="0.00" 
                  onChange={e => setPaymentAmount(parseFloat(e.target.value))}
                  style={{ borderRadius: 12, marginBottom: 20, textAlign: 'center', fontSize: 24, height: 60 }}
                />
                
                <Space orientation="vertical" style={{ width: '100%' }}>
                    <Button 
                        type="primary" 
                        size="large" 
                        block 
                        loading={paymentStatus === 'processing'}
                        onClick={handlePayment}
                        style={{ borderRadius: 12, height: 50, fontWeight: 700, background: '#10b981' }}
                    >
                        Proceed to Paynow Checkout
                    </Button>
                    <Button type="link" onClick={() => setCurrentStep(0)}>Go Back</Button>
                </Space>
              </div>
            </div>
          )}

          {paymentStatus === 'success' && transactionData && (
              <Result
                status="success"
                title="Payment Confirmed!"
                subTitle={`Your payment of $${transactionData.amount} for ${selectedProvider.name} (${accountNumber}) has been verified.`}
                extra={[
                    <Button type="primary" key="dashboard" onClick={() => window.location.reload()}>
                        Make Another Payment
                    </Button>,
                    <Button key="history">View History</Button>,
                ]}
              >
                {transactionData.metadata?.token && (
                    <div style={{ padding: '24px', background: '#fffbeb', borderRadius: 16, border: '1px solid #fde68a', marginTop: 24 }}>
                        <Space align="start">
                            <QrcodeOutlined style={{ fontSize: 32, color: '#fbbf24' }} />
                            <div>
                                <Text strong style={{ color: '#92400e', fontSize: 16 }}>Electricity Token Generated</Text><br/>
                                <Title level={2} style={{ color: '#b45309', margin: '8px 0', letterSpacing: 2 }}>
                                    {transactionData.metadata.token.match(/.{1,4}/g)?.join(' ')}
                                </Title>
                                <Text type="secondary" style={{ fontSize: 12 }}>Reference: {transactionData.gatewayTransactionId}</Text>
                            </div>
                        </Space>
                    </div>
                )}
              </Result>
          )}
        </Card>

        <div style={{ marginTop: 40, textAlign: 'center' }}>
          <Space split={<Divider orientation="vertical" />}>
            <Text type="secondary"><WalletOutlined /> Secure SSL Encrypted</Text>
            <Text type="secondary"><CheckCircleOutlined /> Authorized Paynow Channel</Text>
            <Text type="secondary">DashDrive Fintech</Text>
          </Space>
        </div>
      </div>
    </div>
  );
};

