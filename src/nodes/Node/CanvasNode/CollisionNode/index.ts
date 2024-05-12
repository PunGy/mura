import { ServiceProvider } from "src:/services/ServiceProvider";

export class CollisionNode extends Node {
    getCollision() {
        const scene = ServiceProvider.get('SceneService').activeScene

        const p1 = this.position
        const p1x2 = p1.x + this.width
        const p1y2 = p1.y + this.height
        return scene.getNodes().find((node) => {
            if (!node.collided || node === this.parent) return false;
            const p2 = node.position
            const p2x2 = p2.x + node.width * CHUNK_SIZE
            const p2y2 = p2.y + node.height * CHUNK_SIZE

            return (
                p1.x < p2x2 && p1x2 > p2.x &&
        p1.y < p2y2 && p1y2 > p2.y
            )
        })
    }
}
