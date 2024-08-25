export type Nil = null | undefined
export const isNil = <T>(el: T | Nil): el is Nil => (
    el == null
)

