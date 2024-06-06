import { LinkedList, ListNode } from "engine:/lib/LinkedList";
import { Command } from "./Command";
import { Robot } from "../Robot";
import { BehaviorSubject, Observable } from "rxjs";

export class Programator {
    commandQueue: LinkedList<Command> = new LinkedList()
    private $_activeCommand = new BehaviorSubject<ListNode<Command> | null>(null)
    $activeCommand: Observable<ListNode<Command> | null> = this.$_activeCommand
    done = true

    robot: Robot

    constructor(robot: Robot) {
        this.robot = robot
    }

    prependCommand(newCommand: Command, before: ListNode<Command>) {
        this.commandQueue.prepend(before, newCommand)
    }
    pushCommand(newCommand: Command) {
        this.commandQueue.pushBack(newCommand)
    }

    tick() {
        const command = this.$_activeCommand.value?.next ?? this.commandQueue.peekHead()
        if (!command) {
            this.done = true
            return
        }
        this.done = false
        command.value.run(this.robot)
        this.$_activeCommand.next(command)
    }
}
