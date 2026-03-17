import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class LogisticsIntegrationService {
  private readonly logger = new Logger(LogisticsIntegrationService.name);
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor(private configService: ConfigService) {
    this.baseUrl = this.configService.get<string>('LOGISTICS_ENGINE_URL') || 'http://localhost:3000/api/v1';
    this.apiKey = this.configService.get<string>('LOGISTICS_API_KEY') || '';
  }

  async provisionRider(userData: {
    userId: string;
    name: string;
    phone: string;
    vehicleType: string;
  }) {
    try {
      this.logger.log(`Provisioning rider in Logistics Engine for user ${userData.userId}`);
      const response = await axios.post(
        `${this.baseUrl}/riders`,
        {
          userId: userData.userId,
          name: userData.name,
          phone: userData.phone,
          vehicleType: userData.vehicleType,
          countryCode: 'ZW', // Default country code for now
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      this.logger.error(
        `Failed to provision rider in Logistics Engine: ${error.message}`,
        error.response?.data,
      );
      // We don't throw here to avoid failing the main user upgrade, 
      // but in production we might use a retry queue.
      return null;
    }
  }
}
