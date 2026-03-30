import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as admin from 'firebase-admin';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async syncUser(firebaseUser: admin.auth.DecodedIdToken): Promise<any> {
    try {
      // Upsert user based on Firebase UID (stored in id or a new firebaseUid field)
      // For now we'll use email as the primary key or unique constraint as per existing schema
      const email = firebaseUser.email;
      if (!email) throw new InternalServerErrorException('Firebase user has no email');

      const user = await this.prisma.user.upsert({
        where: { email },
        update: {
          // Update any metadata if needed
          full_name: firebaseUser.name || '',
        },
        create: {
          email,
          password_hash: '', // Firebase handles passwords
          full_name: firebaseUser.name || '',
          active_mode: 'DRIVER', // Default to driver/customer
        },
        include: { hostProfile: true },
      });

      return user;
    } catch (error) {
      console.error('Error syncing user with Prisma:', error);
      throw new InternalServerErrorException('Failed to sync user data');
    }
  }

  async validateUser(email: string, pass: string): Promise<any> {
    // Legacy basic validation
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { hostProfile: true }
    });
    if (user && user.password_hash === pass) {
      const { password_hash, ...result } = user;
      return result;
    }
    return null;
  }
}
