import { assertNil } from "@mura/engine/src/lib/assert"
import { ViewportService } from "@mura/engine/src/viewport/Viewport"
import { Fluid } from 'reactive-fluid'
import type { Scene } from "../scene/Scene"
import type { StratchingStrategy } from "../viewport/types"
import { InputService } from "../input/InputService"
import type { Key } from "../input/types"

export class Application {
    container: HTMLDivElement

    title = "MuraDemo"

    // Services
    viewport: ViewportService
    input: InputService

    // Properties
    startTime = 0
    width = 0
    height = 0

    viewportStractching: StratchingStrategy = 'none'

    background?: string

    // emmiters
    tick = Fluid.val(0)
    draw = Fluid.val(0)

    constructor() {
        const appContainer = document.getElementById('app') as HTMLDivElement | null 
        assertNil(appContainer, 'Container with id #app should be on the page!')
        this.container = appContainer
        this.viewport = new ViewportService(this)
        this.input = new InputService(this)
    }

    init() {
        this.viewport.init()
        this.input.init()
    }

    mainLoop(delta: number) {
        Fluid.write(this.tick, delta)
        Fluid.write(this.draw, 0)
    }

    activeScene?: Scene
    setScene(scene: Scene) {
        this.activeScene = scene
    }
}
