/**
 * Checks whether an file name ends with specified file type.
 * @param fileName - Name of file
 * @param fileType - Expected file type (starting with dot)
 */
export const isFileType = (fileName: string, fileType: string): boolean => {
    return fileName.endsWith(fileType)
}

/**
 * Removes file extension from a file name
 * @param fileName - Name of file
 */
export const removeFileExtension = (fileName: string): string => {
    return fileName.substring(0, fileName.lastIndexOf('.'))
}
