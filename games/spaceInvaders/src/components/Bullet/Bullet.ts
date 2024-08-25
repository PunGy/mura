import { CanvasNode } from "@mura/engine/dist/nodes/Node/CanvasNode";
import { ServiceProvider } from "@mura/engine/dist/services/ServiceProvider";
import { MainScene } from "../../scenes/MainScene";

export enum BulletType {
    PLAYER = 'player',
    ENEMY2 = 'enemy1',
    ENEMY3 = 'enemy2',
    ENEMY4 = 'enemy3',
}

export class Bullet<T extends BulletType> extends CanvasNode<MainScene> {
    speed = 0.5


    readonly bulletType: T 

    constructor(scene: MainScene, bulletType: T) {
        super(scene)
        this.width = 5
        this.height = 13
        this.bulletType = bulletType
        this.collidable = true

        this.collidesWith = new Set([bulletType === BulletType.PLAYER ? 'enemy' : 'player'])
        this.safeSubscribe(this.$actSignal, (delta) => {
            this.y -= this.speed * delta
            if (this.y <= 1) {
                this.destroy()
            }
        })
        this.$collisionSignal.subscribe((node) => {
            node.destroy()
            this.destroy()
        })
        this.safeSubscribe(this.$renderSignal, () => {
            const renderService = ServiceProvider.get('RenderService')
            renderService.rect(this.position.x, this.position.y, this.width, this.height, 'white')
        })
    }
}
