import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import RuneMonitor from '../monitoring/RuneMonitor';
import DiscordMonitor from '../monitoring/DiscordMonitor';
import ActivePieChart from '../monitoring/ActivePieChart';
import ThreeDDonutChart from '../monitoring/Three';
import NodeApis from '../monitoring/NodeAPiMonitors';
import ThreeNode from '../monitoring/ThreeNode';
import ThreePython from '../monitoring/ThreePython';
import FlaskApis from '../monitoring/FlaskMonitors';
import Styles from './sidebar.css';

const Sidebar = () => (
  <div className="sidebar border-end col-md-3 col-lg-2 p-0 bg-body-tertiary">
    <div className="offcanvas-md offcanvas-end bg-body-tertiary" tabIndex="-1" id="sidebarMenu" aria-labelledby="sidebarMenuLabel">
      <div className="offcanvas-header">
        <h5 className="offcanvas-title" id="sidebarMenuLabel">Company name</h5>
        <button type="button" className="btn-close" data-bs-dismiss="offcanvas" data-bs-target="#sidebarMenu" aria-label="Close"></button>
      </div>
      <div className="offcanvas-body d-md-flex flex-column p-0 pt-lg-3 overflow-y-auto">
      <ThreeDDonutChart />

        <RuneMonitor />
        <DiscordMonitor />
        <div className="NapiMonitor">
<ThreePython />
          </div>
       
      </div>
    </div>
  </div>
);

export default Sidebar;
