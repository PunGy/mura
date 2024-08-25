import type { ListNode } from "engine:/lib/LinkedList";
import { LinkedList } from "engine:/lib/LinkedList"

interface Serializable<T = unknown> {
    serialize(): T;
}

export class State {
    trackingObjects: Array<Serializable>
    states: LinkedList<Array<unknown>> = new LinkedList()
    private _activeState: ListNode<Array<unknown>> | null = null

    constructor(objectsToTrack: Array<Serializable>) {
        this.trackingObjects = objectsToTrack
    }

    activeState() {
        return this._activeState?.value ?? null
    }
    snapshot() {
        if (this.states.peekTail() !== this._activeState && this._activeState) {
            this.states.setTail(this._activeState)
        }
        this.states.pushBack(this.trackingObjects.map(obj => obj.serialize()))
    }
    back() {
        if (!this._activeState) return null;
        this._activeState = this._activeState.prev
        return this.activeState()
    }
}
