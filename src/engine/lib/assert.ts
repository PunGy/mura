export function assert(
    condition: unknown,
    errorMsg: string
): asserts condition {
    if (condition === false)
        throw new Error(errorMsg)
}

// Type casting 
export function assertIronicType<T>(value: unknown): asserts value is T {}

export function assertNil<T>(
    value: T,
    errorMsg?: string,
): asserts value is NonNullable<T> {
    if (value == null) {
        throw new Error(errorMsg ?? 'the value is nil')
    }
}

