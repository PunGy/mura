import {UniqueStack} from "src:/lib/stack.ts";

type EventCallback = () => void;

type EventObject = {
    callback: EventCallback;
    locked: boolean;
}

export class InputService {
    private keyStack = new UniqueStack<string>()
    private events: Record<string, EventObject> = {}
    // private keyupEvents: Record<string, EventObject> = {}

    get activeKey() {
        return this.keyStack.peek()
    };
    get keysPressed() {
        const keys: Record<string, boolean> = {}
        this.keyStack.forEach(key => keys[key] = true)
        return keys
    }

    register(key: string, callback: EventCallback) {
        const config = {
            callback,
            locked: false,
        }
        this.events[key] = config
    }

    init() {
        document.addEventListener('keydown', (event) => {
            const code = event.code
            this.keyStack.push(code)
            if (code in this.events && !this.events[code].locked) {
                const cfg = this.events[code]
                cfg.callback()
                cfg.locked = true
            }
        })
        document.addEventListener('keyup', (event) => {
            const code = event.code
            this.keyStack.delete(event.code)
            if (code in this.events && this.events[code].locked) {
                this.events[code].locked = false 
            }
        })
    }
}
