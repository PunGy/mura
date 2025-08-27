import { RenderEngine } from "@mura/engine/src/renderer/RenderEngine"
import type { Application } from "../application/Application"
import { assertNil } from "../lib/assert"

export class ViewportService {
    private _canvas: HTMLCanvasElement
    private fullscreen: boolean = false

    renderer: RenderEngine

    constructor(public app: Application) {
        this._canvas = document.createElement('canvas')
        this.app.container.appendChild(this._canvas)
        this.renderer = new RenderEngine(app)
    }

    get width() {
        return this.app.width
    }
    get height() {
        return this.app.height
    }
    get canvas(): HTMLCanvasElement {
        return this._canvas
    }

    init() {
        const { canvas } = this
        this.renderer.init(canvas)

        const { width, height } = this
        const { ctx, pixelRatio } = this.renderer
        canvas.width = width * pixelRatio
        canvas.height = height * pixelRatio

        this.applyStratchingStrategy()

        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
    }

    private applyStratchingStrategy() {
        const { canvas, width, height } = this

        if (this.app.viewportStractching === 'none') {
            canvas.style.width = width + 'px'
            canvas.style.height = height + 'px'
            return
        }

        let stratchStrategy: (() => void) | undefined
        switch (this.app.viewportStractching) {
        case 'fit-viewport':
            stratchStrategy = this.applyFitViewport.bind(this)
            break
        }
        assertNil(stratchStrategy, `unknown viewport stratching strategy ${this.app.viewportStractching}`)

        stratchStrategy()
        window.addEventListener('resize', () => {
            stratchStrategy()
        })

    }
    private applyFitViewport() {
        const { canvas, width: gameWidth, height: gameHeight } = this
        const windowWidth = window.innerWidth
        const windowHeight = window.innerHeight

        const gameAspectRatio = gameWidth / gameHeight
        const windowAspectRatio = windowWidth / windowHeight

        let width: number, height: number
        if (windowAspectRatio > gameAspectRatio) {
            // window is wider
            height = windowHeight
            width = height * gameAspectRatio
        } else {
            // window is taller
            width = windowWidth
            height = width / gameAspectRatio
        }

        canvas.style.width = width + 'px'
        canvas.style.height = height + 'px'


        this.applyViewportCenter()
    }
    private applyViewportCenter() {
        const container = this.app.container

        container.style.justifyContent = 'center'
        container.style.alignItems = 'center'
    }

    togglePointerLock() {
        return this.canvas.requestPointerLock()
    }

    registerFullScreen() {
        this._canvas.addEventListener('click', () => {
            this.enterFullScreen()
        })
        this._canvas.addEventListener('fullscreenchange', () => {
            this.fullscreen = !this.fullscreen
        })
    }

    private enterFullScreen() {
        if (!this.fullscreen) {
            return this.canvas.requestFullscreen()
                .then(() => {
                    console.log('fullscreen mode!')
                })
                .catch(() => {
                    console.error('cannot enter to fullscreen mode')
                })
        }
    }
}
