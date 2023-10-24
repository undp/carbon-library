import { Test, TestingModule } from '@nestjs/testing';
import { CadtApiService } from './cadt.api.service';
import { SectoralScope } from '@undp/serial-number-gen';
import { Sector } from '../enum/sector.enum';
import { ProgrammeStage } from '../enum/programme-status.enum';
import { TxType } from '../enum/txtype.enum';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from '../configuration';
import { Logger } from '@nestjs/common';
import { CompanyService } from '../company/company.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Programme } from '../entities/programme.entity';
import { Company } from '../entities/company.entity';
import { CompanyModule } from '../company/company.module';
import { TypeOrmConfigService } from '../typeorm.config.service';
import { UserModule } from '../user/user.module';
import { CaslModule } from '../casl/casl.module';
import { UtilModule } from '../util/util.module';
import { ProgrammeTransfer } from '../entities/programme.transfer';
import { ProgrammeLedgerModule } from '../programme-ledger/programme-ledger.module';
import { EmailHelperModule } from '../email-helper/email-helper.module';
import { FileHandlerModule } from '../file-handler/filehandler.module';
import { LocationModule } from '../location/location.module';
import { AsyncOperationsModule } from '../async-operations/async-operations.module';

describe('CadtApiService', () => {
  let service: CadtApiService;

  jest.useRealTimers();
  jest.setTimeout(30000);

  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [configuration],
          envFilePath: [`.env.${process.env.NODE_ENV}`, `.env`]
        }),
        CompanyModule,
        TypeOrmModule.forFeature([Company, ProgrammeTransfer, Programme]),
        TypeOrmModule.forRootAsync({
          useClass: TypeOrmConfigService,
          imports: undefined
        }),
        UserModule,
        CaslModule,
        CompanyModule,
        UtilModule,
        ProgrammeLedgerModule,
        EmailHelperModule,
        FileHandlerModule,
        LocationModule,
        AsyncOperationsModule
      ],
      providers: [ConfigService, Logger, CompanyService, CadtApiService],
    }).compile();

    service = module.get<CadtApiService>(CadtApiService);
  });

  it('should be defined', async () => {
    expect(service).toBeDefined();
    await service.createProgramme({
      programmeId: '123',
      serialNo: '1223',
      title: 'Testing',
      externalId: '',
      sectoralScope: SectoralScope.EnergyIndustry,
      sector: Sector.Energy,
      countryCodeA2: 'NG',
      currentStage: ProgrammeStage.AWAITING_AUTHORIZATION,
      startTime: new Date().getTime(),
      endTime: new Date().getTime() + 20000000,
      creditEst: 100,
      emissionReductionExpected: 0,
      emissionReductionAchieved: 0,
      creditChange: 0,
      creditIssued: 0,
      creditBalance: 0,
      creditRetired: [],
      creditFrozen: [],
      creditTransferred: [],
      constantVersion: '',
      proponentTaxVatId: [],
      companyId: [1],
      proponentPercentage: [],
      creditOwnerPercentage: [],
      certifierId: [],
      revokedCertifierId: [],
      creditUnit: '',
      programmeProperties: undefined,
      txTime: 0,
      createdTime: 0,
      authTime: 0,
      creditUpdateTime: 0,
      statusUpdateTime: 0,
      certifiedTime: 0,
      txRef: '',
      txType: TxType.CREATE,
      geographicalLocationCordintes: undefined,
      cadtId: '',
      environmentalAssessmentRegistrationNo: '',
      createdAt: undefined,
      updatedAt: undefined
    })
  });
});
