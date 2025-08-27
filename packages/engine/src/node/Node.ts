import { Application } from '@mura/engine/src/application/Application'
import { type Rect } from '@mura/engine/src/lib/geometry/rect'
import { Scene } from '@mura/engine/src/scene/Scene'
import { Fluid } from 'reactive-fluid'

class NodeRegistry {
    private lastId = 0

    private issueID() {
        return this.lastId++
    }

    private nodes = new Map<number, Node>()

    add(node: Node) {
        node.id = this.issueID()
        this.nodes.set(node.id, node)
    }
    get(id: number) {
        return this.nodes.get(id)
    }
    delete(node: Node) {
        this.nodes.delete(node.id)
    }
}

export interface InspectNodeConfig {
    color: string;
    stopInspect: () => void;
}

export class Node implements Rect {
    x: number = 0
    y: number = 0
    width: number = 0
    height: number = 0

    scene: Scene
    get app() {
        return this.scene.app
    }

    id!: number

    constructor(scene: Scene) {
        this.scene = scene
        Node.registry.add(this)
    }

    private inspectConfig?: InspectNodeConfig
    inspect(color: string) {
        if (this.app) {
            const viewport = this.app.viewport
            this.inspectConfig = {
                color,
                stopInspect: Fluid.listen(this.app.tick, () => {
                    viewport.renderer.rect(this.x, this.y, this.width, this.height, this.inspectConfig!.color, 'stroke')
                }),
            }
        }
    }
    stopInspect() {
        if (this.inspectConfig) {
            this.inspectConfig.stopInspect()
            this.inspectConfig = undefined
        }
    }

    /**
     * Called upon connecting to scene and app
     */
    init() {}

    destroy() {
        Node.registry.delete(this)
    }

    static registry = new NodeRegistry()
}
