const allowedFileTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"];

export const isValidateFileType = (fileType: string): boolean => {
    console.log("isValidateFileType called with type with new file type change : ", fileType)
    return allowedFileTypes.includes(fileType);
}