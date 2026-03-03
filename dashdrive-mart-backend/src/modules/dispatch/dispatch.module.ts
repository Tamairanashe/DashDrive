import { Module, Global } from '@nestjs/common';
import { DispatchService } from './dispatch.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Global()
@Module({
    imports: [PrismaModule],
    providers: [DispatchService],
    exports: [DispatchService],
})
export class DispatchModule { }
