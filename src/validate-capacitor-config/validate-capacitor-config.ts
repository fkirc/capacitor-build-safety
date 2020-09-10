import { logFatal, readJsonFileOrDie } from '../util';

interface CapConfig {
  server?: unknown;
}

export function validateCapacitorConfig(path: string): void {
  const capConfig: Partial<CapConfig> = readJsonFileOrDie(path);
  if (capConfig.server !== undefined) {
    logFatal('fix');
  }
  console.log('validate success');
}
