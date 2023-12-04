import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min, ValidateIf } from "class-validator";
import { Instrument } from "../enum/instrument.enum";
import { InvestmentType } from "../enum/investment.type";
import { InvestmentLevel } from "../enum/investment.level";
import { InvestmentStream } from "../enum/investment.stream";
import { ESGType } from "../enum/esg.type";
import { InvestmentDto } from "./investment.dto";
import { InvestmentCategoryEnum } from "../enum/investment.category.enum";

export class InvestmentRequestDto extends InvestmentDto{
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  programmeId: string;
  
  @ApiPropertyOptional()
  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  fromCompanyIds: number[];

  @ApiProperty()
  @IsArray()
  @IsNumber({},{each: true})
  @Min(0, { each: true })
  percentage: number[];

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  nationalInvestmentId: number;
}
