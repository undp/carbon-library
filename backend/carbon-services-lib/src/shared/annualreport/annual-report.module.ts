import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AcceptLanguageResolver, I18nModule, QueryResolver } from "nestjs-i18n";
import * as path from "path";
import { TypeOrmModule } from "@nestjs/typeorm";
import configuration from "../configuration";
import { Counter } from "../entities/counter.entity";
import { Country } from "../entities/country.entity";
import { User } from "../entities/user.entity";
import { ConfigurationSettings } from "../entities/configuration.settings";
import { FileHandlerModule } from "../file-handler/filehandler.module";
import { AnnualReportGen } from "./annual.report.gen";
import { Programme } from "../entities/programme.entity";
import { ProgrammeTransfer } from "../entities/programme.transfer";
import { Company } from "../entities/company.entity";
import { ProgrammeLedgerModule } from "../programme-ledger/programme-ledger.module";
import { Investment } from "../entities/investment.entity";
import { ProgrammeModule } from "../programme/programme.module";
import { CompanyModule } from "../company/company.module";
import { UserModule } from "../user/user.module";
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: [`.env.${process.env.NODE_ENV}`, `.env`],
    }),
    TypeOrmModule.forFeature([
      Counter,
      Country,
      Company,
      User,
      Programme,
      Investment,
      ProgrammeTransfer,
      ConfigurationSettings,
    ]),
    FileHandlerModule,
    ProgrammeLedgerModule,
    ProgrammeModule,
    CompanyModule,
    UserModule
  ],
  providers: [
    Logger,
    AnnualReportGen,
  ],
  exports: [
    AnnualReportGen,
  ],
})
export class AnnualReportModule {}
