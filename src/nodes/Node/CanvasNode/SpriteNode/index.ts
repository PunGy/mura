import {CanvasNode} from "src:/nodes/Node/CanvasNode";
import {ServiceProvider} from "src:/services/ServiceProvider.ts";
import {Sprite} from "src:/services/RenderService.ts";
import {CHUNK_SIZE} from "src:/scenes/SceneSettings.ts";

export class SpriteNode extends CanvasNode {
  private sprite: Sprite | null = null;
  private spritePath: string

  constructor(path: string) {
    super();
    this.spritePath = path
  }

  async init() {
    const fileService = ServiceProvider.get('FileService')
    const renderService = ServiceProvider.get('RenderService')

    const file = await fileService.loadImage(this.spritePath)
    this.sprite = {
      resource: file,
      renderer: renderService.getSpriteRenderer(file)
        .size(this.width * CHUNK_SIZE, this.height * CHUNK_SIZE)
    }
  }
  render() {
    if (this.sprite === null) {
      console.log('Sprite is not initialized')
      return
    }

    this.sprite.renderer
      .position(this.position.x, this.position.y)
      .draw()
  }
}