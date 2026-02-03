export function getRedirectPath(redirectTo: string): string {
  if (import.meta.env.DEV) {
    try {
      const url = new URL(redirectTo);
      return url.pathname;
    } catch {
      return redirectTo;
    }
  }
  return redirectTo;
}
