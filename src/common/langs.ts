export const lang = {
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
}