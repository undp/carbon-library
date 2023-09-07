import { Logger, Module } from '@nestjs/common';
import { RegistryClientService } from './registry-client.service';
import { ConfigModule } from '@nestjs/config';
import configuration from '../configuration';
import { UtilModule } from '../util/util.module';
import { CompanyModule } from '../company/company.module';
import { ProgrammeModule } from '../programme/programme.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProgrammeDocument } from '../entities/programme.document';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: [`.env.${process.env.NODE_ENV}`, `.env`],
    }),
    TypeOrmModule.forFeature([
      ProgrammeDocument
    ]),
    UtilModule,
    CompanyModule,
    ProgrammeModule
  ],
  providers: [RegistryClientService, Logger],
  exports: [RegistryClientService]
})
export class RegistryClientModule {}
