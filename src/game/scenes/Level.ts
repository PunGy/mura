import { Node } from "engine:/nodes/Node";
import { CanvasNode } from "engine:/nodes/Node/CanvasNode";
import { Scene } from "engine:/scenes/Scene";
import { ServiceProvider } from "engine:/services/ServiceProvider";

const randomInt = (min: number, max = 0) => Math.floor(Math.random() * (max - min) + min);

class Background extends CanvasNode<Level> {
    init() {
        const viewportService = ServiceProvider.get('ViewportService');
        this.width = viewportService.width;
        this.height = viewportService.height;

        const render = ServiceProvider.get('RenderService')

        const stars = 
            Array.from({ length: randomInt(50, 70) })
                .map(() => ({ x: randomInt(0, this.width), y: randomInt(0, this.height) }))

        this.safeSubscribe(this.$renderSignal, () => {
            render
                .rect(0, 0, this.width, this.height, 'black')

            stars.forEach(star => {
                render.rect(star.x, star.y, 5, 5, 'white')
            })
        })
    }
}

class Platform extends CanvasNode<Level> {
    color: string = '#d9e532'

    constructor(level: Level) {
        super(level);
        this.height = 10;
        this.width = 100;
    }

    init() {
        const render = ServiceProvider.get('RenderService')
        this.safeSubscribe(this.$renderSignal, () => {
            render.rect(this.position.x, this.position.y, this.width, this.height, this.color);
        })
    }
}

class PlatformManager extends Node<Level> {
    platforms: Array<Platform> = [];

    init() {
        const viewportService = ServiceProvider.get('ViewportService');
        this.width = viewportService.width;
        this.height = viewportService.height;
        const spaceBetween = 150

        let prevY = 0;
        const segmentsCount = this.height / spaceBetween;
        this.platforms = Array.from({ length: segmentsCount })
            .map((_, i) => {
                const platform = new Platform(this.scene);
                const y = prevY + spaceBetween;

                platform.position.y = y;
                platform.position.x = i === (segmentsCount - 2)
                    ? this.width / 2 - platform.width / 2
                    : randomInt(
                        100, this.width - 100,
                    )
                prevY = y;

                return platform;
            });

        this.platforms.forEach(platform => {
            this.scene.addNode(platform);
        })
    }
}

export class Level extends Scene {
    constructor() {
        super()
        const background = new Background(this);
        const platformManager = new PlatformManager(this)
        this.addNode(background);
        this.addNode(platformManager)
    }
}
