import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    age: '',
    contactNumber: '',
    password: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      console.log('Register');
      
      const response = await fetch('http://localhost:9876/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), 
      });

      if (!response.ok) {
        const errorData = await response.json(); 
        throw new Error(errorData.message || 'Registration failed');
      }
      localStorage.setItem('userEmail', formData.email);
      const data = await response.json();
      console.log('Registered:', data);
      alert(data.message); 
      navigate('/user'); 
    } catch (error) {
      console.error('Error:', error.message);
      alert(error.message || 'Registration failed');
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required />
        <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange} required />
        <input type="text" name="contactNumber" placeholder="Contact Number" value={formData.contactNumber} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
        <button type="submit">Register</button>
      </form>
      <style>
        {`
          body, html {
            margin: 0;
            padding: 0;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #f0f0f0;
          }

          .register-container {
            width: 320px;
            padding: 20px;
            border: 1px solid #ccc;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            background-color: white;
          }
          h2 {
            text-align: center;
            color: #333;
          }
          form {
            display: flex;
            flex-direction: column;
          }
          input {
            margin-bottom: 10px;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-size: 14px;
          }
          button {
            padding: 10px;
            background-color: rgb(0, 0, 0);
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
          }
          button:hover {
            background-color: rgb(122, 122, 122);
          }
        `}
      </style>
    </div>
  );
};

export default Register;
