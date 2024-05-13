import WallSprite from './img.png'
import {SpriteNode} from "src:/nodes/Node/CanvasNode/SpriteNode";

export class Floor extends SpriteNode {
  constructor() {
    super(WallSprite);
  }
}