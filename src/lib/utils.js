
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"


export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function generateGUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0,
        v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export async function getStorageData(account_id) {
  try {
    const response = await fetch('http://10.2.3.100:8002/getData', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({key: 'subconnect-poc', account_id: account_id})
    });

    if (!response.ok) {
      throw new Error('Failed to get data');
    }

    const data = await response.json();
    console.log(data);
    return data;
  }
  catch (error) {
    console.error('Error getting data:', error);
  }
}


export async function setStorageData(globalState) {
  console.log(globalState);
  try {
    const tjson = {
      "data":globalState.data,
      "account_id":globalState.account_id,
      "key":"subconnect-poc"
    }
    console.log(tjson);
     const response = await fetch('http://10.2.3.100:8002/setData', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(tjson)
    }); 

    if (!response.ok) {
      throw new Error('Failed to set data');
    }

    // Handle the response if needed
    // ...

  } catch (error) {
    console.error('Error setting data:', error);
  }
}