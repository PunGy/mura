import './assets/style.css'
import { FileService } from './services/FileService.ts'
import { RenderService } from './services/RenderService.ts'
import { ServiceProvider } from './services/ServiceProvider.ts'
import { ViewportService } from './services/ViewportService.ts'

import { isCanvas, assert, assertNil } from './lib/index.ts'
import { InputService } from './services/InputService.ts'
import {SceneService} from "./services/SceneService.ts";
import { Scene } from './scenes/Scene.ts'
import { AudioService } from './services/AudioService.ts'

export async function mura(InitialSceneClass: new () => Scene) {
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
    const sceneNodesInitialization = sceneService.activeScene.initNodesEffect
    if (sceneNodesInitialization instanceof Promise) {
        await sceneNodesInitialization
    }

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

