import { Link, useLocation } from 'react-router-dom';

interface Calculator {
  id: string;
  name: string;
  path: string;
}

const calculators: Calculator[] = [
  { id: 'ts-parameters', name: 'TSパラメータ計算', path: '/ts-parameters' },
  { id: 'spl', name: 'SPL計算', path: '/spl' },
  { id: 'crossover', name: 'クロスオーバーネットワーク計算', path: '/crossover' },
];

export function NavigationMenu() {
  const location = useLocation();

  return (
    <nav className="bg-white shadow-sm rounded-lg h-full" aria-label="計算機ナビゲーション">
      <div className="p-3 sm:p-4">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">計算機</h2>
        <ul className="space-y-1 sm:space-y-2" role="list">
          {calculators.map((calculator) => {
            const isActive = location.pathname === calculator.path;
            return (
              <li key={calculator.id}>
                <Link
                  to={calculator.path}
                  className={`block px-3 py-2 sm:px-4 sm:py-2 rounded-md transition-colors text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    isActive
                      ? 'bg-blue-600 text-white font-medium'
                      : 'text-gray-700 hover:bg-gray-100 active:bg-gray-200'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {calculator.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
