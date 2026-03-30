import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private firebaseApp: admin.app.App;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const projectId = this.configService.get<string>('FIREBASE_PROJECT_ID');
    
    if (!admin.apps.length) {
      this.firebaseApp = admin.initializeApp({
        projectId,
      });
    } else {
      this.firebaseApp = admin.app();
    }
  }

  async verifyIdToken(idToken: string): Promise<admin.auth.DecodedIdToken> {
    try {
      return await admin.auth(this.firebaseApp).verifyIdToken(idToken);
    } catch (error) {
      console.error('Firebase token verification failed:', error);
      throw error;
    }
  }

  async getUser(uid: string): Promise<admin.auth.UserRecord> {
    return await admin.auth(this.firebaseApp).getUser(uid);
  }
}
