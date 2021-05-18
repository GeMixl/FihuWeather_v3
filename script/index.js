import { loadAndProcessData } from './loadAndProcessData.js'
import { plotTemperatureChart } from './plotTemperatureChart.js'

const margin = ({top: 20, right: 30, bottom: 30, left: 40});
const height = document.querySelector('#temperature-chart').offsetWidth * 2 / 3;
const width = document.querySelector('#temperature-chart').offsetWidth;

const render = (data) => {
  plotTemperatureChart(d3.select('#temperature-chart'), {data: data,
    width: width,
    height: height,
    margin: margin}
  );
};

loadAndProcessData().then(data => render(data));
