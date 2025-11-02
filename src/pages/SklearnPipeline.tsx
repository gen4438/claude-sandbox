import { useState, useEffect } from 'react'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import { BeakerIcon, PlusIcon, TrashIcon, ChevronUpIcon, ChevronDownIcon, Cog6ToothIcon } from '@heroicons/react/24/outline'
import { PageMetadata } from '../pageRegistry'

// コンポーネントのタイプ定義
type ComponentCategory = 'preprocessing' | 'feature_selection' | 'model'

interface ComponentOption {
  name: string
  type: 'number' | 'select' | 'boolean'
  value: number | string | boolean
  options?: string[]
  min?: number
  max?: number
}

interface ComponentTemplate {
  id: string
  name: string
  category: ComponentCategory
  description: string
  options: ComponentOption[]
}

interface PipelineComponent {
  id: string
  templateId: string
  name: string
  category: ComponentCategory
  options: ComponentOption[]
  expanded: boolean
}

// 利用可能なコンポーネントのカタログ
const COMPONENT_CATALOG: ComponentTemplate[] = [
  // 前処理
  {
    id: 'standard_scaler',
    name: 'StandardScaler',
    category: 'preprocessing',
    description: '平均0、分散1に標準化',
    options: [
      { name: 'with_mean', type: 'boolean', value: true },
      { name: 'with_std', type: 'boolean', value: true },
    ],
  },
  {
    id: 'minmax_scaler',
    name: 'MinMaxScaler',
    category: 'preprocessing',
    description: '指定範囲にスケーリング',
    options: [
      { name: 'feature_range_min', type: 'number', value: 0, min: -10, max: 10 },
      { name: 'feature_range_max', type: 'number', value: 1, min: -10, max: 10 },
    ],
  },
  {
    id: 'robust_scaler',
    name: 'RobustScaler',
    category: 'preprocessing',
    description: '外れ値に頑健なスケーリング',
    options: [
      { name: 'with_centering', type: 'boolean', value: true },
      { name: 'with_scaling', type: 'boolean', value: true },
    ],
  },
  // 特徴量選択
  {
    id: 'select_k_best',
    name: 'SelectKBest',
    category: 'feature_selection',
    description: '上位K個の特徴量を選択',
    options: [
      { name: 'k', type: 'number', value: 10, min: 1, max: 100 },
    ],
  },
  {
    id: 'pca',
    name: 'PCA',
    category: 'feature_selection',
    description: '主成分分析による次元削減',
    options: [
      { name: 'n_components', type: 'number', value: 2, min: 1, max: 50 },
    ],
  },
  // モデル
  {
    id: 'logistic_regression',
    name: 'LogisticRegression',
    category: 'model',
    description: 'ロジスティック回帰',
    options: [
      { name: 'C', type: 'number', value: 1.0, min: 0.01, max: 10 },
      { name: 'max_iter', type: 'number', value: 100, min: 10, max: 1000 },
      { name: 'solver', type: 'select', value: 'lbfgs', options: ['lbfgs', 'liblinear', 'newton-cg', 'sag'] },
    ],
  },
  {
    id: 'random_forest',
    name: 'RandomForestClassifier',
    category: 'model',
    description: 'ランダムフォレスト',
    options: [
      { name: 'n_estimators', type: 'number', value: 100, min: 10, max: 500 },
      { name: 'max_depth', type: 'number', value: 10, min: 1, max: 50 },
      { name: 'criterion', type: 'select', value: 'gini', options: ['gini', 'entropy'] },
    ],
  },
  {
    id: 'svc',
    name: 'SVC',
    category: 'model',
    description: 'サポートベクターマシン',
    options: [
      { name: 'C', type: 'number', value: 1.0, min: 0.01, max: 10 },
      { name: 'kernel', type: 'select', value: 'rbf', options: ['rbf', 'linear', 'poly', 'sigmoid'] },
      { name: 'gamma', type: 'select', value: 'scale', options: ['scale', 'auto'] },
    ],
  },
]

// モックデータ生成
const generateMockData = (rows: number, cols: number): number[][] => {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => Math.random() * 100)
  )
}

function SklearnPipeline() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [pipeline, setPipeline] = useState<PipelineComponent[]>([])
  const [selectedCategory, setSelectedCategory] = useState<ComponentCategory | 'all'>('all')
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [showCatalog, setShowCatalog] = useState(false)
  const [selectedComponentIndex, setSelectedComponentIndex] = useState<number | null>(null)

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

  // コンポーネントをパイプラインに追加
  const addComponent = (template: ComponentTemplate) => {
    const newComponent: PipelineComponent = {
      id: `${template.id}_${Date.now()}`,
      templateId: template.id,
      name: template.name,
      category: template.category,
      options: JSON.parse(JSON.stringify(template.options)), // Deep copy
      expanded: false,
    }
    setPipeline([...pipeline, newComponent])
    setShowCatalog(false)
  }

  // コンポーネントを削除
  const removeComponent = (index: number) => {
    setPipeline(pipeline.filter((_, i) => i !== index))
    if (selectedComponentIndex === index) {
      setSelectedComponentIndex(null)
    }
  }

  // コンポーネントを移動
  const moveComponent = (fromIndex: number, toIndex: number) => {
    const newPipeline = [...pipeline]
    const [moved] = newPipeline.splice(fromIndex, 1)
    newPipeline.splice(toIndex, 0, moved)
    setPipeline(newPipeline)
  }

  // オプション値を更新
  const updateOption = (componentIndex: number, optionName: string, value: any) => {
    const newPipeline = [...pipeline]
    const option = newPipeline[componentIndex].options.find(opt => opt.name === optionName)
    if (option) {
      option.value = value
      setPipeline(newPipeline)
    }
  }

  // ドラッグ&ドロップ処理
  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex !== null && draggedIndex !== index) {
      moveComponent(draggedIndex, index)
      setDraggedIndex(index)
    }
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  // カテゴリーでフィルタリング
  const filteredCatalog = COMPONENT_CATALOG.filter(
    comp => selectedCategory === 'all' || comp.category === selectedCategory
  )

  // カテゴリー表示名
  const getCategoryLabel = (category: ComponentCategory) => {
    const labels = {
      preprocessing: '前処理',
      feature_selection: '特徴量選択',
      model: 'モデル',
    }
    return labels[category]
  }

  // カテゴリー色
  const getCategoryColor = (category: ComponentCategory) => {
    const colors = {
      preprocessing: 'badge-info',
      feature_selection: 'badge-warning',
      model: 'badge-success',
    }
    return colors[category]
  }

  // モックデータ生成（選択されたコンポーネントの出力）
  const getComponentOutput = (componentIndex: number) => {
    const component = pipeline[componentIndex]
    let cols = 4

    if (component.category === 'feature_selection') {
      if (component.templateId === 'pca') {
        const nComponents = component.options.find(opt => opt.name === 'n_components')?.value as number
        cols = nComponents
      } else if (component.templateId === 'select_k_best') {
        const k = component.options.find(opt => opt.name === 'k')?.value as number
        cols = k
      }
    }

    return generateMockData(5, cols)
  }

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
          <div className="max-w-6xl mx-auto">
            {/* ヘッダー */}
            <div className="mb-6 sm:mb-8">
              <div className="flex items-center gap-3 mb-4">
                <BeakerIcon className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                  Scikit-learn パイプライン
                </h1>
              </div>
              <p className="text-sm sm:text-base opacity-70">
                機械学習パイプラインを視覚的に構築・管理
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* パイプライン構築エリア */}
              <div className="lg:col-span-2 space-y-4">
                {/* コントロールバー */}
                <div className="card bg-base-100 shadow-xl">
                  <div className="card-body p-4">
                    <div className="flex flex-wrap gap-2 items-center justify-between">
                      <h2 className="card-title text-lg">パイプライン</h2>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => setShowCatalog(!showCatalog)}
                      >
                        <PlusIcon className="w-4 h-4" />
                        コンポーネント追加
                      </button>
                    </div>

                    {pipeline.length === 0 && (
                      <div className="text-center py-8 opacity-50">
                        <BeakerIcon className="w-16 h-16 mx-auto mb-4" />
                        <p className="text-sm">コンポーネントを追加してパイプラインを構築</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* パイプラインコンポーネント */}
                <div className="space-y-3">
                  {pipeline.map((component, index) => (
                    <div
                      key={component.id}
                      draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragEnd={handleDragEnd}
                      className={`card bg-base-100 shadow-xl cursor-move transition-all ${
                        draggedIndex === index ? 'opacity-50' : ''
                      } ${selectedComponentIndex === index ? 'ring-2 ring-primary' : ''}`}
                    >
                      <div className="card-body p-4">
                        <div className="flex items-start gap-3">
                          {/* ドラッグハンドル */}
                          <div className="flex flex-col gap-1 mt-1">
                            <div className="w-6 h-1 bg-base-300 rounded"></div>
                            <div className="w-6 h-1 bg-base-300 rounded"></div>
                            <div className="w-6 h-1 bg-base-300 rounded"></div>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-bold text-sm sm:text-base">{index + 1}. {component.name}</span>
                                  <span className={`badge badge-sm ${getCategoryColor(component.category)}`}>
                                    {getCategoryLabel(component.category)}
                                  </span>
                                </div>
                              </div>

                              <div className="flex gap-1">
                                <button
                                  className="btn btn-ghost btn-xs"
                                  onClick={() => setSelectedComponentIndex(
                                    selectedComponentIndex === index ? null : index
                                  )}
                                >
                                  <Cog6ToothIcon className="w-4 h-4" />
                                </button>
                                <button
                                  className="btn btn-ghost btn-xs text-error"
                                  onClick={() => removeComponent(index)}
                                >
                                  <TrashIcon className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                            {/* オプション表示 */}
                            {selectedComponentIndex === index && (
                              <div className="mt-3 pt-3 border-t border-base-300 space-y-3">
                                <h3 className="text-sm font-semibold">パラメータ設定</h3>
                                {component.options.map((option) => (
                                  <div key={option.name} className="form-control">
                                    <label className="label py-1">
                                      <span className="label-text text-xs">{option.name}</span>
                                    </label>
                                    {option.type === 'number' && (
                                      <div>
                                        <input
                                          type="range"
                                          min={option.min}
                                          max={option.max}
                                          step={(option.max! - option.min!) / 100}
                                          value={option.value as number}
                                          className="range range-xs range-primary"
                                          onChange={(e) =>
                                            updateOption(index, option.name, parseFloat(e.target.value))
                                          }
                                        />
                                        <div className="text-xs text-center mt-1">{option.value}</div>
                                      </div>
                                    )}
                                    {option.type === 'select' && (
                                      <select
                                        className="select select-bordered select-xs"
                                        value={option.value as string}
                                        onChange={(e) => updateOption(index, option.name, e.target.value)}
                                      >
                                        {option.options?.map((opt) => (
                                          <option key={opt} value={opt}>
                                            {opt}
                                          </option>
                                        ))}
                                      </select>
                                    )}
                                    {option.type === 'boolean' && (
                                      <input
                                        type="checkbox"
                                        className="toggle toggle-primary toggle-sm"
                                        checked={option.value as boolean}
                                        onChange={(e) => updateOption(index, option.name, e.target.checked)}
                                      />
                                    )}
                                  </div>
                                ))}

                                {/* モックデータ表示 */}
                                <div className="mt-4">
                                  <h3 className="text-sm font-semibold mb-2">出力データ（サンプル）</h3>
                                  <div className="overflow-x-auto">
                                    <table className="table table-xs">
                                      <thead>
                                        <tr>
                                          {getComponentOutput(index)[0].map((_, colIndex) => (
                                            <th key={colIndex}>特徴{colIndex + 1}</th>
                                          ))}
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {getComponentOutput(index).map((row, rowIndex) => (
                                          <tr key={rowIndex}>
                                            {row.map((value, colIndex) => (
                                              <td key={colIndex}>{value.toFixed(2)}</td>
                                            ))}
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* コンポーネントカタログ */}
              <div className="lg:col-span-1">
                <div className={`card bg-base-100 shadow-xl sticky top-4 ${!showCatalog && isMobile ? 'hidden' : ''}`}>
                  <div className="card-body p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="card-title text-lg">コンポーネント</h2>
                      {isMobile && (
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => setShowCatalog(false)}
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    {/* カテゴリーフィルター */}
                    <div className="tabs tabs-boxed mb-4">
                      <a
                        className={`tab tab-xs ${selectedCategory === 'all' ? 'tab-active' : ''}`}
                        onClick={() => setSelectedCategory('all')}
                      >
                        すべて
                      </a>
                      <a
                        className={`tab tab-xs ${selectedCategory === 'preprocessing' ? 'tab-active' : ''}`}
                        onClick={() => setSelectedCategory('preprocessing')}
                      >
                        前処理
                      </a>
                      <a
                        className={`tab tab-xs ${selectedCategory === 'feature_selection' ? 'tab-active' : ''}`}
                        onClick={() => setSelectedCategory('feature_selection')}
                      >
                        特徴量
                      </a>
                      <a
                        className={`tab tab-xs ${selectedCategory === 'model' ? 'tab-active' : ''}`}
                        onClick={() => setSelectedCategory('model')}
                      >
                        モデル
                      </a>
                    </div>

                    {/* コンポーネントリスト */}
                    <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                      {filteredCatalog.map((template) => (
                        <div
                          key={template.id}
                          className="card bg-base-200 hover:bg-base-300 cursor-pointer transition-colors"
                          onClick={() => addComponent(template)}
                        >
                          <div className="card-body p-3">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-sm truncate">{template.name}</h3>
                                <p className="text-xs opacity-70 mt-1">{template.description}</p>
                              </div>
                              <PlusIcon className="w-5 h-5 flex-shrink-0 text-primary" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
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
  title: 'Scikit-learn パイプライン',
  description: '機械学習パイプラインの視覚的な構築',
  icon: BeakerIcon,
  path: '/sklearn-pipeline',
  color: 'text-primary',
}

export default SklearnPipeline
