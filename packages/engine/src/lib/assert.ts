import { muraLog } from "./logger/muraLog"

export function assert(
    condition: unknown,
    errorMsg: string
): asserts condition {
    if (condition === false)
        throw new Error(errorMsg)
}

export function assertNil<T>(
    value: T,
    errorMsg?: string,
): asserts value is NonNullable<T> {
    if (value == null) {
        muraLog.error(errorMsg ?? 'the value is nil')
        throw null
    }
}
