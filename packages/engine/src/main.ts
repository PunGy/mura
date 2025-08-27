import { Application } from "./application/Application"
// @ts-expect-error TODO: typescript setup asset import
import './styles.css'

export function main(App: new () => Application) {
    const app = new App()

    app.init()

    // @ts-expect-error Expose for debbuging purpose
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
