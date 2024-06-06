import { Node } from 'engine:/nodes/Node'
import { Scene } from 'engine:/scenes/Scene';
import { ServiceProvider } from 'engine:/services/ServiceProvider';

export class CanvasNode<T extends Scene> extends Node<T> {
    constructor(scene: T) {
        super(scene)
        if (this.debug) {
            this.safeSubscribe(this.$renderSignal, () => this.drawDebugRect())
        }
    }

    get $renderSignal() {
        return ServiceProvider.get('EventService').$renderSignal
    } 
}
