import 'jest'

import { CommandBuilder } from '../src/compiler/command-builder';

test('Put 3 string variables', () => {
    let expectedResult = 'Testing the variables'
    let command = '{var1} {var2} {var3}'

    let commandBuilder = new CommandBuilder(command)
    commandBuilder.putVariable('var1', 'Testing')
    commandBuilder.putVariable('var2', 'the')
    commandBuilder.putVariable('var3', 'variables')
    expect(commandBuilder.buildCommand()).toBe(expectedResult)
})

test('Put 3 different types of variables', () => {
    let expectedResult = 'string true 42'
    let command = '{string} {boolean} {number}'

    let commandBuilder = new CommandBuilder(command)
    commandBuilder.putVariable('string', 'string')
    commandBuilder.putVariable('boolean', true)
    commandBuilder.putVariable('number', 42)
    expect(commandBuilder.buildCommand()).toBe(expectedResult)
})

test('Variables together', () => {
    let expectedResult = 'stringtrue42'
    let command = '{string}{boolean}{number}'

    let commandBuilder = new CommandBuilder(command)
    commandBuilder.putVariable('string', 'string')
    commandBuilder.putVariable('boolean', true)
    commandBuilder.putVariable('number', 42)
    expect(commandBuilder.buildCommand()).toBe(expectedResult)
})

test('Malformed variables 1', () => {
    let expectedResult = '{strin}g} true 42'
    let command = '{strin}g} {boolean} {number}'

    let commandBuilder = new CommandBuilder(command)
    commandBuilder.putVariable('string', 'string')
    commandBuilder.putVariable('boolean', true)
    commandBuilder.putVariable('number', 42)
    expect(commandBuilder.buildCommand()).toBe(expectedResult)
})

test('Malformed variables 2', () => {
    let expectedResult = '{string} {true number}'
    let command = '{{string}} {{boolean} number}'

    let commandBuilder = new CommandBuilder(command)
    commandBuilder.putVariable('string', 'string')
    commandBuilder.putVariable('boolean', true)
    commandBuilder.putVariable('number', 42)
    expect(commandBuilder.buildCommand()).toBe(expectedResult)
})

test('Put undefined as value', () => {
    let expectedResult = ''
    let command = '{undefinedVariable}'

    let commandBuilder = new CommandBuilder(command)
    commandBuilder.putVariable('undefinedVariable', undefined)
    expect(commandBuilder.buildCommand()).toBe(expectedResult)
})

test('Merge map of variables', () => {
    let expectedResult = 'var1 var2 var3 var4'
    let command = '{var1} {var2} {var3} {var4}'

    let variablesMap = new Map()
    variablesMap.set('var1', 'var1')
    variablesMap.set('var2', 'var2')

    let commandBuilder = new CommandBuilder(command)
    commandBuilder.putVariables(variablesMap)
    commandBuilder.putVariable('var3', 'var3')
    commandBuilder.putVariable('var4', 'var4')
    expect(commandBuilder.buildCommand()).toBe(expectedResult)
})