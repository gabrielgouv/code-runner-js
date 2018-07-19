# Compiler Mediator for NodeJS
This is a WIP project using TDD (Test Driven Development) technique. Tested only in linux (Ubuntu 18.04).

To run all tests successfully you must have installed in your machine:
- Java
- PHP CLI
- Python 2
- Python 3
- Bash

These above requirements will be removed soon.

## Setup a new compiler (WIP)

To setup a new compiler is pretty simple. You have three ways to add a new compiler:

### 1) Creating a compiler definition via langs file

1. Go to ```src/common/langs.ts``` file. It look like this:
```typescript
export const lang = {
    java: { 
        compileCommand: 'javac {fileName}',
        runCommand: 'java {compiledFileName}',
        filePath: './__tests__/files/java'
    },
    python: { 
        runCommand: 'python{version} {fileName}',
        filePath: './__tests__/files/python'
    }
}
```

2. You can add a new object that sets up your new compiler. Here, we add a C compiler that uses GCC:
```typescript
c: { 
    compileCommand: 'gcc MyFile.c -o MyFile',
    runCommand: './MyFile',
    filePath: 'path/to/c/file'
}
```

3. Now you can use your compiler. In the constructor you need only pass a lang option that references your compiler definitions in langs file:
```typescript
let myCompiler: Compiler = new Compiler({
    lang: lang.c
})
myCompiler.execute().subscribe((result) => {
    console.log(result.output)
})
```

### 2) Creating a compiler definition via Compiler contructor

1. In a Compiler constructor you can pass compiler options (CompilerOptions interface), same names as you passed in langs file:
```typescript
let myCompiler: Compiler = new Compiler({
    compileCommand: 'gcc MyFile.c -o MyFile',
    runCommand: './MyFile',
    filePath: 'path/to/c/file'
})
```

2. And than, execute it!
```typescript
myCompiler.execute().subscribe((result) => {
    console.log(result.output)
})
```

### 3) Creating a compiler mixing the last two ways

If you noticed, we set a fixed file name in the ```compileCommand``` and ```runCommand``` option. But if we need a dynamic file name? Let's make some changes to our compiler definition in langs file.

1. We can pass dynamic variables in our commands:
```typescript
c: { 
    compileCommand: 'gcc {fileName} -o {compiledFileName}',
    runCommand: './{compiledFileName}',
    filePath: 'path/to/c/file'
}
```

Variables are always used inside two braces (```{variableName}```). By default there are four types of variables. These variables will be replaced by the compiler options that have the same name:

| Variable name    	| Description 	                            |
|------------------	|-------------------------------------------|
| version          	| Replaced by version compiler option    	|
| fileName         	| Replaced by fileName compiler option    	|
| compiledFileName 	| Replaced by compiledFileName option    	|
| filePath         	| Replaced by compiledFileName option    	|


2. Now you can define a "template" of your commands in the langs file and in the constructor options you can define the variables values:
```typescript
let myCompiler: Compiler = new Compiler({
    lang: lang.c,
    fileName: 'MyCFile.c',
    compiledFileName: 'MyCFile'
})
```

3. Finally you can normaly execute your compiler:
```typescript
myCompiler.execute().subscribe((result) => {
    console.log(result.output)
})
```
Note that ```{fileName}``` and ```{compiledFileName}``` will be replaced by ```MyCFile.c``` and ```MyCFile``` respectively.

**BE CAREFUL**: Compiler options defined in the constructor overrides lang file defined options.

**NOTE:** The C and Java language, other than Python, for example, needs to be compiled before it can be run. For these cases add the option ```compileCommand``` and ```runCommand```. If the language can be executed directly, only the ```runCommand``` is needed.

