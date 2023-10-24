import { DataExportDto } from "./data.export.dto";

export class DataExportUserDto extends DataExportDto {
    id;
    email;
    role;
    name;
    country;
    phoneNo;
    companyId;
    companyRole;
    createdTime;
    isPending;
}