import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { IoMdSend } from "react-icons/io";
import { IoMdDocument } from "react-icons/io";
import UploadImageModal from "./Pages/UploadImageModal";
import { useParams } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { BASE_URL } from "../../constants";

const Message = ({ selectedGroupName: propsGroupName, selectedGrade: propsGrade }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [showPrompt, setShowPrompt] = useState(false);
  const [notification, setNotification] = useState(null);
  const [showPopSms, setShowPopSms] = useState(false);
  const [popSmsContent, setPopSmsContent] = useState({});
  const messagesEndRef = useRef(null);
  const adminId = localStorage.getItem("AdminId");

  const { selectedGroupName: paramsGroupName, selectedGrade: paramsGrade } = useParams();

  const selectedGroupName = propsGroupName || paramsGroupName;
  const selectedGrade = propsGrade || paramsGrade;

  useEffect(() => {
    fetchMessages();
  }, [selectedGroupName, selectedGrade]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const interval = setInterval(checkForNewMessages, 1000); // Check for new messages every 1 second
    return () => clearInterval(interval);
  }, [messages]);

  useEffect(() => {
    const interval = setInterval(fetchPopSms, 3000); // Fetch pop sms every 3 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchMessages = async () => {
    if (selectedGroupName && selectedGrade) {
      try {
        const response = await axios.get(`${BASE_URL}/api/messages`, {
          params: {
            group: selectedGroupName,
            grade: selectedGrade,
          },
        });

        const data = response.data;
        if (data && data.messages) {
          setMessages(data.messages);
        } else {
          setMessages([]);
        }
        setShowPrompt(false); // Hide the prompt when a group is selected
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    } else {
      setShowPrompt(true); // Show the prompt when no group is selected
    }
  };

  const sendMessage = async () => {
    if (message.trim() === "") return; // Don't send empty messages

    try {
      const newMessage = {
        employeeId: adminId,
        message: message,
        group: selectedGroupName,
        grade: selectedGrade,
      };

      const response = await axios.post(
        `${BASE_URL}/api/messages`,
        newMessage
      );

      if (response.status === 201) {
        // Update messages state with the new message
        setMessages([...messages, newMessage]);

        // Clear the input field after sending the message
        setMessage("");
      } else {
        console.error("Error sending message:", response.statusText);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const checkForNewMessages = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/messages`, {
        params: {
          group: selectedGroupName,
          grade: selectedGrade,
        },
      });

      const data = response.data;
      if (data && data.messages && data.messages.length > messages.length) {
        const newMessages = data.messages.slice(messages.length);
        const foreignMessage = newMessages.find(
          (msg) => msg.employeeId !== adminId
        );

        if (foreignMessage) {
          setNotification({
            employeeId: foreignMessage.employeeId,
            message: foreignMessage.message,
          });
        }
        setMessages(data.messages);
      }
    } catch (error) {
      console.error("Error checking for new messages:", error);
    }
  };

  const fetchPopSms = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/getNotificationId`);
      const data = response.data;

      if (data && data.employeeId && data.message) {
        setPopSmsContent({
          employeeId: data.employeeId,
          message: data.message,
        });
        setShowPopSms(true); // Show the popup message
      }
    } catch (error) {
      console.error("Error fetching pop sms:", error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex flex-row h-screen lg:w-[70vw] w-[100vw]">
      <div className="flex-1 flex flex-col w-full">
        <div className="flex flex-col flex-1 overflow-y-auto">
          {showPrompt && (
            <div className="bg-yellow-200 p-4 mb-4 text-yellow-800 rounded">
              Please select a group and grade to message.
            </div>
          )}

          {selectedGroupName && selectedGrade && (
            <div className="flex flex-col flex-1 bg-[#f6f5fb]">
              <div className="bg-[#ffffff] text-[#5443c3] text-2xl p-4 flex gap-2">
                <span><IoArrowBack /></span>
                <h1>{selectedGroupName}</h1>
                <p>(Grade: {selectedGrade})</p>
              </div>

              <div
                className="flex flex-col flex-1 px-4 pt-4 overflow-y-auto"
                style={{ maxHeight: "80vh" }}
              >
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.employeeId === adminId ? "justify-end" : "justify-start"
                      } mb-2`}
                  >
                    <div
                      className={`${msg.employeeId === adminId ? "bg-[#5443c3] text-white rounded-tr-3xl rounded-bl-3xl" : "bg-[#ffffff] text-[#5443c3] rounded-tl-3xl rounded-br-3xl"
                        } py-2 px-4 rounded-lg max-w-md`}
                    >
                      <p className={`text-sm font-bold ${msg.employeeId === adminId ? "text-green" : "text-purple-800"
                        }`}>
                        {msg.employeeId}
                        <span> : </span>
                      </p>
                      <p className="text-sm">{msg.message}</p>
                      {msg.Document && (
                        <div className='text-8xl my-2'>
                          <a href={msg.Document} download target="_blank" rel="noopener noreferrer">
                            <IoMdDocument />
                          </a>
                        </div>
                      )}
                      {msg.video && (
                        <div className='text-8xl my-2'>
                          <video src={msg.video} controls >
                          </video>
                        </div>
                      )}
                      {msg && msg.Image && (
                        <div>
                          <img src={msg.Image} alt="" className='rounded-lg' />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>
          )}
        </div>

        <div className="mx-auto flex items-center p-4 sticky bottom-0 z-10 bg-[#f6f5fb] w-full shadow-purple-800">
          <input
            type="text"
            className="flex-1 py-2 px-4 rounded-l-lg border-t border-b border-l text-gray-800 border-gray-200 bg-white w-full focus:outline-none placeholder-[#5443c3]"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            className="bg-[#5443c3] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r-lg"
            onClick={sendMessage}
          >
            <IoMdSend />
          </button>
          <UploadImageModal selectedGroupName={selectedGroupName} selectedGrade={selectedGrade} />
        </div>
      </div>

      {showPopSms && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg relative w-[80vw] md:w-[50vw]">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPopSms(false)}
            >
              &times;
            </button>
            <p className="font-bold">{popSmsContent.employeeId}:</p>
            <p>{popSmsContent.message}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Message;
