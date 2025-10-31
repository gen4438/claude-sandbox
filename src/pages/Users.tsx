import { useState, useEffect } from 'react'
import { UsersIcon } from '@heroicons/react/24/outline'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import { PageMetadata } from '../pageRegistry'

function Users() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
      if (!mobile && !sidebarOpen) {
        setSidebarOpen(true)
      }
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <div className="min-h-screen bg-base-200">
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex relative">
        {isMobile && sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <Sidebar isOpen={sidebarOpen} isMobile={isMobile} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 p-3 sm:p-4 md:p-6 w-full">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <UsersIcon className="w-12 h-12 text-success" />
              <div>
                <h1 className="text-3xl font-bold">ユーザー管理</h1>
                <p className="text-sm opacity-70">ユーザーアカウントの管理と設定</p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">ユーザー一覧</h2>
                <p>ここにユーザー管理機能が表示されます。</p>
                <div className="text-sm opacity-70 mt-4">
                  このページは自動的に登録されたサンプルページです。
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

// ページメタデータのエクスポート
export const metadata: PageMetadata = {
  title: 'ユーザー管理',
  description: 'ユーザーアカウントの管理と設定',
  icon: UsersIcon,
  path: '/users',
  color: 'text-success',
}

export default Users
