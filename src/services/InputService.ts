import { assertNil } from "src:/lib";
import {UniqueStack} from "src:/lib/stack.ts";

type EventCallback = () => void;

type EventObject = {
    callback: EventCallback;
    locked: boolean;
}

export class InputService {
    private keyStacks: Map<string, UniqueStack<string>> = new Map()
    private keyToGroup: Map<string, string> = new Map()
    private events: Record<string, EventObject> = {}
    private pressedKeys = new Set<string>()
    // private keyupEvents: Record<string, EventObject> = {}

    activeKeyOf(group: string) {
        if (this.keyStacks.has(group)) {
            return this.keyStacks.get(group)!.peek()
        }
    };
    // get keysPressed() {
    //     const keys: Record<string, boolean> = {}
    //     this.keyStack.forEach(key => keys[key] = true)
    //     return keys
    // }
    setKeyStackFor(group: string, keys: Array<string>) {
        keys.forEach(key => {
            this.keyToGroup.set(key, group)
        })
        if (!this.keyStacks.has(group)) {
            this.keyStacks.set(group, new UniqueStack())
        }
    }

    isPressed(key: string) {
        return this.pressedKeys.has(key)
    }

    registerKeyPress(key: string, callback: EventCallback) {
        const config = {
            callback,
            locked: false,
        }
        this.events[key] = config
    }

    init() {
        document.addEventListener('keydown', (event) => {
            const code = event.code
            this.pressedKeys.add(code)

            const keyGroup = this.keyToGroup.get(code)
            if (keyGroup) {
                const stack = this.keyStacks.get(keyGroup)
                assertNil(stack)
                stack.push(code)
            }

            if (code in this.events && !this.events[code].locked) {
                const cfg = this.events[code]
                cfg.callback()
                cfg.locked = true
            }
        })
        document.addEventListener('keyup', (event) => {
            const code = event.code
            this.pressedKeys.delete(code)

            const keyGroup = this.keyToGroup.get(code)
            if (keyGroup) {
                const stack = this.keyStacks.get(keyGroup)
                assertNil(stack)
                stack.delete(code)
            }

            if (code in this.events && this.events[code].locked) {
                this.events[code].locked = false 
            }
        })
    }
}
