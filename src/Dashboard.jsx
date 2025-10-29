import { useState } from 'react'
import ThemeToggle from './ThemeToggle'

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="min-h-screen bg-base-200">
      {/* Header - Using DaisyUI navbar */}
      <div className="navbar bg-base-100 shadow-lg">
        <div className="flex-none">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="btn btn-square btn-ghost"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">ダッシュボード</h1>
        </div>
        <div className="flex-none gap-2">
          <ThemeToggle />
          <button className="btn btn-ghost btn-circle">
            <div className="indicator">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="badge badge-xs badge-primary indicator-item"></span>
            </div>
          </button>
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="avatar placeholder">
              <div className="bg-primary text-primary-content w-10 rounded-full">
                <span>U</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar - Using DaisyUI menu */}
        <aside
          className={`${
            sidebarOpen ? 'w-64' : 'w-0'
          } bg-base-100 shadow-xl transition-all duration-300 overflow-hidden`}
        >
          <ul className="menu p-4 space-y-2">
            <li>
              <a className="active">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                ホーム
              </a>
            </li>
            <li>
              <a>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                分析
              </a>
            </li>
            <li>
              <a>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                ユーザー
              </a>
            </li>
            <li>
              <a>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                設定
              </a>
            </li>
          </ul>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Stats Grid - Using DaisyUI stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="stats shadow">
              <div className="stat">
                <div className="stat-figure text-primary">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div className="stat-title">総ユーザー数</div>
                <div className="stat-value text-primary">2,543</div>
                <div className="stat-desc text-success">↑ 12.5%</div>
              </div>
            </div>

            <div className="stats shadow">
              <div className="stat">
                <div className="stat-figure text-success">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="stat-title">売上</div>
                <div className="stat-value text-success">¥1.2M</div>
                <div className="stat-desc text-success">↑ 8.2%</div>
              </div>
            </div>

            <div className="stats shadow">
              <div className="stat">
                <div className="stat-figure text-secondary">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <div className="stat-title">注文数</div>
                <div className="stat-value text-secondary">145</div>
                <div className="stat-desc text-error">↓ 3.1%</div>
              </div>
            </div>

            <div className="stats shadow">
              <div className="stat">
                <div className="stat-figure text-warning">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <div className="stat-title">訪問者数</div>
                <div className="stat-value text-warning">8,429</div>
                <div className="stat-desc text-success">↑ 18.7%</div>
              </div>
            </div>
          </div>

          {/* Chart Section - Using DaisyUI cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">売上推移</h2>
                <div className="h-64 flex items-end justify-between space-x-2">
                  {[65, 45, 75, 55, 85, 70, 90, 60, 80, 70, 95, 85].map((height, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-primary rounded-t hover:bg-primary-focus transition-colors cursor-pointer"
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
                <div className="flex justify-between mt-4 text-sm opacity-60">
                  <span>1月</span>
                  <span>6月</span>
                  <span>12月</span>
                </div>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">カテゴリー別売上</h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>エレクトロニクス</span>
                      <span className="font-semibold">45%</span>
                    </div>
                    <progress className="progress progress-primary" value="45" max="100"></progress>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>ファッション</span>
                      <span className="font-semibold">30%</span>
                    </div>
                    <progress className="progress progress-success" value="30" max="100"></progress>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>ホーム&ガーデン</span>
                      <span className="font-semibold">15%</span>
                    </div>
                    <progress className="progress progress-secondary" value="15" max="100"></progress>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>その他</span>
                      <span className="font-semibold">10%</span>
                    </div>
                    <progress className="progress progress-warning" value="10" max="100"></progress>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Orders Table - Using DaisyUI table */}
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
                    <tr className="hover">
                      <td>#1001</td>
                      <td>田中 太郎</td>
                      <td>ワイヤレスヘッドフォン</td>
                      <td>¥15,800</td>
                      <td>
                        <span className="badge badge-success">配送済み</span>
                      </td>
                    </tr>
                    <tr className="hover">
                      <td>#1002</td>
                      <td>佐藤 花子</td>
                      <td>スマートウォッチ</td>
                      <td>¥32,000</td>
                      <td>
                        <span className="badge badge-info">処理中</span>
                      </td>
                    </tr>
                    <tr className="hover">
                      <td>#1003</td>
                      <td>鈴木 一郎</td>
                      <td>ノートパソコン</td>
                      <td>¥98,000</td>
                      <td>
                        <span className="badge badge-warning">保留中</span>
                      </td>
                    </tr>
                    <tr className="hover">
                      <td>#1004</td>
                      <td>高橋 美咲</td>
                      <td>キーボード</td>
                      <td>¥8,500</td>
                      <td>
                        <span className="badge badge-success">配送済み</span>
                      </td>
                    </tr>
                    <tr className="hover">
                      <td>#1005</td>
                      <td>伊藤 健太</td>
                      <td>マウス</td>
                      <td>¥3,200</td>
                      <td>
                        <span className="badge badge-info">処理中</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Dashboard
