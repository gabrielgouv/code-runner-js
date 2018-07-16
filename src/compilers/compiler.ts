import { CompilerOutput } from "./compiler-output";

export abstract class Compiler {

    abstract execute(fileName: string, input?: string): Promise<CompilerOutput>

}