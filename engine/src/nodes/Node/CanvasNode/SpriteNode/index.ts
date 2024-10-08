import {CanvasNode} from "src:/nodes/Node/CanvasNode";
import {ServiceProvider} from "src:/services/ServiceProvider.ts";
import {Sprite} from "src:/services/RenderService.ts";
import { Scene } from "src:/scenes/Scene";

export class SpriteNode<T extends Scene> extends CanvasNode<T> {
    private sprite: Sprite | null = null;
    private spritePath: string

    constructor(scene: T, path: string) {
        super(scene);
        this.spritePath = path

        this.safeSubscribe(this.$renderSignal, () => {
            if (this.sprite === null) {
                console.error('Sprite is not initialized')
                return
            }

            this.sprite.renderer
                .position(this.position.x, this.position.y)
                .draw()
        })
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
}
