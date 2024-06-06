import { Range } from "engine:/lib/range";
import { CanvasNode } from "engine:/nodes/Node/CanvasNode";
import { SpriteNode } from "engine:/nodes/Node/CanvasNode/SpriteNode";
import { ServiceProvider } from "engine:/services/ServiceProvider";
import { Level } from "game:/scenes/Level";
import BackgroundAsset from 'game:/assets/background.png'
import { first } from "rxjs";

class BackgroundChunk extends SpriteNode<Level> {
    readonly form: 'light' | 'dark'
    static WIDTH = 64
    static HEIGHT = 64
    constructor(level: Level, form: 'light' | 'dark') {
        super(level, BackgroundAsset, false)
        this.width = BackgroundChunk.WIDTH 
        this.height = BackgroundChunk.HEIGHT
        this.form = form
    }

    async init() {
        await super.init()
        if (!this.sprite) {
            throw new Error('No sprite available')
        }
        const { width, height } = this
        const imgSize = this.sprite.renderer.getImageSize()
        const scaledWidth = width * (imgSize.width / width) / 2
        const scaledHeight = height * (imgSize.height / height)
        this.sprite?.renderer.crop(
            this.form === 'light' ? 0 : scaledWidth,
            0,
            scaledWidth,
            scaledHeight,
        )
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
        new Range(0, this.width, BackgroundChunk.WIDTH).iterate((x) => {
            nextColor = nextColor === 'light' ? 'dark' : 'light'
            new Range(0, this.height, BackgroundChunk.HEIGHT).iterate((y) => {
                const chunk = new BackgroundChunk(level, nextColor)
                chunk.position.x = x
                chunk.position.y = y
                chunks.push(chunk)

                nextColor = nextColor === 'light' ? 'dark' : 'light'
            })
        })
        this.chunks = chunks

        this.safeSubscribe(this.$renderSignal.pipe(first()), () => {
            this.chunks.forEach(chunk => {
                chunk.render()
            })
        })
        this.safeSubscribe(level.$gameTickSignal, () => {
            this.chunks.forEach(chunk => {
                chunk.render()
            })
        })
    }

    async init() {
        await Promise.all(this.chunks.map(chunk => chunk.init()))
    }
}
