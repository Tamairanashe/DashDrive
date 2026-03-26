import React, { useState } from 'react';
import { 
  Card, 
  Typography, 
  Row, 
  Col, 
  Input, 
  Button, 
  Space, 
  Divider, 
  message, 
  Steps, 
  Statistic, 
  Tag, 
  Alert, 
  Select, 
  Result, 
  Spin,
  Avatar
} from 'antd';
import { 
  ArrowRightOutlined, 
  WalletOutlined,
  UserOutlined,
  SendOutlined,
  CheckCircleOutlined,
  LoadingOutlined,
  SwapOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import { fintechHubApi } from '../../api/fintechHubApi';

const { Title, Text, Paragraph } = Typography;

export const DashWalletTransfer: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [currency, setCurrency] = useState('USD');
  const [loading, setLoading] = useState(false);
  
  // Sender State
  const [senderIdentifier, setSenderIdentifier] = useState('');
  const [senderData, setSenderData] = useState<any>(null);
  
  // Recipient State
  const [recipientIdentifier, setRecipientIdentifier] = useState('');
  const [recipientData, setRecipientData] = useState<any>(null);
  
  // Transfer State
  const [amount, setAmount] = useState<number>(0);
  const [reason, setReason] = useState('P2P Transfer');
  const [transferStatus, setTransferStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const [resultData, setResultData] = useState<any>(null);

  const handleLookupSender = async () => {
    if (!senderIdentifier) return message.warning('Enter sender phone or email');
    setLoading(true);
    try {
      const res = await fintechHubApi.wallets.lookupRecipient(senderIdentifier, currency);
      setSenderData(res.data);
      message.success('Sender located');
    } catch (err: any) {
      console.error('Sender lookup failed:', err);
      message.error(err.response?.data?.message || 'Sender not found');
    } finally {
      setLoading(true);
      setTimeout(() => setLoading(false), 500); // UI feel
    }
  };

  const handleLookupRecipient = async () => {
    if (!recipientIdentifier) return message.warning('Enter recipient phone or email');
    setLoading(true);
    try {
      const res = await fintechHubApi.wallets.lookupRecipient(recipientIdentifier, currency);
      setRecipientData(res.data);
      message.success('Recipient located');
    } catch (err: any) {
      console.error('Recipient lookup failed:', err);
      message.error(err.response?.data?.message || 'Recipient not found');
    } finally {
      setLoading(false);
    }
  };

  const handleProcessTransfer = async () => {
    if (amount <= 0) return message.warning('Amount must be greater than 0');
    if (amount > senderData.wallet.balance) return message.error('Insufficient sender balance');
    
    setTransferStatus('processing');
    setLoading(true);
    try {
      const res = await fintechHubApi.wallets.transferP2P({
        from_wallet_id: senderData.wallet.id,
        recipient_identifier: recipientIdentifier,
        amount,
        reason,
        currency
      });
      setResultData(res.data);
      setTransferStatus('success');
      setCurrentStep(3);
    } catch (err: any) {
      console.error('Transfer failed:', err);
      setTransferStatus('failed');
      message.error(err.response?.data?.message || 'Transfer failed');
    } finally {
      setLoading(false);
    }
  };

  const next = () => setCurrentStep(currentStep + 1);
  const prev = () => setCurrentStep(currentStep - 1);

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Card 
        variant="borderless"
        style={{ 
          background: 'linear-gradient(135deg, #1a1c1e 0%, #2d2f31 100%)',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          marginBottom: '24px'
        }}
      >
        <Row align="middle" gutter={24}>
          <Col>
            <Avatar size={64} icon={<SwapOutlined />} style={{ backgroundColor: '#00cc66' }} />
          </Col>
          <Col flex="auto">
            <Title level={2} style={{ color: '#fff', margin: 0 }}>DashWallet Peer-to-Peer</Title>
            <Text style={{ color: 'rgba(255,255,255,0.65)' }}>Secure intra-platform transfers for users, drivers, and partners</Text>
          </Col>
          <Col>
            <Select 
              value={currency} 
              onChange={setCurrency} 
              style={{ width: 100 }}
              disabled={currentStep > 0}
            >
              <Select.Option value="USD">USD</Select.Option>
              <Select.Option value="ZiG">ZiG</Select.Option>
            </Select>
          </Col>
        </Row>
      </Card>

      <Steps
        current={currentStep}
        style={{ marginBottom: '32px' }}
        items={[
          { title: 'Source', icon: <UserOutlined /> },
          { title: 'Recipient', icon: <ArrowRightOutlined /> },
          { title: 'Transfer', icon: <WalletOutlined /> },
          { title: 'Confirm', icon: <CheckCircleOutlined /> }
        ]}
      />

      <Row gutter={24}>
        <Col span={16}>
          {currentStep === 0 && (
            <Card title="Identify Sender" variant="borderless">
              <Paragraph>Locate the source wallet by phone number, email, or ID.</Paragraph>
              <Space orientation="vertical" style={{ width: '100%' }} size="large">
                <Input 
                  size="large" 
                  placeholder="e.g. +263777123456 or driver@dashdrive.app" 
                  prefix={<UserOutlined />}
                  value={senderIdentifier}
                  onChange={(e) => setSenderIdentifier(e.target.value)}
                  onPressEnter={handleLookupSender}
                />
                <Button 
                  type="primary" 
                  size="large" 
                  block 
                  icon={<SwapOutlined />} 
                  onClick={handleLookupSender}
                  loading={loading}
                  style={{ backgroundColor: '#00cc66', borderColor: '#00cc66' }}
                >
                  Locate Sender Wallet
                </Button>

                {senderData && (
                  <Alert
                    message="Sender Verified"
                    description={
                      <div style={{ marginTop: '8px' }}>
                        <Statistic 
                          title={`Available Balance (${currency})`} 
                          value={senderData.wallet.balance} 
                          precision={2} 
                          valueStyle={{ color: '#00cc66' }}
                        />
                        <div style={{ marginTop: '8px' }}>
                           <Text strong>{senderData.user.name}</Text> <Tag color="blue">{senderData.user.type}</Tag>
                        </div>
                      </div>
                    }
                    type="success"
                    showIcon
                  />
                )}

                <div style={{ textAlign: 'right', marginTop: '16px' }}>
                  <Button type="primary" size="large" onClick={next} disabled={!senderData}>
                    Next: Add Recipient <ArrowRightOutlined />
                  </Button>
                </div>
              </Space>
            </Card>
          )}

          {currentStep === 1 && (
            <Card title="Identify Recipient" variant="borderless">
              <Paragraph>Who are we sending to? Enter their phone, email, or ID.</Paragraph>
              <Space orientation="vertical" style={{ width: '100%' }} size="large">
                <Input 
                  size="large" 
                  placeholder="Recipient phone or email" 
                  prefix={<UserOutlined />}
                  value={recipientIdentifier}
                  onChange={(e) => setRecipientIdentifier(e.target.value)}
                  onPressEnter={handleLookupRecipient}
                />
                <Button 
                  type="primary" 
                  size="large" 
                  block 
                  onClick={handleLookupRecipient}
                  loading={loading}
                >
                  Verify Recipient
                </Button>

                {recipientData && (
                  <Alert
                    message="Recipient Verified"
                    description={
                      <div style={{ marginTop: '8px' }}>
                         <Text strong>{recipientData.user.name}</Text> <Tag color="green">{recipientData.user.type}</Tag>
                         <div style={{ fontSize: '12px', color: 'rgba(0,0,0,0.45)' }}>ID: {recipientData.wallet.id}</div>
                      </div>
                    }
                    type="info"
                    showIcon
                  />
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
                  <Button size="large" onClick={prev}>Back</Button>
                  <Button type="primary" size="large" onClick={next} disabled={!recipientData}>
                    Next: Transfer Details <ArrowRightOutlined />
                  </Button>
                </div>
              </Space>
            </Card>
          )}

          {currentStep === 2 && (
            <Card title="Transfer Details" variant="borderless">
              <Paragraph>Enter the amount and reason for this transfer.</Paragraph>
              <Space orientation="vertical" style={{ width: '100%' }} size="large">
                <Row gutter={16}>
                  <Col span={12}>
                    <Statistic title="Sender Balance" value={senderData.wallet.balance} precision={2} suffix={currency} />
                  </Col>
                  <Col span={12}>
                    <div style={{ textAlign: 'right' }}>
                      <Tag color="cyan">Recipient: {recipientData.user.name}</Tag>
                    </div>
                  </Col>
                </Row>
                
                <Divider />

                <div style={{ textAlign: 'center' }}>
                  <Text type="secondary">Amount to Transfer</Text>
                  <Input 
                    type="number"
                    size="large"
                    prefix={<Text strong>{currency}</Text>}
                    style={{ fontSize: '24px', textAlign: 'center', height: '60px', marginTop: '8px' }}
                    value={amount}
                    onChange={(e) => setAmount(parseFloat(e.target.value))}
                  />
                </div>

                <Input 
                  placeholder="Reason for transfer (Optional)" 
                  size="large"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />

                <Alert
                  type="warning"
                  showIcon
                  icon={<InfoCircleOutlined />}
                  message="Irreversible Action"
                  description="Wallet-to-wallet transfers are atomic and irreversible once processed."
                />

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
                  <Button size="large" onClick={prev}>Back</Button>
                  <Button 
                    type="primary" 
                    size="large" 
                    danger
                    icon={<SendOutlined />}
                    onClick={handleProcessTransfer}
                    loading={loading}
                    disabled={amount <= 0 || amount > senderData.wallet.balance}
                  >
                    Send {currency} {amount.toFixed(2)}
                  </Button>
                </div>
              </Space>
            </Card>
          )}

          {currentStep === 3 && (
            <Result
              status="success"
              title="Transfer Successful"
              subTitle={resultData?.referenceId ? `Reference: ${resultData.referenceId}` : 'Transfer completed successfully'}
              extra={[
                <Button type="primary" key="new" onClick={() => window.location.reload()}>
                  New Transfer
                </Button>,
                <Button key="ledger" onClick={() => setCurrentStep(2)}>View Summary</Button>,
              ]}
            >
              <div style={{ textAlign: 'center', background: '#f5f5f5', padding: '24px', borderRadius: '8px' }}>
                <Paragraph>
                  <Text strong>{currency} {amount.toFixed(2)}</Text> has been moved from 
                  <br />
                  <Text code>{senderData.user.name}</Text> to <Text code>{recipientData.user.name}</Text>
                </Paragraph>
              </div>
            </Result>
          )}
        </Col>

        <Col span={8}>
          <Card title="Security Protocol" variant="borderless">
             <Space orientation="vertical" size="middle">
                <Text type="secondary">This portal is restricted to DashDrive Treasury and Fintech Admin users.</Text>
                <Divider style={{ margin: '12px 0' }} />
                <div>
                    <Tag color="red">AML CHECK</Tag>
                    <Text style={{ fontSize: '12px' }}>Automated screening active</Text>
                </div>
                <div>
                   <Tag color="gold">IDEMPOTENCY</Tag>
                   <Text style={{ fontSize: '12px' }}>Duplicate prevention enabled</Text>
                </div>
                <div>
                   <Tag color="green">LEDGER</Tag>
                   <Text style={{ fontSize: '12px' }}>Double-entry verified</Text>
                </div>
             </Space>
          </Card>
          
          {senderData && (
             <Card title="Sender Summary" style={{ marginTop: '16px' }} size="small">
                <Paragraph style={{ margin: 0 }}>
                    <UserOutlined /> {senderData.user.name}
                    <br />
                    <WalletOutlined /> {senderData.wallet.id}
                </Paragraph>
             </Card>
          )}
        </Col>
      </Row>
    </div>
  );
};

