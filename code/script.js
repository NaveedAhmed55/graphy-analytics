const svg = d3.select("svg"),
      margin = {top: 50, right: 50, bottom: 50, left: 50},
      width = 1800 - margin.left - margin.right,
      height = 1200 - margin.top - margin.bottom;

const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

const x = d3.scaleLinear().domain([0, 100]).range([0, width]);
const y = d3.scaleLinear().domain([0, 100]).range([height, 0]);

let nodesData, edgesData;
let currentZoom = 1;
let currentTransform = d3.zoomIdentity;

const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

document.getElementById('fileInputNodes').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        nodesData = d3.csvParse(e.target.result).map(d => ({
            ...d,
            Value_Chain_Position: +d.Value_Chain_Position,
            Global_Competition_Intensity: +d.Global_Competition_Intensity,
            originalX: x(+d.Value_Chain_Position),
            originalY: y(+d.Global_Competition_Intensity)
        }));
        if (edgesData) filterAndUpdate();
    };
    reader.readAsText(file);
});

document.getElementById('fileInputEdges').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        edgesData = d3.csvParse(e.target.result);
        if (nodesData) filterAndUpdate();
    };
    reader.readAsText(file);
});

d3.select('#statusFilter').on('change', filterAndUpdate);
d3.select('#knowledgeFilter').on('change', filterAndUpdate);
d3.select('#capitalFilter').on('change', filterAndUpdate);
d3.select('#laborFilter').on('change', filterAndUpdate);
d3.select('#naturalResourcesFilter').on('change', filterAndUpdate);

document.getElementById('zoomIn').addEventListener('click', () => zoomChart(1.2));
document.getElementById('zoomOut').addEventListener('click', () => zoomChart(0.8));
document.getElementById('resetFilters').addEventListener('click', resetFilters);

function resetFilters() {
    d3.select("#statusFilter").property("value", "all");
    d3.select("#knowledgeFilter").property("value", "all");
    d3.select("#capitalFilter").property("value", "all");
    d3.select("#laborFilter").property("value", "all");
    d3.select("#naturalResourcesFilter").property("value", "all");

    filterAndUpdate();
}

const zoom = d3.zoom()
    .scaleExtent([0.5, 5])
    .translateExtent([[-width, -height], [2 * width, 2 * height]])
    .on("zoom", (event) => {
        currentTransform = event.transform;
        g.attr("transform", currentTransform);
    });

svg.call(zoom);

function zoomChart(factor) {
    currentZoom *= factor;
    svg.transition().duration(500).call(zoom.scaleTo, currentZoom);
}

// Remaining functions like renderChart, filterAndUpdate, displayNodeDetails, etc.
