export class CommandBuilder {

    private variables = new Map<string, string | number | boolean | undefined>()

    constructor(private command: string) {

    }

    /**
     * Puts a new single variable in variables map.
     * @param name - Variable name.
     * @param value - Variable value.
     */
    public putVariable(name: string, value: string | number | boolean | undefined): void {
        value = typeof value !== 'undefined' ? value : ''
        this.variables.set(name, value)
    }

    /**
     * Merges a new whole map of variables in variables map.
     * @param variables - Map of variables.
     */
    public putVariables(variables: Map<string, string | number | boolean | undefined>): void {
        this.variables = new Map([...this.variables, ...variables])
    }

    /**
     * Returns the command with all variables replaced by it respective values.
     * If the command string has variables that are not in variables map they will not replaced.
     */
    public buildCommand(): string {
        this.configureVariables()
        return this.command
    }

    private configureVariables(): void {
        for (const [name, value] of this.variables.entries()) {
            this.command = this.command.replace(new RegExp(`\\{${name}\\}`, 'g'), value ? value.toString() : '')
        }
    }

}
