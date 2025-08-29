export type ActionListener = () => void

enum ActionType {
    released = -1,
    pressed = 1
}
type ReleasedDesc = { i: number, type: ActionType.released }
type PressedDesc = { i: number, type: ActionType.pressed }

export class ActionController {
    private releasedListeners = new Map<number, ActionListener>()
    private pressedListeners = new Map<number, ActionListener>()
    private lastReleasedId = 0
    private lastPressedId = 0

    isActive = false

    constructor(public actionName: string) {}

    addReleasedListener(listener: ActionListener): ReleasedDesc {
        const id = this.lastReleasedId++
        this.releasedListeners.set(id, listener)
        return { i: id, type: ActionType.released }
    }
    addPressedListener(listener: ActionListener): PressedDesc {
        const id = this.lastPressedId++
        this.pressedListeners.set(id, listener)
        return { i: id, type: ActionType.pressed }
    }

    removeListener(desc: ReleasedDesc | PressedDesc) {
        if (desc.type === ActionType.released) {
            this.releasedListeners.delete(desc.i)
        } else {
            this.pressedListeners.delete(desc.i)
        }
    }

    destroy() {
        this.pressedListeners.clear()
        this.releasedListeners.clear()
    }

    pressed() {
        if (this.isActive)
            return

        this.isActive = true
        for (const listener of this.pressedListeners.values()) {
            listener()
        }
    }
    released() {
        this.isActive = false
        for (const listener of this.releasedListeners.values()) {
            listener()
        }
    }
}
