function OrdersTable() {
  const orders = [
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
      <div className="card-body">
        <h2 className="card-title">最近の注文</h2>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>注文ID</th>
                <th>顧客名</th>
                <th>商品</th>
                <th>金額</th>
                <th>ステータス</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={index} className="hover">
                  <td>{order.id}</td>
                  <td>{order.customer}</td>
                  <td>{order.product}</td>
                  <td>{order.amount}</td>
                  <td>
                    <span className={`badge ${order.statusColor}`}>{order.status}</span>
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
