import { useEffect, useMemo, useState } from "react";

export function useWellbeingData() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ----------------------------
    // Load JSON once on mount
    // ----------------------------
    useEffect(() => {
        let isMounted = true;

        async function fetchData() {
            try {
                setLoading(true);
                setError("");

                const res = await fetch("/data/wellbeing_master.json");

                if (!res.ok) {
                    throw new Error(`HTTP ${res.status}`);
                }

                const json = await res.json();

                if (isMounted) {
                    setData(Array.isArray(json) ? json : []);
                }
            } catch (err) {
                if (isMounted) {
                    setError(err?.message || "Failed to load data");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        fetchData();

        return () => {
            isMounted = false;
        };
    }, []);

    // ----------------------------
    // Derived values
    // ----------------------------

    const levels = useMemo(() => {
        return Array.from(new Set(data.map(d => d.geography_level))).sort();
    }, [data]);

    const quarters = useMemo(() => {
        return Array.from(new Set(data.map(d => d.quarter))).sort((a, b) => a - b);
    }, [data]);

    const metrics = useMemo(() => {
        return [
            "wellbeing_index",
            "life_satisfaction",
            "worthwhile",
            "happiness",
            "anxiety",
            "lonely_at_least_occasionally_pct",
            "lonely_often_or_sometimes_pct",
        ];
    }, []);

    const getGeographies = (level) => {
        return Array.from(
            new Set(
                data
                    .filter(d => d.geography_level === level)
                    .map(d => d.geography)
            )
        ).sort();
    };

    // ----------------------------
    // Return public API
    // ----------------------------

    return {
        data,
        loading,
        error,
        levels,
        quarters,
        metrics,
        getGeographies,
    };
}