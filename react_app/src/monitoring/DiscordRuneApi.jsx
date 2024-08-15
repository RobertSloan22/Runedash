import React, { PureComponent } from 'react';
import { PieChart, Pie, Sector, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const endpoints = [
    { name: 'DiscordAPI', endpoint: 'https://08329d6c246f9ab5.ngrok.app/status' },
    { name: 'Discordhealth', endpoint: 'https://08329d6c246f9ab5.ngrok.app/health' },

    { name: 'RuneAPI', endpoint: 'https://a16f3f32b182ec9a.ngrok.app/status' },
    { name: 'Runehealth', endpoint: 'https://a16f3f32b182ec9a.ngrok.app/health' },



 


  
  


];

const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (


    <>
  
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`PV ${value}`}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
        {`(Rate ${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
    </>
  );
};

export default class DiscordRuneApi extends PureComponent {
  static demoUrl = 'https://codesandbox.io/s/pie-chart-with-customized-active-shape-y93si';

  state = {
    activeIndex: 0,
    data: endpoints.map((endpoint, index) => ({
      name: endpoint.name,
      value: 1,
      fill: '#8884d8', // Default color
      endpoint: endpoint.endpoint,
      key: index,
    })),
  };

  componentDidMount() {
    this.checkEndpoints();
    this.interval = setInterval(this.checkEndpoints, 15000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  checkEndpoints = async () => {
    const { data } = this.state;

    for (let i = 0; i < data.length; i++) {
      try {
        await axios.get(data[i].endpoint);
        this.updateEndpointStatus(i, true);
      } catch (error) {
        this.updateEndpointStatus(i, false);
      }
    }
  };

  updateEndpointStatus = (index, isAlive) => {
    this.setState((prevState) => {
      const updatedData = [...prevState.data];
      updatedData[index].fill = isAlive ? '#00C49F' : '#FF8042'; // Green if alive, red if not
      return { data: updatedData };
    });
  };

  onPieEnter = (_, index) => {
    this.setState({
      activeIndex: index,
    });
  };

  render() {
    return (
      <>

       <h1>Data Collection Service-API's </h1>
       
      <ResponsiveContainer width="100%" height="100%">
        <PieChart width={400} height={400}>
          <Pie
            activeIndex={this.state.activeIndex}
            activeShape={renderActiveShape}
            data={this.state.data}
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
            onMouseEnter={this.onPieEnter}
          />
        </PieChart>
      </ResponsiveContainer>
      </>
    );
  }
}
