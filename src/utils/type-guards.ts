import { CompilerOptions } from "../compiler/compiler-options";

export var isCompilerOptions = (obj: any): obj is CompilerOptions => {
    return obj.name !== undefined
}