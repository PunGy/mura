import { BehaviorSubject } from "rxjs";
import { Scene } from "./Scene";
import { Rect, isCollided } from "engine:/lib/geometry";
import { ServiceProvider } from "engine:/services/ServiceProvider";
import { Node } from 'engine:/nodes/Node'

export class MovingScene extends Scene {

    private $visibilityRect: BehaviorSubject<Rect>;
    private $visibleNodes: BehaviorSubject<Array<Node>>;
    constructor(rect?: Rect) {
        super()
        if (rect === undefined) {
            const viewportService = ServiceProvider.get('ViewportService')
            rect = {
                x: 0,
                y: 0,
                width: viewportService.width,
                height: viewportService.height
            }
        }
        this.$visibilityRect = new BehaviorSubject(rect)

        const nodes: Array<Node> = []
        if (this.nodes.size > 0) {
            this.calculateNodes(rect)
        }
        this.$visibleNodes = new BehaviorSubject(nodes)

        this.$nodesChangedSignal.subscribe(() => {

        })
    }

    get visibilityRect() {
        return this.$visibilityRect.value
    }
    set visibilityRect(rect: Rect) {
        this.$visibilityRect.next(rect)
    }

    private calculateNodes(rect: Rect) {
        const rectX = rect.x
        const rectY = rect.y
        const rectX2 = rect.width + rect.x
        const rectY2 = rect.height + rect.y
        const nodes: Array<Node> = []
        this.nodes.forEach(node => {
            if (isCollided(
                rectX, rectY, rectX2, rectY2,
                node.position.x, node.position.y, node.position.x + node.width, node.position.y + node.height
            )) {
                nodes.push(node)
            }
        })
        this.$visibleNodes.next(nodes)
    }
}
