import type { Application } from "../application/Application"
import { ActionController, type ActionListener } from "./action"
import { KeyboardController } from "./keyboard/KeyboardController"
import { KeyType, type ActionEntry } from "./types"

type ActionName = string

export class InputService {
    keyboardController = new KeyboardController()

    constructor(public app: Application) {}

    init() {
        this.keyboardController.init()
    }

    registerActions(actions: Array<ActionEntry>) {
        actions.forEach(action => this.registerAction(action))
    }
    registerAction(action: ActionEntry) {
        const { actionName, triggers } = action
        const controller = new ActionController(actionName)
        this.controllers.set(actionName, controller)

        triggers.forEach(trigger => {
            switch (trigger.type) {
            case KeyType.KEYBOARD:
                return this.keyboardController.registerAction(controller, trigger)
            // case KeyType.MOUSE:
            //     return this.mouseController.registerAction(actionName, trigger)
            // case KeyType.GAMEPAD:
            //     return this.gamepadController.registerAction(actionName, trigger)
            }
        })
    }
    removeAction(actionName: ActionName) {
        const controller = this.controllers.get(actionName)
        if (controller) {
            controller.destroy()
            this.controllers.delete(actionName)
            this.keyboardController.removeAction(controller)
        }
    }

    actions = new Map<ActionName, { pressed: () => void, released: () => void }>()
    private controllers = new Map<ActionName, ActionController>()
    onActionPressed(action: ActionName, fn: ActionListener) {
        const controller = this.controllers.get(action)
        if (controller) {
            return controller.addPressedListener(fn)
        }
    }
    onActionReleased(action: ActionName, fn: ActionListener) {
        const controller = this.controllers.get(action)
        if (controller) {
            return controller.addReleasedListener(fn)
        }
    }

    isActionActive(action: string) {
        const controller = this.controllers.get(action)
        if (controller) {
            return controller.isActive
        }
        return false
    }
}
