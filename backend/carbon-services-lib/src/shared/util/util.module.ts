import { forwardRef, Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AcceptLanguageResolver, I18nModule, QueryResolver } from "nestjs-i18n";
import * as path from "path";
import { TypeOrmModule } from "@nestjs/typeorm";
import configuration from "../configuration";
import { Counter } from "../entities/counter.entity";
import { Country } from "../entities/country.entity";
import { TypeOrmConfigService } from "../typeorm.config.service";
import { CounterService } from "./counter.service";
import { CountryService } from "./country.service";
import { HelperService } from "./helpers.service";
import { IsValidCountryConstraint } from "./validcountry.decorator";
import { PasswordReset } from "../entities/userPasswordResetToken.entity";
import { PasswordResetService } from "./passwordReset.service";
import { User } from "../entities/user.entity";
import { UserModule } from "../user/user.module";
import { AsyncOperationsModule } from "../async-operations/async-operations.module";
import { ConfigurationSettingsService } from "./configurationSettings.service";
import { ConfigurationSettings } from "../entities/configuration.settings";
import { ObjectionLetterGen } from "./objection.letter.gen";
import { FileHandlerModule } from "../file-handler/filehandler.module";
import { Region } from "../entities/region.entity";
import { AuthorizationLetterGen } from "./authorisation.letter.gen";
import { LetterOfIntentRequestGen } from "./letter.of.intent.request.gen";
import { LetterOfIntentResponseGen } from "./letter.of.intent.response.gen";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: [`.env.${process.env.NODE_ENV}`, `.env`],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      imports: undefined,
    }),
    I18nModule.forRoot({
      fallbackLanguage: "en",
      loaderOptions: {
        path: path.join(__dirname, "../../i18n/"),
        watch: true,
      },
      resolvers: [
        { use: QueryResolver, options: ["lang"] },
        AcceptLanguageResolver,
      ],
    }),
    TypeOrmModule.forFeature([
      Counter,
      Country,
      PasswordReset,
      User,
      ConfigurationSettings,
      Region
    ]),
    forwardRef(() => AsyncOperationsModule),
    FileHandlerModule
  ],
  providers: [
    CounterService,
    CountryService,
    IsValidCountryConstraint,
    HelperService,
    PasswordResetService,
    Logger,
    ConfigurationSettingsService,
    ObjectionLetterGen,
    AuthorizationLetterGen,
    LetterOfIntentRequestGen,
    LetterOfIntentResponseGen
  ],
  exports: [
    CounterService,
    CountryService,
    HelperService,
    PasswordResetService,
    ConfigurationSettingsService,
    ObjectionLetterGen,
    AuthorizationLetterGen,
    LetterOfIntentRequestGen,
    LetterOfIntentResponseGen
  ],
})
export class UtilModule {}
