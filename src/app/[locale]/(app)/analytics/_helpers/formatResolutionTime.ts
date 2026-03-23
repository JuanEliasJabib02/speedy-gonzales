export function formatResolutionTime(ms: number): string {
  if (ms <= 0) return "0 sec"

  const totalSeconds = Math.round(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  if (minutes === 0) return `${seconds} sec`
  if (seconds === 0) return `${minutes} min`
  return `${minutes} min ${seconds} sec`
}
