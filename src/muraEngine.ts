import './assets/style.css'
import { FileService } from './services/FileService'
import { RenderService } from './services/RenderService'
import { ServiceProvider } from './services/ServiceProvider'
import { ViewportService } from './services/ViewportService'

import { isCanvas, assert, assertNil } from './lib'
import { InputService } from './services/InputService'
import {SceneService} from "src:/services/SceneService.ts";
import { Scene } from './scenes/Scene'
import { AudioService } from './services/AudioService'

export async function muraEngine(InitialSceneClass: new () => Scene) {
    const canvasEl = document.getElementById('world')

    assertNil(canvasEl, 'Cannot find canvas element!')
    assert(isCanvas(canvasEl), 'The world is not a canvas!')

    const fileService = new FileService()
    const renderService = new RenderService(canvasEl)
    const viewportService = new ViewportService(canvasEl, 800, 600)
    const inputService = new InputService()
    const sceneService = new SceneService()
    const audioService = new AudioService()

    ServiceProvider.registerServices({
        'ViewportService': viewportService,
        'RenderService': renderService,
        'FileService': fileService,
        'InputService': inputService,
        'SceneService': sceneService,
        'AudioService': audioService,
    })

    viewportService.initViewport()
    viewportService.toggleInCenter()
    inputService.init()

    sceneService.setActiveScene(new InitialSceneClass())
    const sceneInitialization = sceneService.activeScene.init()
    if (sceneInitialization instanceof Promise)
        await sceneInitialization

    let start: number, previousTimeStamp: number, delta: number;
    function f(timeStamp: number) {
        if (start === undefined)
            start = previousTimeStamp = timeStamp

        delta = timeStamp - previousTimeStamp
        gameLoop(delta)
        previousTimeStamp = timeStamp
        window.requestAnimationFrame(f)
    }
    window.requestAnimationFrame(f)
    window.ServiceProvider = ServiceProvider
}
declare global {
    interface Window {
        ServiceProvider: ServiceProvider;
    }

}

function gameLoop(delta: number) {
    const sceneService = ServiceProvider.get('SceneService')

    sceneService.activeScene.nodesTick(delta)
    // const renderService = ServiceProvider.get('RenderService')
    // renderService.rect(CHUNK_SIZE * 4, 0, CHUNK_SIZE, CHUNK_SIZE, '#000');
}

