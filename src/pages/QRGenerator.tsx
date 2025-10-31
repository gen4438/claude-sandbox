import { useState, useEffect } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import { QrCodeIcon } from '@heroicons/react/24/outline'
import { PageMetadata } from '../pageRegistry'

function QRGenerator() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [text, setText] = useState('')
  const [qrSize, setQrSize] = useState(256)

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
        {/* Overlay for mobile */}
        {isMobile && sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <Sidebar isOpen={sidebarOpen} isMobile={isMobile} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 p-3 sm:p-4 md:p-6 w-full">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6 sm:mb-8">
              <div className="flex items-center gap-3 mb-4">
                <QrCodeIcon className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                  QRコードジェネレーター
                </h1>
              </div>
              <p className="text-sm sm:text-base opacity-70">
                テキストを入力してQRコードを生成します
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Input Section */}
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title text-lg sm:text-xl mb-4">テキスト入力</h2>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">QRコードにするテキスト</span>
                    </label>
                    <textarea
                      className="textarea textarea-bordered h-32 sm:h-40 text-sm sm:text-base"
                      placeholder="URL、メッセージ、連絡先情報など、任意のテキストを入力してください..."
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                    />
                  </div>

                  <div className="form-control mt-4">
                    <label className="label">
                      <span className="label-text">QRコードサイズ: {qrSize}px</span>
                    </label>
                    <input
                      type="range"
                      min="128"
                      max="512"
                      value={qrSize}
                      className="range range-primary"
                      step="32"
                      onChange={(e) => setQrSize(Number(e.target.value))}
                    />
                    <div className="w-full flex justify-between text-xs px-2 mt-1">
                      <span>小</span>
                      <span>中</span>
                      <span>大</span>
                    </div>
                  </div>

                  <div className="alert alert-info mt-4 text-xs sm:text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-5 h-5 sm:w-6 sm:h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span>URLやテキストを入力すると、右側にQRコードが表示されます</span>
                  </div>
                </div>
              </div>

              {/* QR Code Display Section */}
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body items-center">
                  <h2 className="card-title text-lg sm:text-xl mb-4">QRコード</h2>

                  <div className="flex items-center justify-center min-h-[250px] sm:min-h-[300px] w-full">
                    {text ? (
                      <div className="bg-white p-4 rounded-lg shadow-inner">
                        <QRCodeSVG
                          value={text}
                          size={Math.min(qrSize, isMobile ? 256 : qrSize)}
                          level="H"
                          includeMargin={true}
                        />
                      </div>
                    ) : (
                      <div className="text-center opacity-50">
                        <QrCodeIcon className="w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-4" />
                        <p className="text-sm sm:text-base">テキストを入力すると<br/>QRコードが表示されます</p>
                      </div>
                    )}
                  </div>

                  {text && (
                    <button
                      className="btn btn-primary mt-4 w-full sm:w-auto"
                      onClick={() => {
                        const svg = document.querySelector('.card-body svg')
                        if (svg) {
                          const svgData = new XMLSerializer().serializeToString(svg)
                          const canvas = document.createElement('canvas')
                          const ctx = canvas.getContext('2d')
                          const img = new Image()

                          img.onload = () => {
                            canvas.width = img.width
                            canvas.height = img.height
                            ctx?.drawImage(img, 0, 0)
                            const pngFile = canvas.toDataURL('image/png')
                            const downloadLink = document.createElement('a')
                            downloadLink.download = 'qrcode.png'
                            downloadLink.href = pngFile
                            downloadLink.click()
                          }

                          img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
                        }
                      }}
                    >
                      QRコードをダウンロード
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Examples Section */}
            <div className="card bg-base-100 shadow-xl mt-4 sm:mt-6">
              <div className="card-body">
                <h2 className="card-title text-lg sm:text-xl">使用例</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mt-2">
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => setText('https://example.com')}
                  >
                    Webサイト
                  </button>
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => setText('mailto:example@email.com')}
                  >
                    メールアドレス
                  </button>
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => setText('tel:+81-90-1234-5678')}
                  >
                    電話番号
                  </button>
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => setText('こんにちは！これはテキストメッセージです。')}
                  >
                    テキスト
                  </button>
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => setText('WIFI:T:WPA;S:MyNetwork;P:MyPassword;;')}
                  >
                    WiFi接続
                  </button>
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => setText('')}
                  >
                    クリア
                  </button>
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
  title: 'QRコードジェネレーター',
  description: 'テキストからQRコードを生成',
  icon: QrCodeIcon,
  path: '/qr-generator',
  color: 'text-primary',
}

export default QRGenerator
