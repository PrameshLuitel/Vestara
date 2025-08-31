
"use client"

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { TrendingUp, TrendingDown, Minus, Info, Briefcase, BarChart, Clock, Hash } from 'lucide-react';
import { Skeleton } from './ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Badge } from './ui/badge';

const modelNames = ["LSTM", "Prophet", "XGBoost", "LightGBM", "Random Forest", "Linear Regression", "Exponential Smoothing"];
const modelKeys: {[key: string]: string} = {
    "LSTM": "LSTM",
    "Prophet": "Prophet",
    "XGBoost": "XGBoost",
    "LightGBM": "LightGBM",
    "Random Forest": "RandomForest",
    "Linear Regression": "Linear",
    "Exponential Smoothing": "ExpSmoothing",
    "Ensemble Mean": "Ensemble",
    "Ensemble Median": "EnsembleMedian",
}

interface HistoricalPoint {
    date: string;
    close: number;
    open: number;
    high: number;
    low: number;
    vol: number;
    turnover: number;
    prevClose: number;
}
interface ForecastPoint {
    date: string;
    value: number;
}
interface LatestMetrics {
    open: number;
    high: number;
    low: number;
    close: number;
    vol: number;
    turnover: number;
    prevClose: number;
    diff: number;
    range: number;
}

const chartConfig = {
    historic: { label: "Historic", color: "hsl(var(--muted-foreground))" },
    predicted: { label: "Predicted", color: "hsl(var(--primary))" },
};

const formatNumber = (num: number | undefined | null) => {
    if (num === undefined || num === null) return 'N/A';
    return new Intl.NumberFormat('en-US').format(num);
};
const formatCurrency = (num: number | undefined | null) => {
    if (num === undefined || num === null) return 'N/A';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'NPR', minimumFractionDigits: 2 }).format(num).replace('NPR', 'रू').trim();
};


const MetricCard = ({ icon, title, value, footer }: { icon: React.ReactNode, title: string, value: string, footer?: string }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            {icon}
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
            {footer && <p className="text-xs text-muted-foreground">{footer}</p>}
        </CardContent>
    </Card>
)

const ModelChart = ({ modelName, historicalData, forecastData, latestMetrics }: { modelName: string, historicalData: HistoricalPoint[], forecastData: { [key: string]: ForecastPoint[] }, latestMetrics: LatestMetrics | null }) => {
    
    const modelKey = modelKeys[modelName];
    const modelForecast = forecastData[modelKey] || [];

    const chartData = useMemo(() => {
        const data = historicalData.map(p => ({ date: p.date, historic: p.close, predicted: null }));
        const lastHistoric = data[data.length - 1];

        if (modelForecast.length > 0 && lastHistoric) {
            const bridgePoint = { date: lastHistoric.date, historic: lastHistoric.historic, predicted: lastHistoric.historic };
            const forecastPoints = modelForecast.map(p => ({ date: p.date, historic: null, predicted: p.value }));
            return [...data, bridgePoint, ...forecastPoints];
        }
        return data;
    }, [historicalData, modelForecast]);

    const lastPrediction = modelForecast.length > 0 ? modelForecast[modelForecast.length - 1].value : null;
    const lastHistoricClose = latestMetrics?.close ?? 0;

    const priceChange = lastPrediction !== null ? lastPrediction - lastHistoricClose : 0;
    const percentageChange = lastHistoricClose !== 0 ? (priceChange / lastHistoricClose) * 100 : 0;
    const changeType = percentageChange > 0.05 ? 'up' : percentageChange < -0.05 ? 'down' : 'neutral';

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
                    <h2 className="text-4xl font-bold">{lastPrediction !== null ? formatCurrency(lastPrediction) : formatCurrency(latestMetrics?.close)}</h2>
                    {lastPrediction !== null && (
                         <p className={`font-semibold ${changeType === 'up' ? 'text-green-500' : changeType === 'down' ? 'text-red-500' : 'text-muted-foreground'}`}>
                            {priceChange.toFixed(2)} ({percentageChange.toFixed(2)}%)
                        </p>
                    )}
                    {lastPrediction !== null && renderChangeIcon()}
                </div>
                 <Badge variant={lastPrediction !== null ? "default" : "secondary"}>
                    {lastPrediction !== null ? "Forecasted Price" : "Last Closing Price"}
                </Badge>
            </div>
            <ChartContainer config={chartConfig} className="w-full h-[400px]">
                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
                    <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8}tickFormatter={(tick) => new Date(tick).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
                    <YAxis domain={['dataMin - 10', 'dataMax + 10']} hide />
                    <Tooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Area type="monotone" dataKey="historic" stroke="var(--color-historic)" fillOpacity={1} fill="url(#colorHistoric)" strokeWidth={2} connectNulls />
                    <Area type="monotone" dataKey="predicted" stroke="var(--color-predicted)" fillOpacity={1} fill="url(#colorPredicted)" strokeDasharray="5 5" strokeWidth={2} connectNulls />
                </AreaChart>
            </ChartContainer>
            
             {modelName.includes("Ensemble") && latestMetrics && (
                 <Card className="mt-6">
                    <CardHeader className="flex flex-row items-center gap-2">
                        <Info className="h-5 w-5" />
                        <CardTitle>Summary Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            The aggregated {modelName.toLowerCase()} forecast suggests a {changeType === 'up' ? 'positive' : changeType === 'down' ? 'negative' : 'stable'} outlook.
                            The consensus points towards a price of approximately {formatCurrency(lastPrediction)} in the next 7 days.
                            This represents a potential {changeType !== 'neutral' ? `${percentageChange.toFixed(2)}%` : ''} change from the last known price of {formatCurrency(latestMetrics.close)}.
                        </p>
                    </CardContent>
                </Card>
             )}
        </div>
    );
};

export default function PredictiveSuite() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedStock, setSelectedStock] = useState<string>("UPPER");
    const [symbols, setSymbols] = useState<string[]>(["UPPER"]);
    const [historicalData, setHistoricalData] = useState<HistoricalPoint[]>([]);
    const [forecastData, setForecastData] = useState<{ [key: string]: ForecastPoint[] }>({});
    const [latestMetrics, setLatestMetrics] = useState<LatestMetrics | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`/api/stock-data?symbol=${selectedStock}`);
                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.error || `Failed to fetch data for ${selectedStock}`);
                }
                const data = await res.json();
                setHistoricalData(data.historical);
                setForecastData(data.forecast);
                setLatestMetrics(data.latest_metrics);
                if (data.symbols && symbols.length <= 1) {
                    setSymbols(data.symbols);
                }
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedStock]);

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-3/5" />
                    <Skeleton className="h-4 w-4/5" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                             <div className="flex items-baseline gap-4">
                                <Skeleton className="h-10 w-24" />
                                <Skeleton className="h-6 w-32" />
                            </div>
                            <Skeleton className="h-10 w-full sm:w-[180px]" />
                         </div>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            {[...Array(4)].map((_, i) => (
                                <Card key={i}>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <Skeleton className="h-5 w-20" />
                                        <Skeleton className="h-6 w-6" />
                                    </CardHeader>
                                    <CardContent>
                                        <Skeleton className="h-8 w-24" />
                                        <Skeleton className="h-3 w-28 mt-2" />
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                        <Skeleton className="w-full h-[400px]" />
                    </div>
                </CardContent>
            </Card>
        );
    }
    
    if (error) {
        return (
             <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">Predictive Analysis</CardTitle>
                    <CardDescription>An error occurred while fetching data.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Alert variant="destructive">
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                    <div className="mt-4">
                        <Select onValueChange={setSelectedStock} defaultValue={selectedStock}>
                            <SelectTrigger className="w-full sm:w-[180px]">
                                <SelectValue placeholder="Select a stock" />
                            </SelectTrigger>
                            <SelectContent>
                                {symbols.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
             </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div>
                        <CardTitle className="font-headline text-2xl">Predictive Analysis for {selectedStock}</CardTitle>
                        <CardDescription>Historical data and 7-day future price predictions using various AI models.</CardDescription>
                    </div>
                    <Select onValueChange={setSelectedStock} defaultValue={selectedStock}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Select a stock" />
                        </SelectTrigger>
                        <SelectContent>
                            {symbols.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>
            <CardContent>
                {latestMetrics && (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
                        <MetricCard icon={<Briefcase className="h-4 w-4 text-muted-foreground" />} title="Open" value={formatCurrency(latestMetrics.open)} footer={`High: ${formatCurrency(latestMetrics.high)} / Low: ${formatCurrency(latestMetrics.low)}`}/>
                        <MetricCard icon={<BarChart className="h-4 w-4 text-muted-foreground" />} title="Volume" value={formatNumber(latestMetrics.vol)} footer={`Turnover: ${formatCurrency(latestMetrics.turnover)}`} />
                        <MetricCard icon={<Clock className="h-4 w-4 text-muted-foreground" />} title="Previous Close" value={formatCurrency(latestMetrics.prevClose)} footer={`Day Change: ${formatCurrency(latestMetrics.diff)}`} />
                        <MetricCard icon={<Hash className="h-4 w-4 text-muted-foreground" />} title="Day Range" value={formatCurrency(latestMetrics.range)} footer={`From ${formatCurrency(latestMetrics.low)} to ${formatCurrency(latestMetrics.high)}`}/>
                    </div>
                )}
                <Tabs defaultValue="LSTM" className="w-full">
                    <div className="overflow-x-auto pb-2">
                        <TabsList>
                            {modelNames.map(modelName => (
                                <TabsTrigger key={modelName} value={modelName}>{modelName}</TabsTrigger>
                            ))}
                            <TabsTrigger value="ensemble-mean">Ensemble Mean</TabsTrigger>
                            <TabsTrigger value="ensemble-median">Ensemble Median</TabsTrigger>
                        </TabsList>
                    </div>
                    {modelNames.map(modelName => (
                        <TabsContent key={modelName} value={modelName} className="mt-4">
                            <ModelChart modelName={modelName} historicalData={historicalData} forecastData={forecastData} latestMetrics={latestMetrics} />
                        </TabsContent>
                    ))}
                    <TabsContent value="ensemble-mean" className="mt-4">
                        <ModelChart modelName="Ensemble Mean" historicalData={historicalData} forecastData={forecastData} latestMetrics={latestMetrics} />
                    </TabsContent>
                    <TabsContent value="ensemble-median" className="mt-4">
                        <ModelChart modelName="Ensemble Median" historicalData={historicalData} forecastData={forecastData} latestMetrics={latestMetrics} />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
