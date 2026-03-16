import React from 'react';
import { Typography, Card, Calendar as AntCalendar, Badge } from 'antd';

const { Title } = Typography;

const Calendar: React.FC = () => {
  const dateCellRender = (value: any) => {
    if (value.date() === 20) {
      return <Badge status="success" text="Booked" />;
    }
    return null;
  };

  return (
    <div className="space-y-8">
      <Title level={2} className="!font-black">Availability Calendar</Title>
      <Card bordered={false} className="shadow-2xl rounded-[2rem] overflow-hidden p-4">
        <AntCalendar dateCellRender={dateCellRender} />
      </Card>
    </div>
  );
};

export default Calendar;
