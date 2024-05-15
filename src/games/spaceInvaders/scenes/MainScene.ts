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
    get score() {
        return this._score
    }
    set score(newScore: number) {
        this._score = newScore
        this.scoreNode.text = `Score: ${newScore}`
    }
    scoreNode: Label

    constructor() {
        super()
        this.addNode(new Background(this))
        this.addNode(new Player(this))
        this.addNode(new EnemyOperator(this))

        const score = new Label(this, 'Score: 0', 16)
        score.position.x = 10
        score.position.y = 26
        this.scoreNode = score
        this.addNode(score)
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
    }

    gameover() {
        assertNil(this.gameoverSound)
        this.gameoverSound.play()
    }
}
