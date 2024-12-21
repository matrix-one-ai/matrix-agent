/* eslint-disable @typescript-eslint/no-explicit-any */
export function throttle<T extends (...args: any[]) => void>(
    func: T,
    limit: number
  ): T {
    let lastFunc: number;
    let lastRan: number;
    return function (this: any, ...args: any[]) {
      if (!lastRan) {
        func.apply(this, args);
        lastRan = Date.now();
      } else {
        clearTimeout(lastFunc);
        lastFunc = window.setTimeout(() => {
          if (Date.now() - lastRan >= limit) {
            func.apply(this, args);
            lastRan = Date.now();
          }
        }, limit - (Date.now() - lastRan));
      }
    } as T;
  }