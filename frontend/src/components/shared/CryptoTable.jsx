import React, { useState, useMemo, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Star,
  DollarSign,
  Search,
  Filter,
  ArrowUp,
  ArrowDown,
  Eye,
  Activity,
  BarChart3,
  Sparkles,
  Globe,
  AlertCircle,
  CheckCircle2,
  Clock,
  ChevronDown,
  X,
  Wifi,
  WifiOff
} from 'lucide-react';
import { useFetch, API } from '../../utils/api';
import { TableSkeleton, ErrorMessage } from './SkeletonLoader';

const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: price < 1 ? 6 : 2,
  }).format(price);
};

const formatMarketCap = (marketCap) => {
  if (marketCap >= 1e12) return `$${(marketCap / 1e12).toFixed(2)}T`;
  if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(2)}B`;
  if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(2)}M`;
  return formatPrice(marketCap);
};

const formatVolume = (volume) => {
  if (volume >= 1e9) return `$${(volume / 1e9).toFixed(2)}B`;
  if (volume >= 1e6) return `$${(volume / 1e6).toFixed(2)}M`;
  if (volume >= 1e3) return `$${(volume / 1e3).toFixed(2)}K`;
  return formatPrice(volume);
};

const MiniSparkline = ({ data, isPositive, color }) => {
  if (!data || data.length === 0) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min;

  if (range === 0) return null;

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 60;
    const y = 20 - ((value - min) / range) * 20;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width="60" height="20" className="opacity-70">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        points={points}
        className="drop-shadow-sm"
      />
    </svg>
  );
};

const SkeletonRow = () => (
  <tr className="animate-pulse">
    <td className="px-6 py-4">
      <div className="flex items-center space-x-3">
        <div className="w-4 h-4 bg-gray-200 rounded"></div>
        <div className="w-6 h-4 bg-gray-200 rounded"></div>
      </div>
    </td>
    <td className="px-6 py-4">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
        <div className="space-y-1">
          <div className="w-16 h-4 bg-gray-200 rounded"></div>
          <div className="w-20 h-3 bg-gray-200 rounded"></div>
        </div>
      </div>
    </td>
    <td className="px-6 py-4">
      <div className="w-20 h-4 bg-gray-200 rounded ml-auto"></div>
    </td>
    <td className="px-6 py-4">
      <div className="w-16 h-6 bg-gray-200 rounded-full ml-auto"></div>
    </td>
    <td className="px-6 py-4">
      <div className="w-16 h-4 bg-gray-200 rounded ml-auto"></div>
    </td>
    <td className="px-6 py-4">
      <div className="w-16 h-4 bg-gray-200 rounded ml-auto"></div>
    </td>
    <td className="px-6 py-4">
      <div className="w-12 h-5 bg-gray-200 rounded ml-auto"></div>
    </td>
  </tr>
);

const StatCard = ({ icon: Icon, label, value, change, trend }) => (
  <div className="card bg-base-100 shadow-sm hover:shadow-md transition-all duration-200">
    <div className="card-body p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Icon className="w-4 h-4 text-primary" />
          </div>
          <span className="text-sm font-medium text-base-content/70">{label}</span>
        </div>
        {trend !== undefined && (
          <div className={`badge ${trend > 0 ? 'badge-success' : 'badge-error'}`}>
            {trend > 0 ? '+' : ''}{trend.toFixed(1)}%
          </div>
        )}
      </div>
      <p className="text-lg font-bold text-base-content">{value}</p>
    </div>
  </div>
);

const CryptoLogo = ({ crypto, size = 'md' }) => {
  const [imgSrc, setImgSrc] = useState(crypto.logo);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (hasError) return;
    setHasError(true);
    setImgSrc(`https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/${crypto.symbol.toLowerCase().replace('usdt', '')}.png`);
  };

  if (hasError || !imgSrc) {
    return (
      <div
        className={`h-8 w-8 md:h-10 md:w-10 rounded-full flex items-center justify-center font-bold text-sm text-base-100 shadow-sm ring-2 ring-base-100`}
        style={{ backgroundColor: crypto.color || 'hsl(var(--n))' }}
      >
        {crypto.symbol.charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    <div className="relative">
      <img
        className={`h-8 w-8 md:h-10 md:w-10 rounded-full shadow-sm ring-2 ring-base-100 bg-base-100 p-0.5 object-contain`}
        src={imgSrc}
        alt={crypto.name}
        onError={handleError}
        loading="lazy"
      />
    </div>
  );
};

// Popular trading pairs with their logos
const POPULAR_PAIRS = [
  { 
    symbol: 'BTCUSDT', 
    name: 'Bitcoin', 
    logo: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
    color: '#F7931A'
  },
  { 
    symbol: 'ETHUSDT', 
    name: 'Ethereum', 
    logo: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
    color: '#627EEA'
  },
  { 
    symbol: 'BNBUSDT', 
    name: 'Binance Coin', 
    logo: 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png',
    color: '#F3BA2F'
  },
  { 
    symbol: 'SOLUSDT', 
    name: 'Solana', 
    logo: 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
    color: '#9945FF'
  },
  { 
    symbol: 'XRPUSDT', 
    name: 'XRP', 
    logo: 'https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png',
    color: '#23292F'
  },
  { 
    symbol: 'ADAUSDT', 
    name: 'Cardano', 
    logo: 'https://assets.coingecko.com/coins/images/975/large/cardano.png',
    color: '#0033AD'
  },
  { 
    symbol: 'DOGEUSDT', 
    name: 'Dogecoin', 
    logo: 'https://assets.coingecko.com/coins/images/5/large/dogecoin.png',
    color: '#C2A633'
  },
  { 
    symbol: 'DOTUSDT', 
    name: 'Polkadot', 
    logo: 'https://assets.coingecko.com/coins/images/12171/large/polkadot.png',
    color: '#E6007A'
  },
  { 
    symbol: 'MATICUSDT', 
    name: 'Polygon', 
    logo: 'https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png',
    color: '#8247E5'
  },
  { 
    symbol: 'LINKUSDT', 
    name: 'Chainlink', 
    logo: 'https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png',
    color: '#2A5ADA'
  }
];

const AdvancedCryptoTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'volume', direction: 'desc' });
  const [watchlist, setWatchlist] = useState(new Set());
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Network status monitoring
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Fetch cryptocurrency data using our custom hook
  const { data: cryptos, isLoading, error, retry } = useFetch(
    API.getMarketData(),
    { enabled: isOnline }
  );

  const handleRefresh = () => {
    if (!isOnline) return;
    retry();
    setLastUpdated(new Date());
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const toggleWatchlist = (symbol) => {
    const newWatchlist = new Set(watchlist);
    if (newWatchlist.has(symbol)) {
      newWatchlist.delete(symbol);
    } else {
      newWatchlist.add(symbol);
    }
    setWatchlist(newWatchlist);
  };

  const filteredAndSortedCryptos = useMemo(() => {
    if (!Array.isArray(cryptos)) return [];
    
    // Filter only popular USDT pairs
    let filtered = cryptos.filter(crypto => 
      POPULAR_PAIRS.some(pair => pair.symbol === crypto.symbol) &&
      crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (selectedCategory === 'watchlist') {
      filtered = filtered.filter(crypto => watchlist.has(crypto.symbol));
    }

    return filtered.sort((a, b) => {
      const aVal = parseFloat(a[sortConfig.key] || 0);
      const bVal = parseFloat(b[sortConfig.key] || 0);

      if (sortConfig.direction === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
  }, [cryptos, searchTerm, sortConfig, selectedCategory, watchlist]);

  const marketStats = useMemo(() => {
    if (!Array.isArray(cryptos) || cryptos.length === 0) return null;

    // Filter only popular USDT pairs for stats
    const popularPairs = cryptos.filter(crypto => 
      POPULAR_PAIRS.some(pair => pair.symbol === crypto.symbol)
    );
    
    const totalVolume = popularPairs.reduce((sum, crypto) => sum + parseFloat(crypto.volume || 0), 0);
    const avgChange = popularPairs.reduce((sum, crypto) => sum + parseFloat(crypto.priceChangePercent || 0), 0) / popularPairs.length;
    const gainers = popularPairs.filter(crypto => parseFloat(crypto.priceChangePercent || 0) > 0).length;

    return {
      totalVolume,
      avgChange,
      gainersPercentage: (gainers / popularPairs.length) * 100,
      totalCoins: popularPairs.length
    };
  }, [cryptos]);

  const SortableHeader = ({ children, column, className = "" }) => (
    <th
      className={`px-6 py-3 text-left font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors ${className}`}
      onClick={() => handleSort(column)}
    >
      <div className="flex items-center space-x-1">
        {children}
        <div className="flex flex-col">
          <ArrowUp className={`w-3 h-3 ${sortConfig.key === column && sortConfig.direction === 'asc' ? 'text-blue-600' : 'text-gray-300'}`} />
          <ArrowDown className={`w-3 h-3 -mt-1 ${sortConfig.key === column && sortConfig.direction === 'desc' ? 'text-blue-600' : 'text-gray-300'}`} />
        </div>
      </div>
    </th>
  );

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <ErrorMessage 
          message={error.message} 
          onRetry={handleRefresh}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <TableSkeleton />
      </div>
    );
  }

  return (
    <div className="card bg-base-100 shadow-xl">
      {/* Header */}
      <div className="card-body bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 border-b border-base-200">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-primary rounded-xl shadow-lg">
              <Activity className="w-6 h-6 text-primary-content" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-base-content">Cryptocurrency Market</h1>
              <p className="text-sm text-base-content/70">Real-time market data powered by Binance API</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 text-sm text-base-content/70">
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-2 ${isOnline ? 'bg-success animate-pulse' : 'bg-error'}`}></div>
                {isOnline ? <Wifi className="w-4 h-4 mr-1" /> : <WifiOff className="w-4 h-4 mr-1" />}
                <span>{isOnline ? 'Online' : 'Offline'}</span>
              </div>
            </div>
            <button
              onClick={handleRefresh}
              disabled={!isOnline}
              className="btn btn-ghost btn-sm"
              title="Refresh data"
            >
              <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Market Stats */}
      {marketStats && (
        <div className="card-body border-b border-base-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={BarChart3}
              label="24h Volume"
              value={formatVolume(marketStats.totalVolume)}
            />
            <StatCard
              icon={TrendingUp}
              label="Market Sentiment"
              value={`${marketStats.gainersPercentage.toFixed(0)}% Bullish`}
              trend={marketStats.avgChange}
            />
            <StatCard
              icon={Sparkles}
              label="Active Pairs"
              value={marketStats.totalCoins.toString()}
            />
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="card-body border-b border-base-200">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="form-control relative w-full max-w-xs">
              <div className="relative">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search cryptocurrencies..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input input-bordered w-full pl-10 pr-10"
                  />
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50" />
                  {searchTerm && (
                    <button 
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 btn btn-ghost btn-xs p-1 hover:bg-base-200 rounded-full"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="join">
              {[
                { key: 'all', label: 'All Pairs', icon: Globe },
                { key: 'watchlist', label: 'Watchlist', icon: Star }
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className={`join-item btn btn-sm ${
                    selectedCategory === key
                      ? 'btn-primary'
                      : 'btn-ghost'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                  {key === 'watchlist' && watchlist.size > 0 && (
                    <div className="badge badge-primary badge-sm">{watchlist.size}</div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-base-content/50" />
                  <span className="text-sm font-semibold">#</span>
                </div>
              </th>
              <SortableHeader column="symbol">
                <span className="text-sm">Asset</span>
              </SortableHeader>
              <SortableHeader column="lastPrice" className="text-right">
                <DollarSign className="w-4 h-4" />
                <span className="text-sm">Price</span>
              </SortableHeader>
              <SortableHeader column="priceChangePercent" className="text-right">
                <span className="text-sm">24h</span>
              </SortableHeader>
              <SortableHeader column="volume" className="text-right">
                <span className="text-sm">Volume</span>
              </SortableHeader>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedCryptos.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-12">
                  <div className="flex flex-col items-center space-y-3">
                    <AlertCircle className="w-12 h-12 text-base-content/30" />
                    <p className="text-base-content/70">No cryptocurrencies found</p>
                    <p className="text-sm text-base-content/50">Try adjusting your search or filters</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredAndSortedCryptos.map((crypto) => {
                const isPositive24h = parseFloat(crypto.priceChangePercent || 0) >= 0;
                const isInWatchlist = watchlist.has(crypto.symbol);
                const pairInfo = POPULAR_PAIRS.find(pair => pair.symbol === crypto.symbol);
                const symbol = crypto.symbol.replace('USDT', '');

                return (
                  <tr
                    key={crypto.symbol}
                    className="hover:bg-base-200 transition-all duration-200 cursor-pointer"
                  >
                    <td>
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWatchlist(crypto.symbol);
                          }}
                          className={`btn btn-ghost btn-sm ${
                            isInWatchlist
                              ? 'text-warning'
                              : 'text-base-content/30'
                          }`}
                        >
                          <Star className={`w-4 h-4 ${isInWatchlist ? 'fill-current' : ''}`} />
                        </button>
                        <span className="text-sm font-semibold">
                          {symbol}
                        </span>
                      </div>
                    </td>

                    <td>
                      <div className="flex items-center space-x-3">
                        <CryptoLogo crypto={pairInfo} />
                        <div className="min-w-0">
                          <div className="text-sm md:text-base font-semibold truncate">
                            {pairInfo?.name || symbol}
                          </div>
                          <div className="text-xs text-base-content/50 truncate max-w-[100px] md:max-w-[150px]">
                            {symbol}/USDT
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="text-right">
                      <div className="text-sm font-bold">
                        {formatPrice(parseFloat(crypto.lastPrice || 0))}
                      </div>
                    </td>

                    <td className="text-right">
                      <div className={`badge ${
                        isPositive24h
                          ? 'badge-success'
                          : 'badge-error'
                      }`}>
                        {isPositive24h ? (
                          <TrendingUp className="mr-1 w-3 h-3" />
                        ) : (
                          <TrendingDown className="mr-1 w-3 h-3" />
                        )}
                        {Math.abs(parseFloat(crypto.priceChangePercent || 0)).toFixed(2)}%
                      </div>
                    </td>

                    <td className="text-right">
                      <div className="text-sm">
                        {formatVolume(parseFloat(crypto.volume || 0))}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="card-body bg-base-200/50 border-t border-base-200">
        <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-sm text-base-content/70">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <CheckCircle2 className="w-4 h-4 text-success mr-2" />
              <span>Data from Binance API</span>
            </div>
            <div className="flex items-center">
              <Eye className="w-4 h-4 text-primary mr-2" />
              <span>Showing {filteredAndSortedCryptos.length} of {cryptos.length} pairs</span>
            </div>
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedCryptoTable;
