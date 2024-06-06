import { SpriteNode } from "engine:/nodes/Node/CanvasNode/SpriteNode";
import { Level } from "game:/scenes/Level";
import RobotAsset from 'game:/assets/murbot.png'
import { Programator } from "./Programmator/Programmator";
import { first } from 'rxjs'

export class Robot extends SpriteNode<Level> {
    programator: Programator

    constructor(level: Level) {
        super(level, RobotAsset, false)
        this.width = 64 
        this.height = 64 
        this.position.x = 32 * 4
        this.position.y = 32 * 8
        this.programator = new Programator(this)
        this.safeSubscribe(this.$renderSignal.pipe(first()), () => {
            this.render()
        })
        this.safeSubscribe(level.$gameTickSignal, () => {
            this.render()
        })
    }
}
