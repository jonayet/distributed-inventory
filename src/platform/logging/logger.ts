export function log (level: 'debug'|'log'|'info'|'warn'|'error', ...message: any) {
  console[level](message)
}

export default { log }
