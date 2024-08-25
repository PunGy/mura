import { CanvasNode } from "engine:/nodes/Node/CanvasNode";
import { ServiceProvider } from "engine:/services/ServiceProvider";
import type { Level } from "game:/scenes/Level";
import { first } from "rxjs";
import { mergeWith } from "rxjs/operators";

export class Panel extends CanvasNode<Level> {
    constructor(level: Level) {
        super(level)
        this.safeSubscribe(this.$renderSignal.pipe(first(), mergeWith(level.$gameTickSignal)), () => {
            console.log('render background')
            const renderer = ServiceProvider.get('RenderService')
            renderer.rect(this.position.x, this.position.y, this.width, this.height, '#eec39a')
        })
    }
}


