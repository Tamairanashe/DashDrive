import React from 'react';
import { Typography, Row, Col, Card, Statistic } from 'antd';
import { DollarOutlined } from '@ant-design/icons';

const { Title } = Typography;

const Earnings: React.FC = () => {
  return (
    <div className="space-y-8">
      <Title level={2} className="!font-black">Earnings & Financials</Title>
      <Row gutter={24}>
        <Col span={8}>
          <Card bordered={false} className="shadow-2xl rounded-[2rem]">
            <Statistic title="Total Payouts" value={15200} prefix={<DollarOutlined />} />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false} className="shadow-2xl rounded-[2rem]">
            <Statistic title="Pending Balance" value={450} prefix={<DollarOutlined />} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Earnings;
