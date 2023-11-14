import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
import { SectoralScope } from '@undp/serial-number-gen';
import { ProgrammeProperties } from './programme.properties';
import { Sector } from '../enum/sector.enum';
import { Type } from 'class-transformer';
import { NDCActionDto } from './ndc.action.dto';
import { EmissionEnergyEmissions } from './emission.energy.emissions';
import { EmissionIndustrialProcessesProductUse } from './emission.industrial.processes.product.use';
import { EmissionAgricultureForestryOtherLandUse } from './emission.agriculture.forestry.other.land.use';
import { EmissionWaste } from './emission.waste';
import { EmissionOther } from './emission.other';
import { EmissionProperties } from './emission.properties';

export class EmissionDto {
  @ApiProperty()
  @IsNotEmpty()
  year: string;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => EmissionEnergyEmissions)
  energyEmissions: EmissionEnergyEmissions;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => EmissionIndustrialProcessesProductUse)
  industrialProcessesProductUse: EmissionIndustrialProcessesProductUse;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => EmissionAgricultureForestryOtherLandUse)
  agricultureForestryOtherLandUse: EmissionAgricultureForestryOtherLandUse;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => EmissionWaste)
  waste: EmissionWaste;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => EmissionOther)
  other: EmissionOther;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => EmissionProperties)
  totalCo2WithoutLand: EmissionProperties;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => EmissionProperties)
  totalCo2WithLand: EmissionProperties;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  emissionDocument?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  state: string;
}
