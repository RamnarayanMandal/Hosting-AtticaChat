import React, { useState } from "react";
import axios from "axios";
import babusirr from "../../assests/babusirr.png";
import logo from "../../assests/logo.png";
import back3 from "../../assests/back3.png"; // Keep this import if you need to reference the image path directly elsewhere

import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../constants";
// lkgk
const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(`${BASE_URL}/api/admin/login`, {
        email,
        password,
      });
      setLoading(false);
      console.log("Admin", response.data.data._id);
      localStorage.setItem("token", response.data.accessToken);
      localStorage.setItem("AdminId", email);
      localStorage.setItem("CurrentUserId", response.data.data._id);
      navigate("/admin/dashboard");
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center p-4 sm:p-6 lg:p-8"
      style={{ backgroundImage: `url(${back3})` }}
    >
      <div className="flex flex-col lg:flex-row items-center justify-center w-full max-w-5xl bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <img
            src={babusirr}
            alt="Babusir"
            className="object-cover w-full max-w-md h-auto rounded-full"
          />
        </div>
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
          <div className="text-center mb-6">
            <img
              src={logo}
              alt="Chatvia Logo"
              className="mx-auto mb-4 w-48 h-16 sm:w-72 sm:h-32"
            />
            <h2 className="text-2xl font-semibold">Admin Sign in</h2>
            <p className="text-gray-600 mt-5">
              Sign in to continue with Attica Chat Portal.
            </p>
          </div>
          <div className="w-full max-w-md">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="block w-full mt-2 p-2 border border-gray-300 rounded"
                  placeholder="Enter your Email"
                  value={email}
                  onChange={handleEmailChange}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="block text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="block w-full mt-2 p-2 border border-gray-300 rounded"
                  placeholder="********"
                  value={password}
                  onChange={handlePasswordChange}
                />
              </div>
              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
              <button
                type="submit"
                className="w-full bg-purple-500 text-white p-2 rounded hover:bg-[#7269ef]"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>
          </div>
          <div className="text-center mt-6 text-gray-600 text-sm">
            <p>
              © 2024 attic's ChatApp Crafted with{" "}
              <span className="text-red-500">❤</span> by attica gold
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
