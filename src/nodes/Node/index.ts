import { Vector } from "src:/lib/vector";

export class Node {
  public position: Vector = new Vector(0, 0)
  public width: number = 10
  public height: number = 10

  init(): void | Promise<void> {};
  act(delta: number): void {};
}
