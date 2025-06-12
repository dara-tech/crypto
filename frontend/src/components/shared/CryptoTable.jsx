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
  Clock
} from 'lucide-react';

// Mock data generator for demonstration
const generateMockCryptoData = () => {
  const cryptoData = [
    { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', color: '#F7931A' },
    { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', color: '#627EEA' },
    { id: 'binancecoin', name: 'BNB', symbol: 'BNB', color: '#F3BA2F' },
    { id: 'solana', name: 'Solana', symbol: 'SOL', color: '#9945FF' },
    { id: 'cardano', name: 'Cardano', symbol: 'ADA', color: '#0033AD' },
    { id: 'ripple', name: 'XRP', symbol: 'XRP', color: '#23292F' },
    { id: 'polkadot', name: 'Polkadot', symbol: 'DOT', color: '#E6007A' },
    { id: 'dogecoin', name: 'Dogecoin', symbol: 'DOGE', color: '#C2A633' },
    { id: 'avalanche', name: 'Avalanche', symbol: 'AVAX', color: '#E84142' },
    { id: 'chainlink', name: 'Chainlink', symbol: 'LINK', color: '#375BD2' }
  ];

  return cryptoData.map((crypto, index) => {
    const basePrice = Math.random() * 50000 + 100;
    const priceChange = (Math.random() - 0.5) * 20;
    const volume = Math.random() * 10000000000;
    const marketCap = basePrice * (Math.random() * 100000000 + 10000000);

    // CoinGecko image paths mapping with correct filenames
    const coinImageUrls = {
      'bitcoin': 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
      'ethereum': 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
      'binancecoin': 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png',
      'solana': 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
      'cardano': 'https://assets.coingecko.com/coins/images/975/large/cardano.png',
      'ripple': 'https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png',
      'polkadot': 'https://assets.coingecko.com/coins/images/12171/large/polkadot.png',
      'dogecoin': 'https://assets.coingecko.com/coins/images/5/large/dogecoin.png',
      'avalanche': 'https://assets.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png',
      'chainlink': 'https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png'
    };

    // Get the correct image URL or fallback to a placeholder
    const imageUrl = coinImageUrls[crypto.id] || `https://cryptologos.cc/logos/${crypto.id}-${crypto.symbol.toLowerCase()}-logo.png`;

    return {
      ...crypto,
      market_cap_rank: index + 1,
      current_price: basePrice,
      price_change_percentage_24h: priceChange,
      price_change_percentage_7d: (Math.random() - 0.5) * 30,
      total_volume: volume,
      market_cap: marketCap,
      circulating_supply: Math.random() * 1000000000,
      total_supply: Math.random() * 1000000000 + 500000000,
      image: imageUrl,
      image_small: `https://api.coingecko.com/api/v3/coins/${crypto.id}?localization=false&tickers=false&market_data=false&community_data=false&developer_data=false&sparkline=false`,
      last_updated: new Date().toISOString(),
      sparkline_in_7d: {
        price: Array.from({ length: 7 }, () => basePrice + (Math.random() - 0.5) * basePrice * 0.1)
      }
    };
  });
};

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
  <div className="bg-gradient-to-br from-white to-gray-50 p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center space-x-2">
        <div className="p-2 rounded-lg bg-blue-50">
          <Icon className="w-4 h-4 text-blue-600" />
        </div>
        <span className="text-sm font-medium text-gray-600">{label}</span>
      </div>
      {trend && (
        <div className={`text-xs px-2 py-1 rounded-full ${trend > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {trend > 0 ? '+' : ''}{trend.toFixed(1)}%
        </div>
      )}
    </div>
    <p className="text-lg font-bold text-gray-900">{value}</p>
  </div>
);

// CryptoLogo component definition
const CryptoLogo = ({ crypto }) => {
  const [imgSrc, setImgSrc] = useState(crypto.image);
  const [hasError, setHasError] = useState(false);

  // Reset imgSrc and hasError when crypto.image changes
  useEffect(() => {
    setImgSrc(crypto.image);
    setHasError(false);
  }, [crypto.image]);

  const handleError = () => {
    if (hasError) return;

    const fallbacks = [
      `https://cryptologos.cc/logos/${crypto.id}-${crypto.symbol.toLowerCase()}-logo.png`,
      `https://www.cryptocompare.com/media/37746251/${crypto.symbol.toLowerCase()}.png`,
      `https://cryptoicon-api.vercel.app/api/icon/${crypto.symbol.toLowerCase()}`,
      `https://www.coinlore.com/img/32x32/${crypto.id}.png`
    ];

    const currentIndex = fallbacks.findIndex(url => url === imgSrc);

    if (currentIndex < fallbacks.length - 1) {
      setImgSrc(fallbacks[currentIndex + 1]);
    } else {
      setHasError(true);
    }
  };

  if (hasError) {
    return (
      <div
        className="h-8 w-8 md:h-10 md:w-10 rounded-full flex items-center justify-center font-bold text-sm text-white"
        style={{ backgroundColor: crypto.color || '#6B7280' }}
      >
        {crypto.symbol.charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    <div className="relative">
      <img
        className="h-8 w-8 md:h-10 md:w-10 rounded-full shadow-sm ring-2 ring-white bg-white p-0.5 object-contain"
        src={imgSrc}
        alt={crypto.name}
        onError={handleError}
        loading="lazy"
      />
      <div
        className="absolute -bottom-1 -right-1 w-3 h-3 md:w-3.5 md:h-3.5 rounded-full border-2 border-white"
        style={{ backgroundColor: crypto.color || '#6B7280' }}
      ></div>
    </div>
  );
};


const AdvancedCryptoTable = () => {
  const [cryptos, setCryptos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefetching, setIsRefetching] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'market_cap_rank', direction: 'asc' });
  const [watchlist, setWatchlist] = useState(new Set());
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [viewMode, setViewMode] = useState('compact'); // compact, detailed

  // Mock data loading
  useEffect(() => {
    const loadData = () => {
      setIsLoading(true);
      setTimeout(() => {
        setCryptos(generateMockCryptoData());
        setIsLoading(false);
        setLastUpdated(new Date());
      }, 1000);
    };

    loadData();
    const interval = setInterval(loadData, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setIsRefetching(true);
    setTimeout(() => {
      setCryptos(generateMockCryptoData());
      setIsRefetching(false);
      setLastUpdated(new Date());
    }, 1000);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const toggleWatchlist = (cryptoId) => {
    const newWatchlist = new Set(watchlist);
    if (newWatchlist.has(cryptoId)) {
      newWatchlist.delete(cryptoId);
    } else {
      newWatchlist.add(cryptoId);
    }
    setWatchlist(newWatchlist);
  };

  const filteredAndSortedCryptos = useMemo(() => {
    let filtered = cryptos.filter(crypto =>
      crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (selectedCategory === 'watchlist') {
      filtered = filtered.filter(crypto => watchlist.has(crypto.id));
    }

    return filtered.sort((a, b) => {
      if (sortConfig.key === 'market_cap_rank') {
        return sortConfig.direction === 'asc' ? a[sortConfig.key] - b[sortConfig.key] : b[sortConfig.key] - a[sortConfig.key];
      }

      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      if (sortConfig.direction === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
  }, [cryptos, searchTerm, sortConfig, selectedCategory, watchlist]);

  const marketStats = useMemo(() => {
    if (cryptos.length === 0) return null;

    const totalMarketCap = cryptos.reduce((sum, crypto) => sum + crypto.market_cap, 0);
    const totalVolume = cryptos.reduce((sum, crypto) => sum + crypto.total_volume, 0);
    const avgChange = cryptos.reduce((sum, crypto) => sum + crypto.price_change_percentage_24h, 0) / cryptos.length;
    const gainers = cryptos.filter(crypto => crypto.price_change_percentage_24h > 0).length;

    return {
      totalMarketCap,
      totalVolume,
      avgChange,
      gainersPercentage: (gainers / cryptos.length) * 100
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

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 p-6 border-b border-gray-100">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-600 rounded-xl shadow-lg">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Cryptocurrency Market</h1>
              <p className="text-sm text-gray-600">Real-time market data and analytics</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                <Clock className="w-4 h-4 mr-1" />
                <span>Live</span>
              </div>
            </div>
            <button
              onClick={handleRefresh}
              disabled={isRefetching}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-white/50 rounded-lg transition-all"
              title="Refresh data"
            >
              <RefreshCw className={`w-5 h-5 ${isRefetching ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Market Stats */}
      {marketStats && (
        <div className="p-6 border-b border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={DollarSign}
              label="Total Market Cap"
              value={formatMarketCap(marketStats.totalMarketCap)}
              trend={marketStats.avgChange}
            />
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
              label="Active Coins"
              value={cryptos.length.toString()}
            />
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search cryptocurrencies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>

            <div className="flex bg-gray-100 rounded-xl p-1">
              {[
                { key: 'all', label: 'All Coins', icon: Globe },
                { key: 'watchlist', label: 'Watchlist', icon: Star }
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className={`flex items-center space-x-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                    selectedCategory === key
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                  {key === 'watchlist' && watchlist.size > 0 && (
                    <span className="bg-blue-100 text-blue-600 text-xs px-1.5 py-0.5 rounded-full">
                      {watchlist.size}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}
              className="border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="compact">Compact View</option>
              <option value="detailed">Detailed View</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-semibold text-gray-700">#</span>
                </div>
              </th>
              <SortableHeader column="name">
                <span className="text-sm">Asset</span>
              </SortableHeader>
              <SortableHeader column="current_price" className="text-right">
                <DollarSign className="w-4 h-4" />
                <span className="text-sm">Price</span>
              </SortableHeader>
              <SortableHeader column="price_change_percentage_24h" className="text-right">
                <span className="text-sm">24h</span>
              </SortableHeader>
              <SortableHeader column="price_change_percentage_7d" className="text-right">
                <span className="text-sm">7d</span>
              </SortableHeader>
              <SortableHeader column="market_cap" className="text-right">
                <span className="text-sm">Market Cap</span>
              </SortableHeader>
              <SortableHeader column="total_volume" className="text-right">
                <span className="text-sm">Volume</span>
              </SortableHeader>
              <th className="px-6 py-3 text-right">
                <span className="text-sm font-semibold text-gray-700">7d Chart</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {isLoading ? (
              Array(10).fill(0).map((_, i) => <SkeletonRow key={i} />)
            ) : filteredAndSortedCryptos.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center space-y-3">
                    <AlertCircle className="w-12 h-12 text-gray-400" />
                    <p className="text-gray-500">No cryptocurrencies found</p>
                    <p className="text-sm text-gray-400">Try adjusting your search or filters</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredAndSortedCryptos.map((crypto) => {
                const isPositive24h = crypto.price_change_percentage_24h >= 0;
                const isPositive7d = crypto.price_change_percentage_7d >= 0;
                const isInWatchlist = watchlist.has(crypto.id);

                return (
                  <tr
                    key={crypto.id}
                    className="hover:bg-gray-50 transition-all duration-200 group cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWatchlist(crypto.id);
                          }}
                          className={`transition-colors ${
                            isInWatchlist
                              ? 'text-yellow-500 hover:text-yellow-600'
                              : 'text-gray-300 hover:text-yellow-400'
                          }`}
                        >
                          <Star className={`w-4 h-4 ${isInWatchlist ? 'fill-current' : ''}`} />
                        </button>
                        <span className="text-sm font-semibold text-gray-700">
                          {crypto.market_cap_rank}
                        </span>
                      </div>
                    </td>

                    {/* Integrate CryptoLogo component here */}
                    <td className="px-4 md:px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <CryptoLogo crypto={crypto} />
                        <div className="min-w-0">
                          <div className="text-sm md:text-base font-semibold text-gray-900 truncate">
                            {crypto.symbol.toUpperCase()}
                          </div>
                          <div className="text-xs text-gray-500 truncate max-w-[100px] md:max-w-[150px]">
                            {crypto.name}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="text-sm font-bold text-gray-900">
                        {formatPrice(crypto.current_price)}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className={`inline-flex items-center px-2.5 py-1.5 rounded-lg text-xs font-bold shadow-sm ${
                        isPositive24h
                          ? 'bg-green-100 text-green-700 border border-green-200'
                          : 'bg-red-100 text-red-700 border border-red-200'
                      }`}>
                        {isPositive24h ? (
                          <TrendingUp className="mr-1 w-3 h-3" />
                        ) : (
                          <TrendingDown className="mr-1 w-3 h-3" />
                        )}
                        {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
                      </div>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className={`text-sm font-semibold ${
                        isPositive7d ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {isPositive7d ? '+' : ''}{crypto.price_change_percentage_7d.toFixed(2)}%
                      </div>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="text-sm font-semibold text-gray-900">
                        {formatMarketCap(crypto.market_cap)}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="text-sm text-gray-700">
                        {formatVolume(crypto.total_volume)}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end">
                        <MiniSparkline
                          data={crypto.sparkline_in_7d?.price}
                          isPositive={isPositive7d}
                          color={isPositive7d ? '#10B981' : '#EF4444'}
                        />
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
      <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-t border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" />
              <span>Data updates every minute</span>
            </div>
            <div className="flex items-center">
              <Eye className="w-4 h-4 text-blue-500 mr-2" />
              <span>Showing {filteredAndSortedCryptos.length} of {cryptos.length} coins</span>
            </div>
          </div>
          <div className="flex items-center">
            <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedCryptoTable;