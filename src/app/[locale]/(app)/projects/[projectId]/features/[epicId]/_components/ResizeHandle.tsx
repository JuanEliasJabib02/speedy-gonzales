"use client"

type ResizeHandleProps = {
  onDragStart: () => void
}

export function ResizeHandle({ onDragStart }: ResizeHandleProps) {
  return (
    <div
      onMouseDown={onDragStart}
      className="flex w-1 shrink-0 cursor-col-resize items-center justify-center border-l border-border bg-card transition-colors hover:bg-accent"
    />
  )
}
