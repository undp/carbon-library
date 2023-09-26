import { ApiProperty } from "@nestjs/swagger";
import { BuildingType } from "@undp/carbon-credit-calculator";
import { IsNotEmpty, IsPositive, IsNumber, IsEnum } from "class-validator";
import { MitigationProperties } from "./mitigation.properties";

export class SolarProperties {
    
    @ApiProperty()
    @IsNotEmpty()
    @IsPositive()
    @IsNumber()
    energyGeneration: number;

    @ApiProperty({default: "kWh/year/unit"})
    @IsNotEmpty()
    energyGenerationUnit: string;

    @ApiProperty({ enum: BuildingType })
    @IsEnum(BuildingType, {
        message: 'Invalid consumer group. Supported following values:' + Object.values(BuildingType)
    })
    consumerGroup: BuildingType;
}