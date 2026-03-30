// src/providers/storage/file-storage.service.ts

import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { Readable } from 'stream';

@Injectable()
export class FileStorageService {
  private readonly logger = new Logger(FileStorageService.name);
  private readonly uploadDir = path.join(process.cwd(), 'uploads', 'exports');

  constructor() {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async putObject(input: {
    fileName: string;
    contentType: string;
    buffer: Buffer;
  }): Promise<{ path: string }> {
    const filePath = path.join(this.uploadDir, input.fileName);
    
    try {
      fs.writeFileSync(filePath, input.buffer);
      this.logger.log(`File stored successfully at ${filePath}`);
      return { path: filePath };
    } catch (err) {
      this.logger.error(`Failed to store file at ${filePath}`, err);
      throw err;
    }
  }

  async createReadStream(filePath: string): Promise<Readable> {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found at path: ${filePath}`);
    }
    return fs.createReadStream(filePath);
  }

  async deleteFile(filePath: string): Promise<void> {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}
