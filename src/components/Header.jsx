import { Bars3Icon, BellIcon } from '@heroicons/react/24/outline'
import ThemeToggle from '../ThemeToggle'

function Header({ onMenuClick }) {
  return (
    <div className="navbar bg-base-100 shadow-lg">
      <div className="flex-none">
        <button
          onClick={onMenuClick}
          className="btn btn-square btn-ghost"
          aria-label="メニューを開く"
        >
          <Bars3Icon className="w-6 h-6" />
        </button>
      </div>
      <div className="flex-1">
        <h1 className="text-2xl font-bold">ダッシュボード</h1>
      </div>
      <div className="flex-none gap-2">
        <ThemeToggle />
        <button className="btn btn-ghost btn-circle" aria-label="通知">
          <div className="indicator">
            <BellIcon className="w-6 h-6" />
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
  )
}

export default Header
