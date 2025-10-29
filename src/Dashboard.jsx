import { useState, useEffect } from 'react'
import { UsersIcon, CurrencyDollarIcon, ShoppingBagIcon, EyeIcon } from '@heroicons/react/24/outline'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import StatCard from './components/StatCard'
import SalesChart from './components/SalesChart'
import CategoryChart from './components/CategoryChart'
import OrdersTable from './components/OrdersTable'

function Dashboard() {
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

  const stats = [
    {
      icon: UsersIcon,
      title: '総ユーザー数',
      value: '2,543',
      change: '↑ 12.5%',
      colorClass: 'text-primary',
    },
    {
      icon: CurrencyDollarIcon,
      title: '売上',
      value: '¥1.2M',
      change: '↑ 8.2%',
      colorClass: 'text-success',
    },
    {
      icon: ShoppingBagIcon,
      title: '注文数',
      value: '145',
      change: '↓ 3.1%',
      colorClass: 'text-secondary',
    },
    {
      icon: EyeIcon,
      title: '訪問者数',
      value: '8,429',
      change: '↑ 18.7%',
      colorClass: 'text-warning',
    },
  ]

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
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-3 sm:mb-4 md:mb-6">
            {stats.map((stat, index) => (
              <StatCard
                key={index}
                icon={stat.icon}
                title={stat.title}
                value={stat.value}
                change={stat.change}
                colorClass={stat.colorClass}
              />
            ))}
          </div>

          {/* Chart Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-3 sm:mb-4 md:mb-6">
            <SalesChart />
            <CategoryChart />
          </div>

          {/* Recent Orders Table */}
          <OrdersTable />
        </main>
      </div>
    </div>
  )
}

export default Dashboard
