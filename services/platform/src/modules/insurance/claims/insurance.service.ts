import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class InsuranceService {
  private readonly logger = new Logger(InsuranceService.name);

  constructor(private prisma: PrismaService) {}

  async submitClaim(data: {
    policyId: string;
    userId: string;
    incidentType: string;
    description: string;
    amountClaimed?: number;
    incidentReport?: {
      location?: string;
      incidentAt: string;
      narrative: string;
    };
    attachments?: {
      url: string;
      fileType: string;
    }[];
  }) {
    return (this.prisma as any).$transaction(async (tx: any) => {
      // 1. Create Claim
      const claim = await tx.claim.create({
        data: {
          policy_id: data.policyId,
          user_id: data.userId,
          incident_type: data.incidentType,
          description: data.description,
          amount_claimed: data.amountClaimed,
          status: 'submitted',
        }
      });

      // 2. Create Incident Report if provided
      if (data.incidentReport) {
        await tx.incidentReport.create({
          data: {
            claim_id: claim.id,
            location: data.incidentReport.location,
            incident_at: new Date(data.incidentReport.incidentAt),
            narrative: data.incidentReport.narrative,
          }
        });
      }

      // 3. Create Attachments if provided
      if (data.attachments && data.attachments.length > 0) {
        await tx.claimAttachment.createMany({
          data: data.attachments.map(a => ({
            claim_id: claim.id,
            url: a.url,
            file_type: a.fileType,
          }))
        });
      }

      return tx.claim.findUnique({
        where: { id: claim.id },
        include: {
          attachments: true,
          incident_report: true,
          policy: true,
        }
      });
    }, { timeout: 15000 });
  }

  async updateClaimStatus(claimId: string, status: string) {
    return (this.prisma as any).claim.update({
      where: { id: claimId },
      data: { status }
    });
  }
}
