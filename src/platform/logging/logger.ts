export function log (message: any, level: 'debug'|'log'|'warn'|'error' = 'log') {
  console[level](message)
}

export default { log }
