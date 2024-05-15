import {Node} from "src:/nodes/Node";
import {CanvasNode} from "src:/nodes/Node/CanvasNode";
import {AnimationNode} from "src:/nodes/Node/CanvasNode/AnimationNode";

export class Scene {
    protected nodes: Map<number, Node> = new Map()
    collideGroups: Map<string, Array<Node>> = new Map()

    protected nodesToInit: Array<Node> = []
    protected initScheduled = false
    initNodesEffect: Promise<void> | null = null
    addNode(node: Node) {
        this.nodes.set(node.id, node)
        if (node.collideGroup.size > 0) {
            node.collideGroup.forEach(group => {
                const nodes = this.collideGroups.get(group)
                if (nodes) {
                    nodes.push(node)
                } else {
                    this.collideGroups.set(group, [node])
                }
            })
        }
        if (!this.initScheduled) {
            this.initScheduled = true
            this.initNodesEffect = Promise.resolve().then(() => {
                return this.initNodes()
            }).then(() => {
                this.initScheduled = false
            })
        }
        this.nodesToInit.push(node)
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

    getNodesFromGroups(groups: Set<string>): Array<Node> {
        const nodes: Array<Node> = []
        const { collideGroups } = this

        groups.forEach(group => {
            if (collideGroups.has(group)) {
                nodes.push(...collideGroups.get(group)!)
            }
        })

        return nodes
    }

    initNodes() {
        const effects: Array<Promise<void>> = []
        for (let i = 0; i < this.nodesToInit.length; i++) {
            const node = this.nodesToInit[i]
            const effect = node.init()
            if (effect instanceof Promise)
                effects.push(effect)
        }
        this.nodesToInit = []
        console.log(effects)

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

    init(): void | Promise<void> {}
}
