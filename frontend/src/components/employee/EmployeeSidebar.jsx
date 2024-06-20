import React from 'react';
import { CgProfile } from "react-icons/cg";
import { BsChatSquareDots } from "react-icons/bs";
import { MdGroups } from "react-icons/md";
import { RiContactsLine } from "react-icons/ri";
import { BiLogOut } from "react-icons/bi";
import logo from "../../assests/logo.png";
import { SiLivechat } from "react-icons/si";
import { Link, useNavigate } from 'react-router-dom';
import { GrChatOption } from "react-icons/gr";
const EmployeeSidebar = () => {
  const navigate = useNavigate();

  const handleGroup = () => {
    navigate("/empgroupchat");
  };

  const handleChat = () => {
    navigate("/chat");
  };



  const handleLogout = () => {
    navigate("/");
    localStorage.clear();
  };


  return (
    <div className='flex flex-row lg:flex-col h-[80px] lg:h-screen w-full lg:w-[100px] left-0 bg-[#5443c3] border-b lg:border-r shadow-md justify-between items-center py-[10px] lg:py-[20px] text-gray-500 text-2xl md:text-3xl'>
      <div className="w-16 md:w-24 lg:w-32 h-16 md:h-20 lg:h-24 mx-3 bg-[#fffefd] rounded-2xl flex items-center justify-center">
        <img className="m-2 md:m-4 lg:m-10" src={logo} alt="Logo" />
      </div>
      
      <div className="flex flex-row lg:flex-col gap-[10px] sm:gap-[10px] md:gap-[10px] lg:gap-[40px] relative">
        {/* <div className="group relative flex items-center bg-[#fffefd] rounded-full p-3 md:p-5">
          <CgProfile />
          <span className="absolute bottom-full lg:bottom-auto lg:left-full ml-2 lg:ml-0 lg:mt-2 whitespace-nowrap bg-white text-black text-xs md:text-sm rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Profile
          </span>
        </div> */}
        <div onClick={handleGroup} className="group relative flex items-center bg-[#fffefd] rounded-full p-3 md:p-5">
        <GrChatOption />
          <span className="absolute bottom-full lg:bottom-auto lg:left-full ml-2 lg:ml-0 lg:mt-2 whitespace-nowrap bg-white text-black text-xs md:text-sm rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Group Chat
          </span>
        </div>
        <div onClick={handleChat} className="group relative flex items-center bg-[#fffefd] rounded-full p-3 md:p-5">
          <BsChatSquareDots />
          <span className="absolute bottom-full lg:bottom-auto lg:left-full ml-2 lg:ml-0 lg:mt-2 whitespace-nowrap bg-white text-black text-xs md:text-sm rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Chat
          </span>
        </div>
        
        <Link to="/empToadmin" className="group relative flex items-center bg-[#fffefd] rounded-full p-3 md:p-5">
          <RiContactsLine />
          <span className="absolute bottom-full lg:bottom-auto lg:left-full ml-2 lg:ml-0 lg:mt-2 whitespace-nowrap bg-white text-black text-xs md:text-sm rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Admin
          </span>
        </Link>
        
      </div>
      
      <div onClick={handleLogout} className="group relative flex items-center bg-[#fffefd] rounded-full p-3 md:p-5 ">
        <BiLogOut />
        <span className="absolute bottom-full lg:bottom-auto lg:left-full ml-2 lg:ml-0 lg:mt-2 whitespace-nowrap bg-white text-black text-xs md:text-sm rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Logout
        </span>
      </div>
    </div>
  );
};

export default EmployeeSidebar;
