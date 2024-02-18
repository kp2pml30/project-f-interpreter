export interface Execution {
    print(text: string): Promise<void>
    shouldInterrupt(): boolean
}

export async function run(program: string, exec: Execution): Promise<void> {
    exec.print(program)
}
