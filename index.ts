import { Compiler } from "./src/compilers/compiler";
import { lang } from "./src/common/langs";

let input = 'Hello Java'
let javaCompiler: Compiler = new Compiler({
    lang: lang.java,
    fileName: 'Test.java',
    compiledFileName: 'Test',
    executionTimeout: 2000
})
javaCompiler.execute().subscribe((output) => {
    console.log(output.output)
    console.log('Return: ' + output.returnValue)
    console.log('Took: ' + output.took + 'ms')
})

input = 'Hello Python 3'
let pythonCompiler: Compiler = new Compiler({
    lang: lang.python,
    version: '3',
    fileName: 'Test_python3.py'
})
pythonCompiler.execute(input).subscribe((output) => {
    console.log(output.output)
    console.log('Return: ' + output.returnValue)
    console.log('Took: ' + output.took + 'ms')
})

input = 'Hello PHP'
let phpCompiler: Compiler = new Compiler({
    lang: lang.php,
    fileName: 'Test.php'
})
phpCompiler.execute(input).subscribe((output) => {
    console.log(output.output)
    console.log('Return: ' + output.returnValue)
    console.log('Took: ' + output.took + 'ms')
})