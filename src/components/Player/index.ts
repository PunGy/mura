// import PlayerSprite from 'src:/resources/character_sprites.png'
import PlayerSprite from './char.png'
import PlayerReversedSprite from './char_reversed.png'
import { ServiceProvider } from 'src:/services/ServiceProvider';
import { Vector } from 'src:/lib/vector';
import {AnimationNode, PlayAnimationEntry} from "src:/nodes/Node/CanvasNode/AnimationNode";
import {CHUNK_SIZE} from "src:/scenes/SceneSettings.ts";
import {Camera} from "src:/components/Player/camera.ts";

type PlayerAnimation = 'stay' | 'move'
export class Player extends AnimationNode<PlayerAnimation>{
  position: Vector = new Vector(CHUNK_SIZE * 6, CHUNK_SIZE * 7)
  // units / milliseconds
  speed = 0.16;

  direction: 'left' | 'right' = 'right'
  camera: Camera

  constructor() {
    super();
    this.width = 2
    this.height = 2
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

    this.camera = new Camera(this)

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

    const { activeKey } = inputService
    const {position, speed} = this
    if (Player.movementKeys.has(activeKey!)) {
      this.setAnimation('move')
    }
    switch (activeKey) {
      case 'KeyD':
        position.x += speed * delta
        this.activeAnimation.sprite?.renderer.invert(false)
        break
      case 'KeyA':
        this.activeAnimation.sprite?.renderer.invert(true)
        position.x -= speed * delta
        break
      case 'KeyW':
        position.y -= speed * delta
        break
      case 'KeyS':
        position.y += speed * delta
        break
      default:
        this.setAnimation('stay')
    }

    this.camera.act()
  }
}
