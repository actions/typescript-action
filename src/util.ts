export function joinPath(...args: string[]): string {
  let s = args[0]

  for (let i = 1; i < args.length; ++i) {
    if (s.endsWith('/')) {
      if (args[i].startsWith('/')) {
        s += args[i].slice(1)
      } else {
        s += args[i]
      }
    } else {
      if (args[i].startsWith('/')) {
        s += args[i]
      } else {
        s += `/${args[i]}`
      }
    }
  }

  return s ?? ''
}
