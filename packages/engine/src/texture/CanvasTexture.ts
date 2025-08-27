import { Texture } from "./Texture"

export class CanvasTexture extends Texture {
    color: string = '#ffffff'

    draw(): void {
        this.node.app.viewport.renderer.rect(this.node.x, this.node.y, this.node.width, this.node.height, this.color, 'fill')
    }
}
