import GrassResource from './grass2.png'
import {SpriteNode} from "src:/nodes/Node/CanvasNode/SpriteNode";

export class Grass extends SpriteNode {
  constructor() {
    super(GrassResource);
  }
}