import WallSprite from './img.png'
import {SpriteNode} from "src:/nodes/Node/CanvasNode/SpriteNode";

export class Door extends SpriteNode {
    constructor() {
        super(WallSprite);
    }
}
