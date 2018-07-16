import { Compiler } from "./src/compilers/compiler";
import { JavaCompiler } from "./src/compilers/java-compiler";
import { PythonCompiler } from "./src/compilers/python-compiler";

var compiler: Compiler = new JavaCompiler();

compiler.run('Test.java', 'Hello Java').then((output) => {
    console.log('Output: ' + output.output)
    console.log('Return value: ' + output.returnValue)
})

var pythonCompiler = new PythonCompiler('3')

pythonCompiler.run('Test.py', 'Hello Python 3').then((output) => {
    console.log('Output: ' + output.output)
    console.log('Return value: ' + output.returnValue)
})