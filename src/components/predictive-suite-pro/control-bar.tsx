
'use client';
import { FC } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { LayoutGrid, List, CircleDotDashed, Search, SlidersHorizontal, ArrowDownUp, CheckSquare, Square } from 'lucide-react';
import { ViewMode, SortConfig, ModelKey } from './types';
import { ALL_MODELS, MODEL_METADATA, SECTORS, SORT_OPTIONS } from './constants';

interface ControlBarProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortConfig: SortConfig;
  onSortChange: (config: SortConfig) => void;
  activeSectors: string[];
  onSectorToggle: (sector: string) => void;
  activeModels: ModelKey[];
  onActiveModelsChange: (models: ModelKey[]) => void;
  stockCount: number;
  switchButton: React.ReactNode;
}

const ControlBar: FC<ControlBarProps> = ({
  viewMode, onViewModeChange, searchQuery, onSearchChange,
  sortConfig, onSortChange, activeSectors, onSectorToggle,
  activeModels, onActiveModelsChange, stockCount, switchButton
}) => {
    
    const handleSelectAllModels = () => {
        if (activeModels.length === ALL_MODELS.length) {
            onActiveModelsChange([]);
        } else {
            onActiveModelsChange(ALL_MODELS);
        }
    };

    return (
        <header className="sticky top-0 z-30 flex flex-col gap-2 p-2 border-b bg-background/80 backdrop-blur-sm">
            <div className="flex items-center gap-2">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by ticker or name..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-9 h-10 bg-card/50 border-0"
                    />
                </div>
                <div className="flex items-center gap-1 p-0.5 rounded-lg bg-card/50">
                    <Button variant={viewMode === 'heatmap' ? "secondary" : "ghost"} size="icon" onClick={() => onViewModeChange('heatmap')} className="h-9 w-9"><LayoutGrid className="h-5 w-5" /></Button>
                    <Button variant={viewMode === 'list' ? "secondary" : "ghost"} size="icon" onClick={() => onViewModeChange('list')} className="h-9 w-9"><List className="h-5 w-5" /></Button>
                    <Button variant={viewMode === 'bubble' ? "secondary" : "ghost"} size="icon" onClick={() => onViewModeChange('bubble')} className="h-9 w-9"><CircleDotDashed className="h-5 w-5" /></Button>
                </div>
                
                <Select value={sortConfig.key} onValueChange={(val) => onSortChange({...sortConfig, key: val})}>
                    <SelectTrigger className="h-10 w-[220px] bg-card/50 border-0">
                        <SelectValue placeholder="Sort by..." />
                    </SelectTrigger>
                    <SelectContent>
                        {SORT_OPTIONS.map(opt => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Button variant="ghost" size="icon" className="h-10 w-10 bg-card/50" onClick={() => onSortChange({...sortConfig, direction: sortConfig.direction === 'asc' ? 'desc' : 'asc'})}>
                    <ArrowDownUp className="h-5 w-5" />
                </Button>

                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="h-10 bg-card/50 border-0">
                            <SlidersHorizontal className="mr-2 h-4 w-4" />
                            Models ({activeModels.length})
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64 bg-popover border-border">
                         <div className="grid gap-4">
                            <div className="space-y-2">
                                <h4 className="font-medium leading-none">Select Models</h4>
                                <p className="text-sm text-muted-foreground">
                                Toggles which models appear in the detail panel.
                                </p>
                            </div>
                            <div className="flex items-center justify-between">
                                <Label className="text-sm font-medium">
                                    {activeModels.length === ALL_MODELS.length ? "Deselect All" : "Select All"}
                                </Label>
                                <Button variant="ghost" size="icon" onClick={handleSelectAllModels} className='h-6 w-6'>
                                     {activeModels.length === ALL_MODELS.length ? <CheckSquare className='h-4 w-4'/> : <Square className='h-4 w-4'/>}
                                </Button>
                            </div>
                            <div className="grid gap-2 max-h-64 overflow-y-auto custom-scrollbar pr-2">
                                {ALL_MODELS.map((modelKey) => (
                                <div key={modelKey} className="flex items-center gap-2">
                                    <Checkbox
                                        id={modelKey}
                                        checked={activeModels.includes(modelKey)}
                                        onCheckedChange={(checked) => {
                                            onActiveModelsChange(
                                                checked
                                                ? [...activeModels, modelKey]
                                                : activeModels.filter((m) => m !== modelKey)
                                            );
                                        }}
                                    />
                                    <Label htmlFor={modelKey} className="text-sm font-normal flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full" style={{backgroundColor: MODEL_METADATA[modelKey].color}}></div>
                                        {MODEL_METADATA[modelKey].label}
                                    </Label>
                                </div>
                                ))}
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>

                <Badge className="h-10 text-sm px-4 bg-card/50 text-foreground hover:bg-card/80">
                    Showing {stockCount} stocks
                </Badge>
                {switchButton}
            </div>
            <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-2">
                {['ALL', ...SECTORS].map(sector => (
                    <Button
                        key={sector}
                        variant={activeSectors.includes(sector) ? 'secondary' : 'ghost'}
                        size="sm"
                        onClick={() => onSectorToggle(sector)}
                        className="rounded-full flex-shrink-0"
                    >
                        {sector}
                    </Button>
                ))}
            </div>
        </header>
    );
};

export default ControlBar;
