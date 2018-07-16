import { Compiler } from "./src/compilers/compiler";
import { JavaCompiler } from "./src/compilers/java-compiler";
import { PythonCompiler } from "./src/compilers/python-compiler";

var javaCompiler: Compiler = new JavaCompiler(2000);

javaCompiler.run('Test.java', 'Hello Java').then((output) => {
    console.log('Output: ' + output.output)
    console.log('Return value: ' + output.returnValue)
    console.log('Took: ' + output.took + 'ms')
})

var pythonCompiler = new PythonCompiler('2', 2000)

pythonCompiler.run('Test_python2.py', 'Hello Python 3').then((output) => {
    console.log('Output: ' + output.output)
    console.log('Return value: ' + output.returnValue)
    console.log('Took: ' + output.took + 'ms')
})