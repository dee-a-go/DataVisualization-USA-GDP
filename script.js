let url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";
let req = new XMLHttpRequest();

let receivedData;
let values;
let datesArr;

let heightScale, xScale;
let xAxisScale, yAxisScale;
let width = 800, height = 600, padding = 40;
let barWidth, xAxis, yAxis;
let tooltip;

let svg = d3.select("svg");

let addTitle = () => {
  svg.append("text")
    .attr("id", "title")
    .attr("x", 350)
    .attr("y", 30)
    .text("USA GDP");
};

let drawCanvas = () => {
  svg.attr("width", width)
    .attr("height", height);
};

let generateScales = () => {
  datesArr = values.map(d => new Date(d[0]));

  heightScale = d3.scaleLinear()
    .domain([0, d3.max(values, item => item[1])])
    .range([0, height - 2 * padding]);

  xScale = d3.scaleLinear()
    .domain([0, values.length - 1])
    .range([padding, width - padding]);

  xAxisScale = d3.scaleTime()
    .domain([d3.min(datesArr), d3.max(datesArr)])
    .range([padding, width - padding]);

  yAxisScale = d3.scaleLinear()
    .domain([0, d3.max(values, item => item[1])])
    .range([height - padding, padding]);
};

let generateAxes = () => {
  xAxis = d3.axisBottom(xAxisScale)
  yAxis = d3.axisLeft(yAxisScale)

  svg.append("g")
    .call(xAxis)
    .attr("id", "x-axis")
    .attr("transform", `translate(0, ${height - padding})`)

  svg.append("g")
    .call(yAxis)
    .attr("id", "y-axis")
    .attr("transform", `translate(${padding}, 0)`)
};

let drawBars = () => {
  barWidth = (width - 2 * padding) / values.length

  tooltip = d3.select("body")
    .append("div")
    .attr("id", "tooltip")
    .style("visibility", "hidden")
    .style("width", "auto")
    .style("height", "auto")

  svg.selectAll("rect")
    .data(values)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("width", barWidth)
    .attr("height", item => heightScale(item[1]))
    .attr("x", (item, index) => xScale(index))
    .attr("y", item => height - padding - heightScale(item[1]))
    .attr("data-date", item => item[0])
    .attr("data-gdp", item => item[1])
    .on("mouseover", item => {
      tooltip.transition().style("visibility", "visible");
      tooltip.text(`${item[0]}: ${item[1]} Trillion USD`);
      document.querySelector("#tooltip").setAttribute("data-date", item[0]);
    })
    .on("mouseout", () => {
      tooltip.transition().style("visibility", "hidden")
    })
    .append("title")
    .text(item => `${item[0]}: ${item[1]} Trillion USD`)
};

req.open("GET", url, true);
req.onload = () => {
  receivedData = JSON.parse(req.responseText);
  values = receivedData.data;
  addTitle();
  drawCanvas();
  generateScales();
  generateAxes();
  drawBars();
};
req.send();