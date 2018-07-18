# NodeJSCompilerMediator
This is a WIP project using TDD (Test Driven Development) technique. Tested only in linux (Ubuntu 18.04).

To run all tests successfully you must have installed in your machine:
- Java
- PHP CLI
- Python 2
- Python 3
- Bash

## Creating a new compiler (WIP)

1. Go to src/common/langs.ts file:
```typescript
java: { 
    compileCommand: 'javac {1}',
    runCommand: 'java {2}',
    directory: './__tests__/files/java'
},
php: { 
    runCommand: 'php {1}',
    directory: './__tests__/files/php'
},
bash: { 
    runCommand: 'sh {1}' ,
    directory: './__tests__/files/bash'
},
python: { 
    runCommand: 'python{0} {1}',
    directory: './__tests__/files/python'
}
```

2. Now, you can add a new object that sets up your new compiler:
```typescript
c: { 
    compileCommand: 'gcc {1} -o {2}',
    runCommand: './{2}',
    directory: 'path/to/c/file'
}
```

NOTE: The C and Java language, other than Python, for example, needs to be compiled before it can be run. For these cases add the option "compileCommand" and "runCommand". If the language can be executed directly, only the "runCommand" is needed.

You can pass dynamic parameters to the commands:
- {0} version
- {1} file name
- {2} compiled file name

3. Done! Now you can test your compile:
```typescript
let myCompiler: Compiler = new Compiler({
lang: lang.c,
fileName: 'MyCFile.c',
compiledFileName: 'MyCFile'
})
myCompiler.execute().subscribe((result) => {
    console.log(result.output)
})
```
