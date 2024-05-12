import { SpriteNode } from "src:/nodes/Node/CanvasNode/SpriteNode";
import PlayerSprite from './player.png'
import { ServiceProvider } from "src:/services/ServiceProvider";
import { Bullet } from "../Bullet";
import { EnemyOperator } from "../EnemyOperator";

const VIEWPORT_PADDING = 20

export class Player extends SpriteNode {
    width = 60 
    height = 30
    speed = 0.5
    private missleReady = true 
    private enemyOperator: EnemyOperator | null = null

    constructor() {
        super(PlayerSprite)
    }

    init() {
        const viewportService = ServiceProvider.get('ViewportService')
        const scene = ServiceProvider.get('SceneService').activeScene

        this.position.x = viewportService.width / 2 - this.width / 2
        this.position.y = viewportService.height - this.height - VIEWPORT_PADDING

        this.enemyOperator = scene.getNodes().find(node => node instanceof EnemyOperator) as EnemyOperator ?? null

        return super.init()
    }

    act(delta: number) {
        const inputService = ServiceProvider.get('InputService')
        const viewportService = ServiceProvider.get('ViewportService')
        const scene = ServiceProvider.get('SceneService').activeScene

        const { activeKey } = inputService
        switch (activeKey) {
        case 'KeyA':
            this.position.x = Math.max(VIEWPORT_PADDING, this.position.x - this.speed * delta)
            break
        case 'KeyD':
            this.position.x = Math.min(viewportService.width - this.width - VIEWPORT_PADDING, this.position.x + this.speed * delta)
            break
        case 'Space':
            if (this.missleReady) {
                this.missleReady = false

                const bullet = new Bullet()
                const { x, y } = this.position
                const { width } = this
                bullet.position.x = x + width / 2 - bullet.width / 2
                bullet.position.y = y - bullet.height
                bullet.onDestroyed(() => this.missleReady = true)

                scene.addNode(bullet)
            }
            break
        } 
    }
}
