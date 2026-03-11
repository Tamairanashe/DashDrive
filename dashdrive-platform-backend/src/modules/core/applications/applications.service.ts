import { Injectable, Logger } from '@nestjs/common';

export interface Application {
  id: string;
  applicant: string;
  productId: string;
  partnerId: string;
  source: 'Financier Portal' | 'Insurance Portal' | 'Rider App';
  status: string;
  requestedValue?: string;
  createdAt: string;
}

@Injectable()
export class ApplicationsService {
  private readonly logger = new Logger(ApplicationsService.name);
  
  private applications: Application[] = [
    {
      id: 'APP-9901',
      applicant: 'Marcus Johnson',
      productId: 'PROD-101',
      partnerId: 'Capital Drive Bank',
      source: 'Financier Portal',
      status: 'Underwriting',
      requestedValue: '$15,000',
      createdAt: new Date().toISOString()
    }
  ];

  findAll(): Application[] {
    return this.applications;
  }

  findByPartnerId(partnerId: string): Application[] {
    return this.applications.filter(a => a.partnerId === partnerId);
  }

  create(data: Partial<Application>): Application {
    const newApp: Application = {
      id: `APP-${Math.floor(Math.random()*10000)}`,
      applicant: data.applicant || 'Unknown User',
      productId: data.productId || 'Unknown',
      partnerId: data.partnerId || 'Internal',
      source: data.source || 'Rider App',
      status: data.status || 'Pending',
      requestedValue: data.requestedValue,
      createdAt: new Date().toISOString()
    };
    
    this.applications.push(newApp);
    this.logger.log(`New Application Received: ${newApp.id} for Product ${newApp.productId}`);
    return newApp;
  }
}
