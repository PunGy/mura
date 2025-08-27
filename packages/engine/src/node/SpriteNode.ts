import { Fluid } from "reactive-fluid"
import type { Texture } from "../texture/Texture"
import { Node } from "./Node"

export class SpriteNode extends Node {
    texture?: Texture

    private stopDraw?: () => void
    init() {
        super.init()

        const texture = this.texture
        if (texture) {
            this.stopDraw = Fluid.listen(this.app.draw, () => {
                texture.draw()
            })
        }
    }

    destroy(): void {
        super.destroy()

        if (this.stopDraw) {
            this.stopDraw()
        }
    }

}
