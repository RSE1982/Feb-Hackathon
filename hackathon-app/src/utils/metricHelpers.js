// src/utils/metricHelpers.js

export const METRIC_META = {
    wellbeing_index: {
        label: 'Wellbeing',
        decimals: 1,
        suffix: '',
        higherIsBetter: true,
    },
    life_satisfaction: {
        label: 'Life satisfaction',
        decimals: 1,
        suffix: '',
        higherIsBetter: true,
    },
    worthwhile: {
        label: 'Worthwhile',
        decimals: 1,
        suffix: '',
        higherIsBetter: true,
    },
    happiness: {
        label: 'Happiness',
        decimals: 1,
        suffix: '',
        higherIsBetter: true,
    },
    anxiety: {
        label: 'Anxiety',
        decimals: 1,
        suffix: '',
        higherIsBetter: false, // lower anxiety is better
    },
    lonely_at_least_occasionally_pct: {
        label: 'Lonely ≥ occasionally',
        decimals: 1,
        suffix: '%',
        higherIsBetter: false, // lower loneliness is better
    },
    lonely_often_or_sometimes_pct: {
        label: 'Lonely often/sometimes',
        decimals: 1,
        suffix: '%',
        higherIsBetter: false, // lower loneliness is better
    },
};

export function metricNiceName(metric) {
    return METRIC_META[metric]?.label ?? metric;
}

export function formatMetricValue(metric, value) {
    const n = Number(value);
    if (!Number.isFinite(n)) return '—';

    const meta = METRIC_META[metric];
    const decimals = meta?.decimals ?? 1;
    const suffix = meta?.suffix ?? '';

    return `${n.toFixed(decimals)}${suffix}`;
}

/**
 * Returns a status for a delta, taking into account whether higher is better.
 * - 'better' means "moving in the good direction"
 * - 'worse' means "moving in the bad direction"
 * - 'neutral' means near-zero change
 */
export function deltaStatus(metric, delta, { neutralThreshold } = {}) {
    const d = Number(delta);
    if (!Number.isFinite(d)) return 'neutral';

    // Default: half of the metric's precision step
    const decimals = METRIC_META[metric]?.decimals ?? 1;
    const defaultThreshold = 0.5 * Math.pow(10, -decimals);
    const t = neutralThreshold ?? defaultThreshold;

    if (Math.abs(d) < t) return 'neutral';

    const higherIsBetter = METRIC_META[metric]?.higherIsBetter ?? true;

    // If higher is better: positive delta is better
    // If lower is better: negative delta is better
    const isBetter = higherIsBetter ? d > 0 : d < 0;
    return isBetter ? 'better' : 'worse';
}

/**
 * Creates a nice delta label e.g. "+0.6 vs UK" or "−1.2% vs UK"
 */
export function formatDeltaLabel(metric, delta, { baselineLabel = 'UK' } = {}) {
    const d = Number(delta);
    if (!Number.isFinite(d)) return `— vs ${baselineLabel}`;

    const sign = d > 0 ? '+' : d < 0 ? '−' : '';
    const abs = Math.abs(d);

    // Reuse formatting rules for the metric
    const meta = METRIC_META[metric];
    const decimals = meta?.decimals ?? 1;
    const suffix = meta?.suffix ?? '';

    return `${sign}${abs.toFixed(decimals)}${suffix} vs ${baselineLabel}`;
}