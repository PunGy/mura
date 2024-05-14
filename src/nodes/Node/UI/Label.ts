import { ServiceProvider } from "src:/services/ServiceProvider";
import { CanvasNode } from "../CanvasNode";

export class Label extends CanvasNode {

    constructor(
        public text: string,
        public size?: number,
        public color?: string,
    ) {
        super()
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
