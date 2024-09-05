import React, { Component } from 'react';
import * as THREE from 'three';
import axios from 'axios';

const endpoints = [
  { name: '3030-Base', endpoint: 'http://localhost:3030' },
  { name: 'Server-Health', endpoint: 'http://localhost:3030/health' },
  { name: 'Price/volume', endpoint: 'http://localhost:3030/api1/rune-names' },
  { name: 'ServerLogs', endpoint: 'http://localhost:3030api1/log-data' },
  { name: 'RuneNames', endpoint: 'http://localhost:3030/api1/rune-names' },
  { name: 'Forecasts', endpoint: 'http://localhost:3030/api1/forecast' },

  { name: '3055-Base', endpoint: 'http://localhost:3055/health' },
  { name: '3055Status', endpoint: 'http://localhost:3055/api4/forecastingstatus' },
  { name: '3055FP', endpoint: 'http://localhost:3055/api4/forecastplot' },
  { name: 'BDC-4650', endpoint: 'http://localhost:4650/api5/predictions' },
  { name: '4650H', endpoint: 'http://localhost:4650/health' },
  { name: '5100-T', endpoint: 'http://localhost:5100/health' },
];

export default class ThreeDDonutChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: endpoints.map((endpoint, index) => ({
        name: endpoint.name,
        value: 1,
        color: '#8884d8', // Default color
        endpoint: endpoint.endpoint,
        key: index,
      })),
    };
    this.mount = React.createRef();
  }

  componentDidMount() {
    this.initThree();
    this.checkEndpoints();
    this.interval = setInterval(this.checkEndpoints, 15000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
    window.removeEventListener('resize', this.handleResize);
    cancelAnimationFrame(this.frameId);
    this.mount.current.removeChild(this.renderer.domElement);
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
      updatedData[index].color = isAlive ? '#00C49F' : '#FF8042'; // Green if alive, red if not
      return { data: updatedData };
    }, this.updateChart);
  };

  initThree = () => {
    const width = this.mount.current.clientWidth;
    const height = this.mount.current.clientHeight;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.set(0, 0, 20); // Adjust the position of the camera
    this.camera.lookAt(0, 0, 0); // Make the camera look at the center of the scene

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(width, height);
    this.mount.current.appendChild(this.renderer.domElement);

    this.chartGroup = new THREE.Group();
    this.scene.add(this.chartGroup);

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5).normalize();
    this.scene.add(directionalLight);

    this.createChart();

    this.handleResize = this.handleResize.bind(this);
    window.addEventListener('resize', this.handleResize);

    this.animate();
  };

  handleResize = () => {
    const width = this.mount.current.clientWidth;
    const height = this.mount.current.clientHeight;
    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  };

  createChart = () => {
    const radius = 5;
    const tubeRadius = 1.5;
    const radialSegments = 32;
    const tubularSegments = 100;
    const { data } = this.state;
    const totalValue = data.reduce((sum, item) => sum + item.value, 0);
    let startAngle = 0;

    data.forEach((item) => {
      const segmentValue = (item.value / totalValue) * Math.PI * 2;
      const geometry = new THREE.TorusGeometry(radius, tubeRadius, radialSegments, tubularSegments, segmentValue);
      const material = new THREE.MeshBasicMaterial({ color: item.color });
      const mesh = new THREE.Mesh(geometry, material);

      mesh.rotation.x = Math.PI / 2;
      mesh.position.set(0, 0, 0); // Ensure the mesh is centered

      this.chartGroup.add(mesh);

      startAngle += segmentValue;
    });
  };

  updateChart = () => {
    while (this.chartGroup.children.length) {
      this.chartGroup.remove(this.chartGroup.children[0]);
    }
    this.createChart();
  };

  animate = () => {
    this.frameId = requestAnimationFrame(this.animate);

    this.chartGroup.rotation.y += 0.01;

    this.renderer.render(this.scene, this.camera);
  };

  render() {
    return (
      <div
        ref={this.mount}
        style={{ width: '100%', height: '600px', border: '1px solid #ccc' }}
      />
    );
  }
}
