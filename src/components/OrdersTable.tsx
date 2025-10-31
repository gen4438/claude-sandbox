interface Order {
  id: string
  customer: string
  product: string
  amount: string
  status: string
  statusColor: string
}

function OrdersTable() {
  const orders: Order[] = [
    {
      id: '#1001',
      customer: '田中 太郎',
      product: 'ワイヤレスヘッドフォン',
      amount: '¥15,800',
      status: '配送済み',
      statusColor: 'badge-success',
    },
    {
      id: '#1002',
      customer: '佐藤 花子',
      product: 'スマートウォッチ',
      amount: '¥32,000',
      status: '処理中',
      statusColor: 'badge-info',
    },
    {
      id: '#1003',
      customer: '鈴木 一郎',
      product: 'ノートパソコン',
      amount: '¥98,000',
      status: '保留中',
      statusColor: 'badge-warning',
    },
    {
      id: '#1004',
      customer: '高橋 美咲',
      product: 'キーボード',
      amount: '¥8,500',
      status: '配送済み',
      statusColor: 'badge-success',
    },
    {
      id: '#1005',
      customer: '伊藤 健太',
      product: 'マウス',
      amount: '¥3,200',
      status: '処理中',
      statusColor: 'badge-info',
    },
  ]

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body p-3 sm:p-4 md:p-6">
        <h2 className="card-title text-base sm:text-lg md:text-xl">最近の注文</h2>
        <div className="overflow-x-auto -mx-3 sm:-mx-4 md:-mx-6 px-3 sm:px-4 md:px-6">
          <table className="table table-xs sm:table-sm md:table-md">
            <thead>
              <tr>
                <th className="text-xs sm:text-sm">注文ID</th>
                <th className="text-xs sm:text-sm">顧客名</th>
                <th className="text-xs sm:text-sm">商品</th>
                <th className="text-xs sm:text-sm">金額</th>
                <th className="text-xs sm:text-sm">ステータス</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={index} className="hover">
                  <td className="text-xs sm:text-sm font-mono">{order.id}</td>
                  <td className="text-xs sm:text-sm">{order.customer}</td>
                  <td className="text-xs sm:text-sm max-w-[120px] sm:max-w-none truncate">{order.product}</td>
                  <td className="text-xs sm:text-sm font-semibold">{order.amount}</td>
                  <td>
                    <span className={`badge badge-xs sm:badge-sm ${order.statusColor} text-xs`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default OrdersTable
