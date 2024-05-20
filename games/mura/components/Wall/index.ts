import WallSprite from './img.png'
import {SpriteNode} from "src:/nodes/Node/CanvasNode/SpriteNode";

export class Wall extends SpriteNode {
  collided = true
  constructor() {
    super(WallSprite);
  }
}