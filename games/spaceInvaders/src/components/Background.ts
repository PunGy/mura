import { CanvasNode } from "@mura/engine/dist/nodes/Node/CanvasNode";
import { ServiceProvider } from "@mura/engine/dist/services/ServiceProvider";
import { MainScene } from "../scenes/MainScene";

export class Background extends CanvasNode<MainScene> {
    init() {
        const viewportService = ServiceProvider.get('ViewportService')
        this.width = viewportService.width
        this.height = viewportService.height
        this.safeSubscribe(this.$renderSignal, () => {
            ServiceProvider.get('RenderService')
                .rect(0, 0, this.width, this.height, 'black')
        })
    }

}
