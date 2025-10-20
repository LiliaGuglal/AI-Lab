import React from 'react'

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Панель судді</h1>
          <p className="text-gray-600 mt-1">
            Аналіз поєдинків кікбоксингу в реальному часі
          </p>
        </div>
        <div className="flex space-x-3">
          <button className="btn-secondary">
            Налаштування камер
          </button>
          <button className="btn-primary">
            Новий поєдинок
          </button>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Статус системи</p>
              <p className="text-2xl font-bold text-gray-900">Активна</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 font-bold">3</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Активні камери</p>
              <p className="text-2xl font-bold text-gray-900">3 з 4</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-purple-600 font-bold">92%</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Точність ШІ</p>
              <p className="text-2xl font-bold text-gray-900">92.3%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live Match Analysis */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Поточний поєдинок
          </h2>
          <div className="space-y-4">
            <div className="bg-gray-100 rounded-lg p-4 text-center">
              <p className="text-gray-600 mb-2">Відео з камери</p>
              <div className="w-full h-48 bg-gray-300 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">Камера не підключена</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <button className="btn-primary">
                Почати аналіз
              </button>
              <div className="text-sm text-gray-600">
                Раунд: 1 з 3 | Час: 00:00
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Panel */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Статистика раунду
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">Боєць А</p>
                <p className="text-2xl font-bold text-blue-600">12</p>
                <p className="text-xs text-gray-500">Чисті удари</p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <p className="text-sm text-gray-600">Боєць Б</p>
                <p className="text-2xl font-bold text-red-600">8</p>
                <p className="text-xs text-gray-500">Чисті удари</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Активність А:</span>
                <span className="font-medium">65%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{width: '65%'}}></div>
              </div>
              
              <div className="flex justify-between text-sm">
                <span>Активність Б:</span>
                <span className="font-medium">45%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-red-600 h-2 rounded-full" style={{width: '45%'}}></div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm font-medium text-gray-900">Рекомендація ШІ:</p>
              <p className="text-blue-600 font-semibold">Перемога Бійця А за балами</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Events */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Останні події
        </h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium">Чистий хай-кік - Боєць А</span>
            </div>
            <span className="text-xs text-gray-500">2:15</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-sm font-medium">Спірний момент - потребує перевірки</span>
            </div>
            <span className="text-xs text-gray-500">1:45</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-medium">Серія ударів - Боєць Б</span>
            </div>
            <span className="text-xs text-gray-500">1:20</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard