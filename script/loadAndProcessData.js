export const loadAndProcessData = () =>
  d3.csv('./data/data.csv')
    .then( data => {
      data.forEach(d => {
        d.temperature = +d.temperature;
        d.timestamp = new Date(d.timestamp.slice(0,4), d.timestamp.slice(4,6), d.timestamp.slice(6,8), d.timestamp.slice(9,11), d.timestamp.slice(11,13));
      });
      return data;
    });
