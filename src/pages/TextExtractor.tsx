import { useState, useEffect, useRef } from 'react'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import { DocumentTextIcon, TrashIcon, ArrowDownTrayIcon, PhotoIcon } from '@heroicons/react/24/outline'
import { PageMetadata } from '../pageRegistry'

interface Point {
  x: number
  y: number
}

function TextExtractor() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [points, setPoints] = useState<Point[]>([])
  const [extractedImage, setExtractedImage] = useState<string | null>(null)
  const [sensitivity, setSensitivity] = useState(30)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const resultCanvasRef = useRef<HTMLCanvasElement>(null)

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

  useEffect(() => {
    if (image && canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      // Canvasサイズを画像に合わせる
      const maxWidth = isMobile ? 350 : 600
      const scale = Math.min(maxWidth / image.width, maxWidth / image.height, 1)
      canvas.width = image.width * scale
      canvas.height = image.height * scale

      ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
    }
  }, [image, isMobile])

  useEffect(() => {
    if (!canvasRef.current || !image) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // 画像を再描画
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height)

    // 選択パスを描画
    if (points.length > 0) {
      ctx.strokeStyle = '#3b82f6'
      ctx.lineWidth = 3
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      ctx.beginPath()
      ctx.moveTo(points[0].x, points[0].y)

      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y)
      }

      if (!isDrawing && points.length > 2) {
        ctx.closePath()
      }

      ctx.stroke()

      // 選択領域を半透明で表示
      if (points.length > 2) {
        ctx.fillStyle = 'rgba(59, 130, 246, 0.1)'
        ctx.fill()
      }
    }
  }, [points, isDrawing, image])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new Image()
      img.onload = () => {
        setImage(img)
        setPoints([])
        setExtractedImage(null)
      }
      img.src = event.target?.result as string
    }
    reader.readAsDataURL(file)
  }

  const getCanvasPoint = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()

    let clientX: number, clientY: number
    if ('touches' in e) {
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    } else {
      clientX = e.clientX
      clientY = e.clientY
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    }
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    const point = getCanvasPoint(e)
    setIsDrawing(true)
    setPoints([point])
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    if (!isDrawing) return

    const point = getCanvasPoint(e)
    setPoints(prev => [...prev, point])
  }

  const handleMouseUp = () => {
    setIsDrawing(false)
  }

  const extractText = () => {
    if (!canvasRef.current || !image || points.length < 3) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // 画像データを取得
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data

    // マスクを作成
    const maskCanvas = document.createElement('canvas')
    maskCanvas.width = canvas.width
    maskCanvas.height = canvas.height
    const maskCtx = maskCanvas.getContext('2d')
    if (!maskCtx) return

    // 選択領域のパスを作成
    maskCtx.fillStyle = 'white'
    maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height)
    maskCtx.fillStyle = 'black'
    maskCtx.beginPath()
    maskCtx.moveTo(points[0].x, points[0].y)
    for (let i = 1; i < points.length; i++) {
      maskCtx.lineTo(points[i].x, points[i].y)
    }
    maskCtx.closePath()
    maskCtx.fill()

    const maskData = maskCtx.getImageData(0, 0, maskCanvas.width, maskCanvas.height)

    // 選択領域内の背景色を検出（最も多い色を背景色とする）
    const colorCounts = new Map<string, number>()
    for (let i = 0; i < data.length; i += 4) {
      const pixelIndex = i / 4
      const y = Math.floor(pixelIndex / canvas.width)
      const x = pixelIndex % canvas.width
      const maskIndex = (y * maskCanvas.width + x) * 4

      // 選択領域内のピクセルのみカウント
      if (maskData.data[maskIndex] === 0) {
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]
        const colorKey = `${r},${g},${b}`
        colorCounts.set(colorKey, (colorCounts.get(colorKey) || 0) + 1)
      }
    }

    // 最頻出色を背景色とする
    let bgColor = { r: 255, g: 255, b: 255 }
    let maxCount = 0
    colorCounts.forEach((count, colorKey) => {
      if (count > maxCount) {
        maxCount = count
        const [r, g, b] = colorKey.split(',').map(Number)
        bgColor = { r, g, b }
      }
    })

    // 背景を透過
    for (let i = 0; i < data.length; i += 4) {
      const pixelIndex = i / 4
      const y = Math.floor(pixelIndex / canvas.width)
      const x = pixelIndex % canvas.width
      const maskIndex = (y * maskCanvas.width + x) * 4

      // 選択領域外は完全に透明
      if (maskData.data[maskIndex] !== 0) {
        data[i + 3] = 0
      } else {
        // 選択領域内で背景色に近い色を透明化
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]

        const distance = Math.sqrt(
          Math.pow(r - bgColor.r, 2) +
          Math.pow(g - bgColor.g, 2) +
          Math.pow(b - bgColor.b, 2)
        )

        if (distance < sensitivity) {
          data[i + 3] = 0
        }
      }
    }

    // 結果をキャンバスに描画
    const resultCanvas = resultCanvasRef.current
    if (!resultCanvas) return

    resultCanvas.width = canvas.width
    resultCanvas.height = canvas.height
    const resultCtx = resultCanvas.getContext('2d')
    if (!resultCtx) return

    resultCtx.putImageData(imageData, 0, 0)

    // 画像データをBase64に変換
    const extractedDataUrl = resultCanvas.toDataURL('image/png')
    setExtractedImage(extractedDataUrl)
  }

  const clearSelection = () => {
    setPoints([])
    setExtractedImage(null)
  }

  const downloadImage = () => {
    if (!extractedImage) return

    const link = document.createElement('a')
    link.download = 'extracted-text.png'
    link.href = extractedImage
    link.click()
  }

  return (
    <div className="min-h-screen bg-base-200">
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex relative">
        {isMobile && sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <Sidebar isOpen={sidebarOpen} isMobile={isMobile} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 p-3 sm:p-4 md:p-6 w-full">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6 sm:mb-8">
              <div className="flex items-center gap-3 mb-4">
                <DocumentTextIcon className="w-8 h-8 sm:w-10 sm:h-10 text-secondary" />
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                  写真から文字抽出
                </h1>
              </div>
              <p className="text-sm sm:text-base opacity-70">
                写真の文字部分をなぞって選択し、透過背景の画像として抽出します
              </p>
            </div>

            {/* Image Upload */}
            {!image && (
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body items-center text-center">
                  <PhotoIcon className="w-16 h-16 sm:w-24 sm:h-24 opacity-30 mb-4" />
                  <h2 className="card-title text-lg sm:text-xl mb-2">写真をアップロード</h2>
                  <p className="text-sm opacity-70 mb-4">
                    看板やポスターなど、文字が写っている写真を選択してください
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="file-input file-input-bordered file-input-primary w-full max-w-xs"
                  />
                </div>
              </div>
            )}

            {/* Main Workspace */}
            {image && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Canvas Section */}
                <div className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <h2 className="card-title text-lg sm:text-xl mb-2">1. 文字をなぞって選択</h2>
                    <p className="text-xs sm:text-sm opacity-70 mb-4">
                      抽出したい文字の周りを粗めになぞってください
                    </p>

                    <div className="flex justify-center bg-base-200 rounded-lg p-4">
                      <canvas
                        ref={canvasRef}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        onTouchStart={handleMouseDown}
                        onTouchMove={handleMouseMove}
                        onTouchEnd={handleMouseUp}
                        className="cursor-crosshair border-2 border-base-300 rounded max-w-full"
                        style={{ touchAction: 'none' }}
                      />
                    </div>

                    <div className="form-control mt-4">
                      <label className="label">
                        <span className="label-text">背景除去の感度: {sensitivity}</span>
                        <span className="label-text-alt text-xs opacity-70">
                          {sensitivity < 20 ? '低' : sensitivity < 40 ? '中' : '高'}
                        </span>
                      </label>
                      <input
                        type="range"
                        min="10"
                        max="60"
                        value={sensitivity}
                        className="range range-secondary range-xs"
                        step="5"
                        onChange={(e) => setSensitivity(Number(e.target.value))}
                      />
                      <div className="text-xs opacity-60 mt-1">
                        感度が高いほど多くの背景が除去されます
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <button
                        className="btn btn-primary flex-1"
                        onClick={extractText}
                        disabled={points.length < 3}
                      >
                        文字を抽出
                      </button>
                      <button
                        className="btn btn-outline btn-error"
                        onClick={clearSelection}
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>

                    <button
                      className="btn btn-ghost btn-sm mt-2"
                      onClick={() => {
                        setImage(null)
                        setPoints([])
                        setExtractedImage(null)
                      }}
                    >
                      別の画像を選択
                    </button>
                  </div>
                </div>

                {/* Result Section */}
                <div className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <h2 className="card-title text-lg sm:text-xl mb-2">2. 抽出結果</h2>
                    <p className="text-xs sm:text-sm opacity-70 mb-4">
                      背景が透過された文字画像
                    </p>

                    <div className="flex justify-center bg-base-200 rounded-lg p-4 min-h-[300px] items-center">
                      {extractedImage ? (
                        <div className="relative">
                          <div className="absolute inset-0 bg-[linear-gradient(45deg,#ccc_25%,transparent_25%,transparent_75%,#ccc_75%,#ccc),linear-gradient(45deg,#ccc_25%,transparent_25%,transparent_75%,#ccc_75%,#ccc)] bg-[length:20px_20px] bg-[position:0_0,10px_10px] rounded" />
                          <img
                            src={extractedImage}
                            alt="Extracted text"
                            className="relative max-w-full rounded"
                          />
                        </div>
                      ) : (
                        <div className="text-center opacity-50">
                          <DocumentTextIcon className="w-16 h-16 mx-auto mb-2" />
                          <p className="text-sm">文字を選択して<br/>抽出してください</p>
                        </div>
                      )}
                    </div>

                    {extractedImage && (
                      <button
                        className="btn btn-success mt-4"
                        onClick={downloadImage}
                      >
                        <ArrowDownTrayIcon className="w-5 h-5" />
                        画像をダウンロード
                      </button>
                    )}

                    <canvas ref={resultCanvasRef} className="hidden" />
                  </div>
                </div>
              </div>
            )}

            {/* Instructions */}
            <div className="card bg-base-100 shadow-xl mt-4 sm:mt-6">
              <div className="card-body">
                <h2 className="card-title text-lg sm:text-xl">使い方</h2>
                <div className="space-y-2 text-sm sm:text-base">
                  <div className="flex gap-3">
                    <span className="badge badge-primary badge-sm mt-1">1</span>
                    <p>看板やポスターなど、文字が写っている写真をアップロード</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="badge badge-primary badge-sm mt-1">2</span>
                    <p>抽出したい文字の周りをマウスやタッチでなぞって選択</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="badge badge-primary badge-sm mt-1">3</span>
                    <p>背景除去の感度を調整（文字と背景のコントラストに応じて）</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="badge badge-primary badge-sm mt-1">4</span>
                    <p>「文字を抽出」ボタンをクリックして背景を透過</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="badge badge-primary badge-sm mt-1">5</span>
                    <p>結果を確認し、ダウンロードして使用</p>
                  </div>
                </div>

                <div className="alert alert-info mt-4 text-xs sm:text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>
                    背景と文字のコントラストがはっきりしている写真ほど、きれいに抽出できます。
                    感度を調整して最適な結果を得てください。
                  </span>
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
  title: '写真から文字抽出',
  description: '写真の文字を選択して透過画像として抽出',
  icon: DocumentTextIcon,
  path: '/text-extractor',
  color: 'text-secondary',
}

export default TextExtractor
