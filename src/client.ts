import React from 'react'
import { mascotDataUrl } from './mascot.generated'

interface ClientContext {
  get<T = unknown>(name: string): T | undefined
}

interface Slots {
  inject(key: string, callback: () => unknown): unknown
  register(options: Record<string, unknown>, render: () => unknown): unknown
}

export const name = 'dsh-deepwhale-minimal-theme'
export const inject = ['slots']

const STYLE_ID = 'dsh-deepwhale-minimal-theme-style'

const CSS = String.raw`
/* Deliberately small token delta: preserve the stock Harness layout and type. */
body {
  --deepwhale-accent: #4176e6;
  --deepwhale-glow: rgba(83, 145, 255, 0.13);
  --dsw-focus-ring-color: #4176e6;
}

body[data-ds-dark-theme] {
  --deepwhale-accent: #7aaaff;
  --deepwhale-glow: rgba(75, 135, 245, 0.16);
  --dsw-focus-ring-color: #7aaaff;
}

.deepwhale-theme-stage {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
  isolation: isolate;
}

.deepwhale-theme-stage::before {
  content: '';
  position: absolute;
  left: -9rem;
  bottom: -10rem;
  width: 34rem;
  height: 34rem;
  border-radius: 50%;
  background: radial-gradient(circle, var(--deepwhale-glow) 0%, transparent 68%);
}

.deepwhale-theme-mascot {
  position: absolute;
  left: clamp(2rem, 5.7vw, 6.5rem);
  bottom: clamp(4.75rem, 8vh, 6.25rem);
  width: clamp(8rem, 9vw, 10rem);
  height: auto;
  object-fit: contain;
  opacity: 0.92;
  filter: drop-shadow(0 14px 28px rgba(30, 64, 130, 0.16));
  transform-origin: bottom left;
  animation: deepwhale-arrive 520ms cubic-bezier(.2,.8,.2,1) both;
  user-select: none;
}

body[data-ds-dark-theme] .deepwhale-theme-mascot {
  opacity: 0.86;
  filter: drop-shadow(0 16px 34px rgba(3, 8, 24, 0.44));
}

@keyframes deepwhale-arrive {
  from { opacity: 0; transform: translateY(12px) scale(.98); }
}

@media (max-width: 900px), (max-height: 640px) {
  .deepwhale-theme-mascot { width: 7.5rem; opacity: 0.72; }
}

@media (max-width: 640px) {
  .deepwhale-theme-mascot { display: none; }
  .deepwhale-theme-stage::before { left: -18rem; }
}

@media (prefers-reduced-motion: reduce) {
  .deepwhale-theme-mascot { animation: none; }
}
`

function ThemeLayer(): React.ReactElement {
  React.useEffect(() => {
    let style = document.getElementById(STYLE_ID) as HTMLStyleElement | null
    if (!style) {
      style = document.createElement('style')
      style.id = STYLE_ID
      style.textContent = CSS
      document.head.appendChild(style)
    }
    return () => style?.remove()
  }, [])

  return React.createElement(
    'div',
    { className: 'deepwhale-theme-stage', 'aria-hidden': true },
    React.createElement('img', {
      className: 'deepwhale-theme-mascot',
      src: mascotDataUrl,
      alt: '',
      draggable: false,
    }),
  )
}

export function apply(ctx: ClientContext): void {
  const slots = ctx.get<Slots>('slots')
  if (!slots) return

  slots.inject('shell.overlay', () =>
    slots.register(
      { name: 'shell.overlay', id: 'deepwhale-minimal-theme', order: -850 },
      () => React.createElement(ThemeLayer),
    ),
  )
}
