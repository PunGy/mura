import { Scene } from "src:/scenes/Scene.ts";

class EmptyScene extends Scene {
    init() {
        throw new Error('You need to initialize scene your scene!')
    }
}

export class SceneService {
    private _activeScene: Scene;

    get activeScene(): Readonly<Scene> {
        return this._activeScene
    }

    setActiveScene(scene: Scene) {
        this._activeScene = scene
    }

    constructor(initialScene: Scene = new EmptyScene()) {
        this._activeScene = initialScene
    }
}
