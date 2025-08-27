"use client"

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Legend } from 'recharts';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const mockData = {
  AAPL: {
    price: "172.25",
    change: "+1.50 (0.88%)",
    changeType: "up",
    data: [
      { date: 'Day 1', historic: 155 }, { date: 'Day 2', historic: 156 }, { date: 'Day 3', historic: 154 },
      { date: 'Day 4', historic: 158 }, { date: 'Day 5', historic: 160 }, { date: 'Day 6', historic: 159 },
      { date: 'Day 7', historic: 162 }, { date: 'Day 8', historic: 161 }, { date: 'Day 9', historic: 163 },
      { date: 'Day 10', historic: 165 }, { date: 'Day 11', historic: 164 }, { date: 'Day 12', historic: 166 },
      { date: 'Day 13', historic: 168 }, { date: 'Day 14', historic: 167 }, { date: 'Day 15', historic: 169 },
      { date: 'Day 16', historic: 170 }, { date: 'Day 17', historic: 172 }, { date: 'Day 18', historic: 171 },
      { date: 'Day 19', historic: 173 }, { date: 'Day 20', historic: 174, predicted: 174 }, { date: 'Day 21', predicted: 175 },
      { date: 'Day 22', predicted: 176 }, { date: 'Day 23', predicted: 174 }, { date: 'Day 24', predicted: 177 },
      { date: 'Day 25', predicted: 178 }, { date: 'Day 26', predicted: 179 }, { date: 'Day 27', predicted: 178 },
      { date: 'Day 28', predicted: 180 }, { date: 'Day 29', predicted: 181 }, { date: 'Day 30', predicted: 182 },
    ],
  },
  GOOGL: {
    price: "135.60",
    change: "-0.75 (0.55%)",
    changeType: "down",
    data: [
      { date: 'Day 1', historic: 125 }, { date: 'Day 2', historic: 126 }, { date: 'Day 3', historic: 124 },
      { date: 'Day 4', historic: 128 }, { date: 'Day 5', historic: 130 }, { date: 'Day 6', historic: 129 },
      { date: 'Day 7', historic: 132 }, { date: 'Day 8', historic: 131 }, { date: 'Day 9', historic: 133 },
      { date: 'Day 10', historic: 135 }, { date: 'Day 11', historic: 134 }, { date: 'Day 12', historic: 136 },
      { date: 'Day 13', historic: 138 }, { date: 'Day 14', historic: 137 }, { date: 'Day 15', historic: 139 },
      { date: 'Day 16', historic: 140 }, { date: 'Day 17', historic: 138 }, { date: 'Day 18', historic: 137 },
      { date: 'Day 19', historic: 136 }, { date: 'Day 20', historic: 135, predicted: 135 }, { date: 'Day 21', predicted: 134 },
      { date: 'Day 22', predicted: 133 }, { date: 'Day 23', predicted: 132 }, { date: 'Day 24', predicted: 131 },
      { date: 'Day 25', predicted: 130 }, { date: 'Day 26', predicted: 129 }, { date: 'Day 27', predicted: 128 },
      { date: 'Day 28', predicted: 127 }, { date: 'Day 29', predicted: 126 }, { date: 'Day 30', predicted: 125 },
    ],
  },
  TSLA: {
    price: "177.46",
    change: "+0.10 (0.06%)",
    changeType: "neutral",
    data: [
        { date: 'Day 1', historic: 160 }, { date: 'Day 2', historic: 162 }, { date: 'Day 3', historic: 158 },
        { date: 'Day 4', historic: 165 }, { date: 'Day 5', historic: 170 }, { date: 'Day 6', historic: 168 },
        { date: 'Day 7', historic: 172 }, { date: 'Day 8', historic: 171 }, { date: 'Day 9', historic: 175 },
        { date: 'Day 10', historic: 178 }, { date: 'Day 11', historic: 176 }, { date: 'Day 12', historic: 174 },
        { date: 'Day 13', historic: 172 }, { date: 'Day 14', historic: 170 }, { date: 'Day 15', historic: 173 },
        { date: 'Day 16', historic: 175 }, { date: 'Day 17', historic: 177 }, { date: 'Day 18', historic: 176 },
        { date: 'Day 19', historic: 178 }, { date: 'Day 20', historic: 177, predicted: 177 }, { date: 'Day 21', predicted: 178 },
        { date: 'Day 22', predicted: 176 }, { date: 'Day 23', predicted: 179 }, { date: 'Day 24', predicted: 180 },
        { date: 'Day 25', predicted: 178 }, { date: 'Day 26', predicted: 181 }, { date: 'Day 27', predicted: 182 },
        { date: 'Day 28', predicted: 180 }, { date: 'Day 29', predicted: 183 }, { date: 'Day 30', predicted: 184 },
    ],
  },
};

const chartConfig = {
    historic: {
      label: "Historic",
      color: "hsl(var(--muted-foreground))",
    },
    predicted: {
      label: "Predicted",
      color: "hsl(var(--primary))",
    },
};

export default function PredictiveSuite() {
  const [selectedStock, setSelectedStock] = useState("AAPL");
  const stock = mockData[selectedStock as keyof typeof mockData];

  const renderChangeIcon = () => {
    switch (stock.changeType) {
      case "up":
        return <TrendingUp className="h-6 w-6 text-success" />;
      case "down":
        return <TrendingDown className="h-6 w-6 text-danger" />;
      default:
        return <Minus className="h-6 w-6 text-muted-foreground" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                <CardTitle className="font-headline text-2xl">Predictive Analysis</CardTitle>
                <CardDescription>Historical data and future price predictions.</CardDescription>
            </div>
            <Select onValueChange={setSelectedStock} defaultValue={selectedStock}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Select a stock" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AAPL">Apple (AAPL)</SelectItem>
                <SelectItem value="GOOGL">Google (GOOGL)</SelectItem>
                <SelectItem value="TSLA">Tesla (TSLA)</SelectItem>
              </SelectContent>
            </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-4 mb-6">
            <h2 className="text-4xl font-bold">{stock.price}</h2>
            <p className={`font-semibold ${stock.changeType === 'up' ? 'text-success' : stock.changeType === 'down' ? 'text-danger' : 'text-muted-foreground'}`}>
                {stock.change}
            </p>
            {renderChangeIcon()}
        </div>
        <ChartContainer config={chartConfig} className="w-full h-[400px]">
            <AreaChart data={stock.data}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                    <linearGradient id="colorHistoric" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-historic)" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="var(--color-historic)" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-predicted)" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="var(--color-predicted)" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis domain={['dataMin - 10', 'dataMax + 10']} hide />
                <Tooltip content={<ChartTooltipContent />} />
                <Legend />
                <Area type="monotone" dataKey="historic" stroke="var(--color-historic)" fillOpacity={1} fill="url(#colorHistoric)" strokeWidth={2} connectNulls />
                <Area type="monotone" dataKey="predicted" stroke="var(--color-predicted)" fillOpacity={1} fill="url(#colorPredicted)" strokeDasharray="5 5" strokeWidth={2} />
            </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
