import React from 'react';
import './App.css';
import { TokenBrokerAuthService } from './services/auth/TokenBrokerAuthService';
import { AuthenticationContextProvider } from './context/AuthenticationContext';
import { GraphContextProvider } from './context/GraphContext';
import { ContainerPicker } from './components/ContainerPicker';
import { ContainerView } from './components/ContainerView';
import { GraphBasedSPContextProvider } from './context/GraphBasedSPContext';

function App() {
  const authService = new TokenBrokerAuthService()
  const [selectedContainer, setSelectedContainer] = React.useState<string | undefined>(undefined);
  return (
    <AuthenticationContextProvider authProvider={authService} >
      <GraphContextProvider>
        <GraphBasedSPContextProvider >
          <div className="App">
            <ContainerPicker onContainerPicked={(containerId) => {
              setSelectedContainer(containerId);
            }} />

            {selectedContainer && <ContainerView key={selectedContainer} containerId={selectedContainer} />}
          </div>
        </GraphBasedSPContextProvider>
      </GraphContextProvider>
    </AuthenticationContextProvider>
  );
}

export default App;
