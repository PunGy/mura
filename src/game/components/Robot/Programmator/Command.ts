import { SpriteNode } from 'engine:/nodes/Node/CanvasNode/SpriteNode';
import type { Robot } from '../Robot'
import { Level } from 'game:/scenes/Level';

export abstract class Command extends SpriteNode<Level> {
    abstract run(robot: Robot): void;
}
