import type { Robot } from '../Robot'

export abstract class Command {
    abstract run(robot: Robot): void;
}
