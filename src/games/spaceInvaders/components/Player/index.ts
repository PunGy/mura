import { SpriteNode } from "src:/nodes/Node/CanvasNode/SpriteNode";
import PlayerSprite from './player.png'
import { ServiceProvider } from "src:/services/ServiceProvider";
import { Bullet } from "../Bullet";

export class Player extends SpriteNode {
    speed: number;
    constructor() {
        super(PlayerSprite)
        this.width = 60 
        this.height = 30
        this.speed = 0.5 
    }

    init() {
        const viewportService = ServiceProvider.get('ViewportService')
        const inputService = ServiceProvider.get('InputService')
        const scene = ServiceProvider.get('SceneService').activeScene
        this.position.x = viewportService.width / 2 - this.width / 2
        this.position.y = viewportService.height - this.height - 20

        inputService.register('Space', () => {
            const bullet = new Bullet()
            const { x, y } = this.position
            const { width } = this
            bullet.position.x = x + width / 2 - bullet.width / 2
            bullet.position.y = y - bullet.height

            scene.addNode(bullet)
        })

        return super.init()
    }

    act(delta: number) {
        const inputService = ServiceProvider.get('InputService')
        const viewportService = ServiceProvider.get('ViewportService')

        const { activeKey }= inputService
        switch (activeKey) {
        case 'KeyA':
            this.position.x = Math.max(20, this.position.x - this.speed * delta)
            break
        case 'KeyD':
            this.position.x = Math.min(viewportService.width - this.width - 20, this.position.x + this.speed * delta)
            break
        } 
    }
}
