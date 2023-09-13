const allowedFileTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"];

export const isValidateFileType = (fileType: string): boolean => {
    console.log("isValidateFileType called with type : ", fileType)
    return allowedFileTypes.includes(fileType);
}