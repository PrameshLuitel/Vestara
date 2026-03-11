
export interface HistoricalPoint {
  date: string; // "YYYY-MM-DD"
  symbol: string;
  conf?: number;
  open: number;
  high: number;
  low: number;
  close: number;
  ltp: number;
  vol: number;
  prevClose: number;
  turnover: number;
  trans?: number;
  diff: number;
  range: number;
}

export interface ForecastPoint {
    date: string; // "YYYY-MM-DD"
    value: number;
}

export const modelKeys = [
    "LSTM",
    "Prophet",
    "XGBoost",
    "LightGBM",
    "RandomForest",
    "Linear",
    "ExpSmoothing",
    "Ensemble",
    "EnsembleMedian",
] as const;

export type ModelKey = typeof modelKeys[number];


export interface FullStockData {
    symbol: string;
    name: string;
    sector: string;
    open: number;
    high: number;
    low: number;
    ltp: number;
    prevClose: number;
    vol: number;
    turnover: number;
    diff: number;
    range: number;
    dayChangePerc: number;
    historical: HistoricalPoint[];
    models: {
        [key in ModelKey]?: ForecastPoint[];
    };
    ensemblePredGain7d: number;
    modelAgreement: {
        agreeUp: number;
        agreeDown: number;
        total: number;
    };
    highDivergence: boolean;
    volatility: number;
}

export type ViewMode = 'heatmap' | 'list' | 'bubble';

export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}
