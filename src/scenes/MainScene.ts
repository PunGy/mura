import {Scene} from "./Scene.ts";
import {Node} from "src:/nodes/Node";
import {Grass} from "src:/components/Grass";
import {Water} from "src:/components/Water";
import {Player} from "src:/components/Player";
import {Sand} from "src:/components/Sand";
import {CHUNK_SIZE} from "src:/scenes/SceneSettings.ts";
import {Wall} from "src:/components/Wall";
import {Floor} from "src:/components/Floor";
import {Door} from "src:/components/Door";
import {Window} from "src:/components/Window";

enum MapSymbol {
  GRASS = '.',
  WATER = '_',
  WALL = '(',
  FLOOR = '-',
  SAND = '~',
  DOOR = '0',
  WINDOW = '8',
}

const symbolToNode: Record<MapSymbol, new () => Node> = Object.freeze({
  [MapSymbol.GRASS]: Grass,
  [MapSymbol.WATER]: Water,
  [MapSymbol.WALL]: Wall,
  [MapSymbol.FLOOR]: Floor,
  [MapSymbol.SAND]: Sand,
  [MapSymbol.DOOR]: Door,
  [MapSymbol.WINDOW]: Window,
})
const isMapSymbol = (symbol: string): symbol is MapSymbol =>
  symbol in symbolToNode


const constructMap = (map: string): [Array<string>, number, number] => {
  const width = map.indexOf('\n')
  const height = map.split('\n').length
  return [Array.from(map.replaceAll('\n', '')), width, height]
}

const [gameMap, MAP_WIDTH, MAP_HEIGHT] = constructMap(`\
________________
___((88((_______
__~(----((~~~~__
__~8-----(...~__
__~(0(---(...~__
__~..(--((...~__
__~..((((....~__
__~..........~__
__~.........~~__
__~.........~~__
__~~.........~__
__~~~~~~~~~~~~__
________________
________________\
`)

export class MainScene extends Scene {
  constructor() {
    super();

    gameMap.forEach((symbol, i) => {
      if (!isMapSymbol(symbol))
        throw new Error(`Unknown symbol in the map: "${symbol}"!`)

      const node = new symbolToNode[symbol]

      node.position.x = (i % MAP_WIDTH) * (node.width * CHUNK_SIZE)
      node.position.y = CHUNK_SIZE * Math.floor(i / MAP_WIDTH)

      this.nodes.push(node)
    })
    this.addNode(new Player())
  }

  init() {
    const effects: Array<Promise<void>> = []
    this.nodes.forEach((node) => {
      const effect = node.init()
      if (effect instanceof Promise)
        effects.push(effect)
    })

    if (effects.length > 0) {
      return Promise.allSettled(effects)
        .then((results) => {
          results.forEach((res) => {
            if (res.status === 'rejected')
              console.error('unable to make an effect', res.reason)
          })
        })
    }
  }


}