import { Command } from "../Command";
import type { Robot } from "../../Robot";

export class CommandRight extends Command {
    run(robot: Robot): void {
        robot.position.x += 64
    }
}
export class CommandLeft extends Command {
    run(robot: Robot): void {
        robot.position.x -= 64
    }
}
export class CommandUp extends Command {
    run(robot: Robot): void {
        robot.position.y -= 64
    }
}
export class CommandDown extends Command {
    run(robot: Robot): void {
        robot.position.y += 64
    }
}
