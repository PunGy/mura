import type { ListNode } from "engine:/lib/LinkedList";
import { LinkedList } from "engine:/lib/LinkedList";
import type { Command } from "./Command";
import type { Robot } from "../Robot";
import type { Observable } from "rxjs";
import { BehaviorSubject } from "rxjs";

export class Programator {
    commandQueue: LinkedList<Command> = new LinkedList()
    private $_commandQueue: BehaviorSubject<LinkedList<Command>> = new BehaviorSubject(this.commandQueue)
    $commandQueue: Observable<LinkedList<Command>> = this.$_commandQueue

    private $_activeCommand = new BehaviorSubject<ListNode<Command> | null>(null)
    $activeCommand: Observable<ListNode<Command> | null> = this.$_activeCommand

    robot: Robot

    get done() {
        const command = this.$_activeCommand.value
        return command && command === this.commandQueue.peekTail()
    }

    constructor(robot: Robot) {
        this.robot = robot
    }

    prependCommand(newCommand: Command, before: ListNode<Command>) {
        this.commandQueue.prepend(before, newCommand)
        this.$_commandQueue.next(this.commandQueue)
    }
    pushCommand(newCommand: Command) {
        console.log('command pushed', newCommand)
        this.commandQueue.pushBack(newCommand)
        this.$_commandQueue.next(this.commandQueue)
    }

    tick() {
        const command = this.$_activeCommand.value?.next ?? this.commandQueue.peekHead()
        if (command === null) {
            console.warn('Nothing to execute')
            return;
        }
        console.log('executing command', command)
        command.value.run(this.robot)
        if (!this.done) {
            this.$_activeCommand.next(command)
        }
    }
}
