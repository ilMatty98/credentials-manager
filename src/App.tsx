import React from 'react';
import './App.css';
import { RouterProvider } from "react-router-dom";
import { routerInstance } from './routes/ReactRouter';
import AuthContextProvider from './contexts/AuthContextProvider';
import AppContextProvider from './contexts/AppContextProvider';
import { Interceptor } from './config/Interceptor';
import { InterceptorContextProvider } from './contexts/InterceptorContextProvider';

function App() {
  return (
    <AuthContextProvider>
      <AppContextProvider>
        <InterceptorContextProvider>
          <Interceptor>
            <RouterProvider router={routerInstance} />
          </Interceptor>
        </InterceptorContextProvider>
      </AppContextProvider>
    </AuthContextProvider>
  );
}

export default App;
