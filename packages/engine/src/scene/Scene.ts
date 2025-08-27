import { Application } from "@mura/engine/src/application/Application"
import { Node } from "@mura/engine/src/node/Node"

export class Scene {
    id: string
    nodes: Array<Node> = []

    constructor(public app: Application, id?: string) {
        this.id = id ? `Scene: [${id}]` : 'Scene'
    }

    private connectNode(node: Node) {
        node.init()
    }

    addNode(node: Node) {
        this.connectNode(node)
        this.nodes.push(node)
    }
}
