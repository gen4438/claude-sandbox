import { ComponentType, ForwardRefExoticComponent, SVGProps } from 'react'

// ページメタデータの型定義
export interface PageMetadata {
  title: string
  description: string
  icon: ForwardRefExoticComponent<SVGProps<SVGSVGElement>>
  color: string
  path: string
}

// ページコンポーネントの型定義
export interface PageModule {
  default: ComponentType
  metadata?: PageMetadata
}

// ページ情報を取得する関数
export function getPages(): PageMetadata[] {
  // pagesディレクトリ配下の全.tsxファイルを取得
  const pageModules = import.meta.glob<PageModule>('./pages/*.tsx', { eager: true })

  const pages: PageMetadata[] = []

  for (const path in pageModules) {
    const module = pageModules[path]

    // メタデータがある場合のみ追加（Landing.tsxは除外）
    if (module.metadata && !path.includes('Landing')) {
      pages.push(module.metadata)
    }
  }

  // パスでソート
  return pages.sort((a, b) => a.path.localeCompare(b.path))
}

// ルーティング用のページコンポーネントを取得
export function getPageComponents(): Record<string, ComponentType> {
  const pageModules = import.meta.glob<PageModule>('./pages/*.tsx', { eager: true })
  const components: Record<string, ComponentType> = {}

  for (const path in pageModules) {
    const module = pageModules[path]

    if (module.metadata && !path.includes('Landing')) {
      components[module.metadata.path] = module.default
    }
  }

  return components
}
