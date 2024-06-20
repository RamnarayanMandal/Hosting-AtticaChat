import axios from 'axios';
import React, { useState } from 'react';
import { emplyeRegistration } from '../../constants';
import Sidebar from './Sidebar';
import EmployeeDetails from './EmployeeDetails';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const Register = () => {
  const [form, setForm] = useState({
    name: '',
    password: '',
    confirmPassword: '',
    employeeId: '',
    state: '',
    language: '',
    grade: 'A', // Default value for the dropdown
    group: 'Karnataka Team' // Default value for the dropdown
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null); // For displaying errors

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const token = localStorage.getItem('AdminId'); // Retrieve token from localStorage

    try {
      const res = await axios.post(`${emplyeRegistration}`, form, {
        headers: {
          Authorization: `Bearer ${token}` // Set token in request headers
        }
      });
      console.log('Registered user', res.data);
      toast.success('User registered successfully!');
      setIsModalOpen(false);
      setForm({
        name: '',
        password: '',
        confirmPassword: '',
        employeeId: '',
        state: '',
        language: '',
        grade: 'A',
        group: 'Karnataka Team'
      });
    } catch (error) {
      console.log("An error occurred during registering a user", error);
      setError(error.response?.data?.error || "An unexpected error occurred");
    }
  };

  return (
    <div className="lg:flex block bg-[#f6f5fb]">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="flex items-center justify-between mb-4 flex-col lg:flex-row">
          <h1 className="text-xl sm:text-2xl font-bold text-[#5443c3]">Employee Details</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#5443c3] hover:bg-blue-700 text-white font-bold py-1 px-4 rounded-full h-10 mr-2 mt-4 lg:mt-0"
          >
            Open Registration Form
          </button>
        </div>
        <EmployeeDetails />
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-lg mx-2 sm:mx-4 md:mx-6 lg:mx-auto xl:mx-auto">
              <h2 className="text-2xl font-bold mb-4 text-[#5443c3]">Register</h2>
              {error && <div className="text-red-500 mb-4">{error}</div>}
              <form onSubmit={handleSubmit} className="w-full">
                {[
                  { label: 'Name', name: 'name', type: 'text' },
                  { label: 'Password', name: 'password', type: 'password' },
                  { label: 'Confirm Password', name: 'confirmPassword', type: 'password' },
                  { label: 'Employee Id', name: 'employeeId', type: 'text' },
                  { label: 'State', name: 'state', type: 'text' },
                  { label: 'Language', name: 'language', type: 'text' },
                ].map((field, index) => (
                  <div className="mb-4" key={index}>
                    <label className="block text-[#5443c3] text-sm font-bold mb-2" htmlFor={field.name}>
                      {field.label}
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id={field.name} // Ensure id is unique
                      type={field.type}
                      name={field.name}
                      value={form[field.name]}
                      onChange={handleChange}
                    />
                  </div>
                ))}
                <div className="mb-4">
                  <label className="block text-[#5443c3] text-sm font-bold mb-2" htmlFor="grade">
                    Grade
                  </label>
                  <select
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="grade"
                    name="grade"
                    value={form.grade}
                    onChange={handleChange}
                  >
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-[#5443c3] text-sm font-bold mb-2" htmlFor="group">
                    Team Name
                  </label>
                  <select
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="group"
                    name="group"
                    value={form.group}
                    onChange={handleChange}
                  >
                    <option value="Karnataka Team">Karnataka Team</option>
                    <option value="Andhra Pradesh Team">Andhra Pradesh Team</option>
                    <option value="Tamil Nadu Team">Tamil Nadu Team</option>
                    <option value="Kerala Team">Kerala Team</option>
                    <option value="Pondicherry Team">Pondicherry Team</option>
                  </select>
                </div>
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
        <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      </div>
    </div>
  );
};
