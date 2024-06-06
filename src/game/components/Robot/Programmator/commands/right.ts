import type { Level } from "game:/scenes/Level";
import { Command } from "../Command";
import CommandAsset from './commands.png'
import { Robot } from "../../Robot";

export class CommandRight extends Command {
    constructor(level: Level) {
        super(level, CommandAsset);
        this.width = 32;
        this.height = 32;
    }

    run(robot: Robot): void {
        robot.position.x += 32
    }
}
