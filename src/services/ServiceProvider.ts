import type { FileService } from "./FileService";
import type { InputService } from "./InputService";
import type { RenderService } from "./RenderService";
import type { ViewportService } from "./ViewportService";
import {SceneService} from "src:/services/SceneService.ts";

type Services = {
  'RenderService': RenderService,
  'ViewportService': ViewportService,
  'FileService': FileService,
  'InputService': InputService,
  'SceneService': SceneService,
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
