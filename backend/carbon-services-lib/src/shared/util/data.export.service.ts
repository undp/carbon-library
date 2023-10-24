import { Injectable } from "@nestjs/common";
import * as fs from 'fs';
import { FileHandlerInterface } from '../file-handler/filehandler.interface'; 
import { DataExportDto } from "../dto/data.export.dto";

@Injectable()
export class DataExportService {
    constructor(private fileHandler: FileHandlerInterface,) {

    };

    async generateCsv(data: DataExportDto[], headers: string[]) {

        const csvFile = 'data_'+ Date.now() +'.csv';
          
        let csvContent = ''

        const refinedData = []
        
        refinedData.push(headers)
        
        data.forEach(item => {
          refinedData.push(Object.values(item))  
        })
        
        refinedData.forEach(row => {
          csvContent += row.join(',') + '\n'
        })

        fs.writeFileSync(csvFile, csvContent);
        const content = fs.readFileSync(csvFile, {encoding: 'base64'});
          const url = await this.fileHandler.uploadFile('documents/exports/' + csvFile, content);
          console.log('========================CSV generated end', 'exports/', url);
          return {url, csvFile};
      }
}


