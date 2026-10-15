export default function Loading() {
  return (
    <div className="min-h-screen bg-paper">
      <div className="h-[63px] border-b border-rule" />
      <div className="mx-auto max-w-[1320px] px-4 pb-[72px] pt-[120px] sm:px-8">
        <div className="mb-6 h-3 w-48 animate-pulse bg-rule" />
        <div className="mb-3 h-16 w-3/4 animate-pulse bg-rule" />
        <div className="mb-10 h-16 w-1/2 animate-pulse bg-rule" />
        <div className="grid grid-cols-[repeat(auto-fill,minmax(min(290px,100%),1fr))] gap-5 pt-16">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="border border-rule bg-sheet">
              <div className="h-[132px] animate-pulse border-b border-rule bg-band" />
              <div className="space-y-2 p-[18px]">
                <div className="h-5 w-2/3 animate-pulse bg-rule" />
                <div className="h-3 w-1/3 animate-pulse bg-rule" />
                <div className="h-4 w-full animate-pulse bg-rule" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
