import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import { getPageComponents } from './pageRegistry'

function App() {
  // 自動的にページコンポーネントを取得
  const pageComponents = getPageComponents()

  return (
    <Router basename="/claude-sandbox">
      <Routes>
        <Route path="/" element={<Landing />} />
        {/* 自動的に登録されたページのルーティング */}
        {Object.entries(pageComponents).map(([path, Component]) => (
          <Route key={path} path={path} element={<Component />} />
        ))}
      </Routes>
    </Router>
  )
}

export default App
