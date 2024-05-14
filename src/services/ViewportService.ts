import { assert, isNil } from "src:/lib"
import { ServiceProvider } from "./ServiceProvider"

export class ViewportService {
    private _canvas: HTMLCanvasElement
    private centered: boolean = false
    private fullscreen: boolean = false
    private mouseLocked: boolean = false
    private parent: HTMLElement;
    private pixelRatio: number = 1

    constructor(canvas: HTMLCanvasElement, private _width = 600, private _height = 800) {
        this._canvas = canvas
        const parent = canvas.parentElement
        assert(!isNil(parent), 'There is no parent element')
        assert(parent.id === 'main', `Wrong parent id: "${parent.id}". The "main" expected`)
    
        this.parent = parent
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

    initViewport() {
        const { canvas } = this
        const ctx = ServiceProvider.get('RenderService').getCtx()

        // Enable HiDPI
        const dpr = window.devicePixelRatio || 1
        // @ts-expect-error browser related stuff
        const bsr = ctx.webkitBackingStorePixelRatio ||
        // @ts-expect-error browser related stuff
              ctx.mozBackingStorePixelRatio ||
        // @ts-expect-error browser related stuff
              ctx.msBackingStorePixelRatio ||
        // @ts-expect-error browser related stuff
              ctx.oBackingStorePixelRatio ||
        // @ts-expect-error browser related stuff
              ctx.backingStorePixelRatio || 1
        this.pixelRatio = dpr / bsr

        const { width, height } = this 
        canvas.width = width * this.pixelRatio
        canvas.height = height * this.pixelRatio
        canvas.style.width = width + 'px'
        canvas.style.height = height + 'px'
        ctx.setTransform(this.pixelRatio, 0, 0, this.pixelRatio, 0, 0)
    }

    registerFullScreen() {
        this._canvas.addEventListener('click', () => {
            this.enterFullScreen()
        })
        this._canvas.addEventListener('fullscreenchange', () => {
            this.fullscreen = !this.fullscreen
        })
    }

    toggleInCenter() {
        if (this.centered) {
            this.parent.classList.remove('center')
        } else {
            this.parent.classList.add('center')
        }
        this.centered = !this.centered
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
