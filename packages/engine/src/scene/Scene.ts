import { Application } from "@mura/engine/src/application/Application"
import { Node, type CNode } from "@mura/engine/src/node/Node"

export class Scene {
    app?: Application
    id: string
    nodes: Array<CNode> = []

    constructor(id?: string) {
        this.id = id ? `Scene: [${id}]` : 'Scene'
    }

    private connectNode(node: Node): asserts node is CNode {
        node.scene = this
        node.app = this.app
        if (node.onConnect) {
            node.onConnect(this)
        }
    }

    addNode(node: Node) {
        this.connectNode(node)
        this.nodes.push(node)
    }
}
