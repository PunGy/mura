import { Node } from "src:/nodes/Node";
import { CanvasNode } from "src:/nodes/Node/CanvasNode";
import { ServiceProvider } from "src:/services/ServiceProvider";
import { Player } from "../Player";
import { Enemy } from "../Enemy";

export enum BulletType {
    PLAYER = 'player',
    ENEMY1 = 'enemy1',
    ENEMY2 = 'enemy2',
    ENEMY3 = 'enemy3',
}

export class Bullet<T extends BulletType> extends CanvasNode {
    width = 4
    height = 12
    speed = 0.8

    collidable = true

    readonly bulletType: T 

    constructor(bulletType: T) {
        super()
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
        if (this.position.y <= 0) {
            this.destroy()
        }
    }

    onCollided(cb: (node: T extends BulletType.PLAYER ? Enemy : Player) => void): void {
        // @ts-expect-error I'm kinda dump :(
        this.onCollisionCallback = cb
    }

    protected collisionOccured(node: Node): void {
        super.collisionOccured(node)
        node.destroy()
        this.destroy()
    }

}
