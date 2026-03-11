import { EnrichedLead } from './EnrichmentService';

export type ApplicationStatus = 'submitted' | 'underwriting' | 'approved' | 'declined' | 'funded';

export interface LoanApplication {
  id: string;
  leadId: string;
  borrowerId: string;
  productId?: string;
  productType: string;
  requestedAmount: number;
  vehicleCost?: number;
  downPaymentAmount?: number;
  status: ApplicationStatus;
  decision?: 'approved' | 'rejected' | 'counter';
  approvedAmount?: number;
  approvedApr?: number;
  approvedTermMonths?: number;
  underwriterId?: string;
  created_at: string;
  updated_at: string;
}

export class ApplicationService {
  private static applications: Map<string, LoanApplication> = new Map();

  static createFromLead(lead: EnrichedLead): LoanApplication {
    const application: LoanApplication = {
      id: `APP-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      leadId: lead.leadId,
      borrowerId: lead.userId,
      productId: `PROD-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      productType: lead.productType,
      requestedAmount: lead.requestedAmount,
      vehicleCost: lead.vehicleCost,
      downPaymentAmount: lead.downPaymentAmount,
      status: 'submitted',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.applications.set(application.id, application);
    return application;
  }

  static getApplication(id: string): LoanApplication | undefined {
    return this.applications.get(id);
  }

  static updateStatus(id: string, status: ApplicationStatus): LoanApplication | undefined {
    const app = this.applications.get(id);
    if (app) {
      app.status = status;
      app.updated_at = new Date().toISOString();
      this.applications.set(id, app);
      return app;
    }
    return undefined;
  }

  static setDecision(id: string, decision: LoanApplication['decision'], terms?: Partial<LoanApplication>): LoanApplication | undefined {
    const app = this.applications.get(id);
    if (app) {
      app.decision = decision;
      if (terms) {
        Object.assign(app, terms);
      }
      app.updated_at = new Date().toISOString();
      this.applications.set(id, app);
      return app;
    }
    return undefined;
  }

  static listApplications(): LoanApplication[] {
    return Array.from(this.applications.values());
  }
}
