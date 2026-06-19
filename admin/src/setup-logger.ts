import { getBootstrapConfig } from './bootstrap.js';

export function setupLogger(): void {
  void getBootstrapConfig(); // Config exists for future use
  // Logger is ready to use
}
