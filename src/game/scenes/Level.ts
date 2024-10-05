import { CanvasNode } from "engine:/nodes/Node/CanvasNode";
import { Scene } from "engine:/scenes/Scene";
import { ServiceProvider } from "engine:/services/ServiceProvider";

const randomInt = (max: number, min = 0) => Math.floor(Math.random() * (max - min) + min);

class Background extends CanvasNode<Level> {
    init() {
        const viewportService = ServiceProvider.get('ViewportService');
        this.width = viewportService.width;
        this.height = viewportService.height;

        const render = ServiceProvider.get('RenderService')

        const stars = 
            Array.from({ length: randomInt(50, 70) })
                .map(() => ({ x: randomInt(0, this.width), y: randomInt(0, this.height) }))

        console.log(stars)

        this.safeSubscribe(this.$renderSignal, () => {
            render
                .rect(0, 0, this.width, this.height, 'black')

            stars.forEach(star => {
                render.rect(star.x, star.y, 5, 5, 'white')
            })
        })
    }
}

export class Level extends Scene {
    constructor() {
        super()
        const background = new Background(this);
        this.addNode(background);
    }
}
