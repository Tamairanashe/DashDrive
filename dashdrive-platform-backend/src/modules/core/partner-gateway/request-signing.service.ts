import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class RequestSigningService {
  /**
   * Verify an HMAC signature for incoming requests
   * @param payload The request body as a string
   * @param signature The signature from the header
   * @param secret The partner's shared secret
   */
  verifySignature(payload: string, signature: string, secret: string): boolean {
    const computedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');

    if (computedSignature !== signature) {
      throw new UnauthorizedException('Invalid request signature');
    }

    return true;
  }

  /**
   * Generate a signature (useful for internal testing or outbound webhooks)
   */
  generateSignature(payload: string, secret: string): string {
    return crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');
  }
}
