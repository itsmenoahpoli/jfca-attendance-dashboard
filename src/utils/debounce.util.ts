type DebounceFnGenerics = (...args: any[]) => void;

const debounce = <T extends DebounceFnGenerics>(func: T, delay: number): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout | null = null;

  return function (this: any, ...args: Parameters<T>) {
    const context = this;

    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
};

export { debounce };
