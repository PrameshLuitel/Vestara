
'use client';

import React from 'react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { ForecastPoint } from './types';

interface MiniSparklineProps {
  data: ForecastPoint[];
  color: string;
}

const MiniSparkline: React.FC<MiniSparklineProps> = ({ data, color }) => {
  if (!data || data.length === 0) {
    return <div className="h-full w-full bg-muted-foreground/10 rounded-md" />;
  }

  const chartData = data.map(p => ({ ...p, value: p.value || 0 }));
  const gradientId = `color-${color.replace(/[^a-zA-Z0-9]/g, '')}`;
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={chartData}
        margin={{
          top: 2,
          right: 0,
          left: 0,
          bottom: 2,
        }}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.4} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          fill={`url(#${gradientId})`}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default MiniSparkline;
