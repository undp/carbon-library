import { Module } from '@nestjs/common';
import { SharedServicesService } from './shared-services.service';

@Module({
  providers: [SharedServicesService],
  exports: [SharedServicesService],
})
export class SharedServicesModule {}
