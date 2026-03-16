import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CountriesService } from './countries.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('countries')
@Controller('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all active countries' })
  findAll() {
    return this.countriesService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Create a new country' })
  create(
    @Body()
    body: {
      name: string;
      code: string;
      currency: string;
      timezone: string;
    },
  ) {
    return this.countriesService.create(body);
  }
}
