export type Resource = CanvasImageSource | ArrayBuffer

export class FileService {
    private cache: Map<string, {
        resource: Resource | null,
        loadEffect: Promise<Resource> | null,
    }> = new Map();

    getResource<R extends Resource>(path: string): R | null {
        return this.cache.get(path)?.resource as R ?? null
    }

    loadFile(path: string): Promise<ArrayBuffer> {
        const runningEffect = this.cache.get(path)?.loadEffect as Promise<ArrayBuffer>
        if (runningEffect) return runningEffect

        const effect = fetch(path).then((response) => response.arrayBuffer())
        this.cache.set(path, { resource: null, loadEffect: effect })

        return effect
    }

    loadImage(path: string): Promise<CanvasImageSource> {
        // to prevent loading the same resource twice
        const runningEffect = this.cache.get(path)?.loadEffect as Promise<CanvasImageSource>
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
