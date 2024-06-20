import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assests/logo-removebg.png";

const FirstPage = () => {
  const navigate = useNavigate();

  const handleAdminLogin = () => {
    navigate("/adminlogin");
  };

  const handleEmployeeLogin = () => {
    navigate("/login");
  };

  const handleManagerLogin = () => {
    navigate("/managerLogin");
  };

  const handleBillingTeamManagerLogin = () => {
    navigate("/BillingTeamManagerLogin");
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#824ece] overflow-hidden">
      {/* Bubble Design */}
      <div className="absolute bg-purple-700 rounded-full w-20 h-20 sm:w-32 sm:h-32 top-10 sm:top-20 left-5 sm:left-10 opacity-50"></div>
      <div className="absolute bg-pink-500 rounded-full w-24 h-24 sm:w-40 sm:h-40 top-5 sm:top-10 right-20 sm:right-40 opacity-50"></div>
      <div className="absolute bg-purple-800 rounded-full w-16 h-16 sm:w-24 sm:h-24 bottom-10 sm:bottom-20 right-5 sm:right-10 opacity-50"></div>
      <div className="absolute bg-pink-600 rounded-full w-20 h-20 sm:w-28 sm:h-28 bottom-20 sm:bottom-40 right-20 sm:right-40 opacity-50"></div>
      <div className="absolute bg-purple-500 rounded-full w-16 h-16 sm:w-20 sm:h-20 bottom-5 sm:bottom-10 left-10 sm:left-20 opacity-50"></div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col lg:flex-col w-11/12 sm:w-3/4 lg:w-5/6 xl:w-4/5 h-auto lg:min-h-[36rem] max-w-6xl">
        <div className="w-full bg-gradient-to-r from-purple-600 to-pink-600 p-8 sm:p-12 flex flex-col justify-center items-center relative">
          <div className="w-40 sm:w-60 p-4 sm:p-8 h-16 sm:h-24 bg-white rounded-full flex items-center justify-center">
            <img className="m-4 sm:m-10" src={logo} alt="Logo" />
          </div>
          <div className="flex flex-col items-center justify-center text-center">
            <h2 className="text-white text-3xl sm:text-4xl mb-2 leading-relaxed">
              Welcome to our{" "}
              <span className="font-extrabold text-3xl sm:text-6xl ">
                <br />
                Attic's WhatsApp
              </span>
            </h2>
          </div>

          {/* Additional Bubbles for the right section */}
          <div className="absolute bg-purple-700 rounded-full w-12 h-12 sm:w-16 sm:h-16 top-5 sm:top-10 right-5 sm:right-10 opacity-50"></div>
          <div className="absolute bg-pink-500 rounded-full w-16 h-16 sm:w-24 sm:h-24 bottom-5 sm:bottom-10 left-5 sm:left-10 opacity-50"></div>
        </div>
        <div className="w-full p-8 bg-white flex flex-col justify-between">
          <div className="flex justify-center"></div>
          <p className="text-lg sm:text-2xl text-[#5816bc] not-italic text-center mt-4 lg:mt-0">
            Login to access your account as !
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
            <button
              className="bg-purple-500 hover:bg-purple-700 text-white font-bold text-md sm:text-xl py-2 sm:py-4 px-5 sm:px-7 rounded-2xl focus:outline-none focus:shadow-outline transition-all duration-200 transform hover:scale-110"
              onClick={handleAdminLogin}
            >
              Admin
            </button>
            <button
              className="bg-purple-500 hover:bg-purple-700 text-white font-bold text-md sm:text-xl py-2 sm:py-4 px-4 sm:px-4 rounded-2xl focus:outline-none focus:shadow-outline transition-all duration-200 transform hover:scale-110"
              onClick={handleEmployeeLogin}
            >
              Employee
            </button>
            <button
              className="bg-purple-500 hover:bg-purple-700 text-white font-bold text-md sm:text-xl py-2 sm:py-4 px-4 sm:px-4 rounded-2xl focus:outline-none focus:shadow-outline transition-all duration-200 transform hover:scale-110"
              onClick={handleManagerLogin}
            >
              Manager
            </button>
            <button
              className="bg-purple-500 hover:bg-purple-700 text-white font-bold text-md sm:text-xl py-2 sm:py-4 px-4 sm:px-4 rounded-2xl focus:outline-none focus:shadow-outline transition-all duration-200 transform hover:scale-110"
              onClick={handleBillingTeamManagerLogin}
            >
              Billing Team
            </button>
            <button
              className="bg-purple-500 hover:bg-purple-700 text-white font-bold text-md sm:text-xl py-2 sm:py-4 px-4 sm:px-4 rounded-2xl focus:outline-none focus:shadow-outline transition-all duration-200 transform hover:scale-110"
              // onClick={handleBillingTeamManagerLogin}
            >
              Accounts
            </button>
            <button
              className="bg-purple-500 hover:bg-purple-700 text-white font-bold text-md sm:text-xl py-2 sm:py-4 px-4 sm:px-4 rounded-2xl focus:outline-none focus:shadow-outline transition-all duration-200 transform hover:scale-110"
              // onClick={handleBillingTeamManagerLogin}
            >
              Software
            </button>
            <button
              className="bg-purple-500 hover:bg-purple-700 text-white font-bold text-md sm:text-xl py-2 sm:py-4 px-4 sm:px-4 rounded-2xl focus:outline-none focus:shadow-outline transition-all duration-200 transform hover:scale-110"
              // onClick={handleBillingTeamManagerLogin}
            >
              HR
            </button>
            <button
              className="bg-purple-500 hover:bg-purple-700 text-white font-bold text-md sm:text-xl py-2 sm:py-4 px-4 sm:px-4 rounded-2xl focus:outline-none focus:shadow-outline transition-all duration-200 transform hover:scale-110"
              // onClick={handleBillingTeamManagerLogin}
            >
              Call Center
            </button>
            <button
              className="bg-purple-500 hover:bg-purple-700 text-white font-bold text-md sm:text-xl py-2 sm:py-4 px-4 sm:px-4 rounded-2xl focus:outline-none focus:shadow-outline transition-all duration-200 transform hover:scale-110"
              // onClick={handleBillingTeamManagerLogin}
            >
              Virtual Team
            </button>
            <button
              className="bg-purple-500 hover:bg-purple-700 text-white font-bold text-md sm:text-xl py-2 sm:py-4 px-4 sm:px-4 rounded-2xl focus:outline-none focus:shadow-outline transition-all duration-200 transform hover:scale-110"
              // onClick={handleBillingTeamManagerLogin}
            >
              Monitoring Team
            </button>
            <button
              className="bg-purple-500 hover:bg-purple-700 text-white font-bold text-md sm:text-xl py-2 sm:py-4 px-4 sm:px-4 rounded-2xl focus:outline-none focus:shadow-outline transition-all duration-200 transform hover:scale-110"
              // onClick={handleBillingTeamManagerLogin}
            >
              Bouncers/Drivers
            </button>
            <button
              className="bg-purple-500 hover:bg-purple-700 text-white font-bold text-md sm:text-xl py-2 sm:py-4 px-4 sm:px-4 rounded-2xl focus:outline-none focus:shadow-outline transition-all duration-200 transform hover:scale-110"
              // onClick={handleBillingTeamManagerLogin}
            >
              Security/CCTV
            </button>
            <button
              className="bg-purple-500 hover:bg-purple-700 text-white font-bold text-md sm:text-xl py-2 sm:py-4 px-4 sm:px-4 rounded-2xl focus:outline-none focus:shadow-outline transition-all duration-200 transform hover:scale-110"
              // onClick={handleBillingTeamManagerLogin}
            >
              Digital Marketing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirstPage;
