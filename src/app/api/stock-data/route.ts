
import { NextResponse } from 'next/server';
import * as xlsx from 'xlsx';

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

    const spreadsheetId = '1saWAgJlfvu22QSHI4_Fe8yenRVHHpsErVM7f3l4_Wjk';
    const apiKey = process.env.GOOGLE_SHEETS_API_KEY; // IMPORTANT: Use environment variable for API key

    if (!apiKey) {
        console.error('Google Sheets API key is not configured.');
        return null;
    }

    try {
        // 1. Fetch spreadsheet metadata to get all sheet names
        const sheetMetaUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?key=${apiKey}`;
        const metaResponse = await fetch(sheetMetaUrl, { next: { revalidate: 3600 } });
        if (!metaResponse.ok) {
            console.error(`Failed to fetch Google Sheets metadata. Status: ${metaResponse.status}`);
            return null;
        }
        const metaData = await metaResponse.json();
        
        // 2. Find the latest sheet name with the format YYYY_MM_DD
        const dateSheetRegex = /^\d{4}_\d{2}_\d{2}$/;
        const latestSheetName = metaData.sheets
            .map((sheet: any) => sheet.properties.title)
            .filter((name: string) => dateSheetRegex.test(name))
            .sort((a: string, b: string) => b.localeCompare(a))
            [0];

        if (!latestSheetName) {
            console.error('No forecast sheet with format YYYY_MM_DD found.');
            return null;
        }

        // 3. Fetch data from the latest sheet
        const dataUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${latestSheetName}?key=${apiKey}`;
        const dataResponse = await fetch(dataUrl, { next: { revalidate: 3600 } });
        if (!dataResponse.ok) {
            console.error(`Failed to fetch data from sheet ${latestSheetName}. Status: ${dataResponse.status}`);
            return null;
        }
        const sheetData = await dataResponse.json();

        if (!sheetData.values || sheetData.values.length < 2) {
             console.error('Sheet contains no data or only a header row.');
             return null;
        }

        // 4. Process the JSON data
        const headers = sheetData.values[0];
        const rows = sheetData.values.slice(1);
        
        const data: { [symbol: string]: any } = {};
        
        const symbolIndex = headers.indexOf('Symbol');
        const dateIndex = headers.indexOf('Date');
        if (symbolIndex === -1 || dateIndex === -1) {
            console.error('Sheet must contain "Symbol" and "Date" columns.');
            return null;
        }

        rows.forEach((row: any[]) => {
            const symbol = row[symbolIndex];
            const excelDate = parseFloat(row[dateIndex]);

            if (symbol && !isNaN(excelDate)) {
                if (!data[symbol]) {
                    data[symbol] = {
                        Ensemble: [], EnsembleMedian: [], XGBoost: [], LightGBM: [],
                        RandomForest: [], Linear: [], LSTM: [], Prophet: [], ExpSmoothing: [],
                    };
                }

                // Correctly convert Excel date serial number to YYYY-MM-DD
                const jsTimestamp = (excelDate - 25569) * 86400 * 1000;
                const jsDate = new Date(jsTimestamp);
                const formattedDate = jsDate.toISOString().split('T')[0];
                
                Object.keys(data[symbol]).forEach(modelKey => {
                    const headerIndex = headers.indexOf(modelKey);
                    if (headerIndex !== -1) {
                         const value = parseFloat(row[headerIndex]);
                         if (!isNaN(value)) {
                            data[symbol][modelKey].push({ date: formattedDate, value: value });
                         }
                    }
                });
            }
        });

        CACHE.forecast = data;
        return data;

    } catch (error) {
        console.error('Error fetching or processing forecast data from Google Sheets API:', error);
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
        
        if (!historicalData) {
            return NextResponse.json({ error: 'Failed to fetch or process historical data from Github.' }, { status: 500 });
        }
        if (!forecastData) {
            return NextResponse.json({ error: 'Failed to fetch or process forecast data from Google Sheets.' }, { status: 500 });
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
