export function logError(msg: string) {
  console.error(msg);
}

export function logFatal(msg: string): never {
  logError(msg);
  return process.exit(1) as never;
}
