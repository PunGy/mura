import { Scene } from "src:/scenes/Scene";
import { Background } from "src:/games/spaceInvaders/components/Background";
import { Player } from "src:/games/spaceInvaders/components/Player";
import { EnemyOperator } from "../components/EnemyOperator";
import { Label } from "src:/nodes/Node/UI/Label";

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
        this.addNode(new Background())
        this.addNode(new Player())
        this.addNode(new EnemyOperator())

        const score = new Label('Score: 0', 16)
        score.position.x = 10
        score.position.y = 26
        this.scoreNode = score
        this.addNode(score)
    }
}
