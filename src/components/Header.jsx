import { Bars3Icon, BellIcon } from '@heroicons/react/24/outline'
import ThemeToggle from '../ThemeToggle'

function Header({ onMenuClick }) {
  return (
    <div className="navbar bg-base-100 shadow-lg px-2 sm:px-4 min-h-[60px]">
      <div className="flex-none">
        <button
          onClick={onMenuClick}
          className="btn btn-square btn-ghost btn-sm sm:btn-md"
          aria-label="メニューを開く"
        >
          <Bars3Icon className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>
      <div className="flex-1 px-2">
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold truncate">ダッシュボード</h1>
      </div>
      <div className="flex-none gap-1 sm:gap-2">
        <ThemeToggle />
        <button className="btn btn-ghost btn-circle btn-sm sm:btn-md" aria-label="通知">
          <div className="indicator">
            <BellIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="badge badge-xs badge-primary indicator-item"></span>
          </div>
        </button>
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="avatar placeholder">
            <div className="bg-primary text-primary-content w-8 h-8 sm:w-10 sm:h-10 rounded-full">
              <span className="text-xs sm:text-base">U</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header
