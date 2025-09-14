
/**
 * @fileoverview Service for fetching data from Google Sheets.
 * This is used by both the Predictive Suite and the Vestara GPT AI tool.
 */

// NOTE: This key is read from environment variables. For local development, create a .env.local file
// in the root of your project and add: NEXT_PUBLIC_GOOGLE_API_KEY='YOUR_API_KEY'
// For production, this variable must be set in your hosting provider's environment variable settings.
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
const SPREADSHEET_ID = '1saWAgJlfvu22QSHI4_Fe8yenRVHHpsErVM7f3l4_Wjk';

// Cache to avoid refetching the same data within a short period.
let cache: { data: any; timestamp: number } | null = null;
const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes

export async function getLatestForecastData() {
    if (cache && (Date.now() - cache.timestamp < CACHE_DURATION_MS)) {
        return cache.data;
    }

    if (!API_KEY) {
        const errorMessage = 'Google API key is not configured. Please set NEXT_PUBLIC_GOOGLE_API_KEY.';
        console.error(errorMessage);
        return { error: errorMessage };
    }

    try {
        const metaUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}?key=${API_KEY}`;
        const metaResponse = await fetch(metaUrl, { cache: 'no-store' });
        if (!metaResponse.ok) throw new Error(`Failed to fetch Google Sheets metadata. Status: ${metaResponse.status}`);
        const metaData = await metaResponse.json();
        
        const dateSheetRegex = /^\d{4}_\d{2}_\d{2}$/;
        const latestSheetName = metaData.sheets
            .map((sheet: any) => sheet.properties.title)
            .filter((name: string) => dateSheetRegex.test(name))
            .sort((a: string, b: string) => b.localeCompare(a))[0];

        if (!latestSheetName) throw new Error('No forecast sheet with format YYYY_MM_DD found.');

        const dataUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${latestSheetName}?key=${API_KEY}`;
        const dataResponse = await fetch(dataUrl, { cache: 'no-store' });
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
            // Handle Google Sheets date serial number format
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
        
        cache = { data, timestamp: Date.now() };
        return data;

    } catch (error) {
        console.error('Error fetching forecast data:', error);
        // Return an empty object or re-throw, depending on desired error handling.
        // For the tool, returning an error message within the data is often better.
        return { error: (error as Error).message };
    }
}
