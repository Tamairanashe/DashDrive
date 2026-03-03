import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { InventoryService } from './inventory.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [ProductsController],
    providers: [ProductsService, InventoryService],
    exports: [ProductsService, InventoryService],
})
export class ProductsModule { }
