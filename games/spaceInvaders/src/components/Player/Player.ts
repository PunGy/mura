import { SpriteNode } from "@mura/engine/dist/nodes/Node/CanvasNode/SpriteNode";
import PlayerSprite from './assets/player.png'
import { ServiceProvider } from "@mura/engine/dist/services/ServiceProvider";
import { Bullet, BulletType } from "../Bullet";
import { MainScene } from "../../scenes/MainScene";
import { AudioPlayer } from "@mura/engine/dist/services/AudioService";
import ShootSound from './assets/shoot.wav'
import { assertNil } from "@mura/engine/dist/lib";
import { Enemy } from "src:components/Enemy";

const VIEWPORT_PADDING = 20

export class Player extends SpriteNode<MainScene> {
    speed = 0.5
    private missleReady = true 

    constructor(scene: MainScene) {
        super(scene, PlayerSprite)
        this.width = 60 
        this.height = 30
        this.safeSubscribe(this.$actSignal, (delta) => {
            const inputService = ServiceProvider.get('InputService')
            const viewportService = ServiceProvider.get('ViewportService')
            const scene = this.scene

            const activeMovementKey = inputService.activeKeyOf('movement')
            if (activeMovementKey === 'ArrowLeft') {
                this.position.x = Math.max(VIEWPORT_PADDING, this.position.x - this.speed * delta)
            } else if (activeMovementKey === 'ArrowRight') {
                this.position.x = Math.min(viewportService.width - this.width - VIEWPORT_PADDING, this.position.x + this.speed * delta)
            }

            if (inputService.isPressed('Space') && this.missleReady) {
                this.missleReady = false

                const bullet = new Bullet(scene, BulletType.PLAYER)
                const { x, y } = this.position
                const { width } = this
                bullet.position.x = x + width / 2 - bullet.width / 2
                bullet.position.y = y - bullet.height
                bullet.$destroySignal.subscribe(() => {
                    this.missleReady = true
                })
                bullet.$collisionSignal.subscribe((enemy) => {
                    scene.enemyDestroyed(enemy as Enemy)
                })
                assertNil(this.shootSound)
                this.shootSound.play()

                scene.addNode(bullet)
            }
        })
    }

    shootSound: AudioPlayer | null = null
    async init() {
        const viewportService = ServiceProvider.get('ViewportService')
        const inputService = ServiceProvider.get('InputService')
        const audioService = ServiceProvider.get('AudioService')

        inputService.setKeyStackFor('movement', ['ArrowLeft', 'ArrowRight'])

        this.position.x = viewportService.width / 2 - this.width / 2
        this.position.y = viewportService.height - this.height - VIEWPORT_PADDING

        this.shootSound = await audioService.createPlayer(ShootSound, 'shoot')

        return super.init()
    }
}
