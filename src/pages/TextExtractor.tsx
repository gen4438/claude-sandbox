import { useState, useEffect, useRef } from 'react'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import { DocumentTextIcon, TrashIcon, ArrowDownTrayIcon, CameraIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { PageMetadata } from '../pageRegistry'

interface Point {
  x: number
  y: number
}

interface TextRegion {
  x: number
  y: number
  width: number
  height: number
}

function TextExtractor() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [points, setPoints] = useState<Point[]>([])
  const [extractedImage, setExtractedImage] = useState<string | null>(null)
  const [sensitivity, setSensitivity] = useState(30)
  const [isCameraMode, setIsCameraMode] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [detectedRegions, setDetectedRegions] = useState<TextRegion[]>([])
  const [isDetecting, setIsDetecting] = useState(false)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const resultCanvasRef = useRef<HTMLCanvasElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

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

    // 検出された文字領域を描画
    if (detectedRegions.length > 0) {
      ctx.strokeStyle = '#10b981'
      ctx.lineWidth = 2
      ctx.setLineDash([5, 5])

      detectedRegions.forEach(region => {
        ctx.strokeRect(region.x, region.y, region.width, region.height)
        ctx.fillStyle = 'rgba(16, 185, 129, 0.1)'
        ctx.fillRect(region.x, region.y, region.width, region.height)
      })

      ctx.setLineDash([])
    }

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
      if (points.length > 2 && detectedRegions.length === 0) {
        ctx.fillStyle = 'rgba(59, 130, 246, 0.1)'
        ctx.fill()
      }
    }
  }, [points, isDrawing, image, detectedRegions])

  // streamが変更されたらvideoに接続
  useEffect(() => {
    if (stream && videoRef.current) {
      console.log('Setting video stream...')
      videoRef.current.srcObject = stream

      // loadedmetadataイベントを待ってから再生
      videoRef.current.onloadedmetadata = () => {
        console.log('Video metadata loaded, playing...')
        videoRef.current?.play().catch(err => {
          console.error('Video play error:', err)
        })
      }
    }
  }, [stream])

  // カメラを起動
  const startCamera = async () => {
    console.log('Starting camera...')
    try {
      const constraints = {
        video: {
          facingMode: isMobile ? 'environment' : 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      }
      console.log('Camera constraints:', constraints)

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints)
      console.log('Camera stream obtained:', mediaStream.getTracks())

      setStream(mediaStream)
      setIsCameraMode(true)
    } catch (error) {
      console.error('カメラの起動に失敗しました:', error)
      alert(`カメラにアクセスできませんでした: ${error.message}\n\nブラウザの設定でカメラの使用を許可してください。`)
    }
  }

  // カメラを停止
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
    setIsCameraMode(false)
  }

  // 写真を撮影
  const capturePhoto = () => {
    const video = videoRef.current
    if (!video) {
      console.error('Video element not found')
      return
    }

    // videoの準備ができているか確認
    if (video.readyState !== video.HAVE_ENOUGH_DATA) {
      console.error('Video not ready', video.readyState)
      alert('カメラの準備ができていません。少しお待ちください。')
      return
    }

    if (video.videoWidth === 0 || video.videoHeight === 0) {
      console.error('Invalid video dimensions')
      alert('カメラの映像を取得できませんでした。')
      return
    }

    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.drawImage(video, 0, 0)

    const img = new Image()
    img.onload = () => {
      setImage(img)
      setPoints([])
      setExtractedImage(null)
      setDetectedRegions([])
      stopCamera()
    }
    img.src = canvas.toDataURL('image/png')
  }

  // クリーンアップ
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [stream])

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

  // 文字領域を自動検出
  const detectTextRegions = () => {
    if (!canvasRef.current || !image || points.length < 3) {
      console.log('Detection skipped:', { canvas: !!canvasRef.current, image: !!image, points: points.length })
      return
    }

    console.log('Starting text detection...')
    setIsDetecting(true)

    // 重い処理を非同期化
    setTimeout(() => {
      try {
        const canvas = canvasRef.current
        if (!canvas) {
          console.error('Canvas not found')
          setIsDetecting(false)
          return
        }

        const ctx = canvas.getContext('2d')
        if (!ctx) {
          console.error('Context not found')
          setIsDetecting(false)
          return
        }

        // 選択範囲のバウンディングボックスを計算
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
        points.forEach(p => {
          minX = Math.min(minX, p.x)
          minY = Math.min(minY, p.y)
          maxX = Math.max(maxX, p.x)
          maxY = Math.max(maxY, p.y)
        })

        const width = Math.floor(maxX - minX)
        const height = Math.floor(maxY - minY)

        console.log('Selection area:', { minX, minY, width, height })

        if (width <= 0 || height <= 0) {
          console.error('Invalid dimensions:', { width, height })
          alert('選択範囲が小さすぎます。もう少し大きな範囲を選択してください。')
          setIsDetecting(false)
          return
        }

        // 選択範囲の画像データを取得
        const imageData = ctx.getImageData(Math.floor(minX), Math.floor(minY), width, height)
        const data = imageData.data

        // グレースケール化とエッジ検出
        const grayData = new Uint8Array(width * height)
        const edgeData = new Uint8Array(width * height)

        // グレースケール化
        for (let i = 0; i < data.length; i += 4) {
          const idx = i / 4
          const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
          grayData[idx] = gray
        }

        console.log('Grayscale conversion complete')

        // Sobelフィルタでエッジ検出
        for (let y = 1; y < height - 1; y++) {
          for (let x = 1; x < width - 1; x++) {
            const idx = y * width + x

            // Sobelカーネル
            const gx =
              -1 * grayData[(y - 1) * width + (x - 1)] + 1 * grayData[(y - 1) * width + (x + 1)] +
              -2 * grayData[y * width + (x - 1)] + 2 * grayData[y * width + (x + 1)] +
              -1 * grayData[(y + 1) * width + (x - 1)] + 1 * grayData[(y + 1) * width + (x + 1)]

            const gy =
              -1 * grayData[(y - 1) * width + (x - 1)] - 2 * grayData[(y - 1) * width + x] - 1 * grayData[(y - 1) * width + (x + 1)] +
              1 * grayData[(y + 1) * width + (x - 1)] + 2 * grayData[(y + 1) * width + x] + 1 * grayData[(y + 1) * width + (x + 1)]

            const magnitude = Math.sqrt(gx * gx + gy * gy)
            edgeData[idx] = magnitude > 50 ? 255 : 0
          }
        }

        console.log('Edge detection complete')

        // 連結成分分析で文字領域を検出
        const visited = new Uint8Array(width * height)
        const regions: TextRegion[] = []

        const floodFill = (startX: number, startY: number): TextRegion | null => {
          const stack: Point[] = [{ x: startX, y: startY }]
          let minRX = startX, minRY = startY, maxRX = startX, maxRY = startY
          let pixelCount = 0

          while (stack.length > 0) {
            const { x, y } = stack.pop()!
            if (x < 0 || x >= width || y < 0 || y >= height) continue

            const idx = y * width + x
            if (visited[idx] || edgeData[idx] === 0) continue

            visited[idx] = 1
            pixelCount++
            minRX = Math.min(minRX, x)
            minRY = Math.min(minRY, y)
            maxRX = Math.max(maxRX, x)
            maxRY = Math.max(maxRY, y)

            stack.push({ x: x + 1, y })
            stack.push({ x: x - 1, y })
            stack.push({ x, y: y + 1 })
            stack.push({ x, y: y - 1 })
          }

          // 小さすぎる領域は無視
          if (pixelCount < 20) return null

          return {
            x: minX + minRX,
            y: minY + minRY,
            width: maxRX - minRX,
            height: maxRY - minRY
          }
        }

        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const idx = y * width + x
            if (!visited[idx] && edgeData[idx] === 255) {
              const region = floodFill(x, y)
              if (region) regions.push(region)
            }
          }
        }

        console.log('Found regions:', regions.length)

        // 近い領域を統合
        const mergedRegions: TextRegion[] = []
        const used = new Set<number>()

        regions.forEach((region, i) => {
          if (used.has(i)) return

          let merged = { ...region }
          used.add(i)

          regions.forEach((other, j) => {
            if (i === j || used.has(j)) return

            // 重なりまたは近接チェック
            const distance = Math.sqrt(
              Math.pow(merged.x + merged.width / 2 - (other.x + other.width / 2), 2) +
              Math.pow(merged.y + merged.height / 2 - (other.y + other.height / 2), 2)
            )

            if (distance < Math.max(merged.width, merged.height, other.width, other.height) * 1.5) {
              const newMinX = Math.min(merged.x, other.x)
              const newMinY = Math.min(merged.y, other.y)
              const newMaxX = Math.max(merged.x + merged.width, other.x + other.width)
              const newMaxY = Math.max(merged.y + merged.height, other.y + other.height)

              merged = {
                x: newMinX,
                y: newMinY,
                width: newMaxX - newMinX,
                height: newMaxY - newMinY
              }
              used.add(j)
            }
          })

          mergedRegions.push(merged)
        })

        console.log('Merged regions:', mergedRegions.length)

        if (mergedRegions.length === 0) {
          alert('文字領域が検出できませんでした。別の範囲を選択するか、もっとはっきりした文字が写っている場所を選択してください。')
        }

        setDetectedRegions(mergedRegions)
        setIsDetecting(false)
      } catch (error) {
        console.error('Error during text detection:', error)
        alert('文字検出中にエラーが発生しました: ' + (error as Error).message)
        setIsDetecting(false)
      }
    }, 100)
  }

  const extractText = () => {
    if (!canvasRef.current || !image) return
    if (detectedRegions.length === 0 && points.length < 3) return

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

    maskCtx.fillStyle = 'white'
    maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height)
    maskCtx.fillStyle = 'black'

    // 検出された領域がある場合はそれを使用
    if (detectedRegions.length > 0) {
      detectedRegions.forEach(region => {
        // パディングを追加
        const padding = 5
        maskCtx.fillRect(
          Math.max(0, region.x - padding),
          Math.max(0, region.y - padding),
          Math.min(canvas.width, region.width + padding * 2),
          Math.min(canvas.height, region.height + padding * 2)
        )
      })
    } else {
      // なぞった範囲を使用
      maskCtx.beginPath()
      maskCtx.moveTo(points[0].x, points[0].y)
      for (let i = 1; i < points.length; i++) {
        maskCtx.lineTo(points[i].x, points[i].y)
      }
      maskCtx.closePath()
      maskCtx.fill()
    }

    const maskData = maskCtx.getImageData(0, 0, maskCanvas.width, maskCanvas.height)

    // 文字領域内の背景色を検出
    const colorCounts = new Map<string, number>()
    for (let i = 0; i < data.length; i += 4) {
      const pixelIndex = i / 4
      const y = Math.floor(pixelIndex / canvas.width)
      const x = pixelIndex % canvas.width
      const maskIndex = (y * maskCanvas.width + x) * 4

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

      if (maskData.data[maskIndex] !== 0) {
        data[i + 3] = 0
      } else {
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

    const extractedDataUrl = resultCanvas.toDataURL('image/png')
    setExtractedImage(extractedDataUrl)
  }

  const clearSelection = () => {
    setPoints([])
    setExtractedImage(null)
    setDetectedRegions([])
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
                カメラで撮影した写真から文字領域を自動検出し、透過背景の画像として抽出します
              </p>
            </div>

            {/* Camera/Image Selection */}
            {!image && !isCameraMode && (
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body items-center text-center">
                  <CameraIcon className="w-16 h-16 sm:w-24 sm:h-24 opacity-30 mb-4" />
                  <h2 className="card-title text-lg sm:text-xl mb-2">写真を撮影または選択</h2>
                  <p className="text-sm opacity-70 mb-4">
                    看板やポスターなど、文字が写っている写真を撮影または選択してください
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
                    <button
                      className="btn btn-primary flex-1"
                      onClick={startCamera}
                    >
                      <CameraIcon className="w-5 h-5" />
                      カメラで撮影
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Camera Preview */}
            {isCameraMode && (
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="card-title text-lg sm:text-xl">カメラプレビュー</h2>
                    <button
                      className="btn btn-circle btn-ghost btn-sm"
                      onClick={stopCamera}
                    >
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex justify-center bg-base-200 rounded-lg p-4">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="max-w-full rounded"
                      style={{ maxHeight: '500px', minHeight: '200px', backgroundColor: '#000' }}
                    />
                  </div>

                  {stream && (
                    <div className="text-xs text-success mt-2 text-center">
                      ✓ カメラが起動しました
                    </div>
                  )}

                  <button
                    className="btn btn-primary btn-lg mt-4"
                    onClick={capturePhoto}
                    disabled={!stream}
                  >
                    <CameraIcon className="w-6 h-6" />
                    撮影
                  </button>
                </div>
              </div>
            )}

            {/* Main Workspace */}
            {image && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Canvas Section */}
                <div className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <h2 className="card-title text-lg sm:text-xl mb-2">1. 文字領域をなぞる</h2>
                    <p className="text-xs sm:text-sm opacity-70 mb-4">
                      文字が含まれる範囲を大まかになぞってください
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

                    {detectedRegions.length > 0 && (
                      <div className="alert alert-success text-xs sm:text-sm mt-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <span>{detectedRegions.length}個の文字領域を検出しました（緑の枠）</span>
                      </div>
                    )}

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
                      {detectedRegions.length === 0 ? (
                        <button
                          className="btn btn-secondary flex-1"
                          onClick={detectTextRegions}
                          disabled={points.length < 3 || isDetecting}
                        >
                          {isDetecting ? (
                            <>
                              <span className="loading loading-spinner loading-sm"></span>
                              検出中...
                            </>
                          ) : (
                            '文字領域を自動検出'
                          )}
                        </button>
                      ) : (
                        <button
                          className="btn btn-primary flex-1"
                          onClick={extractText}
                        >
                          文字を抽出
                        </button>
                      )}
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
                        setDetectedRegions([])
                      }}
                    >
                      別の写真を撮影
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
                    <p>カメラで看板やポスターなど、文字が写っている写真を撮影</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="badge badge-primary badge-sm mt-1">2</span>
                    <p>抽出したい文字が含まれる範囲を大まかになぞる</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="badge badge-primary badge-sm mt-1">3</span>
                    <p>「文字領域を自動検出」ボタンで文字部分を自動認識（緑の枠で表示）</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="badge badge-primary badge-sm mt-1">4</span>
                    <p>必要に応じて背景除去の感度を調整</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="badge badge-primary badge-sm mt-1">5</span>
                    <p>「文字を抽出」ボタンで背景を透過処理</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="badge badge-primary badge-sm mt-1">6</span>
                    <p>結果を確認し、ダウンロードして使用</p>
                  </div>
                </div>

                <div className="alert alert-info mt-4 text-xs sm:text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>
                    背景と文字のコントラストがはっきりしている写真ほど、文字領域の検出精度が高くなります。
                    明るい場所で撮影すると良い結果が得られます。
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
  description: 'カメラ撮影から文字を自動検出して抽出',
  icon: DocumentTextIcon,
  path: '/text-extractor',
  color: 'text-secondary',
}

export default TextExtractor
