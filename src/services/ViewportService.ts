import { assert, isNil } from "src:/lib"

export class ViewportService {
  private _canvas: HTMLCanvasElement
  private centered: boolean = false
  private fullscreen: boolean = false
  private mouseLocked: boolean = false
  private parent: HTMLElement;

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
    this.canvas.width = this.width
    this.canvas.height = this.height
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
