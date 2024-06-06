import type { Level } from "game:/scenes/Level";
import { Command } from "../Command";
import CommandAsset from './commands.png'
import { Robot } from "../../Robot";

export class CommandRight extends Command {
    constructor(level: Level) {
        super(level, CommandAsset, false);
        this.width = 32;
        this.height = 32;
    }

    run(robot: Robot): void {
        robot.position.x += 64
    }
}
export class CommandLeft extends Command {
    constructor(level: Level) {
        super(level, CommandAsset, false);
        this.width = 32;
        this.height = 32;
    }

    run(robot: Robot): void {
        robot.position.x -= 64
    }
}
export class CommandUp extends Command {
    constructor(level: Level) {
        super(level, CommandAsset, false);
        this.width = 32;
        this.height = 32;
    }

    run(robot: Robot): void {
        robot.position.y -= 64
    }
}
export class CommandDown extends Command {
    constructor(level: Level) {
        super(level, CommandAsset, false);
        this.width = 32;
        this.height = 32;
    }

    run(robot: Robot): void {
        robot.position.y += 64
    }
}
