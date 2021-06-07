
export const plotLineChart = (selection, props) => {
  const {
    data,
    xval,
    yval,
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

  const t = d3.transition().duration(1000);

  const yAxis = g => g
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y))

  const xAxis = g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0))

  const y = d3.scaleLinear()
    .domain([d3.min(data, yval), d3.max(data, yval)]).nice()
      .range([height - margin.bottom, margin.top])

  const x = d3.scaleTime()
    .domain(setXExtent(d3.extent(data, xval), status.xStart))
      .range([margin.left, width - margin.right])

  const line = d3.line()
      .x(d => x(xval(d)))
      .y(d => y(yval(d)))

  let svg = selection.selectAll("svg").data([null])
    .join("svg")
      .attr("viewBox", [0, 0, width, height])

  svg.selectAll("#y-axis").data([null])
    .join(enter => enter.append("g").attr("id", "y-axis"))
      .call(yAxis);

  svg.selectAll("#x-axis").data([null])
    .join(enter => enter.append("g").attr("id", "x-axis").call(xAxis),
          update => update.call(update => update.transition(t).call(xAxis)),
          exit => exit.remove());

  svg.selectAll("#temp-line")
      .data([data])
      .join(enter => enter.append("path")
                        .attr("id", "temp-line")
                        .attr("d", line)
                        .attr("fill", "none")
                        .attr("stroke", "steelblue")
                        .attr("stroke-width", 1.5)
                        .attr("stroke-linejoin", "round")
                        .attr("stroke-linecap", "round"),
            update => update.call(update => update.transition(t)
                                              .attr("d", line))
            )
}
