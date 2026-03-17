import { Controller, Post, Body, UnauthorizedException, Inject, forwardRef } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import { UserService } from '../users/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly firebaseService: FirebaseService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  @Post('login')
  async login(@Body('idToken') idToken: string) {
    try {
      const decodedToken = await this.firebaseService.verifyIdToken(idToken);
      const user = await this.userService.findOne(decodedToken.uid);
      if (!user) {
        // Auto-register or sync
        return this.userService.syncUser(decodedToken);
      }
      return { user, token: idToken };
    } catch (error) {
      throw new UnauthorizedException('Authentication failed');
    }
  }

  @Post('register')
  async register(@Body() data: any) {
    // Firebase handles actual registration on client, this is for profile sync
    return this.userService.syncUser(data);
  }
}
