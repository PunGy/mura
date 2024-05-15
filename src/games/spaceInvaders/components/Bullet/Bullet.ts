import { Node } from "src:/nodes/Node";
import { CanvasNode } from "src:/nodes/Node/CanvasNode";
import { ServiceProvider } from "src:/services/ServiceProvider";
import { Player } from "../Player";
import { Enemy } from "../Enemy";
import { MainScene } from "../../scenes/MainScene";

export enum BulletType {
    PLAYER = 'player',
    ENEMY2 = 'enemy1',
    ENEMY3 = 'enemy2',
    ENEMY4 = 'enemy3',
}

export class Bullet<T extends BulletType> extends CanvasNode<MainScene> {
    width = 5
    height = 13
    speed = 0.5

    collidable = true

    readonly bulletType: T 

    constructor(scene: MainScene, bulletType: T) {
        super(scene)
        this.bulletType = bulletType

        this.collidesWith = new Set([bulletType === BulletType.PLAYER ? 'enemy' : 'player'])
    }

    render() {
        const renderService = ServiceProvider.get('RenderService')
        renderService.rect(this.position.x, this.position.y, this.width, this.height, 'white')
    }

    act(delta: number) {
        super.act(delta)
        this.position.y -= this.speed * delta
        if (this.position.y <= 1) {
            this.destroy()
        }
    }

    onCollided(cb: (node: T extends BulletType.PLAYER ? Enemy : Player) => void): void {
        // @ts-expect-error I'm kinda dump :(
        this.onCollisionCallback = cb
    }

    protected collisionOccured(node: Node): void {
        node.destroy()
        super.collisionOccured(node)
        this.destroy()
    }

}
