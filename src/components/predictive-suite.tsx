
"use client"

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Area, AreaChart, Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { TrendingUp, TrendingDown, Minus, Info, Briefcase, BarChart, Clock, Hash, Search } from 'lucide-react';
import { Skeleton } from './ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Badge } from './ui/badge';
import { Input } from './ui/input';

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

const chartConfigSingle = {
    historic: { label: "Historic", color: "hsl(var(--muted-foreground))" },
    predicted: { label: "Predicted", color: "hsl(var(--primary))" },
};
const chartConfigAll = {
    historic: { label: "Historic", color: "hsl(var(--muted-foreground))" },
    LSTM: { label: "LSTM", color: "hsl(var(--chart-1))" },
    Prophet: { label: "Prophet", color: "hsl(var(--chart-2))" },
    XGBoost: { label: "XGBoost", color: "hsl(var(--chart-3))" },
    LightGBM: { label: "LightGBM", color: "hsl(var(--chart-4))" },
    RandomForest: { label: "Random Forest", color: "hsl(var(--chart-5))" },
    Linear: { label: "Linear", color: "hsl(var(--accent))" },
    ExpSmoothing: { label: "Exp. Smoothing", color: "hsl(var(--foreground))" },
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
            <ChartContainer config={chartConfigSingle} className="w-full h-[400px]">
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

const AllModelsChart = ({ historicalData, forecastData }: { historicalData: HistoricalPoint[], forecastData: { [key: string]: ForecastPoint[] } }) => {
    const chartData = useMemo(() => {
        let combinedData: any[] = historicalData.map(p => ({ date: p.date, historic: p.close }));

        const lastHistoric = combinedData[combinedData.length - 1];
        if (!lastHistoric) return combinedData;

        // Create a map for quick date lookups
        const dateMap = new Map(combinedData.map(p => [p.date, p]));
        
        Object.entries(forecastData).forEach(([modelKey, modelPoints]) => {
            if (!modelKeys[modelKey as keyof typeof modelKeys]) { // Skip Ensemble models for clarity
                 // Use the modelKey directly if it's one of the base models like "LSTM", "Prophet", etc.
                const validModelKey = Object.keys(modelKeys).find(k => modelKeys[k] === modelKey);
                if (validModelKey) {
                    const bridgePoint = { date: lastHistoric.date, [modelKey]: lastHistoric.historic };
                    if (dateMap.has(bridgePoint.date)) {
                        Object.assign(dateMap.get(bridgePoint.date)!, { [modelKey]: bridgePoint[modelKey] });
                    }

                    modelPoints.forEach(p => {
                        if (dateMap.has(p.date)) {
                            Object.assign(dateMap.get(p.date)!, { [modelKey]: p.value });
                        } else {
                            dateMap.set(p.date, { date: p.date, [modelKey]: p.value });
                        }
                    });
                }
            }
        });
        
        return Array.from(dateMap.values()).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [historicalData, forecastData]);

    return (
         <div>
            <div className="mb-6">
                <h2 className="text-2xl font-bold">All Models Forecast Comparison</h2>
                <p className="text-muted-foreground">Comparative view of all predictive models against historical data.</p>
            </div>
            <ChartContainer config={chartConfigAll} className="w-full h-[400px]">
                <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(tick) => new Date(tick).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
                    <YAxis domain={['dataMin - 20', 'dataMax + 20']} hide />
                    <Tooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Line type="monotone" dataKey="historic" stroke="var(--color-historic)" strokeWidth={2} dot={false} />
                    {Object.values(modelKeys).filter(k => k !== 'Ensemble' && k !== 'EnsembleMedian').map((key) => (
                        <Line key={key} type="monotone" dataKey={key} stroke={`var(--color-${key})`} strokeWidth={2} strokeDasharray="5 5" dot={false} connectNulls />
                    ))}
                </LineChart>
            </ChartContainer>
        </div>
    );
};


export default function PredictiveSuite() {
    const [symbols, setSymbols] = useState<string[]>([]);
    const [filteredSymbols, setFilteredSymbols] = useState<string[]>([]);
    const [selectedStock, setSelectedStock] = useState<string>("UPPER");
    const [searchQuery, setSearchQuery] = useState("");
    const [stockData, setStockData] = useState<{
        historical: HistoricalPoint[];
        forecast: { [key: string]: ForecastPoint[] };
        latestMetrics: LatestMetrics | null;
    } | null>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [initialLoad, setInitialLoad] = useState(true);

    useEffect(() => {
        const fetchSymbols = async () => {
            try {
                const res = await fetch(`/api/stock-data?symbol=UPPER`); 
                if (!res.ok) {
                    throw new Error('Failed to fetch symbol list');
                }
                const data = await res.json();
                if (data.symbols) {
                    setSymbols(data.symbols);
                    setFilteredSymbols(data.symbols);
                }
            } catch (err: any) {
                 setError('Could not load stock list. Please refresh the page.');
            }
        };
        fetchSymbols();
    }, []);

    useEffect(() => {
        if (!selectedStock) return;

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
                setStockData({
                    historical: data.historical,
                    forecast: data.forecast,
                    latestMetrics: data.latest_metrics
                });
            } catch (err: any) {
                setError(err.message);
                setStockData(null);
            } finally {
                setLoading(false);
                if(initialLoad) setInitialLoad(false);
            }
        };

        fetchData();
    }, [selectedStock, initialLoad]);
    
    useEffect(() => {
        const lowerCaseQuery = searchQuery.toLowerCase();
        setFilteredSymbols(
            symbols.filter(s => s.toLowerCase().includes(lowerCaseQuery))
        );
    }, [searchQuery, symbols]);

    if (initialLoad || (loading && !stockData && !error)) {
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

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <CardTitle className="font-headline text-2xl">Predictive Analysis for {selectedStock}</CardTitle>
                        <CardDescription>Historical data and 7-day future price predictions using various AI models.</CardDescription>
                    </div>
                    <div className="w-full sm:w-auto flex flex-col gap-2">
                        <div className="relative">
                            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input 
                                placeholder="Search symbol..."
                                className="w-full sm:w-[180px] pl-8"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Select onValueChange={setSelectedStock} defaultValue={selectedStock} disabled={symbols.length === 0}>
                            <SelectTrigger className="w-full sm:w-[180px]">
                                <SelectValue placeholder="Select a stock" />
                            </SelectTrigger>
                            <SelectContent>
                                {filteredSymbols.length > 0 ? (
                                    filteredSymbols.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)
                                ) : (
                                    <SelectItem value="no-results" disabled>No symbols found</SelectItem>
                                )}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                 {loading ? (
                    <div className="text-center p-8">
                        <p>Loading data for {selectedStock}...</p>
                    </div>
                 ) : error ? (
                    <Alert variant="destructive">
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                 ) : stockData && stockData.historical.length > 0 ? (
                    <>
                        {stockData.latestMetrics && (
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
                                <MetricCard icon={<Briefcase className="h-4 w-4 text-muted-foreground" />} title="Open" value={formatCurrency(stockData.latestMetrics.open)} footer={`High: ${formatCurrency(stockData.latestMetrics.high)} / Low: ${formatCurrency(stockData.latestMetrics.low)}`}/>
                                <MetricCard icon={<BarChart className="h-4 w-4 text-muted-foreground" />} title="Volume" value={formatNumber(stockData.latestMetrics.vol)} footer={`Turnover: ${formatCurrency(stockData.latestMetrics.turnover)}`} />
                                <MetricCard icon={<Clock className="h-4 w-4 text-muted-foreground" />} title="Previous Close" value={formatCurrency(stockData.latestMetrics.prevClose)} footer={`Day Change: ${formatCurrency(stockData.latestMetrics.diff)}`} />
                                <MetricCard icon={<Hash className="h-4 w-4 text-muted-foreground" />} title="Day Range" value={formatCurrency(stockData.latestMetrics.range)} footer={`From ${formatCurrency(stockData.latestMetrics.low)} to ${formatCurrency(stockData.latestMetrics.high)}`}/>
                            </div>
                        )}
                        <Tabs defaultValue="all-models" className="w-full">
                            <div className="overflow-x-auto pb-2">
                                <TabsList>
                                    <TabsTrigger value="all-models">All Models</TabsTrigger>
                                    {modelNames.map(modelName => (
                                        <TabsTrigger key={modelName} value={modelName}>{modelName}</TabsTrigger>
                                    ))}
                                    <TabsTrigger value="ensemble-mean">Ensemble Mean</TabsTrigger>
                                    <TabsTrigger value="ensemble-median">Ensemble Median</TabsTrigger>
                                </TabsList>
                            </div>
                             <TabsContent value="all-models" className="mt-4">
                                <AllModelsChart historicalData={stockData.historical} forecastData={stockData.forecast} />
                            </TabsContent>
                            {modelNames.map(modelName => (
                                <TabsContent key={modelName} value={modelName} className="mt-4">
                                    <ModelChart modelName={modelName} historicalData={stockData.historical} forecastData={stockData.forecast} latestMetrics={stockData.latestMetrics} />
                                </TabsContent>
                            ))}
                            <TabsContent value="ensemble-mean" className="mt-4">
                                <ModelChart modelName="Ensemble Mean" historicalData={stockData.historical} forecastData={stockData.forecast} latestMetrics={stockData.latestMetrics} />
                            </TabsContent>
                            <TabsContent value="ensemble-median" className="mt-4">
                                <ModelChart modelName="Ensemble Median" historicalData={stockData.historical} forecastData={stockData.forecast} latestMetrics={stockData.latestMetrics} />
                            </TabsContent>
                        </Tabs>
                    </>
                ) : (
                    <div className="text-center p-8">
                        <p>No data available for {selectedStock}. Please select another stock.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

    
