import { RenderEngine } from "@mura/engine/src/renderer/RenderEngine"
import type { Application } from "../application/Application"

export class ViewportService {
    private _canvas: HTMLCanvasElement
    private centered: boolean = false
    private fullscreen: boolean = false
    private mouseLocked: boolean = false
    private pixelRatio: number = 1

    private _width: number = 0
    private _height: number = 0

    renderer: RenderEngine

    constructor(public app: Application) {
        this._canvas = document.createElement('canvas')
        this.app.container.appendChild(this._canvas)
        this.renderer = new RenderEngine(app)
    }

    get width() {
        return this._width
    }
    get height() {
        return this._height
    }
    get canvas(): HTMLCanvasElement {
        return this._canvas
    }

    init() {
        const { canvas } = this
        this.renderer.init(canvas)

        const box = this.app.container.getBoundingClientRect()
        this._width = box.width
        this._height = box.height

        const { width, height } = this
        const { ctx, pixelRatio } = this.renderer
        canvas.width = width * pixelRatio
        canvas.height = height * pixelRatio
        canvas.style.width = width + 'px'
        canvas.style.height = height + 'px'
        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
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

    togglePointerLock() {
        return this.canvas.requestPointerLock()
    }

}
