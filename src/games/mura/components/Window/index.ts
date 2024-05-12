import WallSprite from './img.png'
import {SpriteNode} from "src:/nodes/Node/CanvasNode/SpriteNode";

export class Window extends SpriteNode {
  collided = true
  constructor() {
    super(WallSprite);
  }
}