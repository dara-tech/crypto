import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, Bar, BarChart } from 'recharts';
import { RefreshCw, ZoomIn, ZoomOut, TrendingUp, TrendingDown, Activity, DollarSign, Calendar, BarChart3, Maximize2, Minimize2 } from 'lucide-react';

// Mock data generator for demonstration
const generateMockData = (coinId, days) => {
  const now = Date.now();
  const interval = days === '1' ? 3600000 : days === '7' ? 3600000 * 4 : 86400000;
  const dataPoints = days === '1' ? 24 : days === '7' ? 42 : parseInt(days) || 30;
  
  const basePrice = {
    'bitcoin': 45000,
    'ethereum': 3000,
    'binancecoin': 300,
    'solana': 100,
    'cardano': 0.5,
    'ripple': 0.6,
    'polkadot': 7,
    'dogecoin': 0.08
  }[coinId] || 1000;

  const prices = [];
  const volumes = [];
  let currentPrice = basePrice;
  
  for (let i = 0; i < dataPoints; i++) {
    const volatility = 0.02 + Math.random() * 0.03;
    const change = (Math.random() - 0.5) * volatility;
    currentPrice = Math.max(currentPrice * (1 + change), basePrice * 0.5);
    
    const timestamp = now - (dataPoints - i - 1) * interval;
    prices.push([timestamp, currentPrice]);
    volumes.push([timestamp, Math.random() * 1000000000]);
  }
  
  return { prices, total_volumes: volumes };
};

const POPULAR_COINS = [
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', color: '#F7931A', logo: '₿' },
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', color: '#627EEA', logo: 'Ξ' },
  { id: 'binancecoin', name: 'Binance Coin', symbol: 'BNB', color: '#F3BA2F', logo: 'B' },
  { id: 'solana', name: 'Solana', symbol: 'SOL', color: '#9945FF', logo: '◎' },
  { id: 'cardano', name: 'Cardano', symbol: 'ADA', color: '#0033AD', logo: '₳' },
  { id: 'ripple', name: 'XRP', symbol: 'XRP', color: '#23292F', logo: '✕' },
  { id: 'polkadot', name: 'Polkadot', symbol: 'DOT', color: '#E6007A', logo: '●' },
  { id: 'dogecoin', name: 'Dogecoin', symbol: 'DOGE', color: '#C2A633', logo: 'Ð' }
];

const TIME_RANGES = [
  { value: '1', label: '24H', description: 'Last 24 hours' },
  { value: '7', label: '7D', description: 'Last 7 days' },
  { value: '30', label: '30D', description: 'Last 30 days' },
  { value: '90', label: '90D', description: 'Last 90 days' },
  { value: '365', label: '1Y', description: 'Last year' },
  { value: 'max', label: 'ALL', description: 'All time' }
];

const CHART_TYPES = [
  { value: 'line', label: 'Line', icon: Activity },
  { value: 'area', label: 'Area', icon: BarChart3 },
  { value: 'candle', label: 'Volume', icon: Maximize2 }
];

const StatCard = ({ icon: Icon, label, value, change, isPositive }) => (
  <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center space-x-2">
        <div className="p-2 rounded-lg bg-blue-50">
          <Icon className="w-4 h-4 text-blue-600" />
        </div>
        <span className="text-sm font-medium text-gray-600">{label}</span>
      </div>
      {change && (
        <div className={`flex items-center space-x-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          <span className="text-xs font-semibold">{Math.abs(change).toFixed(2)}%</span>
        </div>
      )}
    </div>
    <p className="text-lg font-bold text-gray-900">{value}</p>
  </div>
);

const CustomTooltip = ({ active, payload, label, chartType }) => {
  if (!active || !payload || !payload.length) return null;
  
  const data = payload[0].payload;
  const date = new Date(label);
  
  return (
    <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-200 backdrop-blur-sm">
      <p className="text-sm text-gray-600 mb-2">
        {date.toLocaleDateString('en-US', { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}
      </p>
      <div className="space-y-1">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm font-medium text-gray-700">{entry.name}</span>
            </div>
            <span className="text-sm font-bold text-gray-900">
              {entry.name.toLowerCase().includes('volume') 
                ? `$${(entry.value / 1000000).toFixed(2)}M`
                : `$${parseFloat(entry.value).toLocaleString()}`
              }
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const AdvancedTradingChart = () => {
  const [selectedCoin, setSelectedCoin] = useState('bitcoin');
  const [timeRange, setTimeRange] = useState('7');
  const [chartType, setChartType] = useState('line');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Mock data fetching
  const data = useMemo(() => {
    return generateMockData(selectedCoin, timeRange);
  }, [selectedCoin, timeRange]);

  const formatChartData = useCallback((prices, volumes) => {
    if (!prices || !volumes) return [];
    return prices.map(([timestamp, price], index) => ({
      date: new Date(timestamp),
      timestamp,
      price: parseFloat(price.toFixed(2)),
      volume: volumes[index] ? volumes[index][1] : 0,
    }));
  }, []);

  const chartData = useMemo(() => 
    formatChartData(data.prices, data.total_volumes), 
    [data, formatChartData]
  );

  const { priceChange, currentPrice, volume24h, marketCap } = useMemo(() => {
    if (chartData.length < 2) return { priceChange: 0, currentPrice: 0, volume24h: 0, marketCap: 0 };
    
    const firstPrice = chartData[0].price;
    const lastPrice = chartData[chartData.length - 1].price;
    const change = ((lastPrice - firstPrice) / firstPrice) * 100;
    const totalVolume = chartData.reduce((sum, item) => sum + item.volume, 0);
    
    return {
      priceChange: change,
      currentPrice: lastPrice,
      volume24h: totalVolume / chartData.length,
      marketCap: lastPrice * 19500000 // Mock market cap calculation
    };
  }, [chartData]);

  const selectedCoinData = POPULAR_COINS.find(coin => coin.id === selectedCoin);

  const handleRefresh = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      setLastUpdated(new Date());
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleZoom = useCallback((direction) => {
    setZoomLevel(prev => {
      if (direction === 'in' && prev < 2) return prev + 0.25;
      if (direction === 'out' && prev > 0.5) return prev - 0.25;
      return prev;
    });
  }, []);

  const renderChart = () => {
    const chartProps = {
      data: chartData,
      margin: { top: 20, right: 30, left: 20, bottom: 20 }
    };

    const xAxisProps = {
      dataKey: "date",
      tick: { fontSize: 12, fill: '#6B7280' },
      tickFormatter: (value) => {
        const date = new Date(value);
        return timeRange === '1' 
          ? date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
          : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      },
      axisLine: { stroke: '#E5E7EB' },
      tickLine: { stroke: '#E5E7EB' }
    };

    const yAxisProps = {
      domain: ['auto', 'auto'],
      tickFormatter: (value) => `$${value.toLocaleString()}`,
      width: 80,
      tick: { fontSize: 12, fill: '#6B7280' },
      axisLine: { stroke: '#E5E7EB' },
      tickLine: { stroke: '#E5E7EB' }
    };

    switch (chartType) {
      case 'area':
        return (
          <AreaChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
            <XAxis {...xAxisProps} />
            <YAxis {...yAxisProps} />
            <Tooltip 
              content={<CustomTooltip chartType={chartType} />}
              cursor={{ stroke: selectedCoinData?.color, strokeWidth: 1, strokeDasharray: '3 3' }}
            />
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={selectedCoinData?.color} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={selectedCoinData?.color} stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="price"
              name="Price (USD)"
              stroke={selectedCoinData?.color}
              fillOpacity={1}
              fill="url(#colorPrice)"
              strokeWidth={2}
              animationDuration={300}
            />
          </AreaChart>
        );
      
      case 'candle':
        return (
          <BarChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
            <XAxis {...xAxisProps} />
            <YAxis 
              domain={['auto', 'auto']}
              tickFormatter={(value) => `$${(value / 1000000).toFixed(0)}M`}
              width={80}
              tick={{ fontSize: 12, fill: '#6B7280' }}
              axisLine={{ stroke: '#E5E7EB' }}
              tickLine={{ stroke: '#E5E7EB' }}
            />
            <Tooltip 
              content={<CustomTooltip chartType={chartType} />}
              cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
            />
            <Bar
              dataKey="volume"
              name="Volume (USD)"
              fill={selectedCoinData?.color}
              opacity={0.7}
              animationDuration={300}
            />
          </BarChart>
        );
      
      default:
        return (
          <LineChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
            <XAxis {...xAxisProps} />
            <YAxis {...yAxisProps} />
            <Tooltip 
              content={<CustomTooltip chartType={chartType} />}
              cursor={{ stroke: selectedCoinData?.color, strokeWidth: 1, strokeDasharray: '3 3' }}
            />
            <Line
              type="monotone"
              dataKey="price"
              name="Price (USD)"
              stroke={selectedCoinData?.color}
              strokeWidth={3}
              dot={false}
              activeDot={{ 
                r: 6, 
                fill: selectedCoinData?.color, 
                stroke: '#fff', 
                strokeWidth: 2,
                className: 'drop-shadow-lg'
              }}
              animationDuration={300}
            />
          </LineChart>
        );
    }
  };

  return (
    <div className={`bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 ${isFullscreen ? 'fixed inset-4 z-50' : ''}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-50 to-white p-6 border-b border-gray-100">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg"
                style={{ backgroundColor: selectedCoinData?.color }}
              >
                {selectedCoinData?.logo}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {selectedCoinData?.name}
                </h1>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">{selectedCoinData?.symbol}</span>
                  <span className={`text-lg font-semibold ${priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
            <button
              onClick={() => handleZoom('out')}
              disabled={zoomLevel <= 0.5}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              title="Zoom out"
            >
              <ZoomOut className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleZoom('in')}
              disabled={zoomLevel >= 2}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              title="Zoom in"
            >
              <ZoomIn className="w-5 h-5" />
            </button>
            <button
              onClick={handleRefresh}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Refresh data"
            >
              <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="p-6 border-b border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={DollarSign}
            label="Current Price"
            value={`$${currentPrice.toLocaleString()}`}
            change={priceChange}
            isPositive={priceChange >= 0}
          />
          <StatCard
            icon={Activity}
            label="24h Volume"
            value={`$${(volume24h / 1000000).toFixed(2)}M`}
          />
          <StatCard
            icon={TrendingUp}
            label="Market Cap"
            value={`$${(marketCap / 1000000000).toFixed(2)}B`}
          />
          <StatCard
            icon={Calendar}
            label="Period"
            value={TIME_RANGES.find(r => r.value === timeRange)?.description}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={selectedCoin}
              onChange={(e) => setSelectedCoin(e.target.value)}
              className="bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              {POPULAR_COINS.map(coin => (
                <option key={coin.id} value={coin.id}>
                  {coin.logo} {coin.name} ({coin.symbol})
                </option>
              ))}
            </select>
            
            <div className="flex bg-gray-100 rounded-xl p-1">
              {TIME_RANGES.map(range => (
                <button
                  key={range.value}
                  onClick={() => setTimeRange(range.value)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                    timeRange === range.value
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex bg-gray-100 rounded-xl p-1">
            {CHART_TYPES.map(type => {
              const Icon = type.icon;
              return (
                <button
                  key={type.value}
                  onClick={() => setChartType(type.value)}
                  className={`flex items-center space-x-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                    chartType === type.value
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{type.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="p-6">
        <div 
          className="transition-transform duration-300 ease-in-out"
          style={{ 
            transform: `scale(${zoomLevel})`, 
            transformOrigin: 'center',
            height: isFullscreen ? '60vh' : '400px'
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
        <div className="flex justify-between items-center text-sm text-gray-500">
          <p className="flex items-center space-x-2">
            <span>Powered by Advanced Trading Analytics</span>
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          </p>
          <p>Last updated: {lastUpdated.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default AdvancedTradingChart;