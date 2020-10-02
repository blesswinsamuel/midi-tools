export function classNames(...args: any[]) {
  return args
    .flatMap(x => {
      if (x && typeof x === 'object') {
        return Object.entries(x).map(([key, value]) => value && key)
      } else {
        return x
      }
    })
    .filter(x => x)
    .join(' ')
}
