
'use client';

import { useState, useEffect, useMemo, FC } from 'react';
import { getHistoricalData } from '@/services/historical-data';
import { getLatestForecastData } from '@/services/google-sheets';
import { FullStockData, SortConfig, ViewMode, ModelKey } from './types';
import { processStockData } from './utils';
import ControlBar from './control-bar';
import HeatmapView from './heatmap-view';
import RankedListView from './ranked-list-view';
import BubbleChartView from './bubble-chart-view';
import StockDetailDrawer from './stock-detail-drawer';
import LoadingSkeleton from './loading-skeleton';
import { Alert, AlertTitle, AlertDescription } from '../ui/alert';
import { ALL_MODELS, SECTORS } from './constants';

interface PredictiveSuiteProProps {
  switchButton: React.ReactNode;
}

const PredictiveSuitePro: FC<PredictiveSuiteProProps> = ({ switchButton }) => {
  const [allStocks, setAllStocks] = useState<FullStockData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Interaction State
  const [viewMode, setViewMode] = useState<ViewMode>('heatmap');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSectors, setActiveSectors] = useState<string[]>(['ALL']);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'ensemblePredGain7d', direction: 'desc' });
  const [activeModels, setActiveModels] = useState<ModelKey[]>(ALL_MODELS);
  const [selectedStock, setSelectedStock] = useState<FullStockData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [historical, forecast] = await Promise.all([getHistoricalData(), getLatestForecastData()]);
        
        if (!historical || typeof historical !== 'object') throw new Error('Historical data is invalid.');
        if (!forecast || typeof forecast !== 'object') throw new Error('Forecast data is invalid.');
        if ((forecast as any).error) throw new Error((forecast as any).error);

        const processedData = processStockData(historical, forecast);
        setAllStocks(processedData);
      } catch (err: any) {
        console.error('Failed to fetch and process stock data:', err);
        setError(err.message || 'An unknown error occurred.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredAndSortedStocks = useMemo(() => {
    let stocks = allStocks;

    // Filter by search query
    if (searchQuery) {
      stocks = stocks.filter(s =>
        s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by sector
    if (!activeSectors.includes('ALL')) {
      stocks = stocks.filter(s => activeSectors.includes(s.sector));
    }
    
    // Sort
    const { key, direction } = sortConfig;
    stocks.sort((a, b) => {
        let valA = a[key as keyof FullStockData] as number;
        let valB = b[key as keyof FullStockData] as number;
        
        if (typeof valA === 'string' && typeof valB === 'string') {
            return direction === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
        if (valA === undefined || valA === null || isNaN(valA)) valA = direction === 'asc' ? Infinity : -Infinity;
        if (valB === undefined || valB === null || isNaN(valB)) valB = direction === 'asc' ? Infinity : -Infinity;

        if (valA < valB) return direction === 'asc' ? -1 : 1;
        if (valA > valB) return direction === 'asc' ? 1 : -1;
        return 0;
    });

    return stocks;
  }, [allStocks, searchQuery, activeSectors, sortConfig]);

  const handleSectorToggle = (sector: string) => {
    setActiveSectors(prev => {
        if (sector === 'ALL') return ['ALL'];
        const newSectors = prev.includes('ALL') ? [] : [...prev];
        const index = newSectors.indexOf(sector);
        if (index > -1) {
            newSectors.splice(index, 1);
        } else {
            newSectors.push(sector);
        }
        if (newSectors.length === 0 || newSectors.length === SECTORS.length) return ['ALL'];
        return newSectors;
    });
  };

  const renderContent = () => {
    if (loading) {
      return <LoadingSkeleton />;
    }
    if (error) {
      return (
        <div className="p-8">
            <Alert variant="destructive">
                <AlertTitle>Error Loading Market Data</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        </div>
      );
    }
    if (filteredAndSortedStocks.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8">
                <p className="text-lg mb-2">No stocks match the current filters.</p>
                <Button variant="outline" onClick={() => {
                    setSearchQuery('');
                    setActiveSectors(['ALL']);
                }}>Reset Filters</Button>
            </div>
        )
    }

    switch (viewMode) {
      case 'heatmap':
        return <HeatmapView stocks={filteredAndSortedStocks} onStockClick={setSelectedStock} />;
      case 'list':
        return <RankedListView stocks={filteredAndSortedStocks} onStockClick={setSelectedStock} sortConfig={sortConfig} setSortConfig={setSortConfig} />;
      case 'bubble':
        return <BubbleChartView stocks={filteredAndSortedStocks} onStockClick={setSelectedStock} />;
      default:
        return <HeatmapView stocks={filteredAndSortedStocks} onStockClick={setSelectedStock} />;
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] bg-background font-bricolage text-foreground">
      <ControlBar
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortConfig={sortConfig}
        onSortChange={setSortConfig}
        activeSectors={activeSectors}
        onSectorToggle={handleSectorToggle}
        activeModels={activeModels}
        onActiveModelsChange={setActiveModels}
        stockCount={filteredAndSortedStocks.length}
        switchButton={switchButton}
      />
      <main className="flex-1 overflow-auto custom-scrollbar">
        {renderContent()}
      </main>
      <StockDetailDrawer
        stock={selectedStock}
        onOpenChange={(isOpen) => !isOpen && setSelectedStock(null)}
        activeModels={activeModels}
      />
    </div>
  );
};

export default PredictiveSuitePro;
