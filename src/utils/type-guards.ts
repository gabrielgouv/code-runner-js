import { ICompilerOptions } from '../compiler/compiler-options'

export const isCompilerOptions = (obj: any): obj is ICompilerOptions => {
    return obj.name !== undefined
}
