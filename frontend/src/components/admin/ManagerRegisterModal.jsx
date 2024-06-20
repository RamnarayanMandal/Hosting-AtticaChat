import React, { useState } from "react";
import Sidebar from "./Sidebar";
import ManagerDetails from "../manager/ManagerDetails";
import { BASE_URL } from "../../constants";

const ManagerRegisterModal = () => {
  const [formData, setFormData] = useState({
    manager_Id: "",
    manager_name: "",
    manager_email: "",
    manager_password: "",
    manager_phone: "",
    manager_address: "",
    branch_city: "",
    branch_state: "",
    branch_pincode: "",
    branch_name: "",
    branch_address: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch(`${BASE_URL}/api/manager/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        console.log("Registration Successful");
        setIsModalOpen(false);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Registration failed");
      }
    } catch (error) {
      setError("An error occurred: " + error.message);
    }
  };

  return (
    <div className="lg:flex block">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="flex items-center mb-4 flex-col">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded h-8 mr-2"
          >
            Open Manager Registration Form
          </button>
          <ManagerDetails />
        </div>
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-lg mx-2 sm:mx-4 md:mx-6 lg:mx-auto xl:mx-auto">
              <h2 className="text-2xl font-bold mb-4 text-[#5816bc]">
                Register Manager
              </h2>
              {error && <div className="text-red-500 mb-4">{error}</div>}
              <form onSubmit={handleSubmit} className="w-full">
                {[
                  { label: "Manager ID", name: "manager_Id", type: "text" },
                  { label: "Manager Name", name: "manager_name", type: "text" },
                  {
                    label: "Manager Email",
                    name: "manager_email",
                    type: "email",
                  },
                  {
                    label: "Manager Password",
                    name: "manager_password",
                    type: "password",
                  },
                  {
                    label: "Manager Phone",
                    name: "manager_phone",
                    type: "text",
                  },
                  {
                    label: "Manager Address",
                    name: "manager_address",
                    type: "text",
                  },
                  { label: "Branch City", name: "branch_city", type: "text" },
                  { label: "Branch State", name: "branch_state", type: "text" },
                  {
                    label: "Branch Pincode",
                    name: "branch_pincode",
                    type: "text",
                  },
                  { label: "Branch Name", name: "branch_name", type: "text" },
                  {
                    label: "Branch Address",
                    name: "branch_address",
                    type: "text",
                  },
                ].map((field, index) => (
                  <div className="mb-4" key={index}>
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor={field.name}
                    >
                      {field.label}
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id={field.name}
                      type={field.type}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      required
                    />
                  </div>
                ))}
                <div className="flex justify-between">
                  <button
                    type="submit"
                    className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-all duration-200 transform hover:scale-105"
                  >
                    Submit
                  </button>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-all duration-200 transform hover:scale-105"
                    type="button"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerRegisterModal;
