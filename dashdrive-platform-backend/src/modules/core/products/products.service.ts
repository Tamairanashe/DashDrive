import { Injectable, Logger } from '@nestjs/common';

export interface Product {
  id: string;
  name: string;
  provider: string;
  type: string;
  category: 'finance' | 'insurance';
  status: string;
  interestRate?: string;
  premium?: string;
  coverage?: string;
  createdAt: string;
}

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);
  
  // Seed with initial data mimicking the platform state
  private products: Product[] = [
    {
      id: 'PROD-101',
      name: 'Standard Auto Loan',
      provider: 'Capital Drive Bank',
      type: 'Vehicle Financing',
      category: 'finance',
      status: 'Active',
      interestRate: '8.5%',
      createdAt: new Date().toISOString()
    },
    {
      id: 'INS-201',
      name: 'Comprehensive Driver Shield',
      provider: 'Allied Shield Ins.',
      type: 'Driver Incident',
      category: 'insurance',
      status: 'Active',
      premium: '$45/mo',
      coverage: '$100k',
      createdAt: new Date().toISOString()
    }
  ];

  findAll(): Product[] {
    return this.products;
  }

  findByCategory(category: 'finance' | 'insurance'): Product[] {
    return this.products.filter(p => p.category === category);
  }

  create(data: Partial<Product>): Product {
    const newProduct: Product = {
      id: data.category === 'finance' ? `PROD-${Math.floor(Math.random()*1000)}` : `INS-${Math.floor(Math.random()*1000)}`,
      name: data.name || 'Unknown Product',
      provider: data.provider || 'Internal',
      type: data.type || 'Standard',
      category: data.category || 'finance',
      status: data.status || 'Active',
      interestRate: data.interestRate,
      premium: data.premium,
      coverage: data.coverage,
      createdAt: new Date().toISOString()
    };
    
    this.products.push(newProduct);
    this.logger.log(`New Product Created: ${newProduct.name} by ${newProduct.provider}`);
    return newProduct;
  }
}
