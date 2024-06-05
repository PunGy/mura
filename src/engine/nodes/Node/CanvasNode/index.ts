import { Observable, Subject } from 'rxjs';
import { Node } from 'engine:/nodes/Node'
import { Scene } from 'engine:/scenes/Scene';

export class CanvasNode<T extends Scene> extends Node<T> {
    constructor(scene: T) {
        super(scene)
        this.safeSubscribe(this.$actSignal, (delta) => {
            this.$_renderSignal.next(delta)
        })
        if (this.debug) {
            this.safeSubscribe(this.$_renderSignal, () => this.drawDebugRect())
        }
    }

    private $_renderSignal = new Subject<number>()
    $renderSignal: Observable<number> = this.$_renderSignal
    render(delta: number) {
        this.$_renderSignal.next(delta)
    }
}
