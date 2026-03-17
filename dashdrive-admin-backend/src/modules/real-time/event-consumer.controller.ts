import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { PlatformEvent } from '../../common/events/platform-events';
import { RealTimeGateway } from './real-time.gateway';

@Controller()
export class EventConsumer {
  constructor(private readonly realTimeGateway: RealTimeGateway) {}

  @EventPattern('order.*')
  handleOrderEvents(@Payload() data: any) {
    // This will catch order.created, order.confirmed, etc.
    this.realTimeGateway.broadcastEvent('ORDER_UPDATE', data);
  }

  @EventPattern('ride.*')
  handleRideEvents(@Payload() data: any) {
    this.realTimeGateway.broadcastEvent('RIDE_UPDATE', data);
  }

  @EventPattern('fraud.alert')
  handleFraudAlerts(@Payload() data: any) {
    this.realTimeGateway.broadcastEvent('FRAUD_ALERT', data);
  }

  @EventPattern('inventory.*')
  handleInventoryEvents(@Payload() data: any) {
    this.realTimeGateway.broadcastEvent('INVENTORY_ALERT', data);
  }
}
