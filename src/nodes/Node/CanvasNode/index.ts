import { Node } from 'src:/nodes/Node'
import { Scene } from 'src:/scenes/Scene';

export class CanvasNode<T extends Scene> extends Node<T> {
    render(): void {};
}
