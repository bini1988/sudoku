
export function query<E extends Element = Element>(selectors: string): E | null {
  return document.querySelector(selectors);
}

export function queryAll<E extends Element = Element>(selectors: string): NodeListOf<E> | null {
  return document.querySelectorAll(selectors);
}

export function on<K extends keyof HTMLElementEventMap>(target: HTMLElement | string | null, type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void {
  const element = (typeof target === 'string') ? query<HTMLElement>(target) : target;

  return element?.addEventListener(type, listener, options);
}
