import { KeyType, type KeyboardKey } from "../types"

function makeKey(code: string): KeyboardKey {
    return { type: KeyType.KEYBOARD, code }
}

export const keys = {
    // Alphabet - Top Row
    Q: makeKey('KeyQ'),
    W: makeKey('KeyW'),
    E: makeKey('KeyE'),
    R: makeKey('KeyR'),
    T: makeKey('KeyT'),
    Y: makeKey('KeyY'),
    U: makeKey('KeyU'),
    I: makeKey('KeyI'),
    O: makeKey('KeyO'),
    P: makeKey('KeyP'),

    // Alphabet - Home Row
    A: makeKey('KeyA'),
    S: makeKey('KeyS'),
    D: makeKey('KeyD'),
    F: makeKey('KeyF'),
    G: makeKey('KeyG'),
    H: makeKey('KeyH'),
    J: makeKey('KeyJ'),
    K: makeKey('KeyK'),
    L: makeKey('KeyL'),

    // Alphabet - Bottom Row
    Z: makeKey('KeyZ'),
    X: makeKey('KeyX'),
    C: makeKey('KeyC'),
    V: makeKey('KeyV'),
    B: makeKey('KeyB'),
    N: makeKey('KeyN'),
    M: makeKey('KeyM'),

    // Top Row Numbers (D for Digit)
    D0: makeKey('Digit0'),
    D1: makeKey('Digit1'),
    D2: makeKey('Digit2'),
    D3: makeKey('Digit3'),
    D4: makeKey('Digit4'),
    D5: makeKey('Digit5'),
    D6: makeKey('Digit6'),
    D7: makeKey('Digit7'),
    D8: makeKey('Digit8'),
    D9: makeKey('Digit9'),

    // Special Characters
    MINUS:       makeKey('Minus'),
    EQUAL:       makeKey('Equal'),
    BACKSPACE:   makeKey('Backspace'),
    BACKQUOTE:   makeKey('Backquote'), // `~
    BRACKET_LEFT:  makeKey('BracketLeft'), // [
    BRACKET_RIGHT: makeKey('BracketRight'), // ]
    BACKSLASH:     makeKey('Backslash'), // \
    SEMICOLON:     makeKey('Semicolon'), // ;
    QUOTE:         makeKey('Quote'), // '
    COMMA:         makeKey('Comma'), // ,
    PERIOD:        makeKey('Period'), // .
    SLASH:         makeKey('Slash'), // /

    // Control Keys
    ENTER:     makeKey('Enter'),
    ESCAPE:    makeKey('Escape'),
    SPACE:     makeKey('Space'),
    TAB:       makeKey('Tab'),
    CAPS_LOCK: makeKey('CapsLock'),

    // Arrow Keys
    LEFT:  makeKey('ArrowLeft'),
    UP:    makeKey('ArrowUp'),
    RIGHT: makeKey('ArrowRight'),
    DOWN:  makeKey('ArrowDown'),

    // Function Keys
    F1:  makeKey('F1'),
    F2:  makeKey('F2'),
    F3:  makeKey('F3'),
    F4:  makeKey('F4'),
    F5:  makeKey('F5'),
    F6:  makeKey('F6'),
    F7:  makeKey('F7'),
    F8:  makeKey('F8'),
    F9:  makeKey('F9'),
    F10: makeKey('F10'),
    F11: makeKey('F11'),
    F12: makeKey('F12'),

    // Navigation Keys (Home, End, etc.)
    INSERT:    makeKey('Insert'),
    DELETE:    makeKey('Delete'),
    HOME:      makeKey('Home'),
    END:       makeKey('End'),
    PAGE_UP:   makeKey('PageUp'),
    PAGE_DOWN: makeKey('PageDown'),

    // Numpad Keys (NP for Numpad)
    NP0: makeKey('Numpad0'),
    NP1: makeKey('Numpad1'),
    NP2: makeKey('Numpad2'),
    NP3: makeKey('Numpad3'),
    NP4: makeKey('Numpad4'),
    NP5: makeKey('Numpad5'),
    NP6: makeKey('Numpad6'),
    NP7: makeKey('Numpad7'),
    NP8: makeKey('Numpad8'),
    NP9: makeKey('Numpad9'),
    NP_ADD:       makeKey('NumpadAdd'),
    NP_SUBTRACT:  makeKey('NumpadSubtract'),
    NP_MULTIPLY:  makeKey('NumpadMultiply'),
    NP_DIVIDE:    makeKey('NumpadDivide'),
    NP_DECIMAL:   makeKey('NumpadDecimal'),
    NP_ENTER:     makeKey('NumpadEnter'),
}
