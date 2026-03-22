// src/providers/storage/storage.module.ts

import { Module, Global } from '@nestjs/common';
import { FileStorageService } from './file-storage.service';

@Global()
@Module({
  providers: [FileStorageService],
  exports: [FileStorageService],
})
export class StorageModule {}
