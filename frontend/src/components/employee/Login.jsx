import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "../../assests/logo.png";
import babusirr from "../../assests/babusirr.png";
import back4 from "../../assests/back4.png";
import { BASE_URL } from "../../constants";

const Login = () => {
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmployeeCodeChange = (e) => setEmployeeId(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        `${BASE_URL}/api/employeeRegistration/login`,
        { employeeId, password }
      );
      setLoading(false);
      localStorage.setItem("token", response.data.accessToken);
      console.log("response.data   ", response.data);
      //localStorage.setItem('EmployeeId', response.data._id);
      localStorage.setItem("CurrentUserId", response.data._id);
      navigate("/empDashbord");
    } catch (err) {
      setLoading(false);
      console.error("Error:", err);
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-[#f7f7ff]"
      style={{ backgroundImage: `url(${back4})` }}
    >
      <div className="flex flex-col lg:flex-row items-center justify-center lg:space-x-6 space-y-6 lg:space-y-0 w-full max-w-5xl p-4">
        <div className="hidden lg:block lg:w-1/2">
          <img
            src={babusirr}
            alt="Babusir"
            className="object-cover h-full w-full rounded-full shadow-lg "
          />
        </div>
        <div className="flex flex-col items-center justify-center lg:w-1/2 p-8 bg-white rounded-lg shadow-lg">
          <div className="text-center mb-6">
            <img
              src={logo}
              alt="Chatvia Logo"
              className="mx-auto mb-4 w-72 h-32"
            />
            <h2 className="text-2xl font-semibold">Employee Sign in</h2>
            <p className="text-gray-600">
              Sign in to continue with Attica Chat Portal.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
            <div className="mb-4">
              <label htmlFor="employeeCode" className="block text-gray-700">
                Employee Code
              </label>
              <input
                type="text"
                id="employeeCode"
                className="block w-full mt-2 p-2 border border-gray-300 rounded"
                placeholder="Enter your Employee Code"
                value={employeeId}
                onChange={handleEmployeeCodeChange}
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
          <div className="text-center mt-6 text-gray-600 text-sm">
            <p>
              © 2024 attica. Crafted with{" "}
              <span className="text-red-500">❤</span> by attica gold
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
