import { assert } from "src:/lib";
import { Scene } from "src:/scenes/Scene";
import {ServiceProvider} from "src:/services/ServiceProvider.ts";
import { merge, BehaviorSubject, Observable, filter, Subject, Subscription, tap } from 'rxjs'
import { ReactiveObject } from "src:/lib/RectiveObject";
import { Vector, isCollidedNodes } from "src:/lib/geometry";


export class Node<T extends Scene = Scene> extends ReactiveObject {
    private static lastId = 0
    static issueId() {
        return Node.lastId++
    }

    protected subscriptions: Map<Observable<unknown>, Subscription[]> = new Map()

    public $position: BehaviorSubject<Vector> = new BehaviorSubject(new Vector(0, 0))
    get position() {
        return this.$position.value
    }
    public readonly id: number

    public $collidable: BehaviorSubject<boolean> = new BehaviorSubject(false)
    get collidable() {
        return this.$collidable.value
    }
    set collidable(collides: boolean) {
        this.$collidable.next(collides)
    }

    // With what kind of objects this node collided
    public collidesWith: Set<string> = new Set()
    // To what kind of objects for colliding this node related
    public collideGroup: Set<string> = new Set()

    public $width: BehaviorSubject<number> = new BehaviorSubject(1)
    public $height: BehaviorSubject<number> = new BehaviorSubject(1)
    get width() {
        return this.$width.value
    }
    set width(value) {
        this.$width.next(value)
    }
    get height() {
        return this.$height.value
    }
    set height(value) {
        this.$height.next(value)
    }


    debug: boolean = false
    debugColor: string = 'yellow'

    public scene: T

    private $boundingBoxChange = merge(this.$x, this.$y, this.$width, this.$height)
    private boundingBoxSub: Subscription | null = null
    constructor(scene: T) {
        super()
        this.id = Node.issueId()
        this.scene = scene

        this.$collidable
            .pipe(
                tap(() => {
                    this.boundingBoxSub?.unsubscribe()
                    this.boundingBoxSub = null
                }),
                filter(collide => !collide)
            ).subscribe(
                () => {
                    this.boundingBoxSub = this.$boundingBoxChange
                        .subscribe(
                            () => {
                                const node = this.getCollision()
                                if (node) {
                                    this.$_collidedWith.next(node)
                                }
                            }
                        )

                }
            )
    }
    private $_collidedWith: Subject<Node> = new Subject()
    $collisionSignal: Observable<Node> = this.$_collidedWith

    init(): void | Promise<void> {};

    protected getCollision(): Node | undefined {
        if (!this.$collidable.value) return

        const scene = ServiceProvider.get('SceneService').activeScene
        const nodes = scene.getNodesFromGroups(this.collidesWith)

        return nodes.find((node) => {
            if (!node.$collidable.value) return false;
            return isCollidedNodes(this, node)
        })
    }
    private $_destroyed = new Subject<void>()
    $destroySignal: Observable<void> = this.$_destroyed
    private $_actSignal = new Subject<number>()
    $actSignal: Observable<number> = this.$_actSignal
    act(delta: number) {
        this.$_actSignal.next(delta)
    }

    destroy() {
        const scene = ServiceProvider.get('SceneService').activeScene
        scene.removeNode(this)
        if (this.collideGroup.size > 0) {
            this.collideGroup.forEach(group => {
                const nodes = scene.collideGroups.get(group)!
                const nodeInx = nodes.findIndex(node => node.id === this.id)
                assert(nodeInx >= 0, 'Cannot find node in group for deletion!!!')

                nodes.splice(nodeInx, 1)
            })
        }

        this.$_destroyed.next()
        this.$_destroyed.complete()
        this.$position.complete()
        this.$height.complete()
        this.$collidable.complete()
        this.$_collidedWith.complete()
        this.clearSubscriptions()
    }

    drawDebugRect(color = this.debugColor) {
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
