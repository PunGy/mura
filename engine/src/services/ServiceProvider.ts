import type { AudioService } from "./AudioService";
import type { EventService } from "./EventService";
import type { FileService } from "./FileService";
import type { InputService } from "./InputService";
import type { RenderService } from "./RenderService";
import type { ViewportService } from "./ViewportService";
import type { SceneService } from "./SceneService";

type Services = {
    'RenderService': RenderService,
    'ViewportService': ViewportService,
    'FileService': FileService,
    'InputService': InputService,
    'SceneService': SceneService,
    'AudioService': AudioService,
    'EventService': EventService,
}

export class ServiceProvider {
    static _services: Services

    static registerServices(services: Services) {
        ServiceProvider._services = services
    }

    static get<S extends keyof Services>(service: S): Services[S] {
        return ServiceProvider._services[service]
    }

    static registerService<S extends keyof Services>(serviceName: S, service: Services[S]): Services[S] {
        return ServiceProvider._services[serviceName] = service
    }
}
