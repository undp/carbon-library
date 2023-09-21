import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImporterInterface } from '../importer.interface';
import { AnnualReportGen } from '../../shared/util/annual.report.gen';
import { ProgrammeDocument } from '../../shared/entities/programme.document';
import { DocumentStatus } from '../../shared/enum/document.status';
import { DocType } from '../../shared/enum/document.type';
@Injectable()
export class AnnualReportImport implements ImporterInterface {
  constructor(
    @InjectRepository(ProgrammeDocument)
    private documentRepo: Repository<ProgrammeDocument>,
    private configService: ConfigService,
    private annualReportGen: AnnualReportGen,
  ) {}

  async start(type: string): Promise<any> {
    const annualreporturl =
      await this.annualReportGen.generateAnnualReportpdf();
    const year = Number(new Date().getFullYear()) - 1;
    const d = await this.documentRepo.query(`SELECT "programmeId" FROM public.programme_document WHERE "programmeId"='AR${year}'`)
    const country = this.configService.get('systemCountryName');
    if(d.length <= 0){
      const dr = new ProgrammeDocument();
      dr.programmeId = `AR${year}`;
      dr.externalId = `Annual_Report_${country}_${year}.pdf`;
      dr.status = DocumentStatus.ACCEPTED;
      dr.type = DocType.ANNUAL_REPORT;
      dr.txTime = new Date().getTime();
      dr.url = annualreporturl;
      await this.documentRepo.save(dr);
    }
  }
}
