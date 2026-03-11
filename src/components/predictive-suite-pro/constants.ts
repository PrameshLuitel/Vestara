
import { ModelKey } from "./types";

export const SECTORS = ['Banking', 'Hydropower', 'Insurance', 'Manufacturing', 'Hotels', 'Finance', 'Investment', 'Others'];

export const SECTOR_COLORS: { [key: string]: string } = {
    'Banking': '#1f77b4',
    'Hydropower': '#ff7f0e',
    'Insurance': '#2ca02c',
    'Manufacturing': '#d62728',
    'Hotels': '#9467bd',
    'Finance': '#8c564b',
    'Investment': '#e377c2',
    'Others': '#7f7f7f',
};

export const SORT_OPTIONS = [
    { value: 'ensemblePredGain7d', label: 'Ensemble Predicted Gain (7d)' },
    { value: 'dayChangePerc', label: 'Day Change %' },
    { value: 'vol', label: 'Volume' },
    { value: 'volatility', label: 'Volatility' },
    { value: 'symbol', label: 'Alphabetical' },
];

export const MODEL_METADATA: { [key in ModelKey]: { label: string; color: string } } = {
    LSTM: { label: "LSTM", color: "#8884d8" },
    Prophet: { label: "Prophet", color: "#82ca9d" },
    XGBoost: { label: "XGBoost", color: "#ffc658" },
    LightGBM: { label: "LightGBM", color: "#ff8042" },
    RandomForest: { label: "Random Forest", color: "#00C49F" },
    Linear: { label: "Linear Regression", color: "#0088FE" },
    ExpSmoothing: { label: "Exp. Smoothing", color: "#FFBB28" },
    Ensemble: { label: "Ensemble Mean", color: "hsl(var(--primary))" },
    EnsembleMedian: { label: "Ensemble Median", color: "#ff7300" },
};

export const ALL_MODELS = Object.keys(MODEL_METADATA) as ModelKey[];
