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
const POSITION_KEY = 'dsh-deepwhale-minimal-theme:mascot-position'

const CSS = String.raw`
/* Deliberately small token delta: preserve the stock Harness layout and type. */
body {
  --deepwhale-accent: #4176e6;
  --dsw-focus-ring-color: #4176e6;
}

body[data-ds-dark-theme] {
  --deepwhale-accent: #7aaaff;
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

.deepwhale-theme-mascot {
  position: absolute;
  left: clamp(2rem, 5.7vw, 6.5rem);
  bottom: clamp(4.75rem, 8vh, 6.25rem);
  width: clamp(10.5rem, 18vw, 17rem);
  height: auto;
  object-fit: contain;
  opacity: 0.92;
  transform-origin: bottom left;
  animation: deepwhale-arrive 520ms cubic-bezier(.2,.8,.2,1) both;
  pointer-events: auto;
  touch-action: none;
  cursor: grab;
  user-select: none;
}

.deepwhale-theme-mascot:active { cursor: grabbing; }

body[data-ds-dark-theme] .deepwhale-theme-mascot {
  opacity: 0.86;
}

@keyframes deepwhale-arrive {
  from { opacity: 0; transform: translateY(12px) scale(.98); }
}

@media (max-width: 900px), (max-height: 640px) {
  .deepwhale-theme-mascot { width: 9.5rem; opacity: 0.72; }
}

@media (max-width: 640px) {
  .deepwhale-theme-mascot { display: none; }
}

@media (prefers-reduced-motion: reduce) {
  .deepwhale-theme-mascot { animation: none; }
}
`

interface MascotPosition {
  left: number
  top: number
}

interface DragState extends MascotPosition {
  pointerId: number
  startX: number
  startY: number
  originLeft: number
  originTop: number
}

function readSavedPosition(): MascotPosition | null {
  try {
    const value = JSON.parse(localStorage.getItem(POSITION_KEY) ?? 'null') as Partial<MascotPosition> | null
    if (value && Number.isFinite(value.left) && Number.isFinite(value.top)) {
      return { left: value.left as number, top: value.top as number }
    }
  } catch {
    // Ignore invalid or unavailable browser storage.
  }
  return null
}

function ThemeLayer(): React.ReactElement {
  const mascotRef = React.useRef<HTMLImageElement | null>(null)
  const dragRef = React.useRef<DragState | null>(null)
  const [position, setPosition] = React.useState<MascotPosition | null>(readSavedPosition)

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

  const clampPosition = React.useCallback((left: number, top: number): MascotPosition => {
    const element = mascotRef.current
    const width = element?.offsetWidth ?? 0
    const height = element?.offsetHeight ?? 0
    return {
      left: Math.max(0, Math.min(left, window.innerWidth - width)),
      top: Math.max(0, Math.min(top, window.innerHeight - height)),
    }
  }, [])

  React.useEffect(() => {
    if (!position) return
    const keepInViewport = () => setPosition((current) =>
      current ? clampPosition(current.left, current.top) : current,
    )
    keepInViewport()
    window.addEventListener('resize', keepInViewport)
    return () => window.removeEventListener('resize', keepInViewport)
  }, [clampPosition])

  const onPointerDown = (event: React.PointerEvent<HTMLImageElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const current = { left: rect.left, top: rect.top }
    dragRef.current = {
      ...current,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originLeft: rect.left,
      originTop: rect.top,
    }
    setPosition(current)
    event.currentTarget.setPointerCapture(event.pointerId)
    event.preventDefault()
  }

  const onPointerMove = (event: React.PointerEvent<HTMLImageElement>) => {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return
    const next = clampPosition(
      drag.originLeft + event.clientX - drag.startX,
      drag.originTop + event.clientY - drag.startY,
    )
    drag.left = next.left
    drag.top = next.top
    setPosition(next)
  }

  const finishDrag = (event: React.PointerEvent<HTMLImageElement>) => {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return
    const saved = { left: drag.left, top: drag.top }
    dragRef.current = null
    try {
      localStorage.setItem(POSITION_KEY, JSON.stringify(saved))
    } catch {
      // Dragging still works when browser storage is unavailable.
    }
  }

  const resetPosition = () => {
    dragRef.current = null
    setPosition(null)
    try {
      localStorage.removeItem(POSITION_KEY)
    } catch {
      // The default position still applies without browser storage.
    }
  }

  return React.createElement(
    'div',
    { className: 'deepwhale-theme-stage', 'aria-hidden': true },
    React.createElement('img', {
      ref: mascotRef,
      className: 'deepwhale-theme-mascot',
      src: mascotDataUrl,
      alt: '',
      draggable: false,
      title: 'Drag to move · Double-click to reset',
      style: position ? { left: position.left, top: position.top, bottom: 'auto' } : undefined,
      onPointerDown,
      onPointerMove,
      onPointerUp: finishDrag,
      onPointerCancel: finishDrag,
      onDoubleClick: resetPosition,
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
