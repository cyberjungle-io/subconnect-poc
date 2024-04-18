// GlobalState.js
import React, { createContext, useContext, useState } from 'react';

const GlobalStateContext = createContext();

export const useGlobalState = () => useContext(GlobalStateContext);

export const GlobalStateProvider = ({ children }) => {
  const [globalState, setGlobalState] = useState({
    account_id: null,
    key: null,
    config: {
      tiles: {},
      dashboards: {},
      charts: {},
    },
  });

  const updateGlobalState = (newState) => {
    setGlobalState(newState);
  };

  return (
    <GlobalStateContext.Provider value={{ globalState, updateGlobalState }}>
      {children}
    </GlobalStateContext.Provider>
  );
};