import {UniqueStack} from "src:/lib/stack.ts";


export class InputService {
  private keyStack = new UniqueStack<string>()

  get activeKey() {
    return this.keyStack.peek()
  };
  get keysPressed() {
    let keys: Record<string, boolean> = {}
    this.keyStack.forEach(key => keys[key] = true)
    return keys
  }

  init() {
    document.addEventListener('keydown', (event) => {
      this.keyStack.push(event.code)
    })
    document.addEventListener('keyup', (event) => {
      this.keyStack.delete(event.code)
    })
  }
}
