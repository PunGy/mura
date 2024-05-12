interface Iteration<T> {
    value: T;
    i: number;
    done: boolean;
}
type Step<T> = T | ((x: T) => T)

export class Range<T = number> {
    #from: number
    #to: number
    #cursor: T 
    #step: Step<T>
    #iteration: number
    // #cached: Array<number>

    get iteration() {
        return this.#iteration
    }

    // First initialization allowed only in numbers category
    constructor(fromOrTo: number, to?: number, step: Step<number> = 1) {
        let from = fromOrTo
        if (to == null) {
            to = fromOrTo
            from = 0
        }

        this.#from = from
        this.#to = to
        this.#cursor = from as T
        this.#step = step as Step<T>
        this.#iteration = 0

        return this 
    }

    *[Symbol.iterator]() {
        let inst
        do {
            inst = this.next()
            yield inst.value
        } while (!inst.done)
    }

    static range(fromOrTo: number, to?: number, step?: Step<number>) {
        return new Range<number>(fromOrTo, to, step)
    }

    clone(fromCursor = true): Range<T> {
        // @ts-expect-error fix later
        const range = new Range<T>(fromCursor ? this.#cursor : this.#from, this.#to, this.#step)
        range.next = this.next
        return range
    }
    static clone<T>(range: Range<T>): Range<T> {
        return range.clone()
    }

    #previous: Iteration<T> | null = null
    next() {
        if (this.#previous && this.#previous.done) {
            return this.#previous
        }

        const nextCursor: T = typeof this.#step === 'function' 
            ? this.#step(this.#cursor, this.#iteration) 
            : this.#cursor + this.#step
        const isLast = this.#to <= nextCursor
        const res = { value: this.#cursor, done: isLast, i: this.#iteration }
        this.#cursor = nextCursor
        this.#iteration += 1

        this.#previous = res
        return res
    }
    static next(range) {
        return range.next()
    }

    step(stepFn) {
        this.#step = stepFn
        return this
    }

    array() {
        return [...this]
    }
    static makeArray(range) {
        return range.makeArray()
    }

    iterate(func: (t: T, i: number) => boolean | void) {
        let inst
        let toContinue = true
        do {
            inst = this.next()
            toContinue = func(inst.value, this.#iteration) ?? true
        } while (toContinue && !inst.done)
    }

    take(toOrFrom, toOrNull) {
        let from = 0
        let to = toOrFrom
        if (toOrNull != null) {
            from = toOrFrom
            to = toOrNull
        }

        const result = []

        this.iterate((val, i) => {
            console.log(val, i)
            if (i >= from) {
                result.push(val)
            }
            return i < to
        })

        return result
    }
    static take(range, toOrFrom, toOrNull) {
        return range.take(toOrFrom, toOrNull)
    }

    at(n: number) {
        if (n > 0) {
            this.skip(n - 1)
        }
        return this.next().value
    }

    skip(skipCount: number) {
        if (skipCount <= 0) return this

        this.iterate((_, i) => i < skipCount)
        return this
    }

    map<B>(fn: (t: T) => B): Range<B> {
        const range = this.clone() as unknown as Range<B>
        const next = this.next.bind(range)
        range.next = (): Iteration<B> => {
            const inst: Iteration<T> = next();
            (inst as unknown as Iteration<B>).value = fn(inst.value)
            return inst as unknown as Iteration<B>
        }
        return range 
    }

    filter(predicate) {
        const range = this.clone()
        const next = range.next.bind(range)
        range.next = () => {
            let inst
            do {
                inst = next()
            } while (!predicate(inst.value))
            return inst
        }
        return range
    }

    fold(fn, acc) {
        const range = this.clone()
        const next = range.next.bind(range)
        range.next = () => {
            const inst = next()
            acc = fn(acc, inst.value)
            inst.value = acc
            return inst
        }
        return range
    }

    slice(toOrFrom, toOrNull) {
        const range = this.clone()
        let from = 0
        let to = toOrFrom
        if (toOrNull != null) {
            from = toOrFrom
            to = toOrNull
        }

        range.skip(from)
        const next = range.next.bind(range)
        range.next = () => {
            const inst = next()
            if (range.iteration >= to) {
                inst.done = true
            }
            return inst
        }

        return range
    }

} 
