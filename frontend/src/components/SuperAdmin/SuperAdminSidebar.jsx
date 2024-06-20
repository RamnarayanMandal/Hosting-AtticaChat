import React, { useState } from 'react';
import { BsChatSquareDots } from "react-icons/bs";
import { BiLogOut } from "react-icons/bi";
import logo from '../../assests/logo.png'
import { SiLivechat } from "react-icons/si";
import { Link, useNavigate } from 'react-router-dom';
import { GrChatOption } from "react-icons/gr";
import { MdDashboard } from "react-icons/md";


const SuperAdminSidebar = () => {
  const navigate = useNavigate();
  const [showEmployeeOptions, setShowEmployeeOptions] = useState(false);
  const [activeRoute, setActiveRoute] = useState('/atticDashboard'); // Default active route

  const handleNavigation = (route) => {
    setActiveRoute(route);
    navigate(route);
  };

  const handleLogout = () => {
    navigate("/");
    localStorage.clear();
  };



  return (
    <div className='flex flex-row lg:flex-col h-[80px] lg:h-screen w-full lg:w-[100px] left-0 bg-[#5443c3] border-b lg:border-r shadow-md justify-between items-center py-[10px] lg:py-[20px] text-gray-500'>
      <div className="w-16 md:w-20 lg:w-24 h-12 md:h-16 lg:h-20 mx-3 bg-[#fffefd] rounded-2xl flex items-center justify-center">
        <img className="m-2 md:m-4 lg:m-6" src={logo} alt="Logo" />
      </div>
      
      <div className="flex flex-row lg:flex-col gap-2 md:gap-3 lg:gap-5 relative">
        <div
          onClick={() => handleNavigation('/atticDashboard')}
          className={`group relative flex items-center rounded-full p-2 md:p-4 lg:p-5 cursor-pointer ${activeRoute === '/atticDashboard' ? 'bg-blue-500 text-white' : 'bg-[#fffefd]'}`}
        >
          <MdDashboard className="text-lg md:text-2xl lg:text-3xl" />
          <span className="absolute bottom-full lg:bottom-auto lg:left-full ml-2 lg:ml-0 lg:mt-2 whitespace-nowrap bg-black text-white text-xs md:text-sm rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Dashboard
          </span>
        </div>

        <div
          onClick={() => handleNavigation('/superAdminGroups')}
          className={`group relative flex items-center rounded-full p-2 md:p-4 lg:p-5 cursor-pointer ${activeRoute === '/Groups' ? 'bg-blue-500 text-white' : 'bg-[#fffefd]'}`}
        >
          <GrChatOption className="text-lg md:text-2xl lg:text-3xl" />
          <span className="absolute bottom-full lg:bottom-auto lg:left-full ml-2 lg:ml-0 lg:mt-2 whitespace-nowrap bg-black text-white text-xs md:text-sm rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Group Chat
          </span>
        </div>

       

        <div
          onClick={() => handleNavigation('/superAdminLiveMesages')}
          className={`group relative flex items-center rounded-full p-2 md:p-4 lg:p-5 cursor-pointer ${activeRoute === '/livemesages' ? 'bg-blue-500 text-white' : 'bg-[#fffefd]'}`}
        >
          <SiLivechat className="text-lg md:text-2xl lg:text-3xl" />
          <span className="absolute bottom-full lg:bottom-auto lg:left-full ml-2 lg:ml-0 lg:mt-2 whitespace-nowrap bg-black text-white text-xs md:text-sm rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Live Chat
          </span>
        </div>

        {/* <Link
          to="/adminToemp"
          className={`group relative flex items-center rounded-full p-2 md:p-4 lg:p-5 cursor-pointer ${activeRoute === '/adminToemp' ? 'bg-blue-500 text-white' : 'bg-[#fffefd]'}`}
        >
          <BsChatSquareDots className="text-lg md:text-2xl lg:text-3xl" />
          <span className="absolute bottom-full lg:bottom-auto lg:left-full ml-2 lg:ml-0 lg:mt-2 whitespace-nowrap bg-black text-white text-xs md:text-sm rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Employee
          </span>
        </Link> */}
      </div>

      <div
        onClick={handleLogout}
        className="group relative flex items-center bg-[#fffefd] rounded-full p-2 md:p-4 lg:p-5 cursor-pointer"
      >
        <BiLogOut className="text-lg md:text-2xl lg:text-3xl" />
        <span className="absolute bottom-full lg:bottom-auto lg:left-full ml-2 lg:ml-0 lg:mt-2 whitespace-nowrap bg-black text-white text-xs md:text-sm rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Logout
        </span>
      </div>
    </div>
  );
};

export default SuperAdminSidebar;
