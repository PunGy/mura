import { Scene } from "engine:/scenes/Scene";
import { ServiceProvider } from "engine:/services/ServiceProvider";
import { Background } from "game:/components/Background";
import { Robot } from "game:/components/Robot/Robot";
import { State } from "game:/components/State/State";

export class Level extends Scene {
    state: State
    robot: Robot

    constructor() {
        super()

        const background = new Background(this)
        this.addNode(background)


        const robot = new Robot(this);
        this.robot = robot
        this.addNode(robot)

        this.state = new State([robot])
        this.safeSubscribe(robot.programator.$activeCommand, () => {
            console.log('moving right!', robot.position)
            this.state.snapshot()
        })
        this.safeSubscribe(ServiceProvider.get('EventService').$tickSignal, (delta) => {
            if (this.running) {
                this.timer += delta 
                if (this.timer >= this.gameTickTimeout) {
                    this.gameTick()
                }
            }
        })
    }

    gameTick() {
        const programator = this.robot.programator
        if (programator.done) {
            this.running = false
            return;
        }
        this.robot.programator.tick()
    }

    running = false
    timer = 0
    gameTickTimeout = 1200
}
