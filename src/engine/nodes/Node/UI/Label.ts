import { ServiceProvider } from "src:/services/ServiceProvider";
import { Scene } from "src:/scenes/Scene";
import { CanvasNode } from "../CanvasNode";

export class Label<T extends Scene> extends CanvasNode<T> {

    constructor(
        scene: T,
        public text: string,
        public size: number = 16,
        public color?: string,
    ) {
        super(scene)
        this.width = text.length * size
        this.height = size

        this.safeSubscribe(this.$renderSignal, () => {
            ServiceProvider.get('RenderService')
                .text(
                    this.text,
                    this.position.x,
                    this.position.y,
                    (this.size ?? this.color) ? { fontSize: this.size, color: this.color } : undefined
                )
        })
    }
}
