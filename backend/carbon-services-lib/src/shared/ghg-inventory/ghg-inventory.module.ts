import { Module } from '@nestjs/common';
import { GhgEmissionsService } from './ghg-emissions/ghg-emissions.service';
import { GhgProjectionsService } from './ghg-projections/ghg-projections.service';

@Module({
  providers: [GhgEmissionsService, GhgProjectionsService]
})
export class GhgInventoryModule {}
