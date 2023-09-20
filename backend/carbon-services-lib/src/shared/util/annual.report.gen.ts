import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { FileHandlerInterface } from '../file-handler/filehandler.interface';
const PDFDocument = require('pdfkit');
const fs = require('fs');
import { Programme } from '../entities/programme.entity';
import { ProgrammeTransfer } from '../entities/programme.transfer';
import { Company } from '../entities/company.entity';

@Injectable()
export class AnnualReportGen {
  constructor(
    @InjectRepository(Programme) private programmeRepo: Repository<Programme>,
    @InjectRepository(Company) private CompanyRepo: Repository<Company>,
    @InjectRepository(ProgrammeTransfer)
    private programmeTransfer: Repository<ProgrammeTransfer>,
    private configService: ConfigService,
    private fileHandler: FileHandlerInterface,
  ) {}

  async generateAnnualReportpdf() {
    const country = this.configService.get('systemCountryName');
    const host = this.configService.get('host');
    const date = Number(new Date().getFullYear()) - 1;
    //Report in PDF format
    const doc = new PDFDocument({ margin: 30, size: 'B0' });
    const stream = fs.createWriteStream(
      './tmp/' + `Annual_Report_${country}_${date}.pdf`,
    );
    doc.pipe(stream);
    doc.font('Times-Roman');
    doc.fontSize(11);
    doc.font('Times-Bold').fontSize(11).text('\n\nTable 1: Heading');
    doc
      .lineCap('butt')
      .strokeColor('#000000')
      .lineWidth(2)
      .moveTo(26, 73)
      .lineTo(250, 73)
      .stroke();
    doc
      .font('Times-Bold')
      .fontSize(11)
      .text('\nParty', {
        continued: true,
      })
      .lineGap(5)
      .font('Times-Roman')
      .text(`                                            ${country}`);
    doc
      .font('Times-Bold')
      .fontSize(11)
      .text('Reported year(a)', {
        continued: true,
      })
      .font('Times-Roman')
      .text(`                             ${date}`);
    doc
      .lineCap('butt')
      .strokeColor('#000000')
      .lineWidth(2)
      .moveTo(26, 120)
      .lineTo(250, 120)
      .stroke();

    doc.text(
      '\n(a) The annual period from 1 January to 31 December during which actions occurred.',
    );

    doc.font('Times-Bold').fontSize(11).text('\n\nTable 2: Actions');
    // Table 2 Main Line
    doc
      .lineCap('butt')
      .strokeColor('#000000')
      .lineWidth(1)
      .moveTo(26, 205)
      .lineTo(2625, 205)
      .stroke();
    // ITMO Line
    doc
      .lineCap('butt')
      .strokeColor('#000000')
      .lineWidth(1)
      .moveTo(225, 225)
      .lineTo(1400, 225)
      .stroke();
    // Actions Line
    doc
      .lineCap('butt')
      .strokeColor('#000000')
      .lineWidth(1)
      .moveTo(1920, 225)
      .lineTo(2625, 225)
      .stroke();
    // Unique identifier Line
    doc
      .lineCap('butt')
      .strokeColor('#000000')
      .lineWidth(1)
      .moveTo(225, 245)
      .lineTo(600, 245)
      .stroke();
    // Metric and quantity Line
    doc
      .lineCap('butt')
      .strokeColor('#000000')
      .lineWidth(1)
      .moveTo(630, 245)
      .lineTo(1000, 245)
      .stroke();
    // ITMO details Line
    doc
      .lineCap('butt')
      .strokeColor('#000000')
      .lineWidth(1)
      .moveTo(1025, 245)
      .lineTo(1400, 245)
      .stroke();
    // Authorization Line
    doc
      .lineCap('butt')
      .strokeColor('#000000')
      .lineWidth(1)
      .moveTo(1430, 245)
      .lineTo(1810, 245)
      .stroke();
    // Action details Line
    doc
      .lineCap('butt')
      .strokeColor('#000000')
      .lineWidth(1)
      .moveTo(1920, 245)
      .lineTo(2520, 245)
      .stroke();
    doc
      .font('Times-Italic')
      .text('ITMO', 750, 210, { continued: true })
      .text('Action', 2300, 210);
    doc
      .font('Times-Italic')
      .text('Unique identifier', 350, 230, { continued: true })
      .text('Metric and quantity', 670, 230, { continued: true })
      .text('ITMO details', 990, 230, { continued: true })
      .text('Authorization', 1350, 230, { continued: true })
      .text('Action details', 1900, 230);

    const lorem = [
      'Article 6 database record ID',
      '  Cooperative \t approach(a)',
      'First unique identifier(b)',
      'Last unique identifier(c)',
      'Underlying unit block start ID(d)',
      'Underlying unit last block end(e)',
      'Metric(f)',
      'Quantity (expressed in metric)(g)',
      'Quantity (t CO2 eq)',
      'Conversion factor  (reporting Party)(h)',
      'First transferring participating Party(i)',
      'Vintage(j)',
      'Sector(s)(k)',
      'Activity type(s)(l)',
      'Date of authorization(m)',
      'Authorization ID(n)',
      'Purposes for authorization',
      'OIMP authorized by the Party(o)',
      'First transfer definition(p)',
      'Action date(q)',
      'Action type(r)',
      'Transferring participating Party(s)',
      'Acquiring participating Party(t)',
      'Purposes for cancellation(u)',
      'Using participating Party or authorized entity or entities',
      'First transfer(v)',
    ];
    for (const rows in lorem) {
      const isBold = [
        'Article 6 database record ID',
        '  Cooperative \t approach(a)',
        'First unique identifier(b)',
        'Last unique identifier(c)',
        'Metric(f)',
        'Quantity (t CO2 eq)',
        'First transferring participating Party(i)',
        'Vintage(j)',
        'Sector(s)(k)',
        'Activity type(s)(l)',
        'Date of authorization(m)',
        'Authorization ID(n)',
        'Purposes for authorization',
        'OIMP authorized by the Party(o)',
        'First transfer definition(p)',
        'Action date(q)',
        'Action type(r)',
        'Transferring participating Party(s)',
        'Acquiring participating Party(t)',
        'Purposes for cancellation(u)',
        'Using participating Party or authorized entity or entities',
        'First transfer(v)',
      ].includes(lorem[rows]);
      if (isBold) {
        doc.font('Times-BoldItalic');
      }
      doc.text(lorem[rows], Number(rows) * 100 + 40, 270, {
        columns: 1,
        lineGap: 0,
        width: 90,
      });
      doc.font('Times-Italic');
    }
    const table = {
      rows: [],
      columnWidths: [80, 80, 80, 80, 80],
      yStart: doc.y + 65,
      margin: 15,
    };

    function addTableRow(data) {
      table.rows.push(data);
    }

    function drawTable() {
      let y = table.yStart;

      table.rows.forEach((row, rowIndex) => {
        let maxCellHeight = 0;
        row.forEach((cell, columnIndex) => {
          const cellHeight = doc.heightOfString(cell, {
            width: 100,
            align: 'left',
          });
          if (cellHeight > maxCellHeight) {
            maxCellHeight = cellHeight;
          }
          const column = String(cell);
          if (column.startsWith('Programme') == true) {
            const id = column.split('-')[1];

            doc
              .fontSize(8)
              .font('Times-Roman')
              .text(cell, 30 + table.margin + columnIndex * 100, y, {
                link: `${host}/programmeManagement/view?id=${id}`,
                width: 100,
                align: 'left',
              });
          } else {
            // Regular text
            doc
              .fontSize(8)
              .font('Times-Roman')
              .text(cell, 30 + table.margin + columnIndex * 100, y, {
                width: 100,
                align: 'left',
              });
          }
          // doc
          //   .fontSize(8)
          //   .font('Times-Roman')
          //   .text(cell, 30 + table.margin + columnIndex * 100, y, {
          //     width: 100,
          //     align: 'left',
          //   });
        });
        y += maxCellHeight + 10;
      });
    }
    const january1st = new Date(date, 0, 1).getTime() / 1000;
    const december31st = new Date(date, 11, 31, 23, 59, 59).getTime() / 1000;
    const authqry = `SELECT * FROM public.programme WHERE "authTime">= '${january1st}' AND "authTime"<='${december31st}' AND  "currentStage"='Authorised' `;
    const tranfretireqry = `SELECT * FROM public.programme_transfer WHERE ("status"='Approved' OR "status"='Recognised') AND "authTime">= '${january1st}' AND "authTime"<='${december31st}'`;
    const authprogrammestable = await this.programmeRepo.query(authqry);
    const transfertable = await this.programmeTransfer.query(tranfretireqry);
    const programecount = authprogrammestable.length + transfertable.length;
    addTableRow([" "," "," "," ",'','','','',' ',' ',' ',' ',' ', ' ', ' ', ` `, ' ',  ' ',  ' ',  ' ', ' ', ' ',  ' ',  ' ',  ' ',  ' \n',]);
    for (const programme of authprogrammestable) {
      const programmeid = programme.programmeId;
      const programmename = programme.title;
      const serialNo = programme.serialNo;
      const authcredit = Number(programme.creditEst);
      const scope = programme.sectoralScope;
      let sector: string;
      if (scope == 1 || scope == 2 || scope == 3 || scope == 7) {
        sector = 'Energy';
      } else if (
        scope == 4 ||
        scope == 5 ||
        scope == 6 ||
        scope == 8 ||
        scope == 9 ||
        scope == 10 ||
        scope == 11 ||
        scope == 12
      ) {
        sector = 'IPPU';
      } else if (scope == 14 || scope == 15) {
        sector = 'AFOLU';
      } else {
        sector = 'Waste';
      }
      const date = new Date(Number(programme.createdTime));
      const vintage = date.getFullYear();
      const compid = await this.programmeRepo.query(
        `SELECT "companyId"[1] FROM public.programme WHERE "programmeId"='${programme.programmeId}'`,
      );
      const firstowner = await this.CompanyRepo.query(
        `SELECT * FROM public.company WHERE "companyId"='${compid[0].companyId}'`,
      );
      const authDate = new Date(Number(programme.authTime))
        .toISOString()
        .split('T')[0];
      addTableRow([
        programmeid,
        programmename,
        serialNo.split('-')[6],
        Number(serialNo.split('-')[7]),
        '',
        '',
        'GHG',
        '',
        authcredit,
        '',
        firstowner.name,
        vintage,
        sector,
        'Authorisation',
        authDate,
        `Programme-${programmeid}`,
        '    NDC',
        ' ',
        'Authorisation',
        authDate,
        'Authorisation',
        firstowner.name,
        firstowner.name,
        '',
        firstowner.name,
        ' \n',
      ]);
    }
    for (const programme of authprogrammestable) {
      if (
        programme.creditIssued.length > 0 &&
        Number(programme.creditIssued) > 0
      ) {
        const programmeid = programme.programmeId;
        const programmename = programme.title;
        const serialNo = programme.serialNo;
        const authcredit = Number(programme.creditIssued);
        const scope = programme.sectoralScope;
        let sector: string;
        if (scope == 1 || scope == 2 || scope == 3 || scope == 7) {
          sector = 'Energy';
        } else if (
          scope == 4 ||
          scope == 5 ||
          scope == 6 ||
          scope == 8 ||
          scope == 9 ||
          scope == 10 ||
          scope == 11 ||
          scope == 12
        ) {
          sector = 'IPPU';
        } else if (scope == 14 || scope == 15) {
          sector = 'AFOLU';
        } else {
          sector = 'Waste';
        }

        const date = new Date(Number(programme.createdTime));
        const vintage = date.getFullYear();
        const compid = await this.programmeRepo.query(
          `SELECT "companyId"[1] FROM public.programme WHERE "programmeId"='${programme.programmeId}'`,
        );
        const firstowner = await this.CompanyRepo.query(
          `SELECT * FROM public.company WHERE "companyId"='${compid[0].companyId}'`,
        );
        const authDate = new Date(Number(programme.authTime))
          .toISOString()
          .split('T')[0];
        addTableRow([
          programmeid,
          programmename,
          serialNo.split('-')[6],
          Number(serialNo.split('-')[7]),
          '',
          '',
          'GHG',
          '',
          authcredit,
          '',
          firstowner.name,
          vintage,
          sector,
          'Issuance',
          authDate,
          `Programme-${programmeid}`,
          '    NDC',
          ' ',
          'Issuance ',
          authDate,
          'Issuance ',
          firstowner.name,
          firstowner.name,
          '',
          firstowner.name,
          ' \n',
        ]);
      }
    }

    for (const tnrprogramme of transfertable) {
      const findprogrammeqry = `SELECT * FROM public.programme WHERE "programmeId"='${tnrprogramme.programmeId}'`;
      const findprogramme = await this.programmeRepo.query(findprogrammeqry);
      const programmename = findprogramme[0].title;
      const firstowner = await this.CompanyRepo.query(
        `SELECT * FROM public.company WHERE "companyId"='${tnrprogramme.initiator}'`,
      );
      const serialNo = String(findprogramme[0].serialNo);
      let type: string;
      let def: string;
      if (tnrprogramme.status == `Recognised`) {
        type = 'Retirement';
        def = 'Cancellation';
      } else {
        type = 'Transfer';
        def = 'Use';
      }
      const credit = Number(tnrprogramme.creditAmount);
      const scope = findprogramme[0].sectoralScope;
      let sector: string;
      if (scope == 1 || scope == 2 || scope == 3 || scope == 7) {
        sector = 'Energy';
      } else if (
        scope == 4 ||
        scope == 5 ||
        scope == 6 ||
        scope == 8 ||
        scope == 9 ||
        scope == 10 ||
        scope == 11 ||
        scope == 12
      ) {
        sector = 'IPPU';
      } else if (scope == 14 || scope == 15) {
        sector = 'AFOLU';
      } else {
        sector = 'Waste';
      }
      let purpose: string;
      if (def == 'Cancellation') {
        if (tnrprogramme.retirementType == '0') {
          purpose = 'CROSS_BORDER';
        } else if (tnrprogramme.retirementType == '1') {
          purpose = 'Legal Action';
        } else {
          purpose = 'Other';
        }
      } else {
        purpose = '';
      }
      const date = new Date(Number(findprogramme[0].createdTime));
      const vintage = date.getFullYear();
      const receive = await this.CompanyRepo.query(
        `SELECT * FROM public.company WHERE "companyId"='${tnrprogramme.toCompanyId}'`,
      );
      const send = await this.CompanyRepo.query(
        `SELECT * FROM public.company WHERE "companyId"='${tnrprogramme.initiatorCompanyId}'`,
      );
      const authDate = new Date(Number(tnrprogramme.authTime))
        .toISOString()
        .split('T')[0];
      const createDate = new Date(Number(tnrprogramme.createdTime))
        .toISOString()
        .split('T')[0];
      addTableRow([
        tnrprogramme.programmeId,
        programmename,
        serialNo.split('-')[6],
        serialNo.split('-')[7],
        '',
        '',
        'GHG',
        '',
        credit,
        '',
        firstowner.name,
        vintage,
        sector,
        type,
        authDate,
        `Programme-${tnrprogramme.programmeId}`,
        '    NDC',
        ' ',
        def,
        authDate,
        def,
        send.name,
        receive.name,
        purpose,
        receive.name,
        '\n',
      ]);
    }
    drawTable();
    addTableRow([" "," "," "," ",'','','','',' ',' ',' ',' ',' ', ' ', ' ', ` `, ' ',  ' ',  ' ',  ' ', ' ', ' ',  ' ',  ' ',  ' ',  ' \n',]);
    doc
      .lineCap('butt')
      .strokeColor('#000000')
      .lineWidth(2)
      .moveTo(26, 335)
      .lineTo(2625, 335)
      .stroke();

    doc
      .lineCap('butt')
      .strokeColor('#000000')
      .lineWidth(2)
      .moveTo(26, doc.y + 30)
      .lineTo(2625, doc.y + 30)
      .stroke();
    doc
      .font('Times-Roman')
      .fontSize(9)
      .text(
        `    (a) Name/ID of the cooperative approach as per common nomenclatures.*\n
    (b) First ITMO unique identifier.\n
    (c) Last ITMO unique identifier. \n
    (d) Underlying unit block start ID for ITMOs recorded on the basis of cooperative approach units tracked in an underlying cooperative approach registry.\n
    (e) Underlying unit block end ID for ITMOs recorded on the basis of cooperative approach units tracked in a an underlying cooperative approach registry.\n
    (f) GHG or non-GHG.\n
    (g) For non-GHG, the metric in which the ITMO was generated as per common nomenclatures.\n
    (h) The conversion method or factor of the non-GHG units in the reporting Party’s as per decision 2/CMA.3, annex, para. 22(d).\n
    (i) Participating Party in which the mitigation outcome was generated as per common nomenclatures.\n
    (j) Year in which the mitigation outcome occurred.\n
    (k) Sector(s) where the mitigation outcome occurred as per common nomenclatures based on IPCC guidelines.\n
    (l) Description of the mitigation activity type(s) as per common nomenclatures.\n
    (m) Date of authorization by first transferring Party.\n
    (n) Authorization ID as assigned by the first transferring Party, may include a link to the public evidence of authorization by the first transferring Party.\n
    (o) Fill when “Purposes for authorization” is “OIMP” or “NDC and OIMP”.\n
    (p) If OIMP is authorized, the first transferring participating Party definition of “first transfer” as per decision 2/CMA.3, annex, para. 2(b).\n
    (q) Date on which the action was executed in the registry of the reporting Party.\n
    (r) Action type as per decision 2/CMA.3, annex, paragraph 20(a) and any further relevant guidance. \n
    (s) Initiating participating Party, including for cancellations and uses.\n
    (t) Participating Party receiving the ITMOs.\n
    (u) For relevant actions, the specific purposes for cancellation towards which ITMOs can be or were used.\n
    (v) Approach for first transfer as per decision 2/CMA.3, annex, paragraph 2 to be clarified, subject to defining the list of actions as per note “r” above. \n
    * Common nomenclature to be established as per decision -/CMA.4`,
        26,
        doc.y + 40,
      );

    doc.end();
    const content = await new Promise<string>((resolve) => {
      stream.on('finish', function () {
        const contents = fs.readFileSync(
          '/tmp/' + `Annual_Report_${country}_${date}.pdf`,
          {
            encoding: 'base64',
          },
        );
        resolve(contents);
      });
    });
    const url = await this.fileHandler.uploadFile(
      'documents/' + `Annual_Report_${country}_${date}.pdf`,
      content,
    );

    return url;
  }

  //   async generateAnnualReportexcel(
  //     excelpath,
  //   ) {
  //     const authqry = `SELECT * FROM public.programme WHERE "currentStage"='Authorised'`
  //     const tranfretireqry = `SELCR * FROM public.programme_transfer WHERE "status"='Approved OR "status"='Recognised'`
  //     const authprogrammestable = await this.programmeRepo.query(authqry)
  //     const transfertable = await this.programmeTransfer.query(tranfretireqry)
  //     const programecount = authprogrammestable.length + transfertable.length;
  //     console.log(transfertable)
  //     console.log(programecount)
  //     // console.log("PassHere")
  //     const country =await this.configService.get("systemCountryName");
  //     // const minister =await this.configService.get("docGenerate.ministerName");
  //     // const ministry =await this.configService.get('docGenerate.ministryName');
  //     const year = new Date().getFullYear();
  //     const report_year = (Number(year)-1)
  //     const xlsxFile = excelpath;
  //     console.log(xlsxFile)
  //     const targetSheet = 'Actions';
  //     try {
  //       const workbook = XLSX.readFile(xlsxFile);
  //       const sheet = workbook.Sheets[targetSheet];
  //       if (!sheet) {
  //         console.error(`Sheet "${targetSheet}" not found in the XLSX file.`);
  //         process.exit(1);
  //       }
  //       let startrow = 11
  //       const range = XLSX.utils.decode_range(sheet['!ref']);
  //       for (let i = 0; i < programecount; i++) {
  //         for (let r = range.e.r; r >= startrow; r--) {
  //           for (let c = range.s.c; c <= range.e.c; c++) {
  //             const fromCell = XLSX.utils.encode_cell({ c: c, r: r });
  //             const toCell = XLSX.utils.encode_cell({ c: c, r: r + 1 });
  //             sheet[toCell] = sheet[fromCell];
  //           }
  //         }
  //           for (let c = range.s.c; c <= range.e.c; c++) {
  //           const cellAddress = XLSX.utils.encode_cell({ c: c, r: startrow });
  //           sheet[cellAddress] = { t: 's', v: '' };
  //         }

  //         range.e.r++;
  //       }

  //       // const ranges = { s: { c: 1, r: 1 }, e: { c: 2, r: 2 } }; // B2:C3
  //       // sheet['!merges'] = [{ range: ranges, style: { border: { right: { style: 'thin', color: { auto: 1 } } } } }];

  //       let datainputrow = 11
  //       //Authorised Credits
  //       for (const item of authprogrammestable) {
  //         const programmeid = item.programmeId;
  //         const programmename = item.title;
  //         const serialNo = item.serialNo;
  //         const authcredit = Number(item.creditEst)
  //         const scope = item.sectoralScope
  //         let sector : string
  //         if (scope==1 || scope==2|| scope==3|| scope==7){
  //           sector = "Energy"
  //         }
  //         else if(scope==4 || scope==5|| scope==6|| scope==8|| scope==9|| scope==10|| scope==11|| scope==12){
  //           sector = "IPPU"
  //         }
  //         else if(scope==14 || scope==15){
  //           sector = "AFOLU"
  //         }
  //         else{
  //           sector = "Waste"
  //         }
  //         console.log(sector)
  //         sheet[`B${datainputrow}`] = {t: 's', v: programmeid };
  //         sheet[`C${datainputrow}`] = {t: 's', v: programmename };
  //         sheet[`D${datainputrow}`] = {t: 's', v: serialNo.split('-')[6] };
  //         sheet[`E${datainputrow}`] = {t: 's', v: Number(serialNo.split('-')[6])+authcredit-1 };
  //         sheet[`F${datainputrow}`] = {t: 's', v: "" };
  //         sheet[`G${datainputrow}`] = {t: 's', v: "" };
  //         sheet[`I${datainputrow}`] = {t: 's', v: "GHG" };
  //         sheet[`J${datainputrow}`] = {t: 's', v: "" };
  //         sheet[`K${datainputrow}`] = {t: 's', v: authcredit };
  //         sheet[`L${datainputrow}`] = {t: 's', v: "" };
  //         sheet[`N${datainputrow}`] = {t: 's', v: "" };
  //         sheet[`O${datainputrow}`] = {t: 's', v: item.createdTime };
  //         sheet[`P${datainputrow}`] = {t: 's', v: sector };
  //         sheet[`Q${datainputrow}`] = {t: 's', v: "Authorisation" };
  //         sheet[`S${datainputrow}`] = {t: 's', v: item.createdTime };
  //         sheet[`T${datainputrow}`] = {t: 's', v: "" };
  //         sheet[`U${datainputrow}`] = {t: 's', v: "NDC" };
  //         sheet[`V${datainputrow}`] = {t: 's', v: "" };
  //         sheet[`W${datainputrow}`] = {t: 's', v: "Authorization" };
  //         sheet[`Y${datainputrow}`] = {t: 's', v: item.createdTime };
  //         sheet[`Z${datainputrow}`] = {t: 's', v: "Authorisation " };
  //         sheet[`AA${datainputrow}`] = {t: 's', v: "to be filled" };
  //         sheet[`AB${datainputrow}`] = {t: 's', v: "to be filled" };
  //         sheet[`AC${datainputrow}`] = {t: 's', v: "Not Cancellation" };
  //         sheet[`AD${datainputrow}`] = {t: 's', v: "to be filled" };
  //         sheet[`AE${datainputrow}`] = {t: 's', v: "" };
  //         datainputrow = datainputrow + 1
  //       }

  //       XLSX.writeFile(workbook, `Annual_Report_${country}.xlsx`);
  //     } catch (error) {
  //       console.error(`An error occurred: ${error}`);
  //     }
  // }
}
