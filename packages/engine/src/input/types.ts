export enum KeyType {
    KEYBOARD,
    MOUSE,
    GAMEPAD,
}

export interface KeyboardKey {
    type: KeyType.KEYBOARD
    code: string;
}

export interface MouseKey {
    type: KeyType.MOUSE
}

export interface GamepadKey {
    type: KeyType.GAMEPAD
}

export type Key = KeyboardKey | MouseKey | GamepadKey

export interface ActionEntry {
    actionName: string;
    triggers: Array<Key>
}
