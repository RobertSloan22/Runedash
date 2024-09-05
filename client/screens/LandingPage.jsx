import { Link } from 'react-router-dom';
import Header from '../Page/Header';
import ThreeDDonutChart from '../monitoring/Three';

import './landing.css';
import CenteredTabs from '../mui/CenteredTabs';


function LandingPage() {
  return (
    <>
    <div>
 <div>
  <div className="mainc"> <ThreeDDonutChart />
  </div>   

    <CenteredTabs />
    </div>
          </div>
    </>
  );
}

export default LandingPage;