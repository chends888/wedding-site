export default function Divider() {
  return (
    <div className="flex items-center gap-3 w-screen -ml-[calc(50vw-50%)] px-[max(1.2rem,calc((50vw-10rem)/2+1.5rem))]">
      <div className="h-px flex-1 bg-white line-shadow" />
      <span className="text-white text-xs text-shadow">◆</span>
      <div className="h-px flex-1 bg-white line-shadow" />
    </div>
  )
}