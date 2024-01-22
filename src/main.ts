import './assets/style.css'
import { FileService } from './services/FileService'
import { RenderService } from './services/RenderService'
import { ServiceProvider } from './services/ServiceProvider'
import { ViewportService } from './services/ViewportService'
import Grass2 from './resources/grass2.png'

import { isNil, isCanvas, assert, assertNil } from './lib'
import { InputService } from './services/InputService'
import { Player } from './components/Player'


const player = new Player()
async function main() {
  const canvasEl = document.getElementById('world')

  assertNil(canvasEl, 'Cannot find canvas element!')
  assert(isCanvas(canvasEl), 'The world is not a canvas!')

  const fileService = new FileService()
  const renderService = new RenderService(canvasEl)
  const viewportService = new ViewportService(canvasEl, 800, 600)
  const inputService = new InputService()

  ServiceProvider.registerServices({
    'ViewportService': viewportService,
    'RenderService': renderService,
    'FileService': fileService,
    'InputService': inputService,
  })

  viewportService.initViewport()
  viewportService.toggleInCenter()
  inputService.init()

  await fileService.loadImage(Grass2)
  await player.init()

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
  const fileService = ServiceProvider.get('FileService')
  const viewportService = ServiceProvider.get('ViewportService')
  const renderService = ServiceProvider.get('RenderService')

  const width = viewportService.width
  const height = viewportService.height
  const chunkSize = 64

  const img = fileService.getResource(Grass2)!

  for (let y = 0; y < height; y += chunkSize) {
    for (let x = 0; x < width; x += chunkSize) {
      renderService.sprite(img, x, y)
    }
  }

  player.act(delta)
  player.animate(delta)
  player.render()
}


main()
