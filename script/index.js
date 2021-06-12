import { loadAndProcessData } from './loadAndProcessData.js'
import { plotLineChart } from './plotLineChart.js'

const margin = ({top: 40, right: 40, bottom: 50, left: 50});
const height = document.querySelector('#temperature-chart').offsetWidth * 2 / 3;
const width = document.querySelector('#temperature-chart').offsetWidth;

let data;

let status = {
  xStart: null
};

const xRangeSelector = document.querySelector('#x-range-selector');
//console.log(xRangeSelector);
xRangeSelector.addEventListener('change', (event) => {
  switch (xRangeSelector.selectedIndex) {
    case 0:
      status.xStart = 7;
      break;
    case 1:
      status.xStart = 14;
      break;
    case 2:
      status.xStart = 30;
      break;
    default:
      status.xStart = null;
  };
  render();
}, false);

const render = () => {
  console.log(data);
  plotLineChart(d3.selectAll('#temperature-chart'), {data: data,
    xval: d => d['timestamp'],
    yval: d => d['temperature'],
    status: status,
    fullWidth: width,
    fullHeight: height,
    margin: margin,
    yLabel: 'Temperature in °C'}
  );
  plotLineChart(d3.selectAll('#humidity-chart'), {data: data,
    xval: d => d['timestamp'],
    yval: d => d['humidity'],
    status: status,
    fullWidth: width,
    fullHeight: height,
    margin: margin,
    yLabel: 'relative Humidity in %'}
  );
};

loadAndProcessData()
  .then(d => { data = d })
  .then( () => { render() });
