import { SpriteNode } from "src:/nodes/Node/CanvasNode/SpriteNode";
import PlayerSprite from './player.png'
import { ServiceProvider } from "src:/services/ServiceProvider";
import { Bullet } from "../Bullet";

const VIEWPORT_PADDING = 20

export class Player extends SpriteNode {
    width = 60 
    height = 30
    speed = 0.5
    private missleReady = true 

    constructor() {
        super(PlayerSprite)
    }

    init() {
        const viewportService = ServiceProvider.get('ViewportService')
        const inputService = ServiceProvider.get('InputService')

        inputService.setKeyStackFor('movement', ['ArrowLeft', 'ArrowRight'])

        this.position.x = viewportService.width / 2 - this.width / 2
        this.position.y = viewportService.height - this.height - VIEWPORT_PADDING

        return super.init()
    }

    act(delta: number) {
        const inputService = ServiceProvider.get('InputService')
        const viewportService = ServiceProvider.get('ViewportService')
        const scene = ServiceProvider.get('SceneService').activeScene

        const activeMovementKey = inputService.activeKeyOf('movement')
        console.log(activeMovementKey)
        if (activeMovementKey === 'ArrowLeft') {
            this.position.x = Math.max(VIEWPORT_PADDING, this.position.x - this.speed * delta)
        } else if (activeMovementKey === 'ArrowRight') {
            this.position.x = Math.min(viewportService.width - this.width - VIEWPORT_PADDING, this.position.x + this.speed * delta)
        }

        if (inputService.isPressed('Space') && this.missleReady) {
            this.missleReady = false

            const bullet = new Bullet()
            const { x, y } = this.position
            const { width } = this
            bullet.position.x = x + width / 2 - bullet.width / 2
            bullet.position.y = y - bullet.height
            bullet.onDestroyed(() => this.missleReady = true)

            scene.addNode(bullet)
        }
    }
}
