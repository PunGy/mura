import type { ActionController } from "../action"
import type { KeyboardKey } from "../types"
import { keys } from "./keys"

type Code = string

export class KeyboardController {
    keys = keys

    constructor() {}

    keyToActions = new Map<Code, Map<string, ActionController>>()
    init() {
        window.addEventListener('keydown', (event) => {
            muraLog(event.code)
            const actions = this.keyToActions.get(event.code)
            if (actions) {
                actions.forEach(controller => {
                    controller.pressed()
                })
            }
        })
        window.addEventListener('keyup', (event) => {
            const actions = this.keyToActions.get(event.code)
            if (actions) {
                actions.forEach(controller => {
                    controller.released()
                })
            }
        })
    }

    registerAction(controller: ActionController, trigger: KeyboardKey) {
        let pool = this.keyToActions.get(trigger.code)
        if (!pool) {
            pool = new Map()
            this.keyToActions.set(trigger.code, pool)
        }
        pool.set(controller.actionName, controller)
    }

    removeAction(controller: ActionController) {
        for (const [code, pool] of this.keyToActions) {
            if (pool.get(controller.actionName) === controller) {
                this.keyToActions.delete(code)
            }
        }
    }
}
