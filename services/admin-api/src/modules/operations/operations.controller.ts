// modules/operations/operations.controller.ts
import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { OperationsService } from "./operations.service";
import { ApplySurgeDto } from "./dto/apply-surge.dto";
import { NotifyFleetDto } from "./dto/notify-fleet.dto";
import { WidenRadiusDto } from "./dto/widen-radius.dto";
import { BroadcastIncentiveDto } from "./dto/broadcast-incentive.dto";
import { HeatMapFilterDto } from "./dto/heatmap-filter.dto";
import { Get, Query } from "@nestjs/common";

@Controller("admin/operations")
export class OperationsController {
  constructor(private readonly operationsService: OperationsService) {}

  @Post("surge/apply")
  async applySurge(@Body() dto: ApplySurgeDto) {
    return this.operationsService.applySurge(dto);
  }

  @Post("notifications/fleet")
  async notifyFleet(@Body() dto: NotifyFleetDto) {
    return this.operationsService.notifyFleet(dto);
  }

  @Post("radius/widen")
  async applyWidenRadius(@Body() dto: WidenRadiusDto) {
    return this.operationsService.widenRadius(dto);
  }

  @Post("incentives/broadcast")
  async broadcastIncentive(@Body() dto: BroadcastIncentiveDto) {
    return this.operationsService.broadcastIncentive(dto);
  }

  @Get("heatmap")
  async getHeatMapData(@Query() filters: HeatMapFilterDto) {
    try {
      return await this.operationsService.getHeatMapData(filters);
    } catch (error) {
      console.error("HeatMap Controller Error:", error);
      throw error;
    }
  }
}
