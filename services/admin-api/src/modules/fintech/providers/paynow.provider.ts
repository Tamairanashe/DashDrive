import { Injectable, BadRequestException } from '@nestjs/common';
import axios from 'axios';
import * as crypto from 'crypto';

@Injectable()
export class PaynowProvider {
  private readonly credentials: Record<string, { id: string; key: string }> = {
    ZiG: {
      id: process.env.PAYNOW_ID_ZIG || '22100',
      key: process.env.PAYNOW_KEY_ZIG || 'b668aada-b617-4903-90ee-dd6cb756bc03-ZiG',
    },
    USD: {
      id: process.env.PAYNOW_ID_USD || '22095',
      key: process.env.PAYNOW_KEY_USD || '7a0c4402-2e8e-4f5a-bf6b-19a09ca9b32a-USD',
    },
  };

  private readonly initiateUrl = 'https://www.paynow.co.zw/interface/initiatetransaction';

  async initiate(data: {
    reference: string;
    amount: number;
    currency: string;
    authEmail: string;
    additionalInfo: string;
    returnUrl: string;
    resultUrl: string;
  }) {
    const creds = this.credentials[data.currency.toUpperCase()] || this.credentials['USD'];
    
    const payload: any = {
      id: creds.id,
      reference: data.reference,
      amount: data.amount.toFixed(2),
      additionalinfo: data.additionalInfo,
      returnurl: data.returnUrl,
      resulturl: data.resultUrl,
      authemail: data.authEmail,
      status: 'Message',
    };

    // Calculate hash using only standard fields (excluding additionalinfo if it causes issues)
    const { additionalinfo, ...hashPayload } = payload;
    payload.hash = this.generateHash(hashPayload, creds.key);

    const formData = new URLSearchParams();
    for (const key in payload) {
      formData.append(key, payload[key]);
    }

    const response = await axios.post(this.initiateUrl, formData.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    return this.parseResponse(response.data);
  }

  /**
   * For BillPay / Aggregator verification
   * Note: This usually requires a specific Integration ID with Aggregator permissions
   */
  async validateUtilityAccount(data: {
    billerCode: string;
    accountNumber: string;
    currency: string;
  }) {
    // Note: Verification URLs vary, often specific to the aggregator integration
    // For demonstration, we'll assume a standard Paynow verification endpoint pattern
    const verifyUrl = 'https://www.paynow.co.zw/interface/validateaccount';
    const creds = this.credentials[data.currency.toUpperCase()] || this.credentials['USD'];

    const payload: any = {
      id: creds.id,
      billercode: data.billerCode,
      accountnumber: data.accountNumber,
      status: 'Message',
    };

    payload.hash = this.generateHash(payload, creds.key);

    const formData = new URLSearchParams();
    for (const key in payload) {
      formData.append(key, payload[key]);
    }

    try {
      const response = await axios.post(verifyUrl, formData.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      return this.parseResponse(response.data);
    } catch (err) {
      console.error('Utility account verification failed:', err);
      return { status: 'Error', error: 'Connection failed' };
    }
  }

  private generateHash(data: any, key: string) {
    let concat = '';
    const keys = Object.keys(data).filter(k => k !== 'hash').sort();
    for (const keyOfData of keys) {
      concat += data[keyOfData];
    }
    concat += key;
    console.log('[Paynow] Hash Input:', concat);
    const hash = crypto.createHash('sha512').update(concat).digest('hex').toUpperCase();
    console.log('[Paynow] Generated Hash (SHA512):', hash);
    return hash;
  }

  verifyHash(data: any, currency: string): boolean {
    const creds = this.credentials[currency.toUpperCase()] || this.credentials['USD'];
    const { hash, ...rest } = data;
    const generated = this.generateHash(rest, creds.key);
    return generated === hash;
  }

  private parseResponse(queryString: string) {
    const params = new URLSearchParams(queryString);
    const result: any = {};
    for (const [key, value] of params.entries()) {
      result[key] = value;
    }
    return result;
  }

  async checkStatus(pollUrl: string) {
    const response = await axios.get(pollUrl);
    return this.parseResponse(response.data);
  }
}
