import { useMemo, useState } from 'react';

function AnalyticsTrendChart({ data, height = 220 }) {
  const [activeIndex, setActiveIndex] = useState(null);

  const chart = useMemo(() => {
    if (!data.length) return null;

    const width = 720;
    const padding = { top: 20, right: 24, bottom: 38, left: 34 };
    const innerWidth = width - padding.left - padding.right;
    const innerHeight = height - padding.top - padding.bottom;
    const maxValue = Math.max(...data.map((item) => item.value), 1);
    const minValue = 0;
    const range = maxValue - minValue || 1;

    const points = data.map((item, index) => {
      const x = padding.left + (data.length === 1 ? innerWidth / 2 : (index / (data.length - 1)) * innerWidth);
      const y = padding.top + innerHeight - ((item.value - minValue) / range) * innerHeight;
      return { ...item, x, y };
    });

    const linePath = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
    const areaPath = `${linePath} L ${points[points.length - 1].x} ${padding.top + innerHeight} L ${points[0].x} ${padding.top + innerHeight} Z`;
    const gridLines = [0, 0.5, 1].map((ratio) => padding.top + innerHeight - ratio * innerHeight);

    return { width, padding, innerHeight, maxValue, points, linePath, areaPath, gridLines, firstValue: points[0].value };
  }, [data, height]);

  if (!chart) {
    return (
      <div className="analytics-trend-chart empty-state">
        <div className="trend-chart-head">
          <div>
            <div className="trend-chart-kicker">捕获趋势</div>
            <div className="trend-chart-value">暂无趋势数据</div>
          </div>
        </div>
        <div className="trend-chart-table" aria-label="卡片捕获趋势明细">
          <div className="trend-chart-row">
            <span>当前无可展示数据</span>
            <strong>—</strong>
          </div>
        </div>
      </div>
    );
  }

  const activePoint = activeIndex === null ? chart.points[chart.points.length - 1] : chart.points[activeIndex];

  return (
    <div className="analytics-trend-chart">
      <div className="trend-chart-head">
        <div>
          <div className="trend-chart-kicker">捕获趋势</div>
          <div className="trend-chart-value">{activePoint.value} 张</div>
        </div>
        <div className="trend-chart-caption">{activePoint.label}</div>
      </div>
      <svg viewBox={`0 0 ${chart.width} ${height}`} role="img" aria-label="卡片捕获趋势图" className="trend-chart-svg">
        <defs>
          <linearGradient id="trend-area-gradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#2563eb" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#93c5fd" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {chart.gridLines.map((y) => (
          <line key={y} x1={chart.padding.left} x2={chart.width - chart.padding.right} y1={y} y2={y} className="trend-grid-line" />
        ))}
        <path d={chart.areaPath} className="trend-area" />
        <path d={chart.linePath} className="trend-line" />
        {chart.points.map((point, index) => (
          <g key={point.label}>
            <line x1={point.x} x2={point.x} y1={chart.padding.top} y2={chart.padding.top + chart.innerHeight} className={`trend-crosshair ${activeIndex === index ? 'active' : ''}`} />
            <circle cx={point.x} cy={point.y} r={activeIndex === index ? 6 : 4} className="trend-point" />
            <rect
              x={point.x - 28}
              y={chart.padding.top}
              width="56"
              height={chart.innerHeight}
              fill="transparent"
              tabIndex={0}
              role="button"
              aria-label={`${point.label} 捕获 ${point.value} 张卡片`}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
              onFocus={() => setActiveIndex(index)}
              onBlur={() => setActiveIndex(null)}
            />
            <text x={point.x} y={height - 12} textAnchor="middle" className="trend-axis-label">{point.label}</text>
          </g>
        ))}
      </svg>
      <div className="trend-chart-table" aria-label="卡片捕获趋势明细">
        {data.map((item) => (
          <div key={item.label} className="trend-chart-row">
            <span>{item.label}</span>
            <strong>{item.value} 张</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AnalyticsTrendChart;
