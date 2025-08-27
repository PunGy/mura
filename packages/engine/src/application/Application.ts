import { assertNil } from "@mura/engine/src/lib/assert"
import { ViewportService } from "@mura/engine/src/viewport/Viewport"
import { Fluid } from 'reactive-fluid'
import type { Scene } from "../scene/Scene"

export class Application {
    container: HTMLDivElement

    // Services
    viewport: ViewportService

    // Properties
    startTime = 0
    width = 0
    height = 0

    // emmiters
    tick = Fluid.val(0)

    constructor() {
        const appContainer = document.getElementById('app') as HTMLDivElement | null 
        assertNil(appContainer, 'Container with id #app should be on the page!')
        this.container = appContainer
        this.viewport = new ViewportService(this)
    }

    init() {
        if (this.height && this.width) {
            this.container.style.width = this.width + "px"
            this.container.style.height = this.height + "px"
        }
        this.viewport.init()
    }

    mainLoop(delta: number) {
        Fluid.write(this.tick, delta)
    }

    activeScene?: Scene
    setScene(scene: Scene) {
        scene.app = this
        this.activeScene = scene
    }
}
