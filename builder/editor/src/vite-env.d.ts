/// <reference types="vite/client" />

declare module 'vite/client' {
  interface ImportMeta {
    glob: (
      pattern: string,
      options?: { eager?: boolean },
    ) => Record<string, Record<string, unknown>>;
  }
}
