import {CanvasNode} from "engine:/nodes/Node/CanvasNode";
import {ServiceProvider} from "engine:/services/ServiceProvider.ts";
import {Sprite} from "engine:/services/RenderService.ts";
import { Scene } from "engine:/scenes/Scene";

export class SpriteNode<T extends Scene> extends CanvasNode<T> {
    protected sprite: Sprite | null = null;
    protected spritePath: string

    constructor(scene: T, path: string, subscribe = true) {
        super(scene);
        this.spritePath = path

        if (subscribe) {
            this.safeSubscribe(this.$renderSignal, () => {
                this.render()
            })
        }
    }

    async init() {
        const fileService = ServiceProvider.get('FileService')
        const renderService = ServiceProvider.get('RenderService')

        const file = await fileService.loadImage(this.spritePath)
        this.sprite = {
            resource: file,
            renderer: renderService.getSpriteRenderer(file)
                .size(this.width, this.height)
        }
    }

    render() {
        if (this.sprite === null) {
            console.error('Sprite is not initialized')
            return
        }

        this.sprite.renderer
            .position(this.position.x, this.position.y)
            .draw()
    }
}
