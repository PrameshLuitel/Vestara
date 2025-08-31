
import { NextResponse } from 'next/server';
import xlsx from 'xlsx';

// Helper function to get the sheet name for the date N days ago
function getSheetName(daysAgo = 0) {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}_${month}_${day}`;
}

// Cache to store fetched data to avoid refetching on every request
const CACHE = {
    historical: null,
    forecast: null,
    lastFetch: 0,
};
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

async function getHistoricalData() {
    const now = Date.now();
    if (CACHE.historical && (now - CACHE.lastFetch < CACHE_DURATION)) {
        return CACHE.historical;
    }

    const historicalUrl = 'https://omitnomis.github.io/ShareSansarScraper/Data/combined_excel.xlsx';
    
    try {
        const response = await fetch(historicalUrl, { next: { revalidate: 3600 } });
        if (!response.ok) {
            console.error(`Failed to fetch historical data workbook. Status: ${response.status}`);
            return null;
        }
        const arrayBuffer = await response.arrayBuffer();
        const workbook = xlsx.read(arrayBuffer, { type: 'buffer' });
        
        const data: { [symbol: string]: any[] } = {};
        let daysChecked = 0;
        let daysToPull = 10;

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
        
        // Sort the data by date ascending
        for (const symbol in data) {
            data[symbol].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        }

        CACHE.historical = data;
        CACHE.lastFetch = now;
        return data;

    } catch (error) {
        console.error('Error fetching or processing historical data:', error);
        return null;
    }
}

async function getForecastData() {
     const now = Date.now();
    if (CACHE.forecast && (now - CACHE.lastFetch < CACHE_DURATION)) {
        return CACHE.forecast;
    }

    const forecastUrl = 'https://docs.google.com/spreadsheets/d/1saWAgJlfvu22QSHI4_Fe8yenRVHHpsErVM7f3l4_Wjk/export?format=xlsx';

    try {
        const response = await fetch(forecastUrl, { next: { revalidate: 3600 } });
         if (!response.ok) {
            console.error(`Failed to fetch forecast data workbook. Status: ${response.status}`);
            return null;
        }
        const arrayBuffer = await response.arrayBuffer();
        const workbook = xlsx.read(arrayBuffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = xlsx.utils.sheet_to_json(worksheet) as any[];

        const data: { [symbol: string]: any } = {};
        jsonData.forEach(row => {
            const symbol = row.Symbol;
            if (symbol) {
                if (!data[symbol]) data[symbol] = {
                    Ensemble: [],
                    EnsembleMedian: [],
                    XGBoost: [],
                    LightGBM: [],
                    RandomForest: [],
                    Linear: [],
                    LSTM: [],
                    Prophet: [],
                    ExpSmoothing: [],
                };
                 const date = new Date(1899, 11, 30);
                 date.setDate(date.getDate() + row.Date);
                 const formattedDate = date.toISOString().split('T')[0];

                data[symbol].Ensemble.push({ date: formattedDate, value: row.Ensemble });
                data[symbol].EnsembleMedian.push({ date: formattedDate, value: row.EnsembleMedian });
                data[symbol].XGBoost.push({ date: formattedDate, value: row.XGBoost });
                data[symbol].LightGBM.push({ date: formattedDate, value: row.LightGBM });
                data[symbol].RandomForest.push({ date: formattedDate, value: row.RandomForest });
                data[symbol].Linear.push({ date: formattedDate, value: row.Linear });
                data[symbol].LSTM.push({ date: formattedDate, value: row.LSTM });
                data[symbol].Prophet.push({ date: formattedDate, value: row.Prophet });
                data[symbol].ExpSmoothing.push({ date: formattedDate, value: row.ExpSmoothing });
            }
        });
        
        CACHE.forecast = data;
        return data;

    } catch (error) {
        console.error('Error fetching or processing forecast data:', error);
        return null;
    }
}


export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const symbol = searchParams.get('symbol');

        if (!symbol) {
            return NextResponse.json({ error: 'Symbol parameter is required' }, { status: 400 });
        }

        const [historicalData, forecastData] = await Promise.all([
            getHistoricalData(),
            getForecastData(),
        ]);
        
        if (!historicalData || !forecastData) {
            return NextResponse.json({ error: 'Failed to fetch or process external data' }, { status: 500 });
        }
        
        const symbolHistorical = historicalData[symbol];
        const symbolForecast = forecastData[symbol];

        if (!symbolHistorical && !symbolForecast) {
            return NextResponse.json({ error: `No data found for symbol: ${symbol}` }, { status: 404 });
        }
        
        const latestHistorical = symbolHistorical ? symbolHistorical[symbolHistorical.length - 1] : null;

        return NextResponse.json({
            historical: symbolHistorical || [],
            forecast: symbolForecast || {},
            latest_metrics: latestHistorical,
            symbols: Object.keys(historicalData || {}).sort(),
        });

    } catch (error) {
        console.error('API Route Error:', error);
        return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
    }
}
