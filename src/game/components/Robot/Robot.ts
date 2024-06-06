import { SpriteNode } from "engine:/nodes/Node/CanvasNode/SpriteNode";
import { Level } from "game:/scenes/Level";
import RobotAsset from 'game:/assets/murbot.png'
import { Programator } from "./Programmator/Programmator";

export class Robot extends SpriteNode<Level> {
    programator: Programator

    constructor(level: Level) {
        super(level, RobotAsset)
        this.programator = new Programator(this)
    }

}
