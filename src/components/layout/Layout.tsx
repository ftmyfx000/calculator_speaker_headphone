import { ReactNode } from 'react';
import { NavigationMenu } from './NavigationMenu';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow sticky top-0 z-10" role="banner">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:py-6 sm:px-6 lg:px-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
            スピーカー計算WEBアプリケーション
          </h1>
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          {/* Navigation Sidebar */}
          <aside className="w-full lg:w-64 xl:w-72 flex-shrink-0" role="navigation" aria-label="サイドバーナビゲーション">
            <NavigationMenu />
          </aside>
          
          {/* Main Content Area */}
          <main id="main-content" className="flex-1 bg-white shadow rounded-lg p-4 sm:p-6 lg:p-8" role="main" aria-label="メインコンテンツ" tabIndex={-1}>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
