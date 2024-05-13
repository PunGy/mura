// import PlayerSprite from 'src:/resources/character_sprites.png'
import PlayerSprite from './cat.png'
import PlayerReversedSprite from './char_reversed.png'
import { ServiceProvider } from 'src:/services/ServiceProvider';
import { Vector } from 'src:/lib/vector';
import {AnimationNode, PlayAnimationEntry} from "src:/nodes/Node/CanvasNode/AnimationNode";
import {CHUNK_SIZE} from "src:/scenes/SceneSettings.ts";
import {Camera} from "src:/games/mura/components/Player/camera";
import {CollisionController} from "src:/games/mura/components/Player/collisionController";

type PlayerAnimation = 'stay' | 'move'
export class Player extends AnimationNode<PlayerAnimation>{
  position: Vector = new Vector(CHUNK_SIZE * 6, CHUNK_SIZE * 8)
  // units / milliseconds
  speed = 0.16;
  collisionController: CollisionController;

  direction: 'left' | 'right' = 'right'
  camera: Camera

  constructor() {
    super();
    this.width = 2
    this.height = 2
    this.frameHeight = 100
    this.frameWidth = 100
    this.animations = {
      move: {
        frames: 0,
        duration: 150,
        sprite: null,
      },
      stay: AnimationNode.staticFrameAnimation(null),
    }

    this.camera = new Camera(this)
    this.collisionController = new CollisionController(this, {
      x: this.position.x + 32,
      y: this.position.y + 16,
    }, this.width * (CHUNK_SIZE / 2.2), this.height * (CHUNK_SIZE / 1.45))

    let { x, y } = this.position
    const collisionController = this.collisionController
    Object.defineProperties(this.position, {
      x: {
        get() {
          return x
        },
        set(val) {
          x = val
          collisionController.position.x = val + 32
        }
      },
      y: {
        get() {
          return y
        },
        set(val) {
          y = val
          collisionController.position.y = val + 16
        }
      }
    })

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

  render() {
    super.render()

    this.drawDebugRect()
    this.collisionController.drawDebugRect('red', false)
  }

  static movementKeys = new Set(['KeyD', 'KeyA', 'KeyW', 'KeyS'])
  act(delta: number) {
    const inputService = ServiceProvider.get('InputService')

    const { activeKey } = inputService
    const {position, speed} = this

    const { x: ix, y: iy } = position
    switch (activeKey) {
      case 'KeyD':
        position.x += speed * delta
        this.activeAnimation.sprite?.renderer.invert(true)
        break
      case 'KeyA':
        this.activeAnimation.sprite?.renderer.invert(false)
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

    if (Player.movementKeys.has(activeKey!)) {
      this.setAnimation('move')
      const c = this.collisionController.getCollision()
      if (c) {
        c.drawDebugRect('blue')
        position.x = ix
        position.y = iy
      }
    }

    this.camera.act()
  }
}
