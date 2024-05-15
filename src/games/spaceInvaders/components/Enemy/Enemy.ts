import { SpriteNode } from "src:/nodes/Node/CanvasNode/SpriteNode";
import GreenEnemySprite from './green.png'
import YellowEnemySprite from './yellow.png'
import RedEnemySprite from './red.png'
import { MainScene } from "../../scenes/MainScene";

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
    [EnemyType.RED]: 200,
    [EnemyType.YELLOW]: 150,
    [EnemyType.GREEN]: 100,
}

export class Enemy extends SpriteNode<MainScene> {
    readonly type: EnemyType
    width = 40
    height = 32

    collidable = true
    collideGroup = new Set(['enemy'])
    
    readonly reward: number

    constructor(scene: MainScene, type: EnemyType) {
        super(scene, enemyTypeToSprite[type])
        this.type = type
        this.reward = enemyTypeToReward[type]
    }

    render() {
        super.render()
    }
}
