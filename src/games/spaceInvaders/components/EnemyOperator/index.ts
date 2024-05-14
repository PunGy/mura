import { Range } from "src:/lib/range"
import { ServiceProvider } from "src:/services/ServiceProvider"
import { Enemy, EnemyType } from "../Enemy"
import { Node } from "src:/nodes/Node"

const SCREEN_PADDING = 40
const BETWEEN_PADDING = 10
export class EnemyOperator extends Node {
    enemies: Array<Enemy> = []
    enemyWidth: number = 0
    enemyHeight: number = 0
    private speed: number = 0

    init() {
        const scene = ServiceProvider.get('SceneService').activeScene

        const { width, height } = new Enemy(EnemyType.RED)
        this.enemyWidth = width
        this.enemyHeight = height
        new Range(SCREEN_PADDING, (height + BETWEEN_PADDING) * 5, height + BETWEEN_PADDING).iterate((y, i) => {
            new Range(SCREEN_PADDING, (width + BETWEEN_PADDING) * 11, width + BETWEEN_PADDING).iterate(x => {
                let type = EnemyType.GREEN
                if (i === 1) {
                    type = EnemyType.RED
                } else if (i <= 3) {
                    type = EnemyType.YELLOW
                }
                const enemy = new Enemy(type)
                enemy.position.x = x
                enemy.position.y = y

                this.enemies.push(enemy)

                scene.addNode(enemy)
            })
        })
        this.position.x = SCREEN_PADDING
        this.position.y = SCREEN_PADDING
        this.width = (width + BETWEEN_PADDING) * 11
        this.height = (height + BETWEEN_PADDING) * 5
        this.speed = width / 4
    }


    private moveTimer = 500
    private moveDelta = 0
    // 1 - right; 0 - left
    private direction = 1
    act(delta: number) {
        if (this.moveDelta >= this.moveTimer) {
            const { position, width, enemyHeight } = this
            const viewport = ServiceProvider.get('ViewportService')

            let changedDirection = false
            const moveXBy = this.speed * (this.direction ? 1 : -1)

            // if moving right, check is the next move would be out of bound
            if (this.direction && position.x + width + moveXBy > viewport.width - SCREEN_PADDING) {
                this.direction = 0
                changedDirection = true
            // same for moving left
            } else if (!this.direction && position.x + moveXBy <= SCREEN_PADDING) {
                this.direction = 1
                changedDirection = true
            }

            if (changedDirection) {
                const moveYBy = enemyHeight + BETWEEN_PADDING
                this.position.y += moveYBy
                this.enemies.forEach(enemy => {
                    enemy.position.y += moveYBy
                })
                this.moveTimer -= 50
            } else {
                this.enemies.forEach(enemy => {
                    enemy.position.x += moveXBy
                })
                this.position.x += moveXBy
            }
            this.moveDelta = 0
        } else {
            this.moveDelta += delta
        }
    }

    
}
