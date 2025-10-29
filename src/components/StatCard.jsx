function StatCard({ icon: Icon, title, value, change, colorClass = 'text-primary' }) {
  const isPositive = change.startsWith('↑')
  const changeColorClass = isPositive ? 'text-success' : 'text-error'

  return (
    <div className="stats shadow">
      <div className="stat">
        <div className={`stat-figure ${colorClass}`}>
          <Icon className="w-8 h-8" />
        </div>
        <div className="stat-title">{title}</div>
        <div className={`stat-value ${colorClass}`}>{value}</div>
        <div className={`stat-desc ${changeColorClass}`}>{change}</div>
      </div>
    </div>
  )
}

export default StatCard
