

"use client"

import { useState, useEffect, useMemo, useCallback } from 'react';
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
import * as xlsx from 'xlsx';
import LoadingAnimation from './loading-animation';

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
interface StockData {
    historical: { [symbol: string]: HistoricalPoint[] };
    forecast: { [symbol: string]: { [model: string]: ForecastPoint[] } };
}

// --- Data Fetching Logic (moved from API route) ---

function getSheetName(daysAgo = 0) {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}_${month}_${day}`;
}

async function getHistoricalData() {
    const historicalUrl = 'https://omitnomis.github.io/ShareSansarScraper/Data/combined_excel.xlsx';
    try {
        const response = await fetch(historicalUrl);
        if (!response.ok) throw new Error(`Failed to fetch historical data workbook. Status: ${response.status}`);
        
        const arrayBuffer = await response.arrayBuffer();
        const workbook = xlsx.read(arrayBuffer, { type: 'buffer' });
        
        const data: { [symbol: string]: any[] } = {};
        let daysChecked = 0;
        const daysToPull = 10;

        for (let i = 0; daysChecked < daysToPull && i < 30; i++) {
            const sheetName = getSheetName(i);
            const worksheet = workbook.Sheets[sheetName];
            if (worksheet) {
                const jsonData = xlsx.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
                
                jsonData.slice(1).forEach(row => {
                    const symbol = row[1];
                    if (symbol) {
                        if (!data[symbol]) data[symbol] = [];
                        data[symbol].push({
                            date: sheetName.replace(/_/g, '-'),
                            symbol: row[1],
                            conf: row[2],
                            open: row[3],
                            high: row[4],
                            low: row[5],
                            close: row[6],
                            ltp: row[7],
                            vol: row[11],
                            prevClose: row[12],
                            turnover: row[13],
                            trans: row[14],
                            diff: row[15],
                            range: row[16],
                        });
                    }
                });
                daysChecked++;
            }
        }
        
        for (const symbol in data) {
            data[symbol].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        }
        return data;
    } catch (error) {
        console.error('Error fetching historical data:', error);
        throw error;
    }
}

async function getForecastData() {
    const spreadsheetId = '1saWAgJlfvu22QSHI4_Fe8yenRVHHpsErVM7f3l4_Wjk';
    const apiKey = 'AIzaSyD56ax5a7x40wjfv6tW8wEmn6Z5PUuFZgg';

    if (!apiKey) {
        throw new Error('Google Sheets API key is not configured. Please set NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY in next.config.ts');
    }

    try {
        const metaUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?key=${apiKey}`;
        const metaResponse = await fetch(metaUrl);
        if (!metaResponse.ok) throw new Error(`Failed to fetch Google Sheets metadata. Status: ${metaResponse.status}`);
        const metaData = await metaResponse.json();
        
        const dateSheetRegex = /^\d{4}_\d{2}_\d{2}$/;
        const latestSheetName = metaData.sheets
            .map((sheet: any) => sheet.properties.title)
            .filter((name: string) => dateSheetRegex.test(name))
            .sort((a: string, b: string) => b.localeCompare(a))[0];

        if (!latestSheetName) throw new Error('No forecast sheet with format YYYY_MM_DD found.');

        const dataUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${latestSheetName}?key=${apiKey}`;
        const dataResponse = await fetch(dataUrl);
        if (!dataResponse.ok) throw new Error(`Failed to fetch data from sheet ${latestSheetName}. Status: ${dataResponse.status}`);
        const sheetData = await dataResponse.json();

        if (!sheetData.values || sheetData.values.length < 2) throw new Error('Sheet contains no data or only a header row.');

        const headers = sheetData.values[0];
        const rows = sheetData.values.slice(1);
        const data: { [symbol: string]: any } = {};
        const symbolIndex = headers.indexOf('Symbol');
        const dateIndex = headers.indexOf('Date');
        if (symbolIndex === -1 || dateIndex === -1) throw new Error('Sheet must contain "Symbol" and "Date" columns.');

        rows.forEach((row: any[]) => {
            const symbol = row[symbolIndex];
            if (!symbol) return;
            if (!data[symbol]) {
                data[symbol] = {};
                headers.slice(2).forEach((header: string) => {
                    const modelKey = header.replace(/\s/g, '');
                    data[symbol][modelKey] = [];
                });
            }
            const dateValue = row[dateIndex];
            let formattedDate;
            if (typeof dateValue === 'number') {
                const jsTimestamp = (dateValue - 25569) * 86400 * 1000;
                formattedDate = new Date(jsTimestamp).toISOString().split('T')[0];
            } else {
                formattedDate = new Date(dateValue).toISOString().split('T')[0];
            }
            headers.slice(2).forEach((header: string, index: number) => {
                const modelKey = header.replace(/\s/g, '');
                const value = parseFloat(row[index + 2]);
                if (!isNaN(value)) {
                    data[symbol][modelKey].push({ date: formattedDate, value });
                }
            });
        });
        return data;
    } catch (error) {
        console.error('Error fetching forecast data:', error);
        throw error;
    }
}

// --- End of Data Fetching Logic ---


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
    RandomForest: { label: "RandomForest", color: "hsl(var(--chart-5))" },
    Linear: { label: "Linear", color: "hsl(var(--accent))" },
    ExpSmoothing: { label: "ExpSmoothing", color: "hsl(var(--foreground))" },
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
        const lastHistoric = data.length > 0 ? data[data.length - 1] : null;

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

        const lastHistoric = combinedData.length > 0 ? combinedData[combinedData.length - 1] : null;
        if (!lastHistoric) return combinedData;

        const dateMap = new Map(combinedData.map(p => [p.date, p]));
        
        Object.entries(forecastData).forEach(([modelKey, modelPoints]) => {
            const validModelKey = Object.keys(modelKeys).find(k => modelKeys[k] === modelKey);
            if (validModelKey && modelKey !== 'Ensemble' && modelKey !== 'EnsembleMedian') {
                const bridgePoint = { date: lastHistoric.date, [modelKey]: lastHistoric.historic };
                if (dateMap.has(bridgePoint.date)) {
                    Object.assign(dateMap.get(bridgePoint.date)!, { [modelKey]: bridgePoint[modelKey] });
                }

                modelPoints.forEach(p => {
                    if (dateMap.has(p.date)) {
                        Object.assign(dateMap.get(p.date)!, { [modelKey]: p.value });
                    } else {
                        const newPoint: { [key: string]: any } = { date: p.date };
                        newPoint[modelKey] = p.value;
                        dateMap.set(p.date, newPoint);
                    }
                });
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
                    {Object.values(modelKeys).filter(k => k !== 'Ensemble' && k !== 'EnsembleMedian').map((key) => {
                       const chartKey = Object.keys(chartConfigAll).find(cKey => cKey === key)
                       if(!chartKey) return null;
                       return (
                        <Line key={key} type="monotone" dataKey={key} stroke={`var(--color-${chartKey})`} strokeWidth={2} strokeDasharray="5 5" dot={false} connectNulls />
                       )
                    })}
                </LineChart>
            </ChartContainer>
        </div>
    );
};


export default function PredictiveSuite() {
    const [allData, setAllData] = useState<StockData | null>(null);
    const [symbols, setSymbols] = useState<string[]>([]);
    const [filteredSymbols, setFilteredSymbols] = useState<string[]>([]);
    const [selectedStock, setSelectedStock] = useState<string>("UPPER");
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [initialLoad, setInitialLoad] = useState(true);

    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);
            setError(null);
            try {
                const [historical, forecast] = await Promise.all([
                    getHistoricalData(),
                    getForecastData(),
                ]);
                
                const stockSymbols = Object.keys(historical || {}).sort();
                setSymbols(stockSymbols);
                setFilteredSymbols(stockSymbols);
                setAllData({ historical, forecast });

            } catch (err: any) {
                setError(err.message || 'An unknown error occurred while fetching data.');
            } finally {
                setLoading(false);
                setInitialLoad(false);
            }
        };

        fetchAllData();
    }, []);
    
    useEffect(() => {
        const upperCaseQuery = searchQuery.toUpperCase();
        const newFilteredSymbols = symbols.filter(s => s.toUpperCase().includes(upperCaseQuery));
        setFilteredSymbols(newFilteredSymbols);
        
        if (symbols.includes(upperCaseQuery) && selectedStock !== upperCaseQuery) {
            setSelectedStock(upperCaseQuery);
        }
    }, [searchQuery, symbols, selectedStock]);

    const currentStockData = useMemo(() => {
        if (!allData || !selectedStock) return null;
        
        const historical = allData.historical[selectedStock] || [];
        const forecast = allData.forecast[selectedStock] || {};
        const latestMetrics = historical.length > 0 ? historical[historical.length - 1] as unknown as LatestMetrics : null;

        return { historical, forecast, latestMetrics };
    }, [allData, selectedStock]);


    if (initialLoad) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <LoadingAnimation />
            </div>
        )
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
                        <Select onValueChange={(value) => { setSelectedStock(value); setSearchQuery(value); }} value={selectedStock} disabled={symbols.length === 0}>
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
                 {loading && !allData ? (
                    <div className="text-center p-8">
                        <p>Loading initial data...</p>
                    </div>
                 ) : error ? (
                    <Alert variant="destructive">
                      <AlertTitle>Error Fetching Data</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                 ) : currentStockData ? (
                    <>
                        {currentStockData.latestMetrics && (
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
                                <MetricCard icon={<Briefcase className="h-4 w-4 text-muted-foreground" />} title="Open" value={formatCurrency(currentStockData.latestMetrics.open)} footer={`High: ${formatCurrency(currentStockData.latestMetrics.high)} / Low: ${formatCurrency(currentStockData.latestMetrics.low)}`}/>
                                <MetricCard icon={<BarChart className="h-4 w-4 text-muted-foreground" />} title="Volume" value={formatNumber(currentStockData.latestMetrics.vol)} footer={`Turnover: ${formatCurrency(currentStockData.latestMetrics.turnover)}`} />
                                <MetricCard icon={<Clock className="h-4 w-4 text-muted-foreground" />} title="Previous Close" value={formatCurrency(currentStockData.latestMetrics.prevClose)} footer={`Day Change: ${formatCurrency(currentStockData.latestMetrics.diff)}`} />
                                <MetricCard icon={<Hash className="h-4 w-4 text-muted-foreground" />} title="Day Range" value={formatCurrency(currentStockData.latestMetrics.range)} footer={`From ${formatCurrency(currentStockData.latestMetrics.low)} to ${formatCurrency(currentStockData.latestMetrics.high)}`}/>
                            </div>
                        )}
                        <Tabs defaultValue="all-models" className="w-full">
                            <div className="overflow-x-auto pb-2">
                                <TabsList>
                                    <TabsTrigger value="all-models">All Models</TabsTrigger>
                                    <TabsTrigger value="ensemble-mean">Ensemble Mean</TabsTrigger>
                                    <TabsTrigger value="ensemble-median">Ensemble Median</TabsTrigger>
                                    {modelNames.map(modelName => (
                                        <TabsTrigger key={modelName} value={modelName}>{modelName}</TabsTrigger>
                                    ))}
                                </TabsList>
                            </div>
                             <TabsContent value="all-models" className="mt-4">
                                <AllModelsChart historicalData={currentStockData.historical} forecastData={currentStockData.forecast} />
                            </TabsContent>
                             <TabsContent value="ensemble-mean" className="mt-4">
                                <ModelChart modelName="Ensemble Mean" historicalData={currentStockData.historical} forecastData={currentStockData.forecast} latestMetrics={currentStockData.latestMetrics} />
                            </TabsContent>
                            <TabsContent value="ensemble-median" className="mt-4">
                                <ModelChart modelName="Ensemble Median" historicalData={currentStockData.historical} forecastData={currentStockData.forecast} latestMetrics={currentStockData.latestMetrics} />
                            </TabsContent>
                            {modelNames.map(modelName => (
                                <TabsContent key={modelName} value={modelName} className="mt-4">
                                    <ModelChart modelName={modelName} historicalData={currentStockData.historical} forecastData={currentStockData.forecast} latestMetrics={currentStockData.latestMetrics} />
                                </TabsContent>
                            ))}
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

