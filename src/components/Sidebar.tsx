import { HomeIcon, ChartBarIcon, UsersIcon, Cog6ToothIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { ForwardRefExoticComponent, SVGProps } from 'react'

interface SidebarProps {
  isOpen: boolean
  isMobile: boolean
  onClose: () => void
}

interface MenuItem {
  icon: ForwardRefExoticComponent<SVGProps<SVGSVGElement>>
  label: string
  active: boolean
}

function Sidebar({ isOpen, isMobile, onClose }: SidebarProps) {
  const menuItems: MenuItem[] = [
    { icon: HomeIcon, label: 'ホーム', active: true },
    { icon: ChartBarIcon, label: '分析', active: false },
    { icon: UsersIcon, label: 'ユーザー', active: false },
    { icon: Cog6ToothIcon, label: '設定', active: false },
  ]

  return (
    <aside
      className={`
        ${isMobile ? 'fixed left-0 top-0 h-full z-50' : 'relative'}
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        ${isMobile ? '' : 'lg:translate-x-0'}
        w-64 bg-base-100 shadow-xl transition-transform duration-300 ease-in-out
      `}
    >
      <div className="flex items-center justify-between p-4 lg:hidden border-b border-base-300">
        <h2 className="text-lg font-bold">メニュー</h2>
        <button
          onClick={onClose}
          className="btn btn-ghost btn-sm btn-circle"
          aria-label="メニューを閉じる"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>
      <ul className="menu p-4 space-y-2">
        {menuItems.map((item, index) => {
          const Icon = item.icon
          return (
            <li key={index}>
              <a
                className={item.active ? 'active' : ''}
                onClick={isMobile ? onClose : undefined}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </a>
            </li>
          )
        })}
      </ul>
    </aside>
  )
}

export default Sidebar
