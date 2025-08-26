'use client';

import { createCompany } from '@/app/actions';
import { useState } from 'react';

export default function TestServerAction() {
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    phone: '',
    slogan: '',
    about: '',
    website: '',
    companySize: '',
    establishedYear: '',
    category: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Create a FormData object to simulate the form submission
    const submitFormData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) submitFormData.append(key, value);
    });

    try {
      const result = await createCompany(null, submitFormData);
      console.log('Result:', result);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="companyName"
        value={formData.companyName}
        onChange={handleChange}
        placeholder="Company Name"
        required
      />
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
      />
      <button type="submit">Submit</button>
    </form>
  );
}