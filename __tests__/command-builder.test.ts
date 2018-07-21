import 'jest'
import { CommandBuilder } from '../src/compiler/command-builder'

test('Put 3 string variables', () => {
    const expectedResult = 'Testing the variables'
    const command = '{var1} {var2} {var3}'

    const commandBuilder = new CommandBuilder(command)
    commandBuilder.putVariable('var1', 'Testing')
    commandBuilder.putVariable('var2', 'the')
    commandBuilder.putVariable('var3', 'variables')
    expect(commandBuilder.buildCommand()).toBe(expectedResult)
})

test('Put 3 different types of variables', () => {
    const expectedResult = 'string true 42'
    const command = '{string} {boolean} {number}'

    const commandBuilder = new CommandBuilder(command)
    commandBuilder.putVariable('string', 'string')
    commandBuilder.putVariable('boolean', true)
    commandBuilder.putVariable('number', 42)
    expect(commandBuilder.buildCommand()).toBe(expectedResult)
})

test('Variables together', () => {
    const expectedResult = 'stringtrue42'
    const command = '{string}{boolean}{number}'

    const commandBuilder = new CommandBuilder(command)
    commandBuilder.putVariable('string', 'string')
    commandBuilder.putVariable('boolean', true)
    commandBuilder.putVariable('number', 42)
    expect(commandBuilder.buildCommand()).toBe(expectedResult)
})

test('Malformed variables 1', () => {
    const expectedResult = '{strin}g} true 42'
    const command = '{strin}g} {boolean} {number}'

    const commandBuilder = new CommandBuilder(command)
    commandBuilder.putVariable('string', 'string')
    commandBuilder.putVariable('boolean', true)
    commandBuilder.putVariable('number', 42)
    expect(commandBuilder.buildCommand()).toBe(expectedResult)
})

test('Malformed variables 2', () => {
    const expectedResult = '{string} {true number}'
    const command = '{{string}} {{boolean} number}'

    const commandBuilder = new CommandBuilder(command)
    commandBuilder.putVariable('string', 'string')
    commandBuilder.putVariable('boolean', true)
    commandBuilder.putVariable('number', 42)
    expect(commandBuilder.buildCommand()).toBe(expectedResult)
})

test('Put undefined as value', () => {
    const expectedResult = ''
    const command = '{undefinedVariable}'

    const commandBuilder = new CommandBuilder(command)
    commandBuilder.putVariable('undefinedVariable', undefined)
    expect(commandBuilder.buildCommand()).toBe(expectedResult)
})

test('Merge map of variables', () => {
    const expectedResult = 'var1 var2 var3 var4'
    const command = '{var1} {var2} {var3} {var4}'

    const variablesMap = new Map()
    variablesMap.set('var1', 'var1')
    variablesMap.set('var2', 'var2')

    const commandBuilder = new CommandBuilder(command)
    commandBuilder.putVariables(variablesMap)
    commandBuilder.putVariable('var3', 'var3')
    commandBuilder.putVariable('var4', 'var4')
    expect(commandBuilder.buildCommand()).toBe(expectedResult)
})
