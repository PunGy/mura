import { CanvasNode } from 'src:/nodes/Node/CanvasNode'
import type {Sprite} from "src:/services/RenderService";
import {ServiceProvider} from "src:/services/ServiceProvider.ts";
import {CHUNK_SIZE} from "src:/scenes/SceneSettings.ts";

export type PlayAnimationEntry = {
  frames: number, // 0 if static
  sprite: Sprite | null,
  duration: number,
}

export type StaticAnimationEntry = {
  frames: 0,
  sprite: Sprite | null,
}

export type AnimationEntry = PlayAnimationEntry | StaticAnimationEntry
export class AnimationNode<AnimationKeys extends PropertyKey> extends CanvasNode {
  animations = {} as Record<AnimationKeys, AnimationEntry>
  activeAnimationKey = '' as AnimationKeys
  _activeFrame = 0
  frameWidth = 0
  frameHeight = 0
  get activeAnimation() {
    return this.animations[this.activeAnimationKey]
  }

  get activeFrame() {
    return this._activeFrame
  }
  set activeFrame(activeFrame) {
    if (this.activeAnimation.sprite !== null) {
      this.activeAnimation.sprite.renderer
        .crop(this.frameWidth * this.activeFrame, 0, this.frameWidth, this.frameHeight)
    }
    this._activeFrame = activeFrame
  }

  makeAnimationSprite(spriteSource: CanvasImageSource): Sprite {
    const renderService = ServiceProvider.get('RenderService')
    return {
      resource: spriteSource,
      renderer: renderService.getSpriteRenderer(spriteSource)
        .size(this.width * CHUNK_SIZE, this.height * CHUNK_SIZE)
    }
  }
  static staticFrameAnimation(sprite: StaticAnimationEntry['sprite']): StaticAnimationEntry {
    return {
      frames: 0,
      sprite,
    }
  }
  private isStatic(animation: AnimationEntry | StaticAnimationEntry): animation is StaticAnimationEntry {
    return animation.frames === 0
  }
  private animationDelta = 0

  setAnimation(animationKey: AnimationKeys) {
    if (this.activeAnimationKey === animationKey) return;

    this.activeAnimationKey = animationKey
    this.animationDelta = 0
    this.activeFrame = this.isStatic(this.activeAnimation) ? 0 : 1
  }

  animate(delta: number): void {
    const animation = this.activeAnimation
    if (this.isStatic(animation)) return;

    if (this.animationDelta < animation.duration) {
      this.animationDelta += delta
    } else {
      this.animationDelta = 0
      this.activeFrame = this.activeFrame === animation.frames // is last
        ? 0
        : this.activeFrame + 1
    }
  }
  render() {
    if (this.activeAnimation.sprite === null) {
      console.error('sprite is not loaded yet!')
      return;
    }

    this.activeAnimation.sprite.renderer
      .position(this.position.x, this.position.y)
      .crop(this.frameWidth * this.activeFrame, 0, this.frameWidth, this.frameHeight)
      .draw()
  }
}