export const plotTemperatureChart = (selection, props) => {
  const {
    data,
    width,
    height,
    margin
  } = props;

  const yAxis = g => g
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y))

  const xAxis = g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0))

  const y = d3.scaleLinear()
    .domain([d3.min(data, d => d.temperature), d3.max(data, d => d.temperature)]).nice()
      .range([height - margin.bottom, margin.top])

  const x = d3.scaleTime()
    .domain(d3.extent(data, d => d.timestamp))
      .range([margin.left, width - margin.right])

  const line = d3.line()
      .x(d => x(d.timestamp))
      .y(d => y(d.temperature))

  const svg = selection
    .append("svg")
      .attr("viewBox", [0, 0, width, height]);

  svg.append("g")
      .call(xAxis);

  svg.append("g")
      .call(yAxis);

  svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("d", line);
}
