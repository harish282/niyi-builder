import { configureLogger } from '@niyi-builder/core';

import { getBootstrapConfig } from './bootstrap.js';

export function setupLogger(): void {
  const config = getBootstrapConfig();
  const enabled = config?.loggingEnabled ?? import.meta.env.DEV;

  configureLogger({ enabled });
}
