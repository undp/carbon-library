export default () => ({
  stage: process.env.STAGE || "local",
  systemCountry: process.env.systemCountryCode || "NG",
  systemCountryName: process.env.systemCountryName || "CountryX",
  systemContinentName: process.env.systemContinentName || "CountryX",
  defaultCreditUnit: process.env.defaultCreditUnit || "ITMO",
  dateTimeFormat: "DD LLLL yyyy @ HH:mm",
  dateFormat: "DD LLLL yyyy",
  database: {
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT) || 5432,
    username: process.env.DB_USER || "hquser",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "carbondev",
    synchronize: process.env.NODE_ENV == "prod" ? true : true,
    autoLoadEntities: true,
    logging: ["error"],
  },
  jwt: {
    expiresIn: process.env.EXPIRES_IN || "7200",
    userSecret: process.env.USER_JWT_SECRET || "1324",
    adminSecret: process.env.ADMIN_JWT_SECRET || "8654",
  },
  ledger: {
    name: "carbon-registry-" + (process.env.NODE_ENV || "dev"),
    table: "programmes",
    overallTable: "overall",
    companyTable: "company",
  },
  email: {
    source: process.env.SOURCE_EMAIL || "info@xeptagon.com",
    endpoint:
      process.env.SMTP_ENDPOINT ||
      "vpce-02cef9e74f152b675-b00ybiai.email-smtp.us-east-1.vpce.amazonaws.com",
    username: process.env.SMTP_USERNAME || "AKIAUMXKTXDJIOFY2QXL",
    password: process.env.SMTP_PASSWORD,
    disabled: process.env.IS_EMAIL_DISABLED === "true" ? true : false,
    disableLowPriorityEmails:
      process.env.DISABLE_LOW_PRIORITY_EMAIL === "true" ? true : false,
    getemailprefix: process.env.EMAILPREFIX || "🏬📐 🇦🇶",
    adresss: process.env.HOST_ADDRESS || "Address <br>Region, Country Zipcode"
  },
  s3CommonBucket: {
    name: "carbon-common-" + (process.env.NODE_ENV || "dev"),
  },
  host: process.env.HOST || "https://test.carbreg.org",
  backendHost: process.env.BACKEND_HOST || "http://localhost:3000",
  liveChat: "https://undp2020cdo.typeform.com/to/emSWOmDo",
  mapbox: {
    key: process.env.MAPBOX_PK,
  },
  openstreet: {
    retrieve: process.env.OPENSTREET_QUERY === "true" || false,
  },
  asyncQueueName:
    process.env.ASYNC_QUEUE_NAME ||
    "https://sqs.us-east-1.amazonaws.com/302213478610/AsyncQueuedev.fifo",
  ITMOSystem: {
    endpoint:
      process.env.ITMO_ENDPOINT ||
      "https://dev-digital-carbon-finance-webapp-api-rxloyxnj3dbso.azurewebsites.net/api/v1/",
    apiKey: process.env.ITMO_API_KEY,
    email: process.env.ITMO_EMAIL,
    password: process.env.ITMO_PASSWORD,
  },
  CERTIFIER:{
    image:process.env.CERTIFIER_IMAGE
  },
  registry: {
    syncEnable: process.env.SYNC_ENABLE || false,
    endpoint: process.env.CLIENT_ENDPOINT || 'https://u4h9swxm8b.execute-api.us-east-1.amazonaws.com/dev',
    apiToken: process.env.CLIENT_API_TOKEN
  },
  docGenerate: {
    ministerName: process.env.MINISTER_NAME || 'Minister X',
    ministryName: "Ministry of Environment, Forestry & Tourism",
    countryCapital: process.env.COUNTRY_CAPITAL || "Capital X"
  },
  systemType: process.env.SYSTEM_TYPE || "CARBON_UNIFIED_SYSTEM"
});