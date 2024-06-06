import { LinkedList, ListNode } from "engine:/lib/LinkedList";
import { Command } from "./Command";
import { Robot } from "../Robot";
import { BehaviorSubject, Observable } from "rxjs";

export class Programator {
    commandQueue: LinkedList<Command> = new LinkedList()
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
    }
    pushCommand(newCommand: Command) {
        console.log('command pushed', newCommand)
        this.commandQueue.pushBack(newCommand)
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
