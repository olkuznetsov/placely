// short vibration tick where supported (Android Chrome); silently a
// no-op on iOS Safari, which has no vibration API
export const buzz = (ms = 12) => {
  try { navigator.vibrate?.(ms) } catch { /* unsupported */ }
}
