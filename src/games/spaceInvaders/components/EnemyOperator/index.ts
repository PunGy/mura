import { Range } from "src:/lib/range"
import { ServiceProvider } from "src:/services/ServiceProvider"
import { Enemy, EnemyType } from "../Enemy"
import { Node } from "src:/nodes/Node"

export class EnemyOperator extends Node {
    enemies: Array<Enemy> = []

    init() {
        const scene = ServiceProvider.get('SceneService').activeScene

        const { width, height } = new Enemy(EnemyType.RED)
        new Range(40, (height + 10) * 5, height + 10).iterate((y, i) => {
            new Range(40, (width + 10) * 11, width + 10).iterate(x => {
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
        this.position.x = 40
        this.position.y = 40
        this.width = (width + 10) * 11
        this.height = (height + 10) * 5
    }


    private moveTimer = 500
    private moveDelta = 0
    // 1 - right; 0 - left
    private direction = 1
    act(delta: number) {
        if (this.moveDelta >= this.moveTimer) {
            this.moveDelta = 0
            const e = this.enemies[0]
            const shifyBy = (e.width / 4) * (this.direction ? 1 : -1)
            this.enemies.forEach(enemy => {
                enemy.position.x += shifyBy
            })
            this.position.x += shifyBy

            const viewport = ServiceProvider.get('ViewportService')
            let changedDirection = false
            if (this.position.x + this.width >= viewport.width - 40) {
                this.direction = 0
                changedDirection = true
            } else if (this.position.x <= 40) {
                this.direction = 1
                changedDirection = true
            }

            if (changedDirection) {
                const e = this.enemies[0]
                const shiftY = e.height + 10
                this.position.y += shiftY
                this.enemies.forEach(enemy => {
                    enemy.position.y += shiftY
                })
            }
        } else {
            this.moveDelta += delta
        }
    }

    
}
