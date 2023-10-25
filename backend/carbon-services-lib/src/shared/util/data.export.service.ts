import { Injectable } from "@nestjs/common";
import * as fs from 'fs';
import { FileHandlerInterface } from '../file-handler/filehandler.interface';
import { DataExportDto } from "../dto/data.export.dto";

@Injectable()
export class DataExportService {
  constructor(private fileHandler: FileHandlerInterface,) {

  };

  async generateCsv(data: DataExportDto[], headers: string[]) {

    const csvFile = 'data_' + Date.now() + '.csv';

    let csvContent = ''

    const refinedData = [];
    refinedData.push(headers);

    data.forEach(item => {
      const values = Object.values(item).map(value => (value === undefined || value === null) ? "" : value);
      refinedData.push(values);
    });


    refinedData.forEach(row => {
      const rowValues = row.map(value => `"${value}"`).join(',');
      csvContent += rowValues + '\n';
    });

    fs.writeFileSync(csvFile, csvContent);
    const content = fs.readFileSync(csvFile, { encoding: 'base64' });
    const url = await this.fileHandler.uploadFile('documents/exports/' + csvFile, content);
    console.log('========================PDF generate end', 'exports/', url);
    return { url, csvFile };
  }
}


