
/**
 * Retrieves environment variables safely
 * Only accessible on the server side
 */
export function getEnvVariable(key: string): string | undefined {
  // For Node.js environments
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key];
  }
  
  // Return undefined if not found or not in a server environment
  return undefined;
}

/**
 * Checks if code is running on the server
 */
export function isServer(): boolean {
  return typeof window === 'undefined';
}
