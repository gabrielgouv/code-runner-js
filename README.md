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
var javaCompiler: Compiler = new JavaCompiler(2000)

javaCompiler.run('Test.java', 'Hello Java').subscribe((output) => {
    console.log('Output: ' + output.output)
    console.log('Return value: ' + output.returnValue)
    console.log('Took: ' + output.took + 'ms')
})
```

```typescript
var pythonCompiler: Compiler = new PythonCompiler('3', 2000)

pythonCompiler.run('Test_python3.py', 'Hello Python 3').subscribe((output) => {
    console.log('Output: ' + output.output)
    console.log('Return value: ' + output.returnValue)
    console.log('Took: ' + output.took + 'ms')
})
```
