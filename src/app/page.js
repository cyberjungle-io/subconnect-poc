"use client";
import React, { useState, useEffect, useContext, createContext } from "react";

import TileEditor from "./tile-editor.jsx";
import ChartEditor from "./chart-editor.jsx";
import DashboardEditor from "./dashboard-editor.jsx";
import TileEditorEditor from "./tile-editor.jsx";
import { Button } from "@/components/ui/button";
import Dashboard from "./dashboard.jsx";
import RegisterHost from "./register-host.jsx";
import Navbar from "../components/custom/Navbar.jsx";
import Footer from "../components/custom/footer.jsx";
import PolkadotJSModal from "@/components/ui/select-js-wallet.jsx";
import { setStorageData, getStorageData } from "@/lib/utils";

const initialState = {
  account_id: null,
  key: null,
  data: {
    tiles: [],
    dashboards: [],
    charts: [],
  },
};
// Create a context
export const GlobalStateContext = createContext();

export default function Home() {
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [page, setPage] = useState("dashboard");
  const [globalState, setGlobalState] = useState(initialState);
  const [selectedAccount, setSelectedAccount] = useState({ name: ''});
  
  const handleSelectAccountContent = (acct) => {
    console.log(acct);
    const newacct = {
      name: acct.meta.name,
      address: acct.address,
    };
    //saveLocalStorage(newacct);
    localStorage.setItem("subconnect", JSON.stringify(newacct));
    console.log(globalState);
    setGlobalState(initialState)
    globalState["account_id"] = newacct.address;
    getStorageData(newacct.address);
    setSelectedAccount(newacct);
    setIsAccountModalOpen(false);
    //location.reload();
  };
  
useEffect(() => {
  console.log("Global State", globalState);
} ,[globalState]);
  return (
    <GlobalStateContext.Provider value={{ globalState, setGlobalState }}>
      {isAccountModalOpen && (
        <div className="modal">
          <PolkadotJSModal
            onClose={() => setIsAccountModalOpen(false)}
            handleSelectContent={handleSelectAccountContent}
          />
        </div>
      )}
      <div className="flex flex-col min-h-screen bg-gray-100">
        <Navbar
          setPage={setPage}
          setIsAccountModalOpen={setIsAccountModalOpen}
          accountName={selectedAccount.name}
        />
        <main className="flex-grow">
          {page === "chart" && <ChartEditor />}
          {page === "dashboard" && <Dashboard />}
          {page === "tileEditor" && <TileEditor />}
          {page === "registerHost" && <RegisterHost />}
        </main>
        <Footer />
      </div>
    </GlobalStateContext.Provider>
  );
}
