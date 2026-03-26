import { useState, useEffect, useMemo } from 'react';
import { useSocket } from '../../../context/SocketContext';

/**
 * Standard Uber-like Hexagon/Cell Definition 
 */
export interface GridCell {
    id: string; // e.g., mock H3 index "8928308280bffff"
    name: string; // Geographic area name
    center: { lat: number, lng: number };
    baseBounds: { lat: number, lng: number }[]; // Extrapolated pentagon/hexagon or square
    metrics: {
        demandCount: number;      // raw requests
        idleSupply: number;       // available drivers
        activeSupply: number;     // busy drivers
        etaBaseline: number;      // minutes
        etaCurrent: number;       // minutes
        cancellations: number;    // % or raw
        completedTrips: number;
        surgeSuggestion: number;
    };
    derived: {
        imbalanceRatio: number; // demand / supply
        etaInflation: number;   // current / baseline
        cancellationRate: number; // canceled / (canceled + completed)
        heatScore: number;      // Uber's composite score
        status: 'healthy' | 'warning' | 'high_demand' | 'critical';
    };
}

/**
 * Hook to consume live data from the unified backend Market engine.
 */
export const useMarketGrid = (mapCenter: [number, number], serviceType: string, dateRange?: [any, any] | null) => {
    const [cells, setCells] = useState<GridCell[]>([]);
    const [loading, setLoading] = useState(false);
    const [isSimulating, setIsSimulating] = useState(false);
    const { socket } = useSocket();

    // 1. Live Socket Connection (Only if no date range)
    useEffect(() => {
        if (!socket || dateRange) return;

        socket.on('heatmapUpdate', (liveCells: GridCell[]) => {
            setCells(liveCells);
        });

        return () => {
            socket.off('heatmapUpdate');
        };
    }, [socket, dateRange]);

    // 2. Historical API Call
    useEffect(() => {
        if (!dateRange) return;

        const fetchHistorical = async () => {
            setLoading(true);
            try {
                const [start, end] = dateRange;
                const url = `http://localhost:8000/api/market/historical?start=${start.toISOString()}&end=${end.toISOString()}&service=${serviceType}`;
                const res = await fetch(url);
                const data = await res.json();
                setCells(data);
            } catch (err) {
                console.error("Failed to fetch historical market data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchHistorical();
    }, [dateRange, serviceType]);

    // Aggregations for the Top Row Metrics Ribbon
    const globalMetrics = useMemo(() => {
        const totalDemand = cells.reduce((acc, c) => acc + c.metrics.demandCount, 0);
        const totalIdle = cells.reduce((acc, c) => acc + c.metrics.idleSupply, 0);
        const totalActiveSurgeZones = cells.filter(c => c.metrics.surgeSuggestion > 1.2).length;
        
        const totalCancellations = cells.reduce((acc, c) => acc + c.metrics.cancellations, 0);
        const totalCompleted = cells.reduce((acc, c) => acc + c.metrics.completedTrips, 0);
        const networkCancelRate = (totalCancellations / Math.max(1, totalCancellations + totalCompleted)) * 100;

        const avgEta = cells.length > 0 ? (cells.reduce((acc, c) => acc + c.metrics.etaCurrent, 0) / cells.length) : 5;

        return {
            totalDemand,
            totalIdle,
            totalActiveSurgeZones,
            networkCancelRate,
            avgEta
        };
    }, [cells]);

    return {
        cells,
        globalMetrics,
        isSimulating,
        setIsSimulating
    };
};
