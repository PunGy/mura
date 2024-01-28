import { Node } from 'src:/nodes/Node'
import {ServiceProvider} from "src:/services/ServiceProvider.ts";
import {CHUNK_SIZE} from "src:/scenes/SceneSettings.ts";
export class Camera extends Node {
  private readonly fixedNode: Node;

  constructor(fixedOn: Node) {
    super();

    this.fixedNode = fixedOn
  }
  act() {
    const render = ServiceProvider.get('RenderService')
    const viewport = ServiceProvider.get('ViewportService')
    const { width, height, position } = this.fixedNode

    this.position.x = (position.x - viewport.width / 2) + (width * CHUNK_SIZE / 2)
    this.position.y = (position.y - viewport.height / 2) + (height * CHUNK_SIZE / 2)

    render.offsetX = this.position.x
    render.offsetY = this.position.y
  }
}