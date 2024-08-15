import React, { Component } from 'react';
import * as THREE from 'three';
import axios from 'axios';
import NodeApis from './NodeAPiMonitors';

const endpoints = [
 
  { name: '3030Node-Base', endpoint: 'https://nodeendpoint.ngrok.app' },
  { name: 'Node-Health', endpoint: 'https://nodeendpoint.ngrok.app/health' },
  { name: 'Node-Price/volume', endpoint: 'https://nodeendpoint.ngrok.app/api1/rune-data' },
  { name: 'Node-ServerLogs', endpoint: 'https://nodeendpoint.ngrok.app/api1/log-data' },
  { name: 'node-RuneNames', endpoint: 'https://nodeendpoint.ngrok.app/api1/rune-names' },
  { name: 'Node-Predictions', endpoint: 'https://nodeendpoint.ngrok.app/api1/forecast' },
  { name: 'Node-Rune-Data', endpoint: 'https://nodeendpoint.ngrok.app/api1/rune-log-data' },
  { name: 'Node-Log-Data', endpoint: 'https://nodeendpoint.ngrok.app/api1/rune-logs' },
  { name: 'DiscordAPI', endpoint: 'https://08329d6c246f9ab5.ngrok.app/status' },
 

];

export default class ThreeNode extends Component {
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
    const radialSegments = 8;  // Adjusted for segment edges
    const tubularSegments = 64; // Higher value for smoother torus
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
      mesh.rotation.y = startAngle; // Rotate each segment to the correct position

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

    this.chartGroup.rotation.y += 0.001;

    this.renderer.render(this.scene, this.camera);
  };

  render() {
    return (
        <>
    
      <div
        ref={this.mount}
        style={{ width: '100%', height: '600px', border: '1px solid #ccc' }}
        
      />
        <NodeApis />
      </>
    );
  }
}
