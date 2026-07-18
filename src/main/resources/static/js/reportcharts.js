// Minimal, dependency-free SVG chart helpers shared by the 3 report pages.
// No external charting library is vendored - these are small enough to hand-roll
// and keep the app's fully self-hosted asset convention (no CDNs anywhere).

// Renders a single-series line/trend chart into an <svg> element.
// points: [{label, value}], color: a CSS color string
function drawLineChart(svg, points, color) {

    svg.innerHTML = "";
    if (!points || points.length === 0) {
        svg.innerHTML = '<text x="50%" y="50%" text-anchor="middle" class="chart-empty">No data for this range</text>';
        return;
    }

    const width = svg.clientWidth || 400;
    const height = svg.clientHeight || 220;
    const padding = { top: 16, right: 16, bottom: 28, left: 44 };
    const plotWidth = width - padding.left - padding.right;
    const plotHeight = height - padding.top - padding.bottom;

    const maxValue = Math.max(...points.map(p => p.value), 1);
    const stepX = points.length > 1 ? plotWidth / (points.length - 1) : 0;

    const xy = (i, v) => {
        const x = padding.left + i * stepX;
        const y = padding.top + plotHeight - (v / maxValue) * plotHeight;
        return [x, y];
    };

    // gridlines (4 horizontal bands)
    let gridSvg = "";
    for (let g = 0; g <= 4; g++) {
        const y = padding.top + (plotHeight / 4) * g;
        gridSvg += `<line x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}" class="chart-grid" />`;
    }

    // line path
    let pathD = "";
    points.forEach((p, i) => {
        const [x, y] = xy(i, p.value);
        pathD += (i === 0 ? "M" : "L") + x + " " + y + " ";
    });

    // area fill under the line
    const [firstX] = xy(0, points[0].value);
    const [lastX] = xy(points.length - 1, points[points.length - 1].value);
    const areaD = pathD + `L${lastX} ${padding.top + plotHeight} L${firstX} ${padding.top + plotHeight} Z`;

    let dotsSvg = "";
    let labelsSvg = "";
    points.forEach((p, i) => {
        const [x, y] = xy(i, p.value);
        dotsSvg += `<circle cx="${x}" cy="${y}" r="3.5" fill="${color}" class="chart-dot" data-label="${p.label}" data-value="${p.value}"><title>${p.label}: ${p.value.toLocaleString(undefined, {maximumFractionDigits:2})}</title></circle>`;
        if (i % Math.ceil(points.length / 8 || 1) === 0) {
            labelsSvg += `<text x="${x}" y="${height - 8}" text-anchor="middle" class="chart-axis-label">${p.label}</text>`;
        }
    });

    svg.innerHTML =
        gridSvg +
        `<path d="${areaD}" fill="${color}" opacity="0.12" stroke="none" />` +
        `<path d="${pathD}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />` +
        dotsSvg +
        labelsSvg;
}


// Renders a donut chart into an <svg> element, with a side legend into legendContainer.
// points: [{label, value}], colors: array of CSS color strings (fixed categorical order)
function drawDonutChart(svg, points, colors, legendContainer) {

    svg.innerHTML = "";
    if (legendContainer) legendContainer.innerHTML = "";

    if (!points || points.length === 0) {
        svg.innerHTML = '<text x="50%" y="50%" text-anchor="middle" class="chart-empty">No data for this range</text>';
        return;
    }

    const size = Math.min(svg.clientWidth || 220, svg.clientHeight || 220);
    const cx = size / 2;
    const cy = size / 2;
    const rOuter = size / 2 - 4;
    const rInner = rOuter * 0.6;

    const total = points.reduce((sum, p) => sum + p.value, 0) || 1;
    let angle = -Math.PI / 2;

    let arcsSvg = "";
    points.forEach((p, i) => {
        const sliceAngle = (p.value / total) * Math.PI * 2;
        const endAngle = angle + sliceAngle;
        const color = colors[i % colors.length];

        const x1o = cx + rOuter * Math.cos(angle), y1o = cy + rOuter * Math.sin(angle);
        const x2o = cx + rOuter * Math.cos(endAngle), y2o = cy + rOuter * Math.sin(endAngle);
        const x1i = cx + rInner * Math.cos(endAngle), y1i = cy + rInner * Math.sin(endAngle);
        const x2i = cx + rInner * Math.cos(angle), y2i = cy + rInner * Math.sin(angle);
        const largeArc = sliceAngle > Math.PI ? 1 : 0;

        const d = `M${x1o} ${y1o} A${rOuter} ${rOuter} 0 ${largeArc} 1 ${x2o} ${y2o} L${x1i} ${y1i} A${rInner} ${rInner} 0 ${largeArc} 0 ${x2i} ${y2i} Z`;
        const pct = ((p.value / total) * 100).toFixed(1);

        arcsSvg += `<path d="${d}" fill="${color}" class="chart-arc"><title>${p.label}: ${p.value} (${pct}%)</title></path>`;

        if (legendContainer) {
            legendContainer.innerHTML += `<div class="chart-legend-item">
                <span class="chart-legend-swatch" style="background:${color}"></span>
                <span>${p.label} (${p.value})</span>
            </div>`;
        }

        angle = endAngle;
    });

    svg.innerHTML = arcsSvg;
}
