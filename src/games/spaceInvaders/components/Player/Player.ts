import { SpriteNode } from "src:/nodes/Node/CanvasNode/SpriteNode";
import PlayerSprite from './assets/player.png'
import { ServiceProvider } from "src:/services/ServiceProvider";
import { Bullet, BulletType } from "../Bullet";
import { MainScene } from "../../scenes/MainScene";
import { AudioPlayer } from "src:/services/AudioService";
import ShootSound from './assets/shoot.wav'
import { assertNil } from "src:/lib";

const VIEWPORT_PADDING = 20

export class Player extends SpriteNode<MainScene> {
    width = 60 
    height = 30
    speed = 0.5
    private missleReady = true 

    constructor(scene: MainScene) {
        super(scene, PlayerSprite)
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

    act(delta: number) {
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
            bullet.onDestroyed(() => this.missleReady = true)
            bullet.onCollided((enemy) => {
                scene.enemyDestroyed(enemy)
            })
            assertNil(this.shootSound)
            this.shootSound.play()

            scene.addNode(bullet)
        }
    }
}
