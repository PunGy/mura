import { Vector } from "src:/lib/vector";
import {CHUNK_SIZE} from "src:/scenes/SceneSettings.ts";
import {ServiceProvider} from "src:/services/ServiceProvider.ts";

export class Node {
  public position: Vector = new Vector(0, 0)

  // The size of objects is measured in chunks (see in src:/scenes/SceneSettings)
  // Example: { width: 2 } -> { width: CHUNK_SIZE * 2 }
  public width: number = 1
  public height: number = 1

  public collided = false

  init(): void | Promise<void> {};
  act(delta: number): void {};

  drawDebugRect(color = 'yellow', withChunkSize = true) {
    const renderService = ServiceProvider.get('RenderService')
    const ctx = renderService.getCtx()

    ctx.strokeStyle = color
    const mult = withChunkSize ? CHUNK_SIZE : 1
    ctx.strokeRect(
      this.position.x - renderService.offsetX,
      this.position.y - renderService.offsetY,
      this.width * mult,
      this.height * mult,
    )
  }
}
