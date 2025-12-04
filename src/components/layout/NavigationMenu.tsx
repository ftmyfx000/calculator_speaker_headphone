import { Link, useLocation } from 'react-router-dom';

interface Calculator {
  id: string;
  name: string;
  path: string;
}

const calculators: Calculator[] = [
  { id: 'f0', name: 'F0計算', path: '/f0' },
  { id: 'air-load-mass', name: '空気負荷質量の計算', path: '/air-load-mass' },
  { id: 'input-voltage', name: '入力電圧計算', path: '/input-voltage' },
  { id: 'vas', name: 'Vas計算', path: '/vas' },
  { id: 'qes', name: 'Qes計算', path: '/qes' },
  { id: 'qms', name: 'Qms計算', path: '/qms' },
  { id: 'qts', name: 'Qts計算', path: '/qts' },
  { id: 'amplitude', name: '振幅の計算', path: '/amplitude' },
  { id: 'spl', name: '音圧の計算', path: '/spl' },
  { id: 'frequency-response', name: '低音域音圧計算', path: '/frequency-response' },
  { id: 'thin-film', name: '薄膜パターンの抵抗値計算', path: '/thin-film' },
  { id: 'xmax', name: 'ドイツのXmax計算', path: '/xmax' },
  { id: 'open-tube', name: '開管の気中共鳴周波数計算', path: '/open-tube' },
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
