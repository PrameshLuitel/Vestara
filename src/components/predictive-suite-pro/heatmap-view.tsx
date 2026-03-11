
'use client';

import { FC } from 'react';
import { FullStockData } from './types';
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import MiniSparkline from './mini-sparkline';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getTileColor, formatCurrency } from './utils';

interface HeatmapViewProps {
  stocks: FullStockData[];
  onStockClick: (stock: FullStockData) => void;
}

const StockTile: FC<{ stock: FullStockData; onStockClick: (stock: FullStockData) => void }> = ({ stock, onStockClick }) => {
  const { 
    symbol, 
    ltp, 
    ensemblePredGain7d, 
    modelAgreement, 
    vol,
    models,
    highDivergence
  } = stock;
  
  const tileColor = getTileColor(ensemblePredGain7d);
  const direction = ensemblePredGain7d > 0 ? 'up' : 'down';

  const normalizedVolume = Math.log10(vol + 1);
  const minSize = 100;
  const maxSize = 300;
  const size = Math.max(minSize, Math.min(maxSize, minSize + normalizedVolume * 15));

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="relative p-1"
      style={{ flex: `1 1 ${size}px`, maxWidth: `${maxSize}px` }}
      onClick={() => onStockClick(stock)}
    >
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={cn(
                'relative flex flex-col justify-between h-full p-3 rounded-md cursor-pointer transition-all duration-300',
                'bg-card hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1'
              )}
              style={{ borderLeft: `3px solid ${tileColor}` }}
            >
              <div>
                <div className="flex justify-between items-center">
                  <span className="font-mono text-xl font-bold">{symbol}</span>
                  {highDivergence && <Badge variant="destructive" className='text-xs'>High Divergence</Badge>}
                </div>
                <span className="font-mono text-lg">{formatCurrency(ltp)}</span>
              </div>
              <div className="mt-2">
                <div className="flex items-center gap-1 font-mono text-base">
                  {direction === 'up' ? <ArrowUp className="w-4 h-4 text-up" /> : <ArrowDown className="w-4 h-4 text-down" />}
                  <span className={cn(direction === 'up' ? 'text-up' : 'text-down')}>
                    {ensemblePredGain7d?.toFixed(2)}%
                  </span>
                </div>
                <div className="h-8 mt-1">
                    <MiniSparkline data={models['Ensemble'] || []} color={tileColor} />
                </div>
              </div>
              <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-accent/50 text-accent-foreground text-xs font-mono">
                {modelAgreement.agreeUp}/{modelAgreement.total} ↑
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="p-2">
              <h4 className="font-bold mb-2">{symbol} Model Forecasts</h4>
              <ul className="space-y-1">
                {Object.entries(models).slice(0, 7).map(([key, value]) => {
                  const gain = value.length > 0 ? ((value[value.length-1].value - ltp) / ltp) * 100 : 0;
                  return (
                    <li key={key} className="flex justify-between items-center text-xs font-mono">
                      <span>{key}:</span>
                      <span className={cn('font-bold', gain > 0 ? 'text-up' : 'text-down')}>
                        {gain.toFixed(2)}%
                      </span>
                    </li>
                  )
                })}
              </ul>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </motion.div>
  );
};

const HeatmapView: FC<HeatmapViewProps> = ({ stocks, onStockClick }) => {
  return (
    <div className="p-2">
        <div className="flex flex-wrap -m-1">
          <AnimatePresence>
            {stocks.map((stock) => (
              <StockTile key={stock.symbol} stock={stock} onStockClick={onStockClick} />
            ))}
          </AnimatePresence>
        </div>
    </div>
  );
};

export default HeatmapView;
