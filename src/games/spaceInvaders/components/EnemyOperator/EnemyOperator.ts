import { Range } from "src:/lib/range"
import { ServiceProvider } from "src:/services/ServiceProvider"
import { Enemy, EnemyType } from "../Enemy"
import { MainScene } from "../../scenes/MainScene"
import MovementSound1 from './assets/movement_1.wav'
import MovementSound2 from './assets/movement_2.wav'
import MovementSound3 from './assets/movement_3.wav'
import MovementSound4 from './assets/movement_4.wav'
import { AudioPlayer } from "src:/services/AudioService"
import { assertNil } from "src:/lib"
import { LinkedList } from "src:/lib/LinkedList"
import { CanvasNode } from "src:/nodes/Node/CanvasNode"

const Y_SCREEN_PADDING = 40
const X_SCREEN_PADDING = 20
const BETWEEN_PADDING = 14
export class EnemyOperator extends CanvasNode<MainScene> {
    enemies: Map<number, Enemy> = new Map()
    enemyWidth: number = 0
    enemyHeight: number = 0
    private speed: number = 0
    private audioCycle: LinkedList<AudioPlayer> | null = null
    // debug = true

    async init() {
        const { width, height } = new Enemy(this.scene, EnemyType.RED)
        this.enemyWidth = width
        this.enemyHeight = height
        this.reset()
        this.speed = width / 4

        const audioService = ServiceProvider.get('AudioService')
        const buffers = await Promise.all([MovementSound1, MovementSound2, MovementSound3, MovementSound4].map((url, i) => audioService.createPlayer(url, `move${i}`)   ))
        const audioCycle = new LinkedList<AudioPlayer>()
        buffers.forEach(player => {
            audioCycle.pushBack(player)
        })
        audioCycle.encycle()
        this.audioCycle = audioCycle
    }

    initEnemies() {
        const { enemyWidth: width, enemyHeight: height } = this
        new Range(Y_SCREEN_PADDING, (height + BETWEEN_PADDING) * 5, height + BETWEEN_PADDING).iterate((y, i) => {
            new Range(X_SCREEN_PADDING, (width + BETWEEN_PADDING) * 11, width + BETWEEN_PADDING).iterate(x => {
                let type = EnemyType.GREEN
                if (i === 1) {
                    type = EnemyType.RED
                } else if (i <= 3) {
                    type = EnemyType.YELLOW
                }
                const enemy = new Enemy(this.scene, type)
                enemy.position.x = x
                enemy.position.y = y

                enemy.onDestroyed(() => {
                    this.enemies.delete(enemy.id)
                })

                this.enemies.set(enemy.id, enemy)

                this.scene.addNode(enemy)
            })
        })
    }

    reset() {
        this.initEnemies()
        this.position.x = X_SCREEN_PADDING
        this.position.y = Y_SCREEN_PADDING
        this.width = (this.enemyWidth + BETWEEN_PADDING) * 11 - BETWEEN_PADDING
        this.height = (this.enemyHeight + BETWEEN_PADDING) * 5 - BETWEEN_PADDING
        this.direction = 1
        this.moveDelta = 0
    }

    recalculateBoundingBox() {
        let minY = Infinity
        let minX = Infinity
        let maxY = 0
        let maxX = 0


        this.enemies.forEach(enemy => {
            const { position: { x, y } } = enemy
            if (x < minX) {
                minX = x
            }
            if (x > maxX) {
                maxX = x
            }

            if (y < minY) {
                minY = y
            }
            if (y > maxY) {
                maxY = y
            }
        })

        this.width = maxX - minX + this.enemyWidth
        this.height = maxY - minY + this.enemyHeight
        this.position.x = minX
        this.position.y = minY
    }

    timerDecreaseStep = 50

    static baseSpeed = 700
    private moveTimer = EnemyOperator.baseSpeed 
    private moveDelta = 0
    // 1 - right; 0 - left
    private direction = 1
    act(delta: number) {
        if (this.stop) return;
        if (this.moveDelta >= this.moveTimer) {
            this.move()
            this.moveDelta = 0
        } else {
            this.moveDelta += delta
        }
    }

    stop = false
    move() {
        const { position, width, enemyHeight } = this
        const viewport = ServiceProvider.get('ViewportService')
        const scene = this.scene

        let changedDirection = false
        const moveXBy = this.speed * (this.direction ? 1 : -1)

        // if moving right, check is the next move would be out of bound
        if (this.direction && position.x + width + moveXBy > viewport.width - X_SCREEN_PADDING) {
            this.direction = 0
            changedDirection = true
            // same for moving left
        } else if (!this.direction && position.x + moveXBy <= X_SCREEN_PADDING) {
            this.direction = 1
            changedDirection = true
        }

        if (changedDirection) {
            if (this.position.y + this.height >= viewport.height - viewport.height / 5) {
                this.stop = true
                scene.gameover()
            }
            const moveYBy = enemyHeight + BETWEEN_PADDING
            this.position.y += moveYBy
            this.enemies.forEach(enemy => {
                enemy.position.y += moveYBy
            })
            const { moveTimer: currentSpeed } = this
            let speedIncreaseOn = 0
            let maxSpeed = 1
            const { baseSpeed } = EnemyOperator
            if (currentSpeed > baseSpeed - 75 * 3) {
                speedIncreaseOn = 75
            } else if (currentSpeed > 300) {
                speedIncreaseOn = 50 
            } else {
                speedIncreaseOn = 30
            }
    
            if (scene.level === 1) {
                maxSpeed = 500
            } else if (scene.level === 2) {
                maxSpeed = 300
            } else {
                maxSpeed = 150
            }

            this.moveTimer = Math.max(this.moveTimer - speedIncreaseOn, maxSpeed)
        } else {
            this.enemies.forEach(enemy => {
                enemy.position.x += moveXBy
            })
            this.position.x += moveXBy
        }

        assertNil(this.audioCycle)
        const player = this.audioCycle.next()!.value
        player.play()
    }
}
