import React, { useState,useEffect } from 'react';
import { generateGUID } from '@/lib/utils';

export default function RegisterHost() {
  const [formData, setFormData] = useState({
    host_id: "",
    owner_id: '',
    ip_address: '',
    host_name: '',
    
    signature: '',
  });

    useEffect(() => {
        const host_id = generateGUID();
        setFormData({ ...formData, host_id });
    }, []);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);

    let msg = {
        "host_id":formData.host_id,
        "owner_id":formData.owner_id,
        "ip_address":formData.ip_address,
        "host_name":formData.host_name,
        }
        console.log(msg);
    
    // Here you can handle the form submission, e.g., send the data to a server
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
      <label>
        Host ID:
        <input type="text" name="host_id" value={formData.host_id} onChange={handleChange} />
      </label>
      <label>
        Owner ID:
        <input type="text" name="owner_id"  value={formData.owner_id} onChange={handleChange} />
      </label>
      <label>
        IP Address:
        <input type="text" name="ip_address" value={formData.ip_address} onChange={handleChange} />
      </label>
      <label>
        Host Name:
        <input type="text" name="host_name" value={formData.host_name} onChange={handleChange} />
      </label>
      
      <label>
        Signature:
        <input type="text" name="signature" onChange={handleChange} />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
}