
'use client';
import { FC } from 'react';
import { FullStockData } from './types';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label } from 'recharts';
import { SECTOR_COLORS } from './constants';
import { formatCurrency } from './utils';
import { cn } from '@/lib/utils';

interface BubbleChartViewProps {
  stocks: FullStockData[];
  onStockClick: (stock: FullStockData) => void;
}

const CustomTooltip: FC<any> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="p-2 bg-popover border rounded-md shadow-lg text-popover-foreground text-xs">
        <p className="font-bold">{data.symbol} ({data.sector})</p>
        <p>Day Change: <span className={cn(data.dayChangePerc > 0 ? 'text-up' : 'text-down')}>{data.dayChangePerc.toFixed(2)}%</span></p>
        <p>Predicted Gain: <span className={cn(data.ensemblePredGain7d > 0 ? 'text-up' : 'text-down')}>{data.ensemblePredGain7d.toFixed(2)}%</span></p>
        <p>Volume: {(data.vol / 1000).toFixed(1)}k</p>
      </div>
    );
  }
  return null;
};

const QuadrantLabel: FC<{ x: number, y: number, text: string }> = ({ x, y, text }) => (
    <div className="absolute text-muted-foreground/50 text-sm font-bold uppercase tracking-wider pointer-events-none" style={{ left: `${x}%`, top: `${y}%` }}>
        {text}
    </div>
)

const BubbleChartView: FC<BubbleChartViewProps> = ({ stocks, onStockClick }) => {
  const data = stocks.map(s => ({
    ...s,
    x: s.dayChangePerc,
    y: s.ensemblePredGain7d,
    z: s.vol,
  }));

  return (
    <div className="w-full h-[calc(100%-2rem)] p-4 relative">
        <QuadrantLabel x={75} y={25} text="Rising & Predicted Higher" />
        <QuadrantLabel x={25} y={25} text="Falling & Predicted Recovery" />
        <QuadrantLabel x={25} y={75} text="Bearish" />
        <QuadrantLabel x={75} y={75} text="Rising But Predicted Pullback" />

      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis type="number" dataKey="x" name="Day Change" unit="%" domain={['dataMin - 1', 'dataMax + 1']}>
            <Label value="Day Change %" offset={-10} position="insideBottom" />
          </XAxis>
          <YAxis type="number" dataKey="y" name="7d Predicted Gain" unit="%" domain={['dataMin - 2', 'dataMax + 2']}>
             <Label value="Ensemble 7-Day Predicted Gain %" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
          </YAxis>
          <ZAxis type="number" dataKey="z" name="Volume" range={[100, 2000]} />
          <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
          <Scatter data={data} fill="hsl(var(--primary))">
            {data.map((entry, index) => (
              <Scatter
                key={`scatter-${index}`}
                data={[entry]}
                fill={SECTOR_COLORS[entry.sector] || '#8884d8'}
                onClick={() => onStockClick(entry)}
                className="cursor-pointer hover:opacity-80 transition-opacity"
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BubbleChartView;
