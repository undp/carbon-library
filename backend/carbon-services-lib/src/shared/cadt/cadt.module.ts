import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from '../configuration';
import { CadtApiService } from './cadt.api.service';

@Module({
    imports: [
      ConfigModule.forRoot({
        isGlobal: true,
        load: [configuration],
        envFilePath: [`.env.${process.env.NODE_ENV}`, `.env`],
      }),
    ],
    providers: [CadtApiService, Logger],
    exports: [CadtApiService]
  })
export class CadtModule {}
