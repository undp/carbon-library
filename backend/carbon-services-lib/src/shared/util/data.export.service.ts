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
        //   const ws = fs.createWriteStream(csvFile);
        //   const csvStream = fastcsv.format({ headers: true });
        //   csvStream.pipe(ws);
      
        //   // Write the data to the stream
        //   programmes.forEach((data) => csvStream.write(data));
      
        //   // End the stream to signal that writing is complete
        //   csvStream.end();

        console.log('========================DataExportService-prepdata', data);
          
        let csvContent = ''
        // // const stream = fs.createWriteStream('/tmp/' + filePath);
        // // csvContent.pipe()

        const refinedData = []
        
        refinedData.push(headers)
        
        data.forEach(item => {
          refinedData.push(Object.values(item))  
        })
        
        

        
        refinedData.forEach(row => {
          csvContent += row.join(',') + '\n'
        })
        
        // console.log('========================csvContent', filePath);
          // Wait for the finish event before proceeding with the deletion
        //   return new Promise<string>((resolve, reject) => {
        //     ws.on('finish', () => {
        //       // Now that writing is finished, delete the file
        //     //   fs.unlinkSync(filePath);
        //       resolve(filePath);
              
        //     });
        //     ws.on('error', (err) => {
        //       reject(err);
        //     });
        //   });


        // console.log('========================ws', ws);
        // const content = await new Promise<string>(resolve => {
        //     writer.on("finish", function() {
        //         const contents = fs.readFileSync(csvFile, {encoding: 'base64'})
        //         resolve(contents);
        //     });
        // });

        fs.writeFileSync(csvFile, csvContent);
        const content = fs.readFileSync(csvFile, {encoding: 'base64'});
        console.log('========================content333', content);
          const url = await this.fileHandler.uploadFile('documents/exports/' + csvFile, content);
          console.log('========================PDF generate end', 'exports/', url);
          return {url, csvFile};
      }
}


