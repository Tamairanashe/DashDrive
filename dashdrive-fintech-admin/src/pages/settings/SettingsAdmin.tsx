import React from 'react';
import { Typography, Row, Col, Card, Form, InputNumber, Switch, Button, Divider } from 'antd';
import { SaveOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export const SettingsAdmin: React.FC = () => {
  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={2} style={{ margin: 0, color: '#ffffff' }}>Global Threshold Settings</Title>
          <Text type="secondary">Manage the underlying constraints, limits, and auto-approval thresholds across the DashDrive ecosystem.</Text>
        </Col>
        <Col>
          <Button type="primary" style={{ background: '#722ed1', borderColor: '#722ed1' }} icon={<SaveOutlined />}>Commit Global Changes</Button>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card 
            title={<span style={{ color: '#fff' }}>Credit & Risk Limits</span>} 
            bordered={false} 
            style={{ background: '#1f1f1f', borderRadius: 8, height: '100%' }}
            headStyle={{ borderBottom: '1px solid #303030' }}
          >
            <Form layout="vertical">
              <Form.Item label={<Text style={{ color: '#8c8c8c' }}>Maximum BNPL Limit (Standard Tier)</Text>}>
                <InputNumber style={{ width: '100%' }} defaultValue={500} prefix="$" />
              </Form.Item>
              <Form.Item label={<Text style={{ color: '#8c8c8c' }}>Maximum Auto Loan Origination</Text>}>
                <InputNumber style={{ width: '100%' }} defaultValue={50000} prefix="$" />
              </Form.Item>
              <Form.Item label={<Text style={{ color: '#8c8c8c' }}>Auto-Approve Claims Under</Text>} extra="Claims below this amount bypass manual review if heuristic score is low.">
                <InputNumber style={{ width: '100%' }} defaultValue={250} prefix="$" />
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card 
            title={<span style={{ color: '#fff' }}>System Architecture Switches</span>} 
            bordered={false} 
            style={{ background: '#1f1f1f', borderRadius: 8, height: '100%' }}
            headStyle={{ borderBottom: '1px solid #303030' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <Text strong style={{ color: '#fff', display: 'block' }}>Accept External API Loan Originators</Text>
                <Text type="secondary" style={{ fontSize: 12 }}>Allow registered Partner Banks to fund loans via API.</Text>
              </div>
              <Switch defaultChecked />
            </div>
            <Divider style={{ borderColor: '#303030', margin: '16px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <Text strong style={{ color: '#fff', display: 'block' }}>Halt All Insurance Sales</Text>
                <Text type="secondary" style={{ fontSize: 12 }}>Kill-switch: instantly removes Insurance catalog from Rider app.</Text>
              </div>
              <Switch />
            </div>
            <Divider style={{ borderColor: '#303030', margin: '16px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <Text strong style={{ color: '#fff', display: 'block' }}>Strict Fraud Heuristics Mode</Text>
                <Text type="secondary" style={{ fontSize: 12 }}>Lowers the threshold score required to flag transactions as High Risk.</Text>
              </div>
              <Switch defaultChecked />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
