function CategoryChart() {
  const categories = [
    { name: 'エレクトロニクス', percentage: 45, color: 'progress-primary' },
    { name: 'ファッション', percentage: 30, color: 'progress-success' },
    { name: 'ホーム&ガーデン', percentage: 15, color: 'progress-secondary' },
    { name: 'その他', percentage: 10, color: 'progress-warning' },
  ]

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">カテゴリー別売上</h2>
        <div className="space-y-4">
          {categories.map((category, index) => (
            <div key={index}>
              <div className="flex justify-between text-sm mb-1">
                <span>{category.name}</span>
                <span className="font-semibold">{category.percentage}%</span>
              </div>
              <progress
                className={`progress ${category.color}`}
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
