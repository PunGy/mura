import { Scene } from "engine:/scenes/Scene";
import { ServiceProvider } from "engine:/services/ServiceProvider";
import { Background } from "game:/components/Background";
import { CommandLeft, CommandRight, CommandUp } from "game:/components/Robot/Programmator/commands/commands";
import { Robot } from "game:/components/Robot/Robot";
import { State } from "game:/components/State/State";
import { Observable, Subject } from "rxjs";

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
                    console.log('tick')
                    this.gameTick()
                    this.timer = 0
                }
            }
        })

        setTimeout(() => {
            robot.programator.pushCommand(new CommandRight(this))
            robot.programator.pushCommand(new CommandUp(this))
            robot.programator.pushCommand(new CommandLeft(this))
        }, 1000)
        setTimeout(() => {
            this.running = true
            console.log('start')
        }, 2000)
    }
    protected $_gameTickSignal = new Subject<void>()
    $gameTickSignal: Observable<void> = this.$_gameTickSignal

    gameTick() {
        console.log('ticking')
        const programator = this.robot.programator
        if (programator.done) {
            this.running = false
            return;
        }
        this.robot.programator.tick()
        this.$_gameTickSignal.next()
    }

    running = false
    timer = 0
    gameTickTimeout = 1200
}
