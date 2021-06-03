
export const plotTemperatureChart = (selection, props) => {
  const {
    data,
    status,
    width,
    height,
    margin
  } = props;

   const setXExtent = function (xExtent, offsetDay) {
    let xExtentStart = new Date(xExtent[0]);
    let xExtentStop  = new Date(xExtent[1]);
    if (offsetDay !== null) {
      xExtentStart.setDate(xExtentStop.getDate() - offsetDay);
    }
    return [xExtentStart, xExtentStop];
  };

  console.log(d3.extent(data, d => d.timestamp))
  console.log(setXExtent(d3.extent(data, d => d.timestamp), status.xStart))
  console.log(d3.extent(data, d => d.timestamp))


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
    .domain(setXExtent(d3.extent(data, d => d.timestamp), status.xStart))
      .range([margin.left, width - margin.right])

  const line = d3.line()
      .x(d => x(d.timestamp))
      .y(d => y(d.temperature))

  let svg = selection.selectAll("svg").data([null])
    .join("svg")
      .attr("viewBox", [0, 0, width, height])

  svg.selectAll("#y-axis").data([null])
    .join(enter => enter.append("g").attr("id", "y-axis"))
      .call(yAxis);

  svg.selectAll("#x-axis").data([null])
    .join(enter => enter.append("g").attr("id", "x-axis"))
      .transition().duration(1000)
      .call(xAxis);

  svg.selectAll("#temp-line")
      .data([data])
      .join(enter => enter.append("path").attr("id", "temp-line"))
      .transition().duration(1000)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("d", line);
}
