import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import QRGenerator from './pages/QRGenerator'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/qr-generator" element={<QRGenerator />} />
        {/* Placeholder routes for other pages */}
        <Route path="/users" element={<div className="p-8 text-center text-2xl">ユーザー管理ページ（準備中）</div>} />
        <Route path="/products" element={<div className="p-8 text-center text-2xl">商品管理ページ（準備中）</div>} />
        <Route path="/inventory" element={<div className="p-8 text-center text-2xl">在庫管理ページ（準備中）</div>} />
        <Route path="/reports" element={<div className="p-8 text-center text-2xl">レポートページ（準備中）</div>} />
        <Route path="/settings" element={<div className="p-8 text-center text-2xl">設定ページ（準備中）</div>} />
      </Routes>
    </Router>
  )
}

export default App
