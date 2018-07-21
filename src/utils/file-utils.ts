export const isFileType = (fileName: string, fileType: string): boolean => {
    return fileName.endsWith(fileType)
}

export const removeFileExtension = (fileName: string): string => {
    return fileName.substring(0, fileName.lastIndexOf('.'))
}
