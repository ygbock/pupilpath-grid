// App configuration flags
// Toggle invites feature via Vite env: VITE_ENABLE_INVITES=true|false

export const INVITES_ENABLED: boolean = String((import.meta as any).env?.VITE_ENABLE_INVITES ?? 'false')
  .toLowerCase() === 'true';
