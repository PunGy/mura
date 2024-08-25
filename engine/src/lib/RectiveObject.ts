import { Observable, Subscription } from "rxjs"

export class ReactiveObject {
    protected subscriptions: Map<Observable<unknown>, Subscription[]> = new Map()
    safeSubscribe<O>(observable: Observable<O>, cb: (value: O) => void) {
        const pool = this.subscriptions.get(observable)
        if (pool) {
            pool.push(observable.subscribe(cb))
        } else {
            this.subscriptions.set(observable, [observable.subscribe(cb)])
        }
    }
    clearSubscriptions() {
        for (const subs of this.subscriptions.values()) {
            subs.forEach(sub => sub.unsubscribe())
        }
        this.subscriptions.clear()
    }
}
