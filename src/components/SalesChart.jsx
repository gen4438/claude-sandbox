function SalesChart() {
  const data = [65, 45, 75, 55, 85, 70, 90, 60, 80, 70, 95, 85]

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body p-3 sm:p-4 md:p-6">
        <h2 className="card-title text-base sm:text-lg md:text-xl">売上推移</h2>
        <div className="h-48 sm:h-56 md:h-64 flex items-end justify-between space-x-1 sm:space-x-2">
          {data.map((height, i) => (
            <div
              key={i}
              className="flex-1 bg-primary rounded-t hover:bg-primary-focus transition-colors cursor-pointer min-w-[4px] sm:min-w-[8px]"
              style={{ height: `${height}%` }}
              title={`${height}%`}
            />
          ))}
        </div>
        <div className="flex justify-between mt-2 sm:mt-3 md:mt-4 text-xs sm:text-sm opacity-60">
          <span>1月</span>
          <span>6月</span>
          <span>12月</span>
        </div>
      </div>
    </div>
  )
}

export default SalesChart
