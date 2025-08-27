import { Application } from '@mura/engine/src/application/Application';
import { lobiLog } from './lib/lobiLog';
import { Node } from '@mura/engine/src/node/Node'
import { Scene } from '@mura/engine/src/scene/Scene';
import { Fluid } from 'reactive-fluid'

class RectNode extends Node {
    width = 20
    height = 20

    onConnect(): void {
        const app = this.app!;

        // px/s
        const speed = 30 / 1000
        let dir = 1

        let time = 0;
        Fluid.listen(app.tick, (delta) => {
            this.x += speed * delta * dir

            if (dir === 1 && this.x >= app.width) {
                lobiLog.info('passed in', time)
                dir = -1
                this.x = app.width
                time = 0
            } else if (dir === -1 && this.x < 0) {
                lobiLog.info('passed in', time)
                dir = 1
                this.x = 0
                time = 0
            }

            app.viewport.renderer.rect(this.x, this.y, this.width, this.height, 'green', 'fill')
        })
    }
}

export class LoBiApplication extends Application {
    width = 800
    height = 600

    init(): void {
        super.init()
        lobiLog.info('initialized!')
        const scene = new Scene()
        this.setScene(scene)
        scene.addNode(new RectNode)
    }
}
