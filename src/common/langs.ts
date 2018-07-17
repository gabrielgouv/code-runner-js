export const lang = {
    java: { 
        extension: '.java',
        compileCommand: 'javac {0}',
        runCommand: 'java {0}',
        directory: './__tests__/files/java'
    },
    php: { 
        extension: '.php', 
        runCommand: 'php {0}',
        directory: './__tests__/files/php'
    },
    bash: { 
        extension: '.sh',
        runCommand: 'sh {0}' ,
        directory: './__tests__/files/bash'
    },
    python: { 
        extension: '.py',
        runCommand: 'python{0} {1}',
        directory: './__tests__/files/python'
    }
}