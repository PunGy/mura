import { Scene } from "src:/scenes/Scene";
import { Background } from "src:/games/spaceInvaders/components/Background";
import { Player } from "src:/games/spaceInvaders/components/Player";
import { EnemyOperator } from "../components/EnemyOperator";

export class MainScene extends Scene {
    constructor() {
        super()
        this.addNode(new Background())
        this.addNode(new Player())
        this.addNode(new EnemyOperator())
    }

}
