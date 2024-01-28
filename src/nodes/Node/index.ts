import { Vector } from "src:/lib/vector";
import {CHUNK_SIZE} from "src:/scenes/SceneSettings.ts";

export class Node {
  public position: Vector = new Vector(0, 0)

  // The size of objects is measured in chunks (see in src:/scenes/SceneSettings)
  // Example: { width: 2 } -> { width: CHUNK_SIZE * 2 }
  public width: number = 1
  public height: number = 1

  init(): void | Promise<void> {};
  act(delta: number): void {};
}
