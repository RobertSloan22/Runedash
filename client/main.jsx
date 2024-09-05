import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App.jsx';
import { PriceDataProvider } from './context/PriceDataContext.jsx';
import store from './app/store.js';
import { BalanceProvider } from './components/BalanceContext.jsx';
import { UserProvider } from './components/UserProvider.jsx';
import { AuthProvider } from './components/AuthProvider.jsx';
import { ForecastDataProvider } from './context/ForecastDataContext.jsx';
import './index.css';
import { ApiStatusProvider } from './context/ApiStatusContext.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Auth0Provider } from '@auth0/auth0-react';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <Auth0Provider
    domain="dev-gtqcs7u8l0hno6ih.us.auth0.com"
    clientId="95AfyE7lQRn34URfOLz4dgApVDU1jMPn"
    authorizationParams={{
      redirect_uri: window.location.origin,
    }}
  >
    <StrictMode>
      <Provider store={store}>
        <AuthProvider>
          <UserProvider>
            <BalanceProvider>
              <ApiStatusProvider>
                <ForecastDataProvider>
                  <PriceDataProvider>
                    <App />
                  </PriceDataProvider>
                </ForecastDataProvider>
              </ApiStatusProvider>
            </BalanceProvider>
          </UserProvider>
        </AuthProvider>
      </Provider>
    </StrictMode>
  </Auth0Provider>
);
