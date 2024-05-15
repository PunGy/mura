import { CanvasNode } from "src:/nodes/Node/CanvasNode";
import { ServiceProvider } from "src:/services/ServiceProvider";
import { MainScene } from "../scenes/MainScene";

export class Background extends CanvasNode<MainScene> {
    init() {
        const viewportService = ServiceProvider.get('ViewportService')
        this.width = viewportService.width
        this.height = viewportService.height
    }

    render(): void {
        ServiceProvider.get('RenderService')
            .rect(0, 0, this.width, this.height, 'black')
    }
}
