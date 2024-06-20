import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { IoMdDocument } from "react-icons/io";
import SuperAdminSidebar from "./SuperAdminSidebar";
import { BASE_URL } from '../../constants';
const SuperAdminLiveChat = () => {
  const [liveChatMessages, setLiveChatMessages] = useState([]);
  const adminId = localStorage.getItem("AdminId");
  const bottomRef = useRef(null);

  useEffect(() => {
    const fetchLiveChatMessages = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/messages/last-24-hours`
        );
        console.log("live......",response.data)
        setLiveChatMessages(response.data);
      } catch (error) {
        console.error("Error fetching live chat messages:", error);
      }
    };

    fetchLiveChatMessages();

    // Fetch new messages every 10 seconds
    const interval = setInterval(() => {
      fetchLiveChatMessages();
    }, 10000);

    return () => clearInterval(interval); // Clear interval on component unmount
  }, []);

  useEffect(() => {
    // Scroll to the bottom when messages are updated
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [liveChatMessages]);

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      <SuperAdminSidebar/>
      <div className="flex-1 flex flex-col w-full lg:w-auto">
        <div className="flex flex-col flex-1 lg:bg-[#f6f5fb] lg:border-l lg:border-gray-200 lg:overflow-y-auto">
          <h2 className="text-lg font-bold p-4 bg-[#ffffff] text-[#5443c3] lg:hidden">
            Live Chat (Last 24 Hours)
          </h2>
          <div className="flex flex-col flex-1 p-4">
            {liveChatMessages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.employeeId === adminId ? "justify-end" : "justify-start"
                } mb-2`}
              >
                <div
                  className={`py-2 px-4 rounded-lg max-w-md ${
                    msg.employeeId === adminId
                      ? "self-end bg-[#5443c3] text-white rounded-tr-3xl rounded-bl-3xl"
                      : "self-start bg-[#ffffff] text-[#5443c3] rounded-tl-3xl rounded-br-3xl"
                  }`}
                >
                  <p className="text-sm font-bold">Group: {msg.group}</p>
                  <p className="text-sm font-bold">Grade: {msg.grade}</p>
                  <p className="text-sm font-bold">
                    {msg.employeeId}
                    <span> : </span>
                  </p>
                  {msg.document && (
                    <div className="text-8xl my-2">
                      <a
                        href={msg.document}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <IoMdDocument />
                      </a>
                    </div>
                  )}
                  {msg.video && (
                    <div className="text-8xl my-2">
                      <video src={msg.video} controls></video>
                    </div>
                  )}

                  {msg.image && (
                    <div>
                      <img src={msg.image} alt="" className="rounded-lg" />
                    </div>
                  )}
                  <p className="text-lg">{msg.messages}</p>
                  <p className="text-xs">
                    {new Date(msg.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
            <div ref={bottomRef} /> {/* Dummy div to help with scrolling */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminLiveChat;
