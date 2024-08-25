import type { Level } from "game:/scenes/Level";
import { Panel } from "./Panel";
import { ServiceProvider } from "engine:/services/ServiceProvider";
import { CommandDown, CommandLeft, CommandRight, CommandUp } from "game:/components/Robot/Programmator/commands/commands";
import { CommandButton, CommandButtonType } from "./CommandPallet";
import { BehaviorSubject, first, mergeWith } from "rxjs";
import type { Command } from "game:/components/Robot/Programmator/Command";
import { CanvasNode } from "engine:/nodes/Node/CanvasNode";

export class ActiveCommandPointer extends CanvasNode<Level> {
    constructor(level: Level) {
        super(level)

        this.safeSubscribe(this.$activeCommand, () => {
            console.log(this.activeCommand)
            this.render()
        })
    }

    private $activeCommand = new BehaviorSubject<CommandButton | null>(null)

    get activeCommand() {
        return this.$activeCommand.value
    }
    set activeCommand(commandButton: CommandButton | null) {
        this.$activeCommand.next(commandButton)
    }

    render() {
        const { activeCommand } = this
        if (!activeCommand) {
            return
        }
        console.log('render cursor')
        const renderer = ServiceProvider.get('RenderService')
        renderer.rect(activeCommand.position.x + activeCommand.width + 10, activeCommand.position.y, 10, activeCommand.height, 'yellow')
    }
}

export class CommandsSequence extends Panel {
    history: Map<Command, CommandButton> = new Map()
    activePointer: ActiveCommandPointer 

    constructor(level: Level) {
        super(level)
        const viewport = ServiceProvider.get('ViewportService')
        this.width = 160
        this.height = viewport.height - 100
        this.position.x = viewport.width - this.width 
        this.activePointer = new ActiveCommandPointer(level)

        const programator = level.robot.programator
        this.safeSubscribe(programator.$commandQueue, (commandQueue) => {
            this.history.clear()
            let lastButton: CommandButton | null = null
            commandQueue.forEach((command) => {
                let type: CommandButtonType
                switch(true) {
                case command instanceof CommandRight:
                    type = CommandButtonType.RIGHT
                    break;
                case command instanceof CommandLeft:
                    type = CommandButtonType.LEFT
                    break;
                case command instanceof CommandUp:
                    type = CommandButtonType.UP
                    break;
                case command instanceof CommandDown:
                    type = CommandButtonType.DOWN
                    break;
                }
                const button = new CommandButton(level, type!)
                button.position.x = this.position.x + 20
                button.position.y = lastButton 
                    ? lastButton.position.y + lastButton.height + 10 
                    : 20 
                button.init()
                this.history.set(command, button)
                lastButton = button
            })
        })
        this.safeSubscribe(programator.$activeCommand, (command) => {
            if (!command) {
                this.activePointer.activeCommand = null
                return
            }
            const button = this.history.get(command.value)
            if (!button) {
                throw new Error('unkown command')
            }
            this.activePointer.activeCommand = button 

        })

        this.safeSubscribe(this.$renderSignal.pipe(first(), mergeWith(level.$gameTickSignal)), () => {
            console.log('render buttons')
            this.history.forEach(command => {
                command.render()
            })
        })
    }
    async init() {
        await Promise.all(
            Array.from(this.history.values())
                .map(button => button.init())
                .concat()
        )
    }
}
