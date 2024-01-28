import {assertNil, isNil, assert } from 'src:/lib'
import {ServiceProvider} from "src:/services/ServiceProvider.ts";

export type Sprite = {
  resource: CanvasImageSource;
  renderer: IDrawSpriteBuilder;
}
export interface IDrawSpriteBuilder {
  position(x: number, y: number): DrawSpriteBuilder;
  size(width: number, height: number): DrawSpriteBuilder;
  crop(x: number, y: number, width: number, height: number): DrawSpriteBuilder;
  invert(toInvert: boolean): DrawSpriteBuilder;
  draw(): void;
}
class DrawSpriteBuilder implements IDrawSpriteBuilder {
  private _ctx: CanvasRenderingContext2D;

  private _img: CanvasImageSource
  private _x?: number
  private _y?: number
  private _crop?: { x: number, y: number, width: number, height: number }
  private _size?: { width: number, height: number }
  private _invert?: boolean;

  constructor(ctx: CanvasRenderingContext2D, img: CanvasImageSource) {
    this._ctx = ctx
    this._img = img
  }

  position(x: number, y: number): DrawSpriteBuilder {
    this._x = x
    this._y = y
    return this
  }

  size(width: number, height: number): DrawSpriteBuilder {
    this._size = {width, height}
    return this
  }

  crop(x: number, y: number, width: number, height: number): DrawSpriteBuilder {
    this._crop = {x, y, width, height}
    return this
  }

  invert(toInvert: boolean) {
    this._invert = toInvert
    return this
  }

  draw() {
    assertNil(this._x, 'You should assign the "x" position for drawing a sprite!')
    assertNil(this._y, 'You should assign the "y" position for drawing a sprite!')
    const renderingService = ServiceProvider.get('RenderService')

    let { _x: x, _y: y } = this
    if (this._invert) {
      this._ctx.save()
      x = -x + (-(this._size ? this._size.width : (this._img as HTMLImageElement).width))
      this._ctx.scale(-1, 1)

      x = x + renderingService.offsetX
    } else {
      x = x - renderingService.offsetX
    }
    y = y - renderingService.offsetY


    switch (true) {
      case !isNil(this._crop):
        assertNil(this._size, 'You should set size of the sprite during cropping!')
        this._ctx.drawImage(
          this._img,
          this._crop.x, this._crop.y, this._crop.width, this._crop.height, // image coordinates
          x, y, this._size.width, this._size.height, // canvas coordinates
        );
        // this._ctx.drawImage(this._img, this._x, this._y, this._crop.x, this._crop.y);
        break
      case !isNil(this._size):
        this._ctx.drawImage(this._img, x, y, this._size.width, this._size.height)
        break
      default:
        this._ctx.drawImage(this._img, x, y)
    }

    if (this._invert) {
      this._ctx.restore()
    }
  }
}

export class RenderService {
  private canvas: HTMLCanvasElement
  private readonly ctx: CanvasRenderingContext2D

  offsetX = 0;
  offsetY = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    const ctx = canvas.getContext('2d')

    assert(!isNil(ctx), 'Cannot create 2d context')

    this.ctx = ctx
  }

  rect(x: number, y: number, w: number, h: number, c: string) {
    this.ctx.fillStyle = c
    this.ctx.fillRect(x, y, w, h)
  }

  sprite(img: CanvasImageSource): DrawSpriteBuilder;
  sprite(img: CanvasImageSource, x: number, y: number): void;
  sprite(img: CanvasImageSource, x?: number, y?: number) {
    if (typeof x === 'number') {
      this.ctx.drawImage(img, x, y!)
    } else {
      return new DrawSpriteBuilder(this.ctx, img)
    }
  }

  clear() {
    const viewportService = ServiceProvider.get('ViewportService')
    this.ctx.clearRect(0, 0, viewportService.width, viewportService.height)
  }

  getSpriteRenderer(img: CanvasImageSource) {
    return new DrawSpriteBuilder(this.ctx, img)
  }
}
