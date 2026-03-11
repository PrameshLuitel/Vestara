
import { FullStockData, HistoricalPoint, ModelKey } from './types';
import { SECTORS } from './constants';

// A mock function to get sector, in a real app this would come from an API or a more robust source
const getSector = (symbol: string): string => {
    // This is a simplified mock. 
    if (['NABIL', 'SCB', 'EBL', 'NICA'].includes(symbol)) return 'Banking';
    if (['UPPER', 'CHCL', 'AKPL'].includes(symbol)) return 'Hydropower';
    if (['NIL', 'SICL'].includes(symbol)) return 'Insurance';
    if (['UNL', 'BNT'].includes(symbol)) return 'Manufacturing';
    if (['OHL'].includes(symbol)) return 'Hotels';
    if (['GFCL'].includes(symbol)) return 'Finance';
    const randomIndex = Math.floor(Math.random() * SECTORS.length);
    return SECTORS[randomIndex];
}

// A mock function to get full name, in a real app this would come from an API
const getFullName = (symbol: string): string => {
    const names: { [key: string]: string } = {
        'UPPER': 'Upper Tamakoshi Hydropower Ltd.',
        'NABIL': 'Nabil Bank Limited',
        'CHCL': 'Chilime Hydropower Company Limited',
        'NICA': 'NIC Asia Bank Ltd.',
    };
    return names[symbol] || `${symbol} Company Ltd.`;
}


export const processStockData = (
  historicalData: { [symbol: string]: HistoricalPoint[] },
  forecastData: { [symbol: string]: { [model: string]: any[] } }
): FullStockData[] => {
  return Object.keys(historicalData).map(symbol => {
    const historical = historicalData[symbol];
    const forecast = forecastData[symbol];
    const latestHist = historical[historical.length - 1];

    if (!latestHist || !forecast) {
        return null;
    }

    const models: { [key in ModelKey]?: any[] } = {};
    if (forecast) {
      for (const key in forecast) {
        models[key as ModelKey] = forecast[key];
      }
    }

    const ensembleForecast = models['Ensemble'];
    const ensemblePred7d = ensembleForecast?.[ensembleForecast.length - 1]?.value || latestHist.ltp;
    const ensemblePredGain7d = ((ensemblePred7d - latestHist.ltp) / latestHist.ltp) * 100;
    
    // Model Agreement
    let agreeUp = 0;
    let agreeDown = 0;
    const coreModels = Object.keys(models).filter(m => m !== 'Ensemble' && m !== 'EnsembleMedian');

    coreModels.forEach(key => {
        const modelForecast = models[key as ModelKey];
        if (modelForecast && modelForecast.length > 0) {
            const finalPrediction = modelForecast[modelForecast.length - 1].value;
            if (finalPrediction > latestHist.ltp) agreeUp++;
            else if (finalPrediction < latestHist.ltp) agreeDown++;
        }
    });

    // High Divergence
    const predictions = coreModels
        .map(key => models[key as ModelKey]?.[models[key as ModelKey]!.length - 1]?.value)
        .filter(p => p !== undefined) as number[];
    const mean = predictions.reduce((a, b) => a + b, 0) / predictions.length;
    const stdDev = Math.sqrt(predictions.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b, 0) / predictions.length);
    const highDivergence = predictions.length > 0 ? (stdDev / mean) > 0.10 : false; // 10% threshold for divergence

    // Volatility
    const prices = historical.map(p => p.close);
    const returns = prices.slice(1).map((p, i) => Math.log(p / prices[i]));
    const returnsMean = returns.reduce((a, b) => a + b, 0) / returns.length;
    const volatility = Math.sqrt(returns.map(r => Math.pow(r - returnsMean, 2)).reduce((a, b) => a + b, 0) / returns.length) * Math.sqrt(252); // Annualized

    return {
      symbol: latestHist.symbol,
      name: getFullName(latestHist.symbol),
      sector: getSector(latestHist.symbol),
      open: latestHist.open,
      high: latestHist.high,
      low: latestHist.low,
      ltp: latestHist.ltp,
      prevClose: latestHist.prevClose,
      vol: latestHist.vol,
      turnover: latestHist.turnover,
      diff: latestHist.diff,
      range: latestHist.range,
      dayChangePerc: ((latestHist.diff / latestHist.prevClose) * 100) || 0,
      historical: historical,
      models,
      ensemblePredGain7d,
      modelAgreement: { agreeUp, agreeDown, total: coreModels.length },
      highDivergence,
      volatility: volatility || 0,
    };
  }).filter(s => s !== null) as FullStockData[];
};

export const formatNumber = (num: number | undefined | null): string => {
    if (num === undefined || num === null || isNaN(num)) return '—';
    if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(2)}B`;
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(2)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(2)}K`;
    return num.toString();
};

export const formatCurrency = (num: number | undefined | null): string => {
    if (num === undefined || num === null || isNaN(num)) return 'रू —';
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'NPR' })
        .format(num)
        .replace('NPR', 'रू');
};

export const getTileColor = (gain: number): string => {
    if (gain > 5) return 'hsl(var(--up))'; // Deep green
    if (gain > 1) return 'hsl(var(--up) / 0.6)'; // Light green
    if (gain < -5) return 'hsl(var(--down))'; // Deep red
    if (gain < -1) return 'hsl(var(--down) / 0.6)'; // Light red
    return 'hsl(var(--neutral))'; // Neutral gray
};
