import { Scene } from "src:/scenes/Scene";
import { Background } from "src:/games/spaceInvaders/components/Background";
import { Player } from "src:/games/spaceInvaders/components/Player";
import { EnemyOperator } from "../components/EnemyOperator";
import { Label } from "src:/nodes/Node/UI/Label";
import { Enemy } from "../components/Enemy";
import GameoverTheme from './game_lost.wav'
import DestroyEnemySound from './hit_target.wav'
import { AudioPlayer } from "src:/services/AudioService";
import { ServiceProvider } from "src:/services/ServiceProvider";
import { assertNil } from "src:/lib";

export class MainScene extends Scene {
    private _score = 0;
    private _level = 1;
    get score() {
        return this._score
    }
    set score(newScore: number) {
        this._score = newScore
        this.scoreLabel.text = `Score: ${newScore}`
    }

    get level() {
        return this._level
    }
    set level(newLevel) {
        this._level = newLevel
        this.levelLabel.text = `Level: ${newLevel}`
    }
    scoreLabel: Label
    levelLabel: Label

    enemyOperator: EnemyOperator

    constructor() {
        super()
        this.addNode(new Background(this))
        this.addNode(new Player(this))

        const enemyOperator = new EnemyOperator(this)
        this.addNode(enemyOperator)
        this.enemyOperator = enemyOperator

        const score = new Label(this, 'Score: 0', 16)
        score.position.x = 10
        score.position.y = 26
        this.scoreLabel = score
        this.addNode(score)

        const viewportService = ServiceProvider.get('ViewportService')
        const level = new Label(this, 'Level: 1', 16)
        level.position.x = viewportService.width / 2 - level.width
        level.position.y = 26
        this.levelLabel = level
        this.addNode(level)
    }

    private gameoverSound: AudioPlayer | null = null
    private destroyEnemySound: AudioPlayer | null = null
    async init() {
        super.init()
        const audioService = ServiceProvider.get('AudioService')
        this.gameoverSound = await audioService.createPlayer(GameoverTheme, 'gameover')
        this.destroyEnemySound = await audioService.createPlayer(DestroyEnemySound, 'destroyEnemy')
    }

    enemyDestroyed(enemy: Enemy) {
        this.score += enemy.reward
        assertNil(this.destroyEnemySound)
        this.destroyEnemySound.play()

        if (this.enemyOperator.enemies.size === 0) {
            this.level += 1
            this.enemyOperator.init()
        } else {
            this.enemyOperator.recalculateBoundingBox()
        }
    }

    gameover() {
        assertNil(this.gameoverSound)
        this.gameoverSound.play()
    }
}
