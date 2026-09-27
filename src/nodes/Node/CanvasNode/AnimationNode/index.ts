import { CanvasNode } from 'src:/nodes/Node/CanvasNode'
import type {Sprite} from "src:/services/RenderService";
import {ServiceProvider} from "src:/services/ServiceProvider.ts";
import {CHUNK_SIZE} from "src:/scenes/SceneSettings.ts";
import { Scene } from 'src:/scenes/Scene';

export type RuntimeAnimation = (frame: number) => void;

export type PlayAnimationEntry = {
    tag: 'play',
    frames: number, // 0 if static
    sprite: Sprite | null,
    duration: number,
}

export type StaticSpriteAnimationEntry = {
    tag: 'static_sprite'
    frames: 0,
    sprite: Sprite | null,
}
export type StaticRuntimeAnimationEntry = {
    tag: 'static_runtime'
    frames: 0,
    draw: RuntimeAnimation,
}

export type RuntimeAnimationEntry = {
    tag: 'runtime'
    frames: number,
    animate: RuntimeAnimation,
    duration: number,
}

export type AnimationEntry = PlayAnimationEntry | StaticSpriteAnimationEntry | StaticRuntimeAnimationEntry | RuntimeAnimationEntry
export class AnimationNode<T extends Scene, AnimationKeys extends PropertyKey> extends CanvasNode<T> {
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
        const animation = this.activeAnimation;
        const sprite = this.isPlay(animation) || this.isStaticSprite(animation)
            ? animation.sprite
            : null;
        
        if (sprite) {
            sprite.renderer.crop(this.frameWidth * this.activeFrame, 0, this.frameWidth, this.frameHeight)
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
    staticRuntimeFrameAnimation(draw: RuntimeAnimation): StaticRuntimeAnimationEntry {
        return {
            tag: 'static_runtime',
            frames: 0,
            draw,
        }
    }
    runtimeFrameAnimation(frames: number, duration: number, animate: RuntimeAnimation): RuntimeAnimationEntry {
        return {
            tag: 'runtime',
            frames,
            animate,
            duration,
        }
    }
    private isStatic(animation: AnimationEntry): animation is StaticSpriteAnimationEntry | StaticRuntimeAnimationEntry {
        return animation.tag.startsWith('static')
    }
    private isStaticSprite(animation: AnimationEntry): animation is StaticSpriteAnimationEntry {
        return animation.tag === 'static_sprite'
    }
    private isStaticRuntime(animation: AnimationEntry): animation is StaticRuntimeAnimationEntry {
        return animation.tag === 'static_runtime'
    }

    private isRuntime(animation: AnimationEntry): animation is RuntimeAnimationEntry {
        return animation.tag === 'runtime'
    }
    private isPlay(animation: AnimationEntry): animation is PlayAnimationEntry {
        return animation.tag === 'play'
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
        const animation = this.activeAnimation
        if (this.isRuntime(animation)) {
            animation.animate(this.activeFrame)
        } else if (this.isStaticRuntime(animation)) {
            animation.draw(0)
        } else if (this.isStaticSprite(animation) || this.isPlay(animation)) {
            if (animation.sprite === null) {
                console.error('sprite is not loaded yet!')
                return;
            }

            animation.sprite.renderer
                .position(this.position.x, this.position.y)
                .crop(this.frameWidth * this.activeFrame, 0, this.frameWidth, this.frameHeight)
                .draw()
        }
    }
}
