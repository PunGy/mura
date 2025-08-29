import { SpriteNode } from "@mura/engine/src/node/SpriteNode"
import { CanvasTexture } from "@mura/engine/src/texture/CanvasTexture"
import { Fluid } from 'reactive-fluid'

export class SlidingNode extends SpriteNode {
    width = 50
    height = 50

    texture = new CanvasTexture(this)

    init(): void {
        super.init()

        this.texture.color = 'green'

        // px/s
        const speed = 500 / 1000
        let dir = 1

        Fluid.listen(this.app.tick, (delta) => {
            this.x += speed * delta * dir

            if (dir === 1 && (this.x + this.width) >= this.app.width) {
                this.x = this.app.width - this.width
                dir = -1
            } else if (dir === -1 && this.x < 0) {
                this.x = 0
                dir = 1
            }
        })
    }
}
