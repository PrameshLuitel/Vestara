
'use client';
import { FC } from 'react';
import { FullStockData, SortConfig } from './types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUp, ArrowDown } from 'lucide-react';
import MiniSparkline from './mini-sparkline';
import { cn } from '@/lib/utils';
import { formatCurrency, getTileColor } from './utils';
import { MODEL_METADATA } from './constants';

interface RankedListViewProps {
  stocks: FullStockData[];
  onStockClick: (stock: FullStockData) => void;
  sortConfig: SortConfig;
  setSortConfig: (config: SortConfig) => void;
}

const ModelAgreementDots: FC<{ stock: FullStockData }> = ({ stock }) => {
    return (
        <div className="flex gap-1 items-center">
            {Object.keys(MODEL_METADATA).slice(0,7).map(key => {
                const modelKey = key as keyof typeof stock.models;
                const modelData = stock.models[modelKey];
                if (!modelData || modelData.length === 0) {
                    return <div key={key} className="w-2 h-2 rounded-full bg-neutral/20" title={`${key}: No data`}></div>
                }
                const prediction = modelData[modelData.length - 1].value;
                const gain = ((prediction - stock.ltp) / stock.ltp) * 100;
                let color = 'bg-neutral';
                if (gain > 0.1) color = 'bg-up';
                if (gain < -0.1) color = 'bg-down';
                return <div key={key} className={cn("w-2 h-2 rounded-full", color)} title={`${key}: ${gain.toFixed(2)}%`}></div>
            })}
        </div>
    )
}

const RankedListView: FC<RankedListViewProps> = ({ stocks, onStockClick, sortConfig, setSortConfig }) => {
  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const headers = [
    { key: '#', label: '#' },
    { key: 'symbol', label: 'Ticker' },
    { key: 'sector', label: 'Sector' },
    { key: 'ltp', label: 'Current Price' },
    { key: 'dayChangePerc', label: 'Day Change' },
    { key: 'vol', label: 'Volume' },
    { key: 'ensemblePredGain7d', label: 'Ensemble 7d %' },
    { key: 'modelAgreement', label: 'Model Agreement' },
    { key: 'forecast', label: 'Forecast' },
  ];

  return (
    <div className="p-2">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            {headers.map(h => (
                <TableHead key={h.key} onClick={() => h.key !== '#' && handleSort(h.key)} className={cn(h.key !== '#' && 'cursor-pointer')}>
                   <div className='flex items-center gap-1'>
                     {h.label}
                     {sortConfig.key === h.key && (
                         sortConfig.direction === 'asc' ? <ArrowUp className="h-3 w-3"/> : <ArrowDown className="h-3 w-3" />
                     )}
                   </div>
                </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {stocks.map((stock, index) => (
            <TableRow key={stock.symbol} onClick={() => onStockClick(stock)} className="cursor-pointer font-mono" style={{borderLeft: `3px solid ${getTileColor(stock.ensemblePredGain7d)}`}}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>
                <div className='font-bold'>{stock.symbol}</div>
                <div className='text-xs text-muted-foreground truncate max-w-[150px]'>{stock.name}</div>
                </TableCell>
              <TableCell>{stock.sector}</TableCell>
              <TableCell>{formatCurrency(stock.ltp)}</TableCell>
              <TableCell className={cn(stock.dayChangePerc > 0 ? 'text-up' : 'text-down')}>
                {stock.dayChangePerc.toFixed(2)}%
              </TableCell>
              <TableCell>{(stock.vol / 1000).toFixed(1)}k</TableCell>
              <TableCell className={cn(stock.ensemblePredGain7d > 0 ? 'text-up' : 'text-down', 'font-bold')}>
                {stock.ensemblePredGain7d.toFixed(2)}%
              </TableCell>
              <TableCell>
                  <div className="flex flex-col">
                    <ModelAgreementDots stock={stock} />
                    <span className='text-xs mt-1 text-muted-foreground'>{stock.modelAgreement.agreeUp}/{stock.modelAgreement.total} agree on UP</span>
                  </div>
              </TableCell>
              <TableCell>
                <div className="h-6 w-24">
                  <MiniSparkline data={stock.models['Ensemble'] || []} color={getTileColor(stock.ensemblePredGain7d)} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default RankedListView;
