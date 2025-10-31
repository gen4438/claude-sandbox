interface Category {
  name: string
  percentage: number
  color: string
}

function CategoryChart() {
  const categories: Category[] = [
    { name: 'エレクトロニクス', percentage: 45, color: 'progress-primary' },
    { name: 'ファッション', percentage: 30, color: 'progress-success' },
    { name: 'ホーム&ガーデン', percentage: 15, color: 'progress-secondary' },
    { name: 'その他', percentage: 10, color: 'progress-warning' },
  ]

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body p-3 sm:p-4 md:p-6">
        <h2 className="card-title text-base sm:text-lg md:text-xl">カテゴリー別売上</h2>
        <div className="space-y-3 sm:space-y-4">
          {categories.map((category, index) => (
            <div key={index}>
              <div className="flex justify-between text-xs sm:text-sm mb-1">
                <span className="truncate mr-2">{category.name}</span>
                <span className="font-semibold flex-shrink-0">{category.percentage}%</span>
              </div>
              <progress
                className={`progress ${category.color} h-2 sm:h-3`}
                value={category.percentage}
                max="100"
              ></progress>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CategoryChart
