export const isCanvas = (el: HTMLElement): el is HTMLCanvasElement => (
  el.tagName === 'CANVAS'
)
