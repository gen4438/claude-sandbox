import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import { useState, useEffect } from 'react'
import { getPages } from '../pageRegistry'

function Landing() {
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

  // 自動的にページリストを取得
  const pages = getPages()

  return (
    <div className="min-h-screen bg-base-200">
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex relative">
        {/* Overlay for mobile */}
        {isMobile && sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <Sidebar isOpen={sidebarOpen} isMobile={isMobile} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 p-3 sm:p-4 md:p-6 w-full">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                ようこそ
              </h1>
              <p className="text-base sm:text-lg opacity-70">
                管理画面へようこそ。以下から必要な機能を選択してください。
              </p>
            </div>

            {pages.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-lg opacity-70">
                  ページがありません。src/pages/ にページファイルを追加してください。
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {pages.map((page, index) => {
                  const Icon = page.icon
                  return (
                    <Link
                      key={index}
                      to={page.path}
                      className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="card-body">
                        <div className={`${page.color} mb-2`}>
                          <Icon className="w-10 h-10 sm:w-12 sm:h-12" />
                        </div>
                        <h2 className="card-title text-lg sm:text-xl">{page.title}</h2>
                        <p className="text-sm sm:text-base opacity-70">{page.description}</p>
                        <div className="card-actions justify-end mt-2">
                          <span className={`text-sm font-semibold ${page.color}`}>
                            開く →
                          </span>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default Landing
