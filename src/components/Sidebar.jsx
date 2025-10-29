import { HomeIcon, ChartBarIcon, UsersIcon, Cog6ToothIcon } from '@heroicons/react/24/outline'

function Sidebar({ isOpen }) {
  const menuItems = [
    { icon: HomeIcon, label: 'ホーム', active: true },
    { icon: ChartBarIcon, label: '分析', active: false },
    { icon: UsersIcon, label: 'ユーザー', active: false },
    { icon: Cog6ToothIcon, label: '設定', active: false },
  ]

  return (
    <aside
      className={`${
        isOpen ? 'w-64' : 'w-0'
      } bg-base-100 shadow-xl transition-all duration-300 overflow-hidden`}
    >
      <ul className="menu p-4 space-y-2">
        {menuItems.map((item, index) => {
          const Icon = item.icon
          return (
            <li key={index}>
              <a className={item.active ? 'active' : ''}>
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
