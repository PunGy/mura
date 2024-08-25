import { Panel } from './Panel'
import { SpriteNode } from "engine:/nodes/Node/CanvasNode/SpriteNode";
import { ServiceProvider } from "engine:/services/ServiceProvider";
import CommandsAsset from './commands.png'
import type { Level } from "game:/scenes/Level";
import { first } from "rxjs";
import { assertIronicType } from "engine:/lib";

export enum CommandButtonType {
    RIGHT = 'right',
    UP = 'up',
    DOWN = 'down',
    LEFT = 'left',
}
export const typeToOffset: Record<CommandButtonType, number> = {
    [CommandButtonType.RIGHT]: 0,
    [CommandButtonType.LEFT]: 1,
    [CommandButtonType.DOWN]: 2,
    [CommandButtonType.UP]: 3,

}
export const COMMANDS_COUNT = Object.keys(typeToOffset).length
export class CommandButton extends SpriteNode<Level> {
    type: CommandButtonType
    constructor(level: Level, type: CommandButtonType) {
        super(level, CommandsAsset)
        this.type = type
        this.width = 64
        this.height = 64
    }

    async init() {
        await super.init()
        if (!this.sprite) {
            throw new Error('No sprite available')
        }
        const { width, height } = this
        const imgSize = this.sprite.renderer.getImageSize()
        const scaledWidth = width * (imgSize.width / width) / COMMANDS_COUNT
        const scaledHeight = height * (imgSize.height / height)
        this.sprite?.renderer.crop(
            scaledWidth * typeToOffset[this.type],
            0,
            scaledWidth,
            scaledHeight,
        )
    }
}

export class CommandPalete extends Panel {
    buttons: Array<CommandButton>

    constructor(level: Level) {
        super(level)
        const viewport = ServiceProvider.get('ViewportService')
        this.width = viewport.width
        this.height = 100
        this.position.x = 0
        this.position.y = viewport.height - this.height

        this.buttons = Object.entries(typeToOffset).map(([commandType, offset]) => {
            assertIronicType<CommandButtonType>(commandType)
            const button = new CommandButton(level, commandType)
            button.position.y = this.position.y + 20
            button.position.x = 10 + button.width * offset
            return button
        })
        this.safeSubscribe(this.$renderSignal.pipe(first()), () => {
            this.buttons.forEach(button => button.render())
        })
    }

    async init() {
        await Promise.all(this.buttons.map(button => button.init()))
    }
}
