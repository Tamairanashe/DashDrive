import { Module, forwardRef } from '@nestjs/common';
import { ApiKeyGuard } from './api-key.guard';
import { FirebaseService } from './firebase.service';
import { FirebaseAuthGuard } from './firebase-auth.guard';
import { AuthController } from './auth.controller';
import { UserModule } from '../users/user.module';

@Module({
  imports: [forwardRef(() => UserModule)],
  controllers: [AuthController],
  providers: [ApiKeyGuard, FirebaseService, FirebaseAuthGuard],
  exports: [ApiKeyGuard, FirebaseService, FirebaseAuthGuard],
})
export class AuthModule {}
