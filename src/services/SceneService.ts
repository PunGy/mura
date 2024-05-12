import {Scene} from "src:/scenes/Scene.ts";

export class SceneService {
    private _activeScene: Scene;

    get activeScene(): Readonly<Scene> {
        return this._activeScene
    }

    setActiveScene(scene: Scene) {
        this._activeScene = scene
    }

    constructor(initialScene: Scene) {
        this._activeScene = initialScene
    }
}
