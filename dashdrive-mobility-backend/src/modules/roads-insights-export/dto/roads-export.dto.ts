// src/modules/roads-insights-export/dto/roads-export.dto.ts

import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum RoadsExportFormat {
  PDF = 'pdf',
  CSV = 'csv',
  JSON = 'json',
  PNG = 'png',
}

export class RoadsFiltersDto {
  @IsOptional() @IsArray() dateRange?: string[];
  @IsOptional() @IsString() cityId?: string;
  @IsOptional() @IsString() zoneId?: string;
  @IsOptional() @IsArray() roadType?: string[];
  @IsOptional() @IsArray() serviceType?: string[];
  @IsOptional() @IsArray() severity?: string[];
  @IsOptional() @IsArray() incidentStatus?: string[];
  @IsOptional() @IsString() mode?: 'live' | 'historical';
}

export class RoadsLayersDto {
  @IsBoolean() traffic!: boolean;
  @IsBoolean() congestion!: boolean;
  @IsBoolean() incidents!: boolean;
  @IsBoolean() speedLimits!: boolean;
  @IsBoolean() routeReliability!: boolean;
  @IsBoolean() riskZones!: boolean;
  @IsBoolean() corridors!: boolean;
  @IsBoolean() vehicleTraces!: boolean;
}

export class RoadsExportDto {
  @IsString()
  @MaxLength(150)
  title!: string;

  @IsEnum(RoadsExportFormat)
  format!: RoadsExportFormat;

  @IsBoolean()
  includeMapSnapshot!: boolean;

  @IsBoolean()
  includeKpis!: boolean;

  @IsBoolean()
  includeAnalytics!: boolean;

  @IsBoolean()
  includeTables!: boolean;

  @IsBoolean()
  includeActiveFilters!: boolean;

  @IsBoolean()
  includeEnabledLayers!: boolean;

  @ValidateNested()
  @Type(() => RoadsFiltersDto)
  filters!: RoadsFiltersDto;

  @ValidateNested()
  @Type(() => RoadsLayersDto)
  layers!: RoadsLayersDto;

  @IsOptional()
  @IsArray()
  tables?: Array<'topDelayedRoads' | 'routePerformance'>;

  @IsOptional()
  @IsString()
  mapSnapshotBase64?: string;
}
