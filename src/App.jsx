import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <header className="App-header">
        <h1>Claude Sandbox</h1>
        <p>React Web アプリケーションへようこそ！</p>
      </header>
      <main className="App-main">
        <div className="card">
          <button onClick={() => setCount((count) => count + 1)}>
            カウント: {count}
          </button>
        </div>
        <div className="description">
          <p>
            このアプリは React + Vite で構築されています。
          </p>
          <p>
            <code>src/App.jsx</code> を編集して変更を確認してください。
          </p>
        </div>
      </main>
    </div>
  )
}

export default App
