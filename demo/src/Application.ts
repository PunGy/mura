import { Application } from '@mura/engine/src/application/Application';
import { Scene } from '@mura/engine/src/scene/Scene';
import type { StratchingStrategy } from '@mura/engine/src/viewport/types';
import { MovingNode } from './MovingNode';

export class LoBiApplication extends Application {
    title = "LoBi"

    width = 800
    height = 600

    background = '#1D1D1F'
    viewportStractching: StratchingStrategy = 'fit-viewport'

    init(): void {
        super.init()

        const keyboard = this.input.keyboardController
        this.input.registerActions([
            {
                actionName: 'Up',
                triggers: [
                    keyboard.keys.W,
                    keyboard.keys.UP,
                ],
            },
            {
                actionName: 'Down',
                triggers: [
                    keyboard.keys.S,
                    keyboard.keys.DOWN,
                ],
            },
            {
                actionName: 'Right',
                triggers: [
                    keyboard.keys.D,
                    keyboard.keys.RIGHT,
                ],
            },
            {
                actionName: 'Left',
                triggers: [
                    keyboard.keys.A,
                    keyboard.keys.LEFT,
                ],
            }
        ])
        gameLog.info('initialized!')

        const scene = new Scene(this)
        this.setScene(scene)
        scene.addNode(new MovingNode(scene))
    }
}
