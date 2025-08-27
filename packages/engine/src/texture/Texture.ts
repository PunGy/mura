import type { Node } from "../node/Node"

export abstract class Texture {
    abstract draw(): void;

    constructor(public node: Node) {}
}
