export type Resource = CanvasImageSource

export class FileService {
  private cache: Map<string, Resource> = new Map();
  constructor() {

  }

  getResource(path: string): Resource | null {
    return this.cache.get(path) ?? null
  }

  loadImage(path: string): Promise<CanvasImageSource> {
    return new Promise<CanvasImageSource>((res) => {
      const img = new Image()
      img.addEventListener('load', () => {
        this.cache.set(path, img)
        res(img)
      })
      img.src = path
    })
  }
}
