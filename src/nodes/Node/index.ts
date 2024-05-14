import { assert } from "src:/lib";
import { Vector } from "src:/lib/vector";
import {ServiceProvider} from "src:/services/ServiceProvider.ts";

export class Node {
    private static lastId = 0
    static issueId() {
        return Node.lastId++
    }

    public position: Vector = new Vector(0, 0)
    public readonly id: number

    public collidable = false

    // With what kind of objects this node collided
    public collidesWith: Set<string> = new Set()
    // To what kind of objects for colliding this node related
    public collideGroup: Set<string> = new Set()

    // The size of objects is measured in chunks (see in src:/scenes/SceneSettings)
    // Example: { width: 2 } -> { width: CHUNK_SIZE * 2 }
    public width: number = 1
    public height: number = 1

    constructor() {
        this.id = Node.issueId()
    }

    init(): void | Promise<void> {};
    act(delta: number): void {
        if (this.collidable) {
            const node = this.getCollision()
            if (node) {
                this.collisionOccured(node)
            }
        }
    }

    protected onCollisionCallback?: (node: Node) => void;
    onCollided(cb: (node: Node) => void) {
        this.onCollisionCallback = cb
    }

    protected collisionOccured(node: Node): void {
        this.onCollisionCallback?.(node)
    } 

    protected getCollision(): Node | undefined {
        if (!this.collidable) return

        const scene = ServiceProvider.get('SceneService').activeScene
        const nodes = scene.getNodesFromGroups(this.collidesWith)

        const p1 = this.position
        const p1x2 = p1.x + this.width
        const p1y2 = p1.y + this.height
        return nodes.find((node) => {
            if (!node.collidable) return false;
            const p2 = node.position
            const p2x2 = p2.x + node.width
            const p2y2 = p2.y + node.height

            return (
                p1.x < p2x2 && p1x2 > p2.x &&
        p1.y < p2y2 && p1y2 > p2.y
            )
        })
    }

    protected destoyCallback: (() => void) | null = null;
    destroy() {
        const scene = ServiceProvider.get('SceneService').activeScene
        scene.removeNode(this)
        if (this.collideGroup.size > 0) {
            this.collideGroup.forEach(group => {
                const nodes = scene.collideGroups.get(group)!
                const nodeInx = nodes.findIndex(node => node.id === this.id)
                console.log(nodeInx)
                assert(nodeInx >= 0, 'Cannot find node in group for deletion!!!')

                nodes.splice(nodeInx, 1)
            })
        }
        this.destoyCallback?.()
    }

    onDestroyed(cb: () => void) {
        this.destoyCallback = cb
    }

    drawDebugRect(color = 'yellow') {
        const renderService = ServiceProvider.get('RenderService')
        const ctx = renderService.getCtx()

        ctx.strokeStyle = color
        ctx.strokeRect(
            this.position.x - renderService.offsetX,
            this.position.y - renderService.offsetY,
            this.width,
            this.height,
        )
    }
}
