import { SpriteNode } from "@mura/engine/src/node/SpriteNode"
import { CanvasTexture } from "@mura/engine/src/texture/CanvasTexture"
import { Fluid } from 'reactive-fluid'

export class MovingNode extends SpriteNode {
    width = 50
    height = 50

    texture = new CanvasTexture(this)

    init(): void {
        super.init()
        this.texture.color = 'green'

        // px/s
        const speed = 500 / 1000

        this.app.input.onActionPressed('Up', () => {
            gameLog('ABOUT TO GO UP!')
        })
        this.app.input.onActionReleased('Up', () => {
            gameLog('STOPPING UPPING!')
        })
        this.app.input.onActionPressed('Down', () => {
            gameLog('ABOUT TO GO DOWN!')
        })
        this.app.input.onActionReleased('Down', () => {
            gameLog('STOPPING GOING DOWN!')
        })

        const input = this.app.input
        Fluid.listen(this.app.tick, (delta) => {
            if (input.isActionActive('Up')) {
                this.y -= speed * delta
            } else if (input.isActionActive('Down')) {
                this.y += speed * delta
            }

            if (input.isActionActive('Right')) {
                this.x += speed * delta
            } else if (input.isActionActive('Left')) {
                this.x -= speed * delta
            }
        })
    }
}
