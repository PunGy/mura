import {Node} from "src:/nodes/Node";
import {CanvasNode} from "src:/nodes/Node/CanvasNode";
import {AnimationNode} from "src:/nodes/Node/CanvasNode/AnimationNode";

export class Scene {
  protected nodes: Array<Node> = []

  addNode(node: Node) {
    this.nodes.push(node)
  }
  getNodes(): Readonly<Array<Node>> {
    return this.nodes
  }
  nodesTick(delta: number) {
    const nodes = this.nodes
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i]
      node.act(delta)
      if (node instanceof CanvasNode)
        node.render()
      if (node instanceof AnimationNode)
        node.animate(delta)
    }
  }


  init(): void | Promise<void> {}
}