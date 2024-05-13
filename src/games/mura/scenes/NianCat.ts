
import {Scene} from "../../../scenes/Scene.ts";
import {Node} from "src:/nodes/Node";
import {Grass} from "src:/games/mura/components/Grass/index.ts";
import {Water} from "src:/games/mura/components/Water/index.ts";
import {Player} from "src:/games/mura/components/Player/index.ts";
import {Sand} from "src:/games/mura/components/Sand/index.ts";
import {CHUNK_SIZE} from "src:/scenes/SceneSettings.ts";
import {Wall} from "src:/games/mura/components/Wall/index.ts";
import {Floor} from "src:/games/mura/components/Floor/index.ts";
import {Door} from "src:/games/mura/components/Door/index.ts";
import {Window} from "src:/games/mura/components/Window/index.ts";

enum MapSymbol {
  GRASS = '.',
  WATER = '_',
}

const symbolToNode: Record<MapSymbol, new () => Node> = Object.freeze({
  [MapSymbol.GRASS]: Grass,
  [MapSymbol.WATER]: Water,
})
const isMapSymbol = (symbol: string): symbol is MapSymbol =>
  symbol in symbolToNode


const constructMap = (map: string): [Array<string>, number, number] => {
  const width = map.indexOf('\n')
  const height = map.split('\n').length
  return [Array.from(map.replaceAll('\n', '')), width, height]
}

const [gameMap, MAP_WIDTH, MAP_HEIGHT] = constructMap(`\
__________________________
__________________________
__________________________
_.._____..._____._________
______.._______.__________
_____________..___________
_....._______.______..____
______......._____________
__________________________
__________________________\
`)

export class NianScene extends Scene {
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
