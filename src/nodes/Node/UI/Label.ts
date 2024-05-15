import { ServiceProvider } from "src:/services/ServiceProvider";
import { CanvasNode } from "../CanvasNode";
import { MainScene } from "src:/games/spaceInvaders/scenes/MainScene";

export class Label extends CanvasNode<MainScene> {

    constructor(
        scene: MainScene,
        public text: string,
        public size?: number,
        public color?: string,
    ) {
        super(scene)
    }

    render() {
        ServiceProvider.get('RenderService')
            .text(
                this.text,
                this.position.x,
                this.position.y,
                (this.size ?? this.color) ? { fontSize: this.size, color: this.color } : undefined
            )
    }
}
