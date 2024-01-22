import PlayerSprite from './char.png'
import PlayerReversedSprite from './char_reversed.png'
import { ServiceProvider } from 'src:/services/ServiceProvider';
import { Vector } from 'src:/lib/vector';
import {AnimationNode, PlayAnimationEntry} from "src:/nodes/Node/CanvasNode/AnimationNode";

type PlayerAnimation = 'stay' | 'move'
export class Player extends AnimationNode<PlayerAnimation>{
  position: Vector = new Vector(10, 10)
  // units / milliseconds
  speed = 0.16;

  direction: 'left' | 'right' = 'right'

  constructor() {
    super();
    this.width = 128
    this.height = 128
    this.frameHeight = 128
    this.frameWidth = 128
    this.animations = {
      move: {
        frames: 5,
        duration: 150,
        sprite: null,
      },
      stay: AnimationNode.staticFrameAnimation(null),
    }
    this.setAnimation('stay')
  }

  async init() {
    const fileService = ServiceProvider.get('FileService')
    fileService.loadImage(PlayerSprite).then(sprite => {
      this.animations.move.sprite
        = this.animations.stay.sprite
        = this.makeAnimationSprite(sprite)
    })
  }

  static movementKeys = new Set(['KeyD', 'KeyA', 'KeyW', 'KeyS'])
  act(delta: number) {
    const inputService = ServiceProvider.get('InputService')

    const {keypressed} = inputService
    const {position, speed} = this
    if (keypressed === "KeyD") {
      position.x += speed * delta
      this.activeAnimation.sprite?.renderer.invert(false)
    } else if (keypressed === 'KeyA') {
      this.activeAnimation.sprite?.renderer.invert(true)
      position.x -= speed * delta
    } else if (keypressed === 'KeyW') {
      position.y -= speed * delta
    } else if (keypressed === 'KeyS') {
      position.y += speed * delta
    }

    if (Player.movementKeys.has(keypressed!)) {
      this.setAnimation('move')
    } else {
      this.setAnimation('stay')
    }
  }


}
