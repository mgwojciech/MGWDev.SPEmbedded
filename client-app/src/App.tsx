import React, { Suspense } from 'react';
import './App.css';
import { TokenBrokerAuthService } from './services/auth/TokenBrokerAuthService';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { AuthenticationContextProvider } from './context/AuthenticationContext';
import { GraphContextProvider } from './context/GraphContext';
import { GraphBasedSPContextProvider } from './context/GraphBasedSPContext';
import { AppHeader } from './components/common/AppHeader';
import background from "./5310cdc6d510ed4507f27da47e70dc71.png";
import { Spinner, makeStyles } from '@fluentui/react-components';
import { LocalizationProvider } from './context/LocalizationContext';

const ContainerPickerPage = React.lazy(() => import('./pages/ContainerPickerPage'));
const ContainerPage = React.lazy(() => import('./pages/ContainerPage'));
const ContainerSearchPage = React.lazy(() => import('./pages/ContainerSearchPage'));

const useAppStyles = makeStyles({
  root: {
    backgroundImage: `url(${background})`,
    backgroundSize: "cover",
    height: "100vh",
  }
})
function App() {
  const classNames = useAppStyles();
  const authService = new TokenBrokerAuthService();
  const mainRouter = createBrowserRouter([{
    path: '/',
    element: <ContainerPickerPage />
  }, {
    path: '/containers/:containerId?',
    element: <ContainerPage />
  },
  {
    path: '/containers/:containerId/search',
    element: <ContainerSearchPage />
  }
]);
  return (
    <AuthenticationContextProvider authProvider={authService} >
      <GraphContextProvider>
        <GraphBasedSPContextProvider>
          <LocalizationProvider>
            <div className={classNames.root}>
              <Suspense fallback={<Spinner size="large" />}>
                <AppHeader />
                <RouterProvider router={mainRouter} />
              </Suspense>
            </div>
          </LocalizationProvider>
        </GraphBasedSPContextProvider>
      </GraphContextProvider>
    </AuthenticationContextProvider>
  );
}

export default App;
