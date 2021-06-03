import { loadAndProcessData } from './loadAndProcessData.js'
import { plotTemperatureChart } from './plotTemperatureChart.js'
import { plotHumidityChart } from './plotHumidityChart.js'

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
  plotTemperatureChart(d3.selectAll('#temperature-chart'), {data: data,
    status: status,
    width: width,
    height: height,
    margin: margin}
  );
  plotHumidityChart(d3.selectAll('#humidity-chart'), {data: data,
    status: status,
    width: width,
    height: height,
    margin: margin}
  );
};

loadAndProcessData()
  .then(d => { data = d })
  .then( () => { render() });
