
"use client"

import { useState } from 'react';
import { Button } from './ui/button';
import { Sparkles } from 'lucide-react';
import PredictiveSuiteLegacy from './predictive-suite-legacy';
import PredictiveSuitePro from './predictive-suite-pro';

export default function PredictiveSuite() {
    const [viewMode, setViewMode] = useState<'legacy' | 'pro'>('legacy');

    const ProViewButton = (
        <Button onClick={() => setViewMode('pro')} variant="outline" className="absolute top-4 right-4 z-10 border-primary/50 bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary">
            <Sparkles className="mr-2 h-4 w-4" />
            Switch to Pro View
        </Button>
    );

    const LegacyViewButton = (
         <Button onClick={() => setViewMode('legacy')} variant="outline" className="border-muted-foreground/50 text-muted-foreground hover:bg-accent/50 hover:text-foreground">
            Switch to Simple View
        </Button>
    );

    if (viewMode === 'pro') {
        return <PredictiveSuitePro switchButton={LegacyViewButton} />;
    }

    return (
        <div className="relative">
            {ProViewButton}
            <PredictiveSuiteLegacy />
        </div>
    );
}
