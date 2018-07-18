# Compiler Mediator for NodeJS
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
    compileCommand: 'javac {fileName}',
    runCommand: 'java {compiledFileName}',
    filePath: './__tests__/files/java'
},
php: { 
    runCommand: 'php {fileName}',
    filePath: './__tests__/files/php'
},
bash: { 
    runCommand: 'sh {fileName}' ,
    filePath: './__tests__/files/bash'
},
python: { 
    runCommand: 'python{version} {fileName}',
    filePath: './__tests__/files/python'
}
```

2. Now, you can add a new object that sets up your new compiler:
```typescript
c: { 
    compileCommand: 'gcc {fileName} -o {compiledFileName}',
    runCommand: './{compiledFileName}',
    filePath: 'path/to/c/file'
}
```

**NOTE:** The C and Java language, other than Python, for example, needs to be compiled before it can be run. For these cases add the option "compileCommand" and "runCommand". If the language can be executed directly, only the "runCommand" is needed.

You can pass dynamic variables to the commands:
- **{version}** => Replaced by version (version)
- **{fileName}** => Replaced by file name (fileName)
- **{compiledFileName}** => Replaced by compiled file name (compiledFileName)
- **{filePath}** => Replaced by file path (filePath)

These variables are reserved, you cannot replace them. You can also create new variables (WIP)

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
