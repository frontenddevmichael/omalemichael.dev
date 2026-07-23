export function vibrate(ms = 6) {
  if ('vibrate' in navigator) {
    try { navigator.vibrate(ms); } catch (_) {}
  }
}
