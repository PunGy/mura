import SandResource from './sand.png'
import {SpriteNode} from "src:/nodes/Node/CanvasNode/SpriteNode";

export class Sand extends SpriteNode {
  constructor() {
    super(SandResource);
  }
}
