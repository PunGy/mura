import WaterResource from './water.jpeg'
import {SpriteNode} from "src:/nodes/Node/CanvasNode/SpriteNode";

export class Water extends SpriteNode {
  constructor() {
    super(WaterResource);
  }
}
