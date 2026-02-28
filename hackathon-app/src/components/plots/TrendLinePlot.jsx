import React, { useMemo } from "react";
import Plot from "react-plotly.js";

export default function TrendLinePlot({
  title = "Trend over time",
  metric,
  data = [],
}) {
  // Guard: no data for current filters
  const hasData = Array.isArray(data) && data.length > 0;

  const { x, y } = useMemo(() => {
    if (!hasData) return { x: [], y: [] };

    return {
      x: data.map((d) => `${d.year} Q${d.quarter}`),
      y: data.map((d) => {
        const v = d?.[metric];
        return typeof v === "number" ? v : Number(v);
      }),
    };
  }, [data, metric, hasData]);

  const trace = {
    x,
    y,
    type: "scatter",
    mode: "lines+markers",
    line: { shape: "spline" },
  };

  return (
    <div className="bg-white/70 rounded-2xl shadow p-4">
      <h2 className="font-semibold mb-2">{title}</h2>
      <div className="text-xs opacity-60 mb-4">Metric: {metric}</div>

      {!hasData ? (
        <div className="h-80 rounded-xl border flex items-center justify-center">
          <span className="text-sm opacity-70">No data for current filters.</span>
        </div>
      ) : (
        <div className="h-80 rounded-xl border overflow-hidden">
          <Plot
            data={[trace]}
            layout={{
              autosize: true,
              margin: { l: 50, r: 20, t: 10, b: 50 },
              xaxis: { title: "Quarter" },
              yaxis: { title: metric },
            }}
            config={{ responsive: true, displayModeBar: false }}
            style={{ width: "100%", height: "100%" }}
            useResizeHandler
          />
        </div>
      )}
    </div>
  );
}
