import { SpriteNode } from "src:/nodes/Node/CanvasNode/SpriteNode";
import GreenEnemySprite from './green.png'
import YellowEnemySprite from './yellow.png'
import RedEnemySprite from './red.png'

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

export class Enemy extends SpriteNode {
    readonly type: EnemyType
    width = 40
    height = 32

    collidable = true
    collideGroup = new Set(['enemy'])
    
    readonly reward: number

    constructor(type: EnemyType) {
        super(enemyTypeToSprite[type])
        this.type = type
        this.reward = enemyTypeToReward[type]
    }

    render() {
        super.render()
    }
}
