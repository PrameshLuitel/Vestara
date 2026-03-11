
'use client';
import { FC } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '../ui/sheet';
import { Badge } from '../ui/badge';
import { FullStockData, ModelKey } from './types';
import { formatCurrency, formatNumber } from './utils';
import { X, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { ResponsiveContainer, ComposedChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Area, Line } from 'recharts';
import { MODEL_METADATA } from './constants';
import MiniSparkline from './mini-sparkline';
import { cn } from '@/lib/utils';

interface StockDetailDrawerProps {
  stock: FullStockData | null;
  onOpenChange: (open: boolean) => void;
  activeModels: ModelKey[];
}

const Metric: FC<{ label: string; value: string | number; className?: string }> = ({ label, value, className }) => (
  <div className={cn("flex flex-col p-2 rounded-md bg-card/50", className)}>
    <span className="text-xs text-muted-foreground">{label}</span>
    <span className="font-mono font-bold text-sm">{value}</span>
  </div>
);

const StockDetailDrawer: FC<StockDetailDrawerProps> = ({ stock, onOpenChange, activeModels }) => {
  if (!stock) return null;

  const chartData = [
    ...stock.historical.map(p => ({ date: p.date, historical: p.close })),
    ...stock.models.Ensemble.map(p => ({ date: p.date, ...Object.fromEntries(
        activeModels.map(m => [m, stock.models[m]?.find(fp => fp.date === p.date)?.value])
      )
    }))
  ].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  const today = new Date().toISOString().split('T')[0];

  return (
    <Sheet open={!!stock} onOpenChange={onOpenChange}>
      <SheetContent className="w-[60vw] sm:max-w-none bg-background/80 backdrop-blur-xl border-l p-0">
        <div className="flex flex-col h-full">
          <SheetHeader className="p-4 border-b">
            <div className="flex justify-between items-center">
                <div>
                    <SheetTitle className="text-2xl font-bricolage">{stock.symbol} - {stock.name}</SheetTitle>
                    <SheetDescription><Badge variant="secondary">{stock.sector}</Badge></SheetDescription>
                </div>
                <Badge variant={stock.highDivergence ? "destructive" : "outline"} className="text-sm">
                  {stock.highDivergence ? 'High Model Divergence' : 'Models Consensus'}
                </Badge>
            </div>
          </SheetHeader>

          <div className="grid grid-cols-4 lg:grid-cols-8 gap-2 p-4 text-xs border-b">
            <Metric label="Open" value={formatCurrency(stock.open)} />
            <Metric label="High" value={formatCurrency(stock.high)} />
            <Metric label="Low" value={formatCurrency(stock.low)} />
            <Metric label="Prev. Close" value={formatCurrency(stock.prevClose)} />
            <Metric label="Volume" value={formatNumber(stock.vol)} />
            <Metric label="Turnover" value={formatCurrency(stock.turnover)} />
            <Metric label="Day Range" value={formatCurrency(stock.range)} />
            <Metric label="Day Change" value={`${formatCurrency(stock.diff)} (${stock.dayChangePerc.toFixed(2)}%)`} 
                className={stock.dayChangePerc > 0 ? 'bg-up/10 text-up' : 'bg-down/10 text-down'}/>
          </div>
          
          <div className="flex-grow p-4 overflow-y-auto custom-scrollbar">
            <div className="h-[350px] w-full">
              <h3 className="font-bold mb-2">Historical Price & Model Forecasts</h3>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))"/>
                  <XAxis dataKey="date" tickFormatter={(d) => new Date(d).toLocaleDateString('en-GB', {day: '2-digit', month: 'short'})} />
                  <YAxis domain={['dataMin - 10', 'dataMax + 10']} tickFormatter={(v) => formatCurrency(v)} />
                  <Tooltip contentStyle={{backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}/>
                  <Legend />
                  <Area type="monotone" dataKey="historical" fill="hsl(var(--neutral)/0.2)" stroke="hsl(var(--neutral))" name="Historical" />
                   {activeModels.map(modelKey => (
                      <Line key={modelKey} type="monotone" dataKey={modelKey} stroke={MODEL_METADATA[modelKey].color} name={MODEL_METADATA[modelKey].label} strokeDasharray="5 5" dot={false} />
                   ))}
                  <Line type="monotone" dataKey="Ensemble" stroke={MODEL_METADATA['Ensemble'].color} name={MODEL_METADATA['Ensemble'].label} strokeWidth={2} dot={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-6">
                <h3 className="font-bold mb-2">Individual Model Analysis</h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                    {Object.keys(stock.models).filter(m => m !== 'EnsembleMedian' && m !== 'Ensemble').map(modelKey => {
                        const model = stock.models[modelKey as ModelKey];
                        if(!model || model.length === 0) return null;
                        const finalPrice = model[model.length - 1].value;
                        const gain = ((finalPrice - stock.ltp) / stock.ltp) * 100;
                        const direction = gain > 0 ? 'up' : gain < 0 ? 'down' : 'neutral';
                        return (
                            <div key={modelKey} className="p-3 rounded-md bg-card/50">
                               <div className='flex justify-between items-center'>
                                 <h4 className="font-bold text-sm flex items-center gap-2">
                                     <div className='w-2 h-2 rounded-full' style={{backgroundColor: MODEL_METADATA[modelKey as ModelKey]?.color || '#fff'}}></div>
                                     {MODEL_METADATA[modelKey as ModelKey]?.label}
                                 </h4>
                                  {direction === 'up' ? <TrendingUp className="w-4 h-4 text-up"/> : direction === 'down' ? <TrendingDown className="w-4 h-4 text-down"/> : <Minus className="w-4 h-4 text-neutral"/>}
                               </div>
                                <p className="font-mono text-lg">{formatCurrency(finalPrice)}</p>
                                <p className={cn('text-sm font-mono', direction === 'up' ? 'text-up' : 'text-down')}>{gain.toFixed(2)}%</p>
                                <div className='h-8 w-full mt-1'>
                                    <MiniSparkline data={model} color={MODEL_METADATA[modelKey as ModelKey]?.color || '#fff'} />
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
          </div>
          
          <SheetFooter className="p-4 border-t flex-col !items-start sm:!items-start gap-2 bg-card/50">
            <div>
              <h4 className="font-bold">Ensemble Summary</h4>
              <p className='text-sm text-muted-foreground'>
                <span className="font-bold text-up">{stock.modelAgreement.agreeUp}</span> out of <span className="font-bold">{stock.modelAgreement.total}</span> models predict an increase.
              </p>
            </div>
            <div className="flex gap-4 font-mono text-sm">
              <span>Mean Target: <span className="font-bold text-primary">{formatCurrency(stock.models['Ensemble']?.[6]?.value)}</span></span>
              <span>Median Target: <span className="font-bold text-primary">{formatCurrency(stock.models['EnsembleMedian']?.[6]?.value)}</span></span>
            </div>
            <p className="text-xs text-muted-foreground/50 w-full mt-2">Disclaimer: For educational purposes only. Not financial advice.</p>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default StockDetailDrawer;
