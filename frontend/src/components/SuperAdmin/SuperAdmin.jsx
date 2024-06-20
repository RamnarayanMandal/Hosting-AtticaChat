import axios from "axios";
import React, { useState } from "react";
import Sidebar from "../admin/Sidebar";
import EmployeeDetails from "../admin/EmployeeDetails";
import AdminDetails from "./AdminDetails";
import SuperAdminSidebar from "./SuperAdminSidebar";
import { BASE_URL } from '../../constants';
const SuperAdmin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const user = { email, password }

  const handlePanic = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/serverControl/crash`
      );
      console.log("updateotp   ", res.data);
    } catch (error) {
      console.error("Error fetching OTP", error);
    }
  };

  const handleNameChange = (e) => setEmail(e.target.value);
  const handleEmpIdChange = (e) => setPassword(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors

    try {
      const response = await fetch(`${BASE_URL}/api/admin/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      console.log(response.data);
      if (response.ok) {
        const data = await response.json();
        setMessage(data.message);
      } else {
        const errorData = await response.json();
        setError(errorData.message);
      }
      setIsModalOpen(false);
    } catch (err) {
      setError("An error occurred while registering. Please try again.");
    }
  };

  return (
    <div className="lg:flex block">
  <SuperAdminSidebar/>
      <div className="flex-1 p-6">
        <div className="flex items-center mb-4 flex-col">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded h-8 mr-2"
          >
            Open Registration Form
          </button>

          <button className="bg-red-500 p-2 w-16 rounded-sm my-2 text-white text-lg " onClick={handlePanic}>
            Panic
          </button>
          <AdminDetails />
        </div>
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-lg mx-2 sm:mx-4 md:mx-6 lg:mx-auto xl:mx-auto">
              <h2 className="text-2xl font-bold mb-4">Register</h2>
              {error && <div className="text-red-500 mb-4">{error}</div>}
              <form onSubmit={handleSubmit} className="w-full">
                <div className="mb-4">
                  <label htmlFor="email" className="block text-gray-700">
                    Email
                  </label>
                  <input
                    type="text"
                    id="email"
                    className="block w-full mt-2 p-2 border border-gray-300 rounded"
                    placeholder="Email"
                    value={email}
                    onChange={handleNameChange}
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="password" className="block text-gray-700">
                    password
                  </label>
                  <input
                    type="text"
                    id="password"
                    className="block w-full mt-2 p-2 border border-gray-300 rounded"
                    placeholder="password"
                    value={password}
                    onChange={handleEmpIdChange}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="submit"
                  >
                    Register
                  </button>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="ml-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="button"
                  >
                    Cancel
                  </button>
                </div>
              </form>
              {message && <p className="text-green-500 mt-4">{message}</p>}
              {error && <p className="text-red-500 mt-4">{error}</p>}
              <div className="text-center mt-6 text-gray-600 text-sm">
                <p>
                  © 2024 attica. Crafted with{" "}
                  <span className="text-red-500">❤</span> by attica gold
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
        
    </div>
  );
};

export default SuperAdmin;
