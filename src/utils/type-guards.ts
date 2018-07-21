import { ICompilerOptions } from '../compiler/compiler-options'

/**
 * Verifies whether an object is of type {@link ICompilerOptions}.
 * @param obj - Object to be verified.
 */
export const isCompilerOptions = (obj: any): obj is ICompilerOptions => {
    return obj.name !== undefined
}
