import { Fluid } from "reactive-fluid"
import type { Application } from "../application/Application"
import { assertNil } from "../lib/assert"
import type { Rect } from "../lib/geometry/rect"

declare global {
    interface CanvasRenderingContext2D {
        webkitBackingStorePixelRatio: number;
        mozBackingStorePixelRatio: number;
        msBackingStorePixelRatio: number;
        oBackingStorePixelRatio: number;
        backingStorePixelRatio: number;
    }
}

interface RenderRect extends Rect {
    kind: 'rect'

    style: 'stroke' | 'fill'
    color: string;
}

export class RenderEngine {
    ctx!: CanvasRenderingContext2D
    pixelRatio: number = 1

    drawPool: Array<RenderRect> = []
    constructor(public app: Application) {}

    init(canvas: HTMLCanvasElement) {
        const ctx = canvas.getContext('2d')
        assertNil(ctx, 'Cannot initialize canvas context!')
        this.ctx = ctx

        const dpr = window.devicePixelRatio || 1
        const bsr = ctx.webkitBackingStorePixelRatio ||
              ctx.mozBackingStorePixelRatio ||
              ctx.msBackingStorePixelRatio ||
              ctx.oBackingStorePixelRatio ||
              ctx.backingStorePixelRatio || 1
        this.pixelRatio = dpr / bsr


        Fluid.listen(
            this.app.tick,
            this.draw.bind(this),
            { priority: Fluid.priorities.lowest },
        )
    }

    private draw() {
        this.ctx.clearRect(0, 0, this.app.width, this.app.height)
        for (const obj of this.drawPool) {
            this.ctx.save()

            switch (obj.kind) {
            case 'rect':
                if (obj.style === 'fill') {
                    this.ctx.fillStyle = obj.color
                    this.ctx.fillRect(obj.x, obj.y, obj.width, obj.height)
                } else {
                    this.ctx.strokeStyle = obj.color
                    this.ctx.strokeRect(obj.x, obj.y, obj.width, obj.height)
                }
                break
            }

            this.ctx.restore()
        }
        this.drawPool.length = 0
    }

    rect(x: number, y: number, width: number, height: number, color: string, style: RenderRect['style'] = 'fill') {
        this.drawPool.push({ kind: 'rect', x, y, width, height, color, style })
    }
}
