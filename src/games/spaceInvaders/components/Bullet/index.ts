import { CanvasNode } from "src:/nodes/Node/CanvasNode";
import { ServiceProvider } from "src:/services/ServiceProvider";

export class Bullet extends CanvasNode {
    width = 4
    height = 12
    speed = 0.8

    render() {
        const renderService = ServiceProvider.get('RenderService')
        renderService.rect(this.position.x, this.position.y, this.width, this.height, 'white')
    }

    act(delta: number) {
        this.position.y -= this.speed * delta
        if (this.position.y <= 0) {
            ServiceProvider.get('SceneService').activeScene.removeNode(this)
        }
    }
}
