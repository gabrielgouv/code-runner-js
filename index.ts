import { Compiler } from "./src/compilers/compiler";
import { JavaCompiler } from "./src/compilers/java-compiler";

var compiler: Compiler = new JavaCompiler();

compiler.execute('Test.java', 'Hello Java').then((output) => {
    console.log('Output: ' + output.output)
    console.log('Return value: ' + output.returnValue)
})