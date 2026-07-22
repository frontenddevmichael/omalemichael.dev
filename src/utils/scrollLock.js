// Module-level scroll-lock counter.
// Multiple components (CommandPalette, ProjectDetail) share this single depth
// counter so that removing the lock only happens when ALL callers are done.
let depth = 0;

export function addScrollLock() {
  if (depth === 0) document.documentElement.classList.add('no-scroll');
  depth++;
}

export function removeScrollLock() {
  depth = Math.max(0, depth - 1);
  if (depth === 0) document.documentElement.classList.remove('no-scroll');
}
