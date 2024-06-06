import { Observable, Subject } from "rxjs";
import { ReactiveObject } from "engine:/lib/RectiveObject";
import { Node } from "engine:/nodes/Node";

export class Scene extends ReactiveObject {
    private _nodes: Map<number, Node> = new Map()
    private $_nodesChangedSignal: Subject<ReadonlyMap<number, Node>> = new Subject()
    $nodesChangedSignal: Observable<ReadonlyMap<number, Node>> = this.$_nodesChangedSignal
    collideGroups: Map<string, Array<Node>> = new Map()

    get nodes(): ReadonlyMap<number, Node> {
        return this._nodes;
    }

    protected nodesToInit: Array<Node> = []
    protected initScheduled = false
    initNodesEffect: Promise<void> | null = null

    addNode(node: Node) {
        this._nodes.set(node.id, node)
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
        this._nodes.delete(node.id)
        this.$_nodesChangedSignal.next(this.nodes)
    }
    getAllNodes(): Readonly<Array<Node>> {
        return Array.from(this.nodes.values())
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
