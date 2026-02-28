/*
This module contains the core logic for generating insights based on the dataset.
The main function is `getInsights`, which takes the full dataset and the current filters (level, quarter, metric) and returns an array of insight objects to display.
*/

// Each insight object has the following structure:
const HIGHER_IS_BETTER = {
    life_satisfaction: true,
    worthwhile: true,
    happiness: true,
    anxiety: false,
    wellbeing_index: true,

    often: false,
    some_time: false,
    occasionally: false,
    hardly_ever: true,
    never: true,

    lonely_at_least_occasionally_pct: false,
    lonely_often_or_sometimes_pct: false,
};


// Example insight object:
/*
{
    id: 'top', // unique identifier for this insight
    title: 'Top area', // short title to display
    value: 'Region A (75.3)', // main value to display
    subtitle: 'Q2 • region', // additional context
    tone: 'good', // one of 'good' | 'bad' | 'neutral' | 'info' (for coloring)
}
*/  
function isPercentMetric(metric) {
    // crude heuristic: if the metric name ends with '_pct' or contains certain keywords, treat it as a percentage
    return (
        metric.endsWith('_pct') ||
        ['often', 'some_time', 'occasionally', 'hardly_ever', 'never'].includes(metric)
    );
}

function formatValue(metric, n) {
    // Format the number based on the metric type
    if (!Number.isFinite(n)) return '—';
    if (isPercentMetric(metric)) return `${Math.round(n)}%`;
    if (metric === 'wellbeing_index') return n.toFixed(2);
    return n.toFixed(1);
}

function stdev(values) {
    // Calculate standard deviation of an array of numbers
    const xs = values.filter(Number.isFinite);
    if (xs.length < 2) return 0;
    const mean = xs.reduce((a, b) => a + b, 0) / xs.length;
    const variance = xs.reduce((acc, x) => acc + (x - mean) ** 2, 0) / (xs.length - 1);
    return Math.sqrt(variance);
}

export function getInsights({ allData, level, quarter, metric }) {
    // Determine if higher values are better for this metric (for coloring and "top"/"bottom" labels)
    const higherIsBetter = HIGHER_IS_BETTER[metric] ?? true;

    const slice = (allData ?? []).filter(
        (d) => d.geography_level === level && d.quarter === quarter,
    );

    // Map the slice to an array of { name, value } objects, filtering out invalid values
    const withVals = slice
        .map((d) => ({
            name: d.geography,
            value: Number(d[metric]),
        }))
        .filter((r) => Number.isFinite(r.value));

    // If nothing found, return safe insight
    if (withVals.length === 0) {
        return [
            {
                id: 'nodata',
                title: 'No data',
                value: '—',
                subtitle: `Nothing found for ${level} • Q${quarter} • ${metric}`,
                tone: 'info',
            },
        ];
    }

    // NATIONAL LEVEL: current + QoQ change + year high/low (if national)
    if (level === 'national') {
        const current = withVals[0];

        // QoQ change (safe)
        let changeCard = {
            id: 'change',
            title: 'Quarter-on-quarter change',
            value: '—',
            subtitle: quarter === 1 ? 'No previous quarter available.' : 'Previous quarter not found.',
            tone: 'info',
        };

        // Only compute QoQ change if we have a valid previous quarter value
        if (quarter > 1) {
            const prevRow = (allData ?? []).find(
                (d) => d.geography_level === 'national' && d.quarter === quarter - 1,
            );

            const prevVal = prevRow ? Number(prevRow[metric]) : NaN;

            if (Number.isFinite(prevVal)) {
                const delta = current.value - prevVal;
                const arrow = delta > 0 ? '↑' : delta < 0 ? '↓' : '→';

                changeCard = {
                    id: 'change',
                    title: 'Quarter-on-quarter change',
                    value: `${arrow} ${formatValue(metric, Math.abs(delta))}`,
                    subtitle: `Now ${formatValue(metric, current.value)} • was ${formatValue(
                        metric,
                        prevVal,
                    )}`,
                    tone:
                        (delta >= 0 && higherIsBetter) || (delta <= 0 && !higherIsBetter)
                            ? 'good'
                            : 'bad',
                };
            }
        }

        // Year high/low (safe)
        const yearRows = (allData ?? []).filter((d) => d.geography_level === 'national');
        const yearVals = yearRows
            .map((d) => ({ q: d.quarter, v: Number(d[metric]) }))
            .filter((x) => Number.isFinite(x.v));

        if (yearVals.length === 0) {
            return [
                {
                    id: 'current',
                    title: 'Current value',
                    value: formatValue(metric, current.value),
                    subtitle: `Quarter ${quarter}`,
                    tone: 'neutral',
                },
                changeCard,
                {
                    id: 'year',
                    title: 'Year range',
                    value: '—',
                    subtitle: 'No valid values across Q1–Q4 for this metric.',
                    tone: 'info',
                },
            ];
        }

        // Find the quarters with the max and min values
        const maxObj = yearVals.reduce((a, b) => (b.v > a.v ? b : a), yearVals[0]);
        const minObj = yearVals.reduce((a, b) => (b.v < a.v ? b : a), yearVals[0]);

        return [
            {
                id: 'current',
                title: 'Current value',
                value: formatValue(metric, current.value),
                subtitle: `Quarter ${quarter}`,
                tone: 'neutral',
            },
            changeCard,
            {
                id: 'year-high',
                title: 'Highest quarter (YTD)',
                value: `Q${maxObj.q} (${formatValue(metric, maxObj.v)})`,
                tone: 'good',
            },
            {
                id: 'year-low',
                title: 'Lowest quarter (YTD)',
                value: `Q${minObj.q} (${formatValue(metric, minObj.v)})`,
                tone: 'bad',
            },
        ];
    }

    // SUB-NATIONAL LEVEL: best/worst + QoQ change + most volatile
    const sorted = [...withVals].sort((a, b) => b.value - a.value);
    const best = higherIsBetter ? sorted[0] : sorted[sorted.length - 1];
    const worst = higherIsBetter ? sorted[sorted.length - 1] : sorted[0];

    // Biggest QoQ change
    let changeCard = {
        id: 'change',
        title: 'Biggest QoQ change',
        value: '—',
        subtitle: quarter === 1 ? 'No previous quarter available.' : '—',
        tone: 'info',
    };

    if (quarter > 1) {
        const prev = (allData ?? []).filter(
            (d) => d.geography_level === level && d.quarter === quarter - 1,
        );
        const prevByGeo = new Map(prev.map((d) => [d.geography, Number(d[metric])]));

        const deltas = withVals
            .map((r) => {
                const p = prevByGeo.get(r.name);
                if (!Number.isFinite(p)) return null;
                return { ...r, prev: p, delta: r.value - p };
            })
            .filter(Boolean);

        if (deltas.length) {
            deltas.sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));
            const c = deltas[0];
            const arrow = c.delta > 0 ? '↑' : c.delta < 0 ? '↓' : '→';

            changeCard = {
                id: 'change',
                title: 'Biggest QoQ change',
                value: `${c.name} (${arrow} ${formatValue(metric, Math.abs(c.delta))})`,
                subtitle: `Now ${formatValue(metric, c.value)} • was ${formatValue(metric, c.prev)}`,
                tone:
                    (c.delta >= 0 && higherIsBetter) || (c.delta <= 0 && !higherIsBetter)
                        ? 'good'
                        : 'bad',
            };
        }
    }

    // Most volatile across the year (std dev)
    const levelAll = (allData ?? []).filter((d) => d.geography_level === level);
    const byGeo = new Map();
    for (const d of levelAll) {
        const name = d.geography;
        const v = Number(d[metric]);
        if (!byGeo.has(name)) byGeo.set(name, []);
        byGeo.get(name).push(v);
    }

    let mostVolatile = null;
    for (const [name, values] of byGeo.entries()) {
        const sd = stdev(values);
        if (!mostVolatile || sd > mostVolatile.sd) mostVolatile = { name, sd };
    }

    const volatileCard = mostVolatile
        ? {
            id: 'volatile',
            title: 'Most volatile (Q1-Q4)',
            value: `${mostVolatile.name} (σ ${formatValue(metric, mostVolatile.sd)})`,
            subtitle: 'Standard deviation across quarters',
            tone: 'neutral',
        }
        : {
            id: 'volatile',
            title: 'Most volatile (Q1-Q4)',
            value: '—',
            subtitle: 'Not enough points to compute volatility.',
            tone: 'info',
        };

    return [
        {
            id: 'top',
            title: higherIsBetter ? 'Top area' : 'Best (lowest)',
            value: `${best.name} (${formatValue(metric, best.value)})`,
            subtitle: `Q${quarter} • ${level}`,
            tone: 'good',
        },
        {
            id: 'bottom',
            title: higherIsBetter ? 'Bottom area' : 'Worst (highest)',
            value: `${worst.name} (${formatValue(metric, worst.value)})`,
            subtitle: '',
            tone: 'bad',
        },
        changeCard,
        volatileCard,
    ];
}