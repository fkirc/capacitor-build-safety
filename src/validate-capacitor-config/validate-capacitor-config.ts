import { getDebugPath, logFatal, readJsonFileOrDie } from '../util';

interface CapConfig {
  server?: unknown;
}

export function validateCapacitorConfig(path: string): void {
  const capConfig: Partial<CapConfig> = readJsonFileOrDie(path);
  if (capConfig.server !== undefined) {
    logFatal(
      `Validation failed: server of ${getDebugPath(path)} is not undefined.`,
    );
  }
  console.log(`Validation succeeded: ${getDebugPath(path)}`);
}
