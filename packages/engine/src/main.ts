import { Application } from "./application/Application"
import { Logger, loggerType, type ILogger } from "./lib/logger/Logger"
import { muraLog } from "./lib/logger/muraLog"
// @ts-expect-error TODO: typescript setup asset import
import './styles.css'

declare global {
    /**
    * @deprecated Following node is browser node!
    * Mura node:
    * import { Node } from "@mura/engine/src/node/Node"
    */
    interface Node {
        _: undefined;
    }

    var app: Application
    var muraLog: ILogger
    var gameLog: ILogger
}

export function main(App: new () => Application) {
    window.muraLog = muraLog
    const app = new App()
    window.gameLog = new Logger(app.title, loggerType.console) as never as ILogger

    app.init()

    window.app = app

    let previousTimeStamp: number, delta: number
    const start = previousTimeStamp = performance.now()

    app.startTime = start
    requestAnimationFrame(function mainLoop(timestamp) {
        delta = timestamp - previousTimeStamp
        app.mainLoop(delta)
        previousTimeStamp = timestamp

        requestAnimationFrame(mainLoop)
    })
}
