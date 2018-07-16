# NodeJSCompilerMediator
This is a WIP project using TDD (Test Driven Development) technique. Tested only in linux (Ubuntu 18.04).

To run all tests successfully you must have installed in your machine:
- Java
- PHP CLI
- Python 2
- Python 3
- Bash

## Example

```typescript
var javaCompiler: Compiler = new JavaCompiler(2000) // execution timeout (2 seconds)

javaCompiler.run('Test.java', 'Hello Java').then((output) => {
    console.log('Output: ' + output.output)
    console.log('Return value: ' + output.returnValue)
    console.log('Took: ' + output.took + 'ms')
})
```

```typescript
var pythonCompiler: Compiler = new PythonCompiler('2', 2000) // Python version (2), execution timeout (2 seconds)

pythonCompiler.run('Test_python2.py', 'Hello Python 2').then((output) => {
    console.log('Output: ' + output.output)
    console.log('Return value: ' + output.returnValue)
    console.log('Took: ' + output.took + 'ms')
})
```
