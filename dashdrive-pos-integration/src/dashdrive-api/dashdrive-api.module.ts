import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { DashDriveApiService } from './dashdrive-api.service';

@Module({
    imports: [HttpModule],
    providers: [DashDriveApiService],
    exports: [DashDriveApiService],
})
export class DashDriveApiModule { }
