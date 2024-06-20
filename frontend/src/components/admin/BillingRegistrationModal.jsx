import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import BillingTeamDetails from "../BillingTeam/BillingTeamDetails";
import { BASE_URL } from "../../constants";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BillingRegistrationModal = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    branch_name: "",
    branch_state: "",
    branch_city: "",
    branch_pincode: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null); // For displaying errors

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BASE_URL}/api/billingTeam/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log("Registration successful");
        toast.success("Registration successful");
        setIsModalOpen(false); // Close the modal on successful registration
        navigate("/billingTeamRegister");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Registration failed");
        toast.error(errorData.message || "Registration failed");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setError("An error occurred, please try again.");
      toast.error("An error occurred, please try again.");
    }
  };

  return (
    <div className="lg:flex block bg-[#f6f5fb]">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="flex items-center justify-between mb-4 flex-col lg:flex-row">
          <h1 className="text-xl sm:text-2xl font-bold text-[#5443c3]">
            Billing Team Details
          </h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#5443c3] hover:bg-blue-700 text-white font-bold py-1 px-4 rounded-full h-10 mr-2 mt-4 lg:mt-0"
          >
            Open Billing Registration Form
          </button>
        </div>
        <BillingTeamDetails />
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-lg mx-2 sm:mx-4 md:mx-6 lg:mx-auto xl:mx-auto">
              <h2 className="text-2xl font-bold mb-4 text-[#5443c3]">
                Register for Billing Team
              </h2>
              {error && <div className="text-red-500 mb-4">{error}</div>}
              <form onSubmit={handleSubmit} className="w-full">
                {[
                  { label: "Name", name: "name", type: "text" },
                  { label: "Email", name: "email", type: "email" },
                  { label: "Password", name: "password", type: "password" },
                  { label: "Phone", name: "phone", type: "text" },
                  { label: "Address", name: "address", type: "text" },
                  { label: "Branch Name", name: "branch_name", type: "text" },
                  { label: "Branch State", name: "branch_state", type: "text" },
                  { label: "Branch City", name: "branch_city", type: "text" },
                  {
                    label: "Branch Pincode",
                    name: "branch_pincode",
                    type: "text",
                  },
                ].map((field, index) => (
                  <div className="mb-4" key={index}>
                    <label
                      className="block text-[#5443c3] text-sm font-bold mb-2"
                      htmlFor={field.name}
                    >
                      {field.label}
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id={field.name} // Ensure id is unique
                      type={field.type}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                    />
                  </div>
                ))}
                <div className="flex items-center justify-between">
                  <button
                    className="bg-[#5443c3] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
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
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default BillingRegistrationModal;
