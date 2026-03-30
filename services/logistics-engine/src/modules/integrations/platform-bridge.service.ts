import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class PlatformBridgeService {
  private readonly logger = new Logger(PlatformBridgeService.name);
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor(private configService: ConfigService) {
    this.baseUrl = this.configService.get<string>('PLATFORM_BACKEND_URL') || 'http://localhost:3004';
    this.apiKey = this.configService.get<string>('SYSTEM_API_KEY') || 'mock-key';
  }

  async getStudentDetails(studentId: string) {
    try {
      const response = await axios.get(`${this.baseUrl}/api/core/students/${studentId}`, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      });
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to fetch student ${studentId}: ${error.message}`);
      throw error;
    }
  }

  async getSchoolDetails(schoolId: string) {
    try {
      const response = await axios.get(`${this.baseUrl}/api/core/schools/${schoolId}`, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      });
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to fetch school ${schoolId}: ${error.message}`);
      throw error;
    }
  }
}
