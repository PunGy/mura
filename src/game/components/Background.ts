import { Range } from "engine:/lib/range";
import { CanvasNode } from "engine:/nodes/Node/CanvasNode";
import { SpriteNode } from "engine:/nodes/Node/CanvasNode/SpriteNode";
import { ServiceProvider } from "engine:/services/ServiceProvider";
import { Level } from "game:/scenes/Level";
import BackgroundAsset from 'game:/assets/background.png'

class BackgroundChunk extends SpriteNode<Level> {
    readonly form: 'light' | 'dark'
    constructor(level: Level, form: 'light' | 'dark') {
        super(level, BackgroundAsset)
        this.width = 32
        this.height = 32
        this.form = form
    }

    async init() {
        await super.init()
        const { width, height } = this
        this.sprite?.renderer.crop(this.form === 'light' ? 0 : width, 0, width, height)
    }
}

export class Background extends CanvasNode<Level> {
    chunks: Array<BackgroundChunk>

    constructor(level: Level) {
        super(level);
        const viewport = ServiceProvider.get('ViewportService')
        this.width = viewport.width
        this.height = viewport.height

        let nextColor: 'light' | 'dark' = 'light'
        const chunks: Array<BackgroundChunk> = []
        new Range(0, this.width, 32).iterate((x) => {
            new Range(0, this.height, 32).iterate((y) => {
                const chunk = new BackgroundChunk(level, nextColor)
                chunk.position.x = x
                chunk.position.y = y
                chunks.push()

                nextColor = nextColor === 'light' ? 'dark' : 'light'
            })
        })
        this.chunks = chunks

        this.safeSubscribe(this.$renderSignal, () => {
            this.chunks.forEach(chunk => {
                chunk.render()
            })
        })
    }
}
