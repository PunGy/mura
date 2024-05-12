import {Node} from "src:/nodes/Node";
import {CanvasNode} from "src:/nodes/Node/CanvasNode";
import {AnimationNode} from "src:/nodes/Node/CanvasNode/AnimationNode";

export class Scene {
    protected nodes: Map<number, Node> = new Map()

    addNode(node: Node) {
        this.nodes.set(node.id, node)
    }
    removeNode(node: Node) {
        this.nodes.delete(node.id)
    }
    getNodes(): Readonly<Array<Node>> {
        return Array.from(this.nodes.values())
    }
    nodesTick(delta: number) {
        const nodes = this.nodes
        for (const node of nodes.values()) {
            node.act(delta)
            if (node instanceof CanvasNode)
                node.render()
            if (node instanceof AnimationNode)
                node.animate(delta)
        }
    }

    init(): void | Promise<void> {
        const effects: Array<Promise<void>> = []
        this.nodes.forEach((node) => {
            const effect = node.init()
            if (effect instanceof Promise)
                effects.push(effect)
        })

        if (effects.length > 0) {
            return Promise.allSettled(effects)
                .then((results) => {
                    results.forEach((res) => {
                        if (res.status === 'rejected')
                            console.error('unable to make an effect', res.reason)
                    })
                })
        }
    }
}
