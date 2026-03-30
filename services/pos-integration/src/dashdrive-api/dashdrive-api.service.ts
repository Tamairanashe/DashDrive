import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class DashDriveApiService {
    private readonly baseUrl = process.env.DASHDRIVE_BACKEND_URL;
    private readonly apiKey = process.env.DASHDRIVE_API_KEY;

    constructor(private readonly httpService: HttpService) { }

    async pushMenu(merchantId: string, menuPayload: any) {
        // Will push normalized menu to DashDrive
        console.log(`[DashDrive API] Pushing menu for ${merchantId}`);
        return { success: true };
    }

    async pushOrder(merchantId: string, orderPayload: any) {
        // Will inject POS order into DashDrive
        console.log(`[DashDrive API] Pushing order for ${merchantId}`);
        return { success: true };
    }

    async pushInventory(merchantId: string, itemUpdates: any[]) {
        // Will push inventory updates to DashDrive
        console.log(`[DashDrive API] Pushing inventory for ${merchantId}`);
        return { success: true };
    }
}
