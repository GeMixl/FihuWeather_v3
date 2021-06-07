import { loadAndProcessData } from './loadAndProcessData.js'
import { plotLineChart } from './plotLineChart.js'

const margin = ({top: 20, right: 30, bottom: 30, left: 40});
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
    width: width,
    height: height,
    margin: margin}
  );
  plotLineChart(d3.selectAll('#humidity-chart'), {data: data,
    xval: d => d['timestamp'],
    yval: d => d['humidity'],
    status: status,
    width: width,
    height: height,
    margin: margin}
  );
};

loadAndProcessData()
  .then(d => { data = d })
  .then( () => { render() });
