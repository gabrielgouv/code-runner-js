import { FileType } from "../enums/file-type";

export var isFileType = (fileName: string, fileType: FileType): boolean => {
    return fileName.endsWith(fileType)
}

export var getOnlyNameFromFile = (fileName: string): string => {
    return fileName.substring(0, fileName.lastIndexOf('.'))
}