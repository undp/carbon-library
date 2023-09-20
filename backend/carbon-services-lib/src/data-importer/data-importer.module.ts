import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataImporterService } from './data-importer.service';
import { Programme } from '../shared/entities/programme.entity';
import configuration from '../shared/configuration';
import { CompanyModule } from '../shared/company/company.module';
import { UserModule } from '../shared/user/user.module';
import { ProgrammeModule } from '../shared/programme/programme.module';
import { TypeOrmConfigService } from '../shared/typeorm.config.service';
import { Company } from '../shared/entities/company.entity';
import { ProgrammeDocument } from '../shared/entities/programme.document';
import { UtilModule } from '../shared/util/util.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: [`.env.${process.env.NODE_ENV}`, `.env`],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    TypeOrmModule.forFeature([
      Programme,
      Company,
      ProgrammeDocument,
    ]),
    ProgrammeModule,
    CompanyModule,
    UserModule,
    UtilModule
    
  ],
  providers: [Logger, DataImporterService],
})
export class DataImporterModule {}
