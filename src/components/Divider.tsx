export default function Divider() {
  return (
    <div className="flex items-center gap-3">
      <div className="h-px flex-1 bg-white line-shadow" />
      <span className="text-white text-xs text-shadow">◆</span>
      <div className="h-px flex-1 bg-white line-shadow" />
    </div>
  )
}