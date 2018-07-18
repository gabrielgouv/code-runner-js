/*
*   {0} version
*   {1} file name
*   {2} compiled file name
*/

export const lang = {
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
}