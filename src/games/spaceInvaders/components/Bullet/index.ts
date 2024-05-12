import { Node } from "src:/nodes/Node";
import { CanvasNode } from "src:/nodes/Node/CanvasNode";
import { ServiceProvider } from "src:/services/ServiceProvider";

export class Bullet extends CanvasNode {
    width = 4
    height = 12
    speed = 0.8

    collidable = true
    collidesWith = new Set(['enemy'])

    render() {
        const renderService = ServiceProvider.get('RenderService')
        renderService.rect(this.position.x, this.position.y, this.width, this.height, 'white')
    }

    act(delta: number) {
        super.act(delta)
        this.position.y -= this.speed * delta
        if (this.position.y <= 0) {
            this.destroy()
        }
    }

    onCollided(node: Node): void {
        node.destroy()
        this.destroy()
    }

}
