export var fillString = (str: string, ...params: string[]): string => {

    for (let i = 0; i < params.length; i++) {
        str = str.replace(new RegExp(`\\{${i}\\}`, 'g'), params[i])
    }
    return str
}