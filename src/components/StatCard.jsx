function StatCard({ icon: Icon, title, value, change, colorClass = 'text-primary' }) {
  const isPositive = change.startsWith('↑')
  const changeColorClass = isPositive ? 'text-success' : 'text-error'

  return (
    <div className="stats shadow">
      <div className="stat p-3 sm:p-4">
        <div className={`stat-figure ${colorClass}`}>
          <Icon className="w-6 h-6 sm:w-8 sm:h-8" />
        </div>
        <div className="stat-title text-xs sm:text-sm">{title}</div>
        <div className={`stat-value text-xl sm:text-2xl md:text-3xl ${colorClass}`}>{value}</div>
        <div className={`stat-desc text-xs ${changeColorClass}`}>{change}</div>
      </div>
    </div>
  )
}

export default StatCard
