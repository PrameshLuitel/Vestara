
"use client"

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';

const generateData = (base: number) => {
    let data = [];
    let value = base;
    for (let i = 1; i <= 20; i++) {
        data.push({ date: `Day ${i}`, historic: value, predicted: null });
        value += Math.random() * 4 - 2;
    }
    
    let predictedValue = value;
    for (let i = 21; i <= 30; i++) {
        predictedValue += Math.random() * 4 - 2;
        data.push({ date: `Day ${i}`, historic: null, predicted: predictedValue });
    }

    const lastHistoric = data.findLast(p => p.historic !== null);
    const firstPredicted = data.find(p => p.predicted !== null);
    if(lastHistoric && firstPredicted) {
        const bridgePointIndex = data.indexOf(firstPredicted) -1;
        data[bridgePointIndex].predicted = lastHistoric.historic;
    }

    return data;
};

const mockModelData = {
    LSTM: {
        AAPL: { price: "172.50", change: "+1.75 (1.02%)", changeType: "up", data: generateData(155) },
        GOOGL: { price: "135.80", change: "-0.55 (0.40%)", changeType: "down", data: generateData(125) },
        TSLA: { price: "177.60", change: "+0.24 (0.14%)", changeType: "neutral", data: generateData(160) },
    },
    Prophet: {
        AAPL: { price: "172.45", change: "+1.70 (1.00%)", changeType: "up", data: generateData(155) },
        GOOGL: { price: "135.70", change: "-0.65 (0.48%)", changeType: "down", data: generateData(125) },
        TSLA: { price: "177.50", change: "+0.14 (0.08%)", changeType: "neutral", data: generateData(160) },
    },
    XGBoost: {
        AAPL: { price: "172.30", change: "+1.55 (0.91%)", changeType: "up", data: generateData(155) },
        GOOGL: { price: "135.90", change: "-0.45 (0.33%)", changeType: "down", data: generateData(125) },
        TSLA: { price: "177.70", change: "+0.34 (0.19%)", changeType: "up", data: generateData(160) },
    },
    LightGBM: {
        AAPL: { price: "172.60", change: "+1.85 (1.08%)", changeType: "up", data: generateData(155) },
        GOOGL: { price: "135.50", change: "-0.85 (0.62%)", changeType: "down", data: generateData(125) },
        TSLA: { price: "177.40", change: "+0.04 (0.02%)", changeType: "neutral", data: generateData(160) },
    },
    TCN: {
        AAPL: { price: "172.20", change: "+1.45 (0.85%)", changeType: "up", data: generateData(155) },
        GOOGL: { price: "136.00", change: "-0.35 (0.26%)", changeType: "down", data: generateData(125) },
        TSLA: { price: "177.80", change: "+0.44 (0.25%)", changeType: "up", data: generateData(160) },
    },
    AutoML: {
        AAPL: { price: "172.10", change: "+1.35 (0.79%)", changeType: "up", data: generateData(155) },
        GOOGL: { price: "136.10", change: "-0.25 (0.18%)", changeType: "down", data: generateData(125) },
        TSLA: { price: "177.90", change: "+0.54 (0.30%)", changeType: "up", data: generateData(160) },
    },
    "Random Forest": {
        AAPL: { price: "172.05", change: "+1.30 (0.76%)", changeType: "up", data: generateData(155) },
        GOOGL: { price: "136.15", change: "-0.20 (0.15%)", changeType: "down", data: generateData(125) },
        TSLA: { price: "177.95", change: "+0.59 (0.33%)", changeType: "up", data: generateData(160) },
    },
    DQN: {
        AAPL: { price: "172.80", change: "+2.05 (1.20%)", changeType: "up", data: generateData(155) },
        GOOGL: { price: "135.30", change: "-1.05 (0.77%)", changeType: "down", data: generateData(125) },
        TSLA: { price: "177.20", change: "-0.16 (0.09%)", changeType: "down", data: generateData(160) },
    },
};

type ModelName = keyof typeof mockModelData;
type StockSymbol = 'AAPL' | 'GOOGL' | 'TSLA';

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


const ModelChart = ({ modelData }: { modelData: typeof mockModelData[ModelName] }) => {
    const [selectedStock, setSelectedStock] = useState<StockSymbol>("AAPL");
    const stock = modelData[selectedStock];

    const renderChangeIcon = () => {
        switch (stock.changeType) {
        case "up":
            return <TrendingUp className="h-6 w-6 text-green-500" />;
        case "down":
            return <TrendingDown className="h-6 w-6 text-red-500" />;
        default:
            return <Minus className="h-6 w-6 text-muted-foreground" />;
        }
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                 <div className="flex items-baseline gap-4">
                    <h2 className="text-4xl font-bold">{stock.price}</h2>
                    <p className={`font-semibold ${stock.changeType === 'up' ? 'text-green-500' : stock.changeType === 'down' ? 'text-red-500' : 'text-muted-foreground'}`}>
                        {stock.change}
                    </p>
                    {renderChangeIcon()}
                </div>
                <Select onValueChange={(value) => setSelectedStock(value as StockSymbol)} defaultValue={selectedStock}>
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
                    <ChartLegend content={<ChartLegendContent />} />
                    <Area type="monotone" dataKey="historic" stroke="var(--color-historic)" fillOpacity={1} fill="url(#colorHistoric)" strokeWidth={2} connectNulls />
                    <Area type="monotone" dataKey="predicted" stroke="var(--color-predicted)" fillOpacity={1} fill="url(#colorPredicted)" strokeDasharray="5 5" strokeWidth={2} connectNulls />
                </AreaChart>
            </ChartContainer>
        </div>
    );
};

const SummaryChart = () => {
    const [selectedStock, setSelectedStock] = useState<StockSymbol>("AAPL");

    const getSummaryData = (stock: StockSymbol) => {
        const models = Object.values(mockModelData);
        const referenceData = models[0][stock].data; 
        
        const summaryData = referenceData.map((point, index) => {
            const newPoint = { date: point.date, historic: point.historic, predicted: null as number | null };
            if (point.predicted !== null) {
                const predictedValues = models.map(model => model[stock].data[index]?.predicted).filter(p => p !== null && p !== undefined) as number[];
                if (predictedValues.length > 0) {
                    const predictedSum = predictedValues.reduce((sum, value) => sum + value, 0);
                    newPoint.predicted = predictedSum / predictedValues.length;
                }
            }
            return newPoint;
        });

        const lastHistoric = summaryData.findLast(p => p.historic !== null);
        const firstPredictedIndex = summaryData.findIndex(p => p.predicted !== null);
        if (lastHistoric && firstPredictedIndex > 0) {
            summaryData[firstPredictedIndex - 1].predicted = lastHistoric.historic;
        }

        return summaryData;
    }

    const summaryData = getSummaryData(selectedStock);
    const lastPrediction = summaryData[summaryData.length - 1].predicted;
    const firstPredictionPoint = summaryData.find(p => p.predicted !== null);
    const firstPrediction = firstPredictionPoint?.predicted || 0;
    const lastHistoricPoint = summaryData.findLast(p => p.historic !== null);
    const lastHistoric = lastHistoricPoint?.historic || 0;
    
    const priceChange = lastPrediction ? lastPrediction - lastHistoric : 0;
    const percentageChange = lastHistoric !== 0 ? (priceChange / lastHistoric) * 100 : 0;
    const changeType = priceChange > 0.05 ? 'up' : priceChange < -0.05 ? 'down' : 'neutral';

    const renderChangeIcon = () => {
        switch (changeType) {
            case "up": return <TrendingUp className="h-6 w-6 text-green-500" />;
            case "down": return <TrendingDown className="h-6 w-6 text-red-500" />;
            default: return <Minus className="h-6 w-6 text-muted-foreground" />;
        }
    };

    return (
         <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div className="flex items-baseline gap-4">
                    <h2 className="text-4xl font-bold">{lastPrediction ? lastPrediction.toFixed(2) : '...'}</h2>
                     <p className={`font-semibold ${changeType === 'up' ? 'text-green-500' : changeType === 'down' ? 'text-red-500' : 'text-muted-foreground'}`}>
                        {priceChange.toFixed(2)} ({percentageChange.toFixed(2)}%)
                    </p>
                    {renderChangeIcon()}
                </div>
                <Select onValueChange={(value) => setSelectedStock(value as StockSymbol)} defaultValue={selectedStock}>
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
            <ChartContainer config={chartConfig} className="w-full h-[400px]">
                <AreaChart data={summaryData}
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
                    <ChartLegend content={<ChartLegendContent />} />
                    <Area type="monotone" dataKey="historic" stroke="var(--color-historic)" fillOpacity={1} fill="url(#colorHistoric)" strokeWidth={2} connectNulls />
                    <Area type="monotone" dataKey="predicted" stroke="var(--color-predicted)" fillOpacity={1} fill="url(#colorPredicted)" strokeDasharray="5 5" strokeWidth={2} connectNulls />
                </AreaChart>
            </ChartContainer>
            <Card className="mt-6">
                <CardHeader className="flex flex-row items-center gap-2">
                    <Info className="h-5 w-5" />
                    <CardTitle>Summary Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        The aggregated forecast for <span className="font-semibold text-foreground">{selectedStock}</span> suggests a {changeType === 'up' ? 'positive' : changeType === 'down' ? 'negative' : 'stable'} outlook. 
                        By averaging the predictions of {Object.keys(mockModelData).length} different AI models, the consensus points towards a price of approximately <span className="font-semibold text-foreground">${lastPrediction ? lastPrediction.toFixed(2) : 'N/A'}</span> in the next 10 days.
                        This represents a potential {changeType !== 'neutral' ? `${percentageChange.toFixed(2)}%` : ''} change from the last known price of ${lastHistoric.toFixed(2)}.
                    </p>
                </CardContent>
            </Card>
             <div className="mt-4 text-center">
                <p className="text-xs text-muted-foreground">
                    *This is the summary of all the other predictive models.
                </p>
            </div>
        </div>
    );
};


export default function PredictiveSuite() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Predictive Analysis</CardTitle>
        <CardDescription>Historical data and future price predictions using various AI models.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="LSTM" className="w-full">
          <div className="overflow-x-auto pb-2">
            <TabsList>
              {Object.keys(mockModelData).map(modelName => (
                  <TabsTrigger key={modelName} value={modelName}>{modelName}</TabsTrigger>
              ))}
              <TabsTrigger value="summary">Summary*</TabsTrigger>
            </TabsList>
          </div>
          {Object.entries(mockModelData).map(([modelName, modelData]) => (
            <TabsContent key={modelName} value={modelName} className="mt-4">
              <ModelChart modelData={modelData as any} />
            </TabsContent>
          ))}
          <TabsContent value="summary" className="mt-4">
              <SummaryChart />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
