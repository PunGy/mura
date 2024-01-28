export type Resource = CanvasImageSource

export class FileService {
  private cache: Map<string, {
    resource: Resource | null,
    loadEffect: Promise<Resource> | null,
  }> = new Map();
  constructor() {

  }

  getResource(path: string): Resource | null {
    return this.cache.get(path)?.resource ?? null
  }

  loadImage(path: string): Promise<CanvasImageSource> {
    // to prevent loading the same resource twice
    const runningEffect = this.cache.get(path)?.loadEffect
    if (runningEffect) return runningEffect

    const effect = new Promise<CanvasImageSource>((res) => {
      const img = new Image()
      img.addEventListener('load', () => {
        this.cache.set(path, {
          loadEffect: null,
          resource: img
        })
        res(img)
      })
      img.src = path
    })
    this.cache.set(path, { resource: null, loadEffect: effect })

    return effect
  }
}
