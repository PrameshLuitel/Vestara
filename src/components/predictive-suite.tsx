
"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';
import { Skeleton } from './ui/skeleton';

const generateData = (base: number) => {
    let data = [];
    let value = base;
    for (let i = 1; i <= 20; i++) {
        data.push({ date: `Day ${i}`, historic: value, predicted: null });
        value += Math.random() * 4 - 2;
    }
    
    let predictedValue = value;
    for (let i = 21; i <= 30; i++) {
        const change = Math.random() * 4 - 2;
        predictedValue += change;
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
    "LSTM": {
        AAPL: { price: "172.50", change: "+1.75 (1.02%)", changeType: "up", data: generateData(155) },
        GOOGL: { price: "135.80", change: "-0.55 (0.40%)", changeType: "down", data: generateData(125) },
        TSLA: { price: "177.60", change: "+0.24 (0.14%)", changeType: "neutral", data: generateData(175) },
    },
    "Prophet": {
        AAPL: { price: "172.45", change: "+1.70 (1.00%)", changeType: "up", data: generateData(155) },
        GOOGL: { price: "135.70", change: "-0.65 (0.48%)", changeType: "down", data: generateData(125) },
        TSLA: { price: "177.50", change: "+0.14 (0.08%)", changeType: "neutral", data: generateData(175) },
    },
    "XGBoost": {
        AAPL: { price: "172.30", change: "+1.55 (0.91%)", changeType: "up", data: generateData(155) },
        GOOGL: { price: "135.90", change: "-0.45 (0.33%)", changeType: "down", data: generateData(125) },
        TSLA: { price: "177.70", change: "+0.34 (0.19%)", changeType: "up", data: generateData(175) },
    },
    "LightGBM": {
        AAPL: { price: "172.60", change: "+1.85 (1.08%)", changeType: "up", data: generateData(155) },
        GOOGL: { price: "135.50", change: "-0.85 (0.62%)", changeType: "down", data: generateData(125) },
        TSLA: { price: "177.40", change: "+0.04 (0.02%)", changeType: "neutral", data: generateData(175) },
    },
    "Random Forest": {
        AAPL: { price: "172.05", change: "+1.30 (0.76%)", changeType: "up", data: generateData(155) },
        GOOGL: { price: "136.15", change: "-0.20 (0.15%)", changeType: "down", data: generateData(125) },
        TSLA: { price: "177.95", change: "+0.59 (0.33%)", changeType: "up", data: generateData(175) },
    },
    "Linear Regression": {
        AAPL: { price: "171.90", change: "+1.15 (0.67%)", changeType: "up", data: generateData(155) },
        GOOGL: { price: "136.30", change: "-0.05 (0.04%)", changeType: "neutral", data: generateData(125) },
        TSLA: { price: "178.50", change: "+1.14 (0.64%)", changeType: "up", data: generateData(175) },
    },
    "Exponential Smoothing": {
        AAPL: { price: "172.70", change: "+1.95 (1.14%)", changeType: "up", data: generateData(155) },
        GOOGL: { price: "135.40", change: "-0.95 (0.70%)", changeType: "down", data: generateData(125) },
        TSLA: { price: "177.00", change: "-0.36 (0.20%)", changeType: "down", data: generateData(175) },
    },
};


type ModelName = keyof typeof mockModelData;
type StockSymbol = 'AAPL' | 'GOOGL' | 'TSLA';

interface StockData {
    price: string;
    change: string;
    changeType: 'up' | 'down' | 'neutral';
    data: { date: string; historic: number | null; predicted: number | null }[];
}

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


const ModelChart = ({ modelName, modelData }: { modelName: ModelName, modelData: typeof mockModelData[ModelName] }) => {
    const [selectedStock, setSelectedStock] = useState<StockSymbol>("AAPL");
    const [loading, setLoading] = useState(false);
    const [apiData, setApiData] = useState<StockData | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setApiData(null);
            setTimeout(() => {
                setLoading(false);
            }, 500);
        };
    }, [modelName, selectedStock]);

    const stock = apiData || modelData[selectedStock];

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
    
    if (loading) {
        return (
            <div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div className="flex items-baseline gap-4">
                        <Skeleton className="h-10 w-24" />
                        <Skeleton className="h-6 w-32" />
                    </div>
                    <Skeleton className="h-10 w-full sm:w-[180px]" />
                </div>
                <Skeleton className="w-full h-[400px]" />
            </div>
        )
    }

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

const SummaryChart = ({ type }: { type: 'mean' | 'median' }) => {
    const [selectedStock, setSelectedStock] = useState<StockSymbol>("AAPL");

    const getSummaryData = (stock: StockSymbol) => {
        const models = Object.values(mockModelData);
        const referenceData = models[0][stock].data; 
        
        const summaryData = referenceData.map((point, index) => {
            const newPoint = { date: point.date, historic: point.historic, predicted: null as number | null };
            if (point.predicted !== null) {
                const predictedValues = models.map(model => model[stock].data[index]?.predicted).filter(p => p !== null && p !== undefined) as number[];
                if (predictedValues.length > 0) {
                    if (type === 'mean') {
                        const predictedSum = predictedValues.reduce((sum, value) => sum + value, 0);
                        newPoint.predicted = predictedSum / predictedValues.length;
                    } else { // median
                        const sorted = [...predictedValues].sort((a, b) => a - b);
                        const mid = Math.floor(sorted.length / 2);
                        newPoint.predicted = sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
                    }
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
    
    const analysisText = type === 'mean' 
        ? `The aggregated forecast for ${selectedStock} suggests a ${changeType === 'up' ? 'positive' : changeType === 'down' ? 'negative' : 'stable'} outlook. By averaging the predictions of ${Object.keys(mockModelData).length} different AI models, the consensus points towards a price of approximately $${lastPrediction ? lastPrediction.toFixed(2) : 'N/A'} in the next 10 days.`
        : `The median forecast for ${selectedStock} suggests a ${changeType === 'up' ? 'positive' : changeType === 'down' ? 'negative' : 'stable'} outlook. By taking the median prediction from ${Object.keys(mockModelData).length} different AI models, which reduces the impact of outliers, the consensus points to a price of approximately $${lastPrediction ? lastPrediction.toFixed(2) : 'N/A'} in the next 10 days.`;


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
                        {analysisText} This represents a potential {changeType !== 'neutral' ? `${percentageChange.toFixed(2)}%` : ''} change from the last known price of ${lastHistoric.toFixed(2)}.
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
              <TabsTrigger value="ensemble-mean">Ensemble Mean*</TabsTrigger>
              <TabsTrigger value="ensemble-median">Ensemble Median*</TabsTrigger>
            </TabsList>
          </div>
          {Object.entries(mockModelData).map(([modelName, modelData]) => (
            <TabsContent key={modelName} value={modelName} className="mt-4">
              <ModelChart modelName={modelName as ModelName} modelData={modelData as any} />
            </TabsContent>
          ))}
          <TabsContent value="ensemble-mean" className="mt-4">
              <SummaryChart type="mean" />
          </TabsContent>
          <TabsContent value="ensemble-median" className="mt-4">
              <SummaryChart type="median" />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

    

    