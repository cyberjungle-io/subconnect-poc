import { useState, useEffect } from "react";
import { getAccounts } from "@/lib/polkadotWallet.js";

import { Button } from "@/components/ui/button";

const PolkadotJSModal = ({onClose,handleSelectContent }) => {
  const [accounts, setAccounts] = useState([]);
  

  useEffect(() => {
    async function fetchAccounts() {
      const accounts = await getAccounts("subconnect-poc");
      setAccounts(accounts);
      console.log("Accounts found", accounts);
    }
    fetchAccounts();
  }, []);

  

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-40 flex justify-center items-center">
      <div className="relative bg-white p-4 md:p-6 lg:p-8 rounded-lg shadow-lg max-w-md max-h-full overflow-y-auto z-50">
        <button
          onClick={onClose}
          className="absolute top-0 right-0 mt-4 mr-4 text-gray-700 hover:text-gray-900"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Select Account
        </h2>
        <div className="mt-4">
        <ul>
          {accounts.map((item, index) => (
            <li key={index} className="flex justify-between items-center">
              <button onClick={() => handleSelectContent(item)}>
                {item.meta.name}
              </button>
              
            </li>
          ))}
        </ul>
        
        </div>
      </div>
    </div>
  );
};
export default PolkadotJSModal;