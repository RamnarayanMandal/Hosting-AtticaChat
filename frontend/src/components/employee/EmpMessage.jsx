import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { IoMdDocument } from "react-icons/io";
import { IoArrowBack } from "react-icons/io5";
import { BASE_URL } from '../../constants';
const EmpMessage = () => {
  const [employees, setEmployees] = useState([]);
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const currentUserId = localStorage.getItem("CurrentUserId");

  // Fetch employees from the API
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/employee/`);
        setEmployees(response.data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployees();
  }, []);

  // Fetch messages from the API based on the selected employee
  useEffect(() => {
    if (employees.length > 0) {
      const selectedEmployee = employees.find(emp => emp._id === currentUserId);
      if (selectedEmployee) {
        const fetchMessages = async () => {
          try {
            const response = await axios.get(
              `${BASE_URL}/api/messages`,
              {
                params: {
                  group: selectedEmployee.group,
                  grade: selectedEmployee.grade,
                },
              }
            );
            setMessages(response.data.messages);
          } catch (error) {
            console.error("Error fetching messages:", error);
          }
        };

        fetchMessages();

        // Set up polling for new messages
        const interval = setInterval(fetchMessages, 100); // Poll every 5 seconds

        return () => clearInterval(interval); // Clean up the interval
      }
    }
  }, [employees, currentUserId]);

  // Scroll to the bottom of the messages list
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleFileDownload = (url) => {
    window.open(url, "_blank");
  };

  const sendMessage = async () => {
    try {
      const selectedEmployee = employees.find(emp => emp._id === currentUserId);
      if (!selectedEmployee) {
        console.error("No employee found for current user.");
        return;
      }

      await axios.post(`${BASE_URL}/api/messages`, {
        employeeId: selectedEmployee.name, // Use _id of the employee
        message: newMessage,
        group: selectedEmployee.group,
        grade: selectedEmployee.grade,
      });
      
      setNewMessage(""); // Clear the input field
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const [newMessage, setNewMessage] = useState("");

  return (
    <div className="flex h-screen w-full">
      {/* Chat Section */}
      <div className="flex-1 flex flex-col w-full">
        <div className="bg-white p-4 shadow-md flex items-center gap-4">
          <IoArrowBack
            className="mr-2 cursor-pointer"
            onClick={() => setMessages([])}
          />
          {employees.length > 0 && (
            <>
              <h2 className="text-xl font-bold">
                Group: {employees[0].group}
              </h2>
              <h2 className="text-xl font-bold">
                Grade: {employees[0].grade}
              </h2>
            </>
          )}
        </div>
        <div className="flex-1 p-4 overflow-y-auto">
          {messages.length > 0 ? (
            messages.map((msg) => (
              <div
                key={msg._id}
                className={`flex ${
                  msg.employeeId === currentUserId
                    ? "justify-end"
                    : "justify-start"
                } mb-2`}
              >
                <div
                  className={`${
                    msg.employeeId === currentUserId
                      ? "bg-blue-500 text-white self-end"
                      : "bg-gray-200 text-gray-800 self-start"
                  } p-2 rounded-lg max-w-xs`}
                >
                  {msg.message && (
                    <p className="text-sm mb-1">
                      <span className="font-bold">{msg.employeeId}:</span>{" "}
                      {msg.message}
                    </p>
                  )}
                  {msg.Document && (
                    <div className="text-2xl my-2">
                      <button
                        className="focus:outline-none"
                        onClick={() => handleFileDownload(msg.Document)}
                      >
                        <IoMdDocument />
                      </button>
                    </div>
                  )}
                  {msg.Image && (
                    <div className="my-2">
                      <img src={msg.Image} alt="" className="rounded-lg" />
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No messages yet.</p>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="p-4 bg-white shadow-md">
          <div className="flex items-center border border-gray-300 rounded-lg">
            <input
              type="text"
              className="flex-1 py-2 px-4 focus:outline-none"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button
              className="py-2 px-4 bg-blue-500 text-white rounded-lg ml-2"
              onClick={sendMessage}
              disabled={!newMessage.trim()}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmpMessage;
