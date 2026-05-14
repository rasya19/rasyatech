import React, { createContext, useContext, useEffect, useState } from 'react';

const SubdomainContext = createContext<string | null>(null);

export const SubdomainProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [subdomain, setSubdomain] = useState<string | null>(null);

  useEffect(() => {
    const hostname = window.location.hostname;
    const parts = hostname.split('.');
    if (parts.length >= 3) {
      setSubdomain(parts[0]);
    } else {
      setSubdomain(null); // Main domain
    }
  }, []);

  return (
    <SubdomainContext.Provider value={subdomain}>
      {children}
    </SubdomainContext.Provider>
  );
};

export const useSubdomain = () => useContext(SubdomainContext);
