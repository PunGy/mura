import BedSprite from './bed.png'
import {SpriteNode} from "src:/nodes/Node/CanvasNode/SpriteNode";

export class Bed extends SpriteNode {
  constructor() {
    super(BedSprite);
  }
}
