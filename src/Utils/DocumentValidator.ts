const allowedFileTypes = [
    "application/pdf", 
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/csv",
    "image/png",
    "image/jpeg"
];

export const isValidateFileType = (fileType: string): boolean => {
    return allowedFileTypes.includes(fileType);
}