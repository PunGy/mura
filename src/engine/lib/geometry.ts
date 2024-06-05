import { type Node } from 'src:/nodes/Node'

export interface XY {
    x: number;
    y: number;
}

export class Vector {
    constructor(
    public x: number,
    public y: number,
    ) {}
}

export interface Rect extends XY {
    width: number;
    height: number;
}

export function isCollided(p1X: number, p1Y: number, p1X2: number, p1Y2: number, p2X: number, p2Y: number, p2X2: number, p2Y2: number) {
    return (
        p1X < p2X2 && p1X2 > p2X
        && p1Y < p2Y2 && p1Y2 > p2Y

    )
}
export function isCollidedRect(rect1: Rect, rect2: Rect): boolean {
    const r1X2 = rect1.x + rect1.width
    const r1Y2 = rect1.y + rect1.height
    const r2X2 = rect2.x + rect2.width
    const r2Y2 = rect2.y + rect2.height

    return isCollided(rect1.x, rect1.y, r1X2, r1Y2, rect2.x, rect2.y, r2X2, r2Y2)
}

export function isCollidedNodes(node1: Node, node2: Node): boolean {
    const p1 = node1.position
    const p2 = node2.position
    const p1X2 = p1.x + node1.width
    const p1Y2 = p1.y + node1.height
    const p2X2 = p2.x + node2.width
    const p2Y2 = p2.y + node2.height

    return isCollided(p1.x, p1.y, p1X2, p1Y2, p2.x, p2.y, p2X2, p2Y2)
}
