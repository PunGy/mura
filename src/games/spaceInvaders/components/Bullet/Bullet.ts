import { Node } from "src:/nodes/Node";
import { CanvasNode } from "src:/nodes/Node/CanvasNode";
import { ServiceProvider } from "src:/services/ServiceProvider";
import { Player } from "../Player";
import { Enemy } from "../Enemy";
import { MainScene } from "../../scenes/MainScene";
import { AnimationNode, RuntimeAnimationEntry, StaticRuntimeAnimationEntry } from "src:/nodes/Node/CanvasNode/AnimationNode";
import { randFloat } from "src:/lib/rand";

export enum BulletType {
    PLAYER = 'player',
    ENEMY2 = 'enemy1',
    ENEMY3 = 'enemy2',
    ENEMY4 = 'enemy3',
}

export class Bullet<T extends BulletType> extends AnimationNode<MainScene, 'fly'> {
    speed: number;
    collidable = true

    readonly bulletType: T

    get isPlayerBullet() {
        return this.bulletType === BulletType.PLAYER;
    }

    constructor(scene: MainScene, bulletType: T) {
        super(scene)
        this.bulletType = bulletType
        this.collidesWith = new Set([this.isPlayerBullet ? 'enemy' : 'player'])

        const render = ServiceProvider.get('RenderService')

        let animation: StaticRuntimeAnimationEntry | RuntimeAnimationEntry;
        if (this.isPlayerBullet) {
            this.width = 5;
            this.height = 13;
            this.speed = 0.5;

            animation = this.staticRuntimeFrameAnimation(() => {
                render.rect(this.position.x, this.position.y, this.width, this.height, 'white');
            })
        } else {
            this.width = 6;
            this.height = 12;
            this.speed = randFloat(0.2, 0.4)
            const r = (x: number, y: number) => render.rect(x, y, 2, 2, 'white')
            animation = this.runtimeFrameAnimation(2, 100, (frame) => {
                const oX = this.position.x;
                const oY = this.position.y;
                
                if (frame === 1) {
                    r(oX,   oY);
                    r(oX+2, oY+2);
                    r(oX+4, oY+4);
                    r(oX+2, oY+6);
                    r(oX ,  oY+8);
                    r(oX+2, oY+10);
                    r(oX+4, oY+12);
                } else {
                    r(oX+4, oY);
                    r(oX+2, oY+2);
                    r(oX  , oY+4);
                    r(oX+2, oY+6);
                    r(oX+4, oY+8);
                    r(oX+2, oY+10);
                    r(oX  , oY+12);
                }
            })
        }

        this.animations = { fly: animation }
        this.activeAnimationKey = 'fly'
    }

    act(delta: number) {
        super.act(delta)
        if (this.bulletType === BulletType.PLAYER) {
            this.position.y -= this.speed * delta
            if (this.position.y <= 1) {
                this.destroy()
            }
        } else {
            const viewport = ServiceProvider.get('ViewportService')
            this.position.y += this.speed * delta;
            if (this.position.y >= viewport.height) {
                this.destroy()
            }
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
        if (!this.isPlayerBullet) {
            this.scene.gameover();
        }
    }

}
