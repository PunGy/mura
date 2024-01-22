import { ServiceProvider } from "./ServiceProvider";

export class InputService {
  keypressed: string | null = null; 
  constructor() {

  }

  init() {
    document.addEventListener('keydown', (event) => {
      this.keypressed = event.code
    })
    document.addEventListener('keyup', () => {
      this.keypressed = null
    })
  }
} 
