// InterceptorContext.tsx
import React, { createContext, useContext, useState } from 'react';
import { AUTHENTICATION_SERVICE_URL } from '../config/Config';

interface InterceptorContextProps {
  baseURL: string;
  setBaseURL: (url: string) => void;
}

const InterceptorContext = createContext<InterceptorContextProps | undefined>(undefined);

export const InterceptorContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [baseURL, setBaseURL] = useState<string>(AUTHENTICATION_SERVICE_URL as string);

  return (
    <InterceptorContext.Provider value={{ baseURL, setBaseURL }}>
      {children}
    </InterceptorContext.Provider>
  );
};

export const useInterceptor = () => {
  const context = useContext(InterceptorContext);
  if (!context) {
    throw new Error('useInterceptor must be used within an InterceptorProvider');
  }
  return context;
};
