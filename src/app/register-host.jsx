import React, { useState, useEffect,useContext } from "react";
import { generateGUID,registerHost } from "@/lib/utils";
import { signTransaction,isValidSignature } from "@/lib/polkadotWallet";
import { GlobalStateContext } from "@/app/page";




export default function RegisterHost() {
  const { globalState, setGlobalState } = useContext(GlobalStateContext);
  function stringToHex(string) {
    return Buffer.from(string, 'utf8').toString('hex');
  }
  const [formData, setFormData] = useState({
    host_id: "",
    owner_id: globalState.account_id,
    ip_address: "",
    host_name: "",

    signature: "",
  });

  useEffect(() => {
    const host_id = generateGUID();

    setFormData({ ...formData, host_id });
  }, []);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);

    let msg = {
      host_id: formData.host_id,
      owner_id: formData.owner_id,
      ip_address: formData.ip_address,
      host_name: formData.host_name,
    };
    /*const accts = await getAccounts("sub-connect");
    console.log(msg);
     const acct = accts.find((a) => a.address === msg.owner_id);
    console.log("address: " + JSON.stringify(acct)) */
    const signature = await signTransaction(formData.owner_id,formData.owner_id,"sub-connect");
    
    
    console.log("Signature: " + signature);

    let isValid = await isValidSignature(formData.owner_id, signature, formData.owner_id);
    console.log("isValid: " + isValid);

    //const rs = await verifyFromPolkadotJs(msg.owner_id, signature, msg.owner_id);
    
    //const result =  signatureVerify(stringToU8a(acct.address), signature, acct.address);
    //console.log("varified: " + JSON.stringify(result));
    msg.signature = signature;
    console.log(msg);
    
    await registerHost(msg);
    
  };
  
  return (
    <div className="flex justify-center mt-10">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg"
      >
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Host ID:
            <input
              type="text"
              name="host_id"
              value={formData.host_id}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </label>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Owner ID:
            <input
              type="text"
              name="owner_id"
              value={formData.owner_id}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </label>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            IP Address:
            <input
              type="text"
              name="ip_address"
              value={formData.ip_address}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </label>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Host Name:
            <input
              type="text"
              name="host_name"
              value={formData.host_name}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </label>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Signature:
            <input
              type="text"
              name="signature"
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </label>
        </div>
        <div className="flex justify-center mt-4">
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
