import { Compiler } from './src/compiler/compiler'

let input = 'Hello Java'
const javaCompiler: Compiler = new Compiler('java')
javaCompiler.executionTimeout(3000)
javaCompiler.onInputRequested(input)
javaCompiler.putVariable('fileName', 'Test.java')
javaCompiler.putVariable('compiledFileName', 'Test')
javaCompiler.execute().subscribe((output) => {
    console.log(output.output)
    console.log('Return: ' + output.returnCode)
    console.log('Took: ' + output.took + 'ms')
})

input = 'Hello Python 2'

const pythonCompiler: Compiler = new Compiler({name: 'python'})
pythonCompiler.putVariable('version', '2')
pythonCompiler.putVariable('fileName', 'Test_python2.py')
pythonCompiler.onInputRequested(input)
pythonCompiler.execute().subscribe((output) => {
    console.log(output.output)
    console.log('Return: ' + output.returnCode)
    console.log('Took: ' + output.took + 'ms')
})

input = 'Hello PHP'
const phpCompiler: Compiler = new Compiler('php')
phpCompiler.putVariable('fileName', 'Test.php')
phpCompiler.onInputRequested(input)
phpCompiler.execute().subscribe((output) => {
    console.log(output.output)
    console.log('Return: ' + output.returnCode)
    console.log('Took: ' + output.took + 'ms')
})
