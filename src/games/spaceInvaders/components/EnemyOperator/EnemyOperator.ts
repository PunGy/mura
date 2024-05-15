import { Range } from "src:/lib/range"
import { ServiceProvider } from "src:/services/ServiceProvider"
import { Enemy, EnemyType } from "../Enemy"
import { Node } from "src:/nodes/Node"
import { MainScene } from "../../scenes/MainScene"
import MovementSound1 from './assets/movement_1.wav'
import MovementSound2 from './assets/movement_2.wav'
import MovementSound3 from './assets/movement_3.wav'
import MovementSound4 from './assets/movement_4.wav'
import { AudioPlayer } from "src:/services/AudioService"
import { assertNil } from "src:/lib"
import { LinkedList } from "src:/lib/LinkedList"

const SCREEN_PADDING = 40
const BETWEEN_PADDING = 13
export class EnemyOperator extends Node<MainScene> {
    enemies: Array<Enemy> = []
    enemyWidth: number = 0
    enemyHeight: number = 0
    private speed: number = 0
    private audioCycle: LinkedList<AudioPlayer> | null = null

    async init() {
        const { width, height } = new Enemy(this.scene, EnemyType.RED)
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
                const enemy = new Enemy(this.scene, type)
                enemy.position.x = x
                enemy.position.y = y

                this.enemies.push(enemy)

                this.scene.addNode(enemy)
            })
        })
        this.position.x = SCREEN_PADDING
        this.position.y = SCREEN_PADDING
        this.width = (width + BETWEEN_PADDING) * 11
        this.height = (height + BETWEEN_PADDING) * 5
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

    private moveTimer = 500
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
            if (this.position.y + this.height >= viewport.height - viewport.height / 5) {
                this.stop = true
                this.scene.gameover()
            }
            const moveYBy = enemyHeight + BETWEEN_PADDING
            this.position.y += moveYBy
            this.enemies.forEach(enemy => {
                enemy.position.y += moveYBy
            })
            this.moveTimer = Math.max(this.moveTimer - 50, 150)
            console.log(this, viewport.height)
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
