import { Subject } from "rxjs";

export class EventService {
    $tickSignal = new Subject<number>()
}
