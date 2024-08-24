import { SpriteNode } from "@mura/engine/dist/nodes/Node/CanvasNode/SpriteNode";
import GreenEnemySprite from './assets/green.png'
import YellowEnemySprite from './assets/yellow.png'
import RedEnemySprite from './assets/red.png'
import { MainScene } from "../../scenes/MainScene";
import { ServiceProvider } from "@mura/engine/dist/services/ServiceProvider";
import { AudioPlayer } from "@mura/engine/dist/services/AudioService";
import { assertNil } from "@mura/engine/dist/lib";

export enum EnemyType {
    RED = 'red',
    GREEN = 'green',
    YELLOW = 'yellow',
}

const enemyTypeToSprite = {
    [EnemyType.RED]: RedEnemySprite,
    [EnemyType.YELLOW]: YellowEnemySprite,
    [EnemyType.GREEN]: GreenEnemySprite,
}
const enemyTypeToReward = {
    [EnemyType.RED]: 40,
    [EnemyType.YELLOW]: 20,
    [EnemyType.GREEN]: 10,
}

export class Enemy extends SpriteNode<MainScene> {
    readonly type: EnemyType
    width = 40
    height = 32

    collidable = true
    collideGroup = new Set(['enemy'])
 
    readonly reward: number
    destroySound: AudioPlayer | null = null

    constructor(scene: MainScene, type: EnemyType) {
        super(scene, enemyTypeToSprite[type])
        this.type = type
        this.reward = enemyTypeToReward[type]
    }

    render() {
        super.render()
    }
}
