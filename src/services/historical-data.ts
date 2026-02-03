
import * as xlsx from 'xlsx';

// Cache to avoid refetching the same data within a short period.
let cache: { data: any; timestamp: number } | null = null;
const CACHE_DURATION_MS = 60 * 60 * 1000; // 1 hour

function getSheetName(daysAgo = 0) {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}_${month}_${day}`;
}

export async function getHistoricalData() {
    if (cache && (Date.now() - cache.timestamp < CACHE_DURATION_MS)) {
        return cache.data;
    }

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

        cache = { data, timestamp: Date.now() };
        return data;
    } catch (error) {
        console.error('Error fetching historical data:', error);
        throw error;
    }
}
