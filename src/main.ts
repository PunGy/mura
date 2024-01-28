import './assets/style.css'
import { FileService } from './services/FileService'
import { RenderService } from './services/RenderService'
import { ServiceProvider } from './services/ServiceProvider'
import { ViewportService } from './services/ViewportService'

import { isCanvas, assert, assertNil } from './lib'
import { InputService } from './services/InputService'
import { Player } from './components/Player'
import {SceneService} from "src:/services/SceneService.ts";
import {MainScene} from "src:/scenes/MainScene.ts";
import {CHUNK_SIZE} from "src:/scenes/SceneSettings.ts";


const player = new Player()
async function main() {
  const canvasEl = document.getElementById('world')

  assertNil(canvasEl, 'Cannot find canvas element!')
  assert(isCanvas(canvasEl), 'The world is not a canvas!')

  const fileService = new FileService()
  const renderService = new RenderService(canvasEl)
  const viewportService = new ViewportService(canvasEl, 800, 600)
  const inputService = new InputService()
  const sceneService = new SceneService(new MainScene())

  ServiceProvider.registerServices({
    'ViewportService': viewportService,
    'RenderService': renderService,
    'FileService': fileService,
    'InputService': inputService,
    'SceneService': sceneService,
  })

  viewportService.initViewport()
  viewportService.toggleInCenter()
  inputService.init()

  const sceneInitialization = sceneService.activeScene.init()
  if (sceneInitialization instanceof Promise)
    await sceneInitialization

  let start: number, previousTimeStamp: number, delta: number;
  function f(timeStamp: number) {
    if (start === undefined)
      start = previousTimeStamp = timeStamp

    delta = timeStamp - previousTimeStamp
    gameLoop(delta, start)
    previousTimeStamp = timeStamp
    window.requestAnimationFrame(f)
  }
  window.requestAnimationFrame(f)
}

function gameLoop(delta: number, start: number) {
  const sceneService = ServiceProvider.get('SceneService')
  const renderService = ServiceProvider.get('RenderService')

  sceneService.activeScene.nodesTick(delta)
  // renderService.rect(CHUNK_SIZE * 4, 0, CHUNK_SIZE, CHUNK_SIZE, '#000');
}

main()
