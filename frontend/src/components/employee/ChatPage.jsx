import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { AiOutlineSearch, AiOutlineDown } from "react-icons/ai";
import { BiLogOut } from "react-icons/bi";
import { Link } from "react-router-dom";
import { IoIosDocument } from "react-icons/io";
import { FaVideo, FaImage } from "react-icons/fa";
import EmployeeSidebar from "./EmployeeSidebar";
import FileUploadModel from "./FileUploadModel";
import { BASE_URL } from "../../constants";
import { useSound } from "use-sound";
// import notificationSound from '../../assets/sound.wav';
import notificationSound from '../../assests/sound.wav'
import ForwardMessageModalEmp from './ForwardMessageModalEmp'

function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [users, setUsers] = useState([]);
  const loggedInUserId = localStorage.getItem("CurrentUserId");
  const [recipient, setRecipient] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [sender, setSender] = useState(loggedInUserId);
  const [attachment, setAttachment] = useState(null);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const messagesEndRef = useRef(null);
  const [unreadUsers, setUnreadUsers] = useState([]);
  const [showMessages, setShowMessages] = useState({});
  const [showPopSms, setShowPopSms] = useState(false);
  const [popSms, setPopSms] = useState([]);
  const [selectedSender, setSelectedSender] = useState("");
  const [selectedSenderName, setSelectedSenderName] = useState("");
  const [isMobileView, setIsMobileView] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [playNotificationSound] = useSound(notificationSound);
  const [hoveredMessage, setHoveredMessage] = useState(null);
  const [showDropdown, setShowDropdown] = useState(null);
  const [forwardMessage, setForwardMessage] = useState(null);
  const [showForwardModal, setShowForwardModal] = useState(false);


  const handleClick = (id, name) => {
    setSender(loggedInUserId);
    setRecipient(id);
    setRecipientName(name);
    fetchMessages(loggedInUserId, id);
    if (isMobileView) setShowChat(true);
  };

  const fetchMessages = (sender, recipient) => {
    axios
      .get(`${BASE_URL}/api/getmessages/${recipient}/${sender}`)
      .then((response) => {
        setMessages(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/employee/`)
      .then((response) => {
        const filteredUsers = response.data.filter(
          (user) => user._id !== loggedInUserId
        );
        setUsers(filteredUsers);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [loggedInUserId]);

  useEffect(() => {
    if (sender && recipient) {
      fetchMessages(sender, recipient);
    }
  }, [sender, recipient]);

  const handleSendMessage = () => {
    if (!newMessage.trim() && !attachment) return;

    const messageData = {
      sender: loggedInUserId,
      recipient: recipient,
      text: newMessage,
      image: attachment?.type.startsWith("image/") ? attachment.url : null,
      document: attachment?.type.startsWith("application/") ? attachment.url : null,
      video: attachment?.type.startsWith("video/") ? attachment.url : null,
    };

    axios
      .post(`${BASE_URL}/api/postmessages`, messageData)
      .then((response) => {
        setMessages([...messages, response.data.data]);
        setNewMessage("");
        setAttachment(null);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleFileUpload = (file, fieldName) => {
    const reader = new FileReader();
    reader.onload = () => {
      setAttachment({
        url: reader.result,
        type: file.type,
      });
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (users.length > 0) {
      const fetchUnreadMessages = async () => {
        try {
          const unreadUsersData = await Promise.all(
            users.map(async (user) => {
              const response = await axios.get(
                `${BASE_URL}/api/mark-messages-read/${user._id}`
              );
              return { userId: user._id, data: response.data };
            })
          );
          setUnreadUsers(unreadUsersData);
        } catch (error) {
          console.error(error);
        }
      };
      fetchUnreadMessages();
      const intervalId = setInterval(fetchUnreadMessages, 3 * 1000);
      return () => clearInterval(intervalId);
    }
  }, [users]);


  const fetchPopSms = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/getNotification/${loggedInUserId}`
      );
      const data = response.data;
      setPopSms(data);
      if (data.length > 0) {
        const senderId = data[0].sender;
        setSelectedSender(senderId);
        setShowPopSms(true);
        const empDetails = await axios.get(
          `${BASE_URL}/api/employee/a/${senderId}`
        );
        setSelectedSenderName(empDetails.data.name);

        // Play notification sound
        playNotificationSound();
      }
    } catch (error) {
      console.error("Error fetching pop SMS:", error);
    }
  };

  useEffect(() => {
    const interval = setInterval(fetchPopSms, 5000);
    return () => clearInterval(interval);
  }, [loggedInUserId, playNotificationSound]);

  const handleModalClose = (senderId) => {
    axios
      .delete(`${BASE_URL}/api/deleteNotification/${senderId}`)
      .then(() => {
        setShowPopSms(false);
      })
      .catch((error) => {
        console.error("Error deleting notification:", error);
      });
  };

  const handleBackToEmployees = () => {
    setShowChat(false);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleHover = (index) => {
    setHoveredMessage(index);
  };

  const handleDropdownClick = (index) => {
    setShowDropdown(showDropdown === index ? null : index);
  };

  const handleReply = (message) => {
    setNewMessage(`Replying to: ${message.content.text}`);
  };

  const handleForward = (message) => {
    console.log(message);
    setForwardMessage(message);
    setShowForwardModal(true);
    setShowDropdown(null);
  };

  const handleForwardMessage = () => {

    setShowForwardModal(false);
    setShowDropdown(null);
  };

  const handleCancelForward = () => {
    setShowForwardModal(false);
  };


  return (
    <div className="flex flex-col lg:flex-row h-screen">
      <EmployeeSidebar />
      {isMobileView && showChat ? (
        <div className="w-full lg:w-3/4 bg-gray-50 flex flex-col justify-between">
          <div className="flex items-center justify-between p-4 bg-blue-200">
            <div>
              <h1 className="text-2xl font-bold">{recipientName}</h1>
            </div>
            <button
              onClick={handleBackToEmployees}
              className="bg-red-500 text-white p-2 rounded-md"
            >
              Back
            </button>
          </div>
          <div className="flex-grow overflow-y-auto p-4 flex flex-col">
            {messages.map((message) => (
              <div
                key={message._id}
                className={`mb-4 p-4 rounded-lg max-w-[70%] ${message.sender === loggedInUserId
                    ? "bg-blue-200 self-end"
                    : "bg-gray-200 self-start"
                  }`}
              >
                {message.content && message.content.text && (
                  <p className="font-bold">{message.content.text}</p>
                )}
                {message.content && message.content.image && (
                  <img src={message.content.image} alt="Image" className="max-w-xs" />
                )}
                {message.content && message.content.document && (
                  <a
                    href={message.content.document}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    <IoIosDocument className="text-9xl" />
                  </a>
                )}
                {message.content && message.content.video && (
                  <video controls className="max-w-xs">
                    <source src={message.content.video} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
                <span className="text-xs text-gray-500">
                  {new Date(message.createdAt).toLocaleString()}
                </span>
                {hoveredMessage === index && (
                    <AiOutlineDown
                      className="absolute top-2 right-2 cursor-pointer"
                      onClick={() => handleDropdownClick(index)}
                    />
                  )}
                  {showDropdown === index && (
                    <div className="absolute top-8 right-2 bg-white border rounded shadow-lg z-10">
                      <button
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => handleReply(message)}
                      >
                        Reply
                      </button>
                      <button
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => handleForward(message)}
                      >
                        Forward
                      </button>
                    </div>
                  )}

              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="flex items-center p-4 bg-white border-t border-gray-200 fixed bottom-0 w-full lg:static">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message"
              className="flex-grow p-2 border rounded-lg mr-2"
            />
            <FileUploadModel sender={sender} recipient={recipient} />
            <button
              onClick={handleSendMessage}
              className="bg-blue-500 text-white p-2 rounded-lg"
            >
              Send
            </button>
            
          </div>
          <>
          {showPopSms && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div
                className={`bg-white relative p-6 rounded-lg shadow-lg w-[80vw] md:w-[50vw] lg:w-[30vw]`}
              >
                {showPopSms && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div
                      className={`bg-white relative p-4 rounded-lg shadow-lg w-[80vw] md:w-[50vw] lg:w-[30vw] animate-pop-up`}
                    >
                      {popSms.length > 0 &&
                        popSms
                          .filter((sms) => sms.sender === selectedSender)
                          .map((sms) => (
                            <div
                              key={sms.id}
                              className="relative border border-gray-200 rounded-lg p-2 mb-2 shadow-sm"
                            >
                              <div className="flex items-center justify-center mb-1">
                                <i className="fas fa-bell text-yellow-500 text-sm mr-2"></i>
                                <h1 className="text-xl font-bold text-green-600 text-center">
                                  {selectedSenderName}
                                </h1>
                              </div>
                              <p className="text-base font-bold mb-1">
                                {sms.content.text}
                              </p>
                              <p className="text-sm text-gray-500 mb-2">
                                {new Date(sms.createdAt).toLocaleDateString()}{" "}
                                {new Date(sms.createdAt).toLocaleTimeString()}
                              </p>
                              <button
                                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                                onClick={() => handleModalClose(sms.sender)}
                              >
                                Close
                              </button>
                            </div>
                          ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

        </>
    
        </div>
        
      ) : (
        <>
          <div className="w-full lg:w-1/4 bg-gray-50 flex flex-col p-4">
            <div className="flex items-center justify-between p-4 bg-blue-200">
              <div className="flex items-center">
                <AiOutlineSearch className="mr-2" />
                <input
                  type="text"
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                  placeholder="Search users"
                  className="p-2 border rounded-lg"
                />
              </div>
              <Link to="/login" className="bg-red-500 text-white p-2 rounded-md">
                <BiLogOut />
              </Link>
            </div>
            <div className="overflow-y-auto mt-4 flex-grow">
              {users
                .filter((user) =>
                  user.name.toLowerCase().includes(userSearchQuery.toLowerCase())
                )
                .map((user) => {
                  const unreadUser = unreadUsers.find((u) => u.userId === user._id);
                  return (
                    <div
                      key={user._id}
                      className="flex items-center justify-between p-4 hover:bg-blue-100 cursor-pointer"
                      onClick={() => handleClick(user._id, user.name)}
                    >
                      <span className="font-bold">{user.name}</span>
                      {unreadUser && unreadUser.data.length > 0 && (
                        <span className="text-xs text-gray-500">
                          {new Date(unreadUser.data[0].createdAt).toLocaleString()}
                        </span>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
          <div className="w-full lg:w-3/4 bg-gray-50 flex flex-col justify-between">
            <div className="flex items-center justify-between p-4 bg-blue-200">
              <div>
                <h1 className="text-2xl font-bold">{recipientName}</h1>
              </div>
              <Link to="/login" className="bg-red-500 text-white p-2 rounded-md">
                <BiLogOut />
              </Link>
            </div>
            <div className="flex-grow overflow-y-auto p-4 flex flex-col">
              {messages.map((message, index) => (
                <div
                  key={message._id}
                  className={`mb-4 p-4 rounded-lg relative max-w-[70%] ${message.sender === loggedInUserId
                      ? "bg-blue-200 self-end"
                      : "bg-gray-200 self-start"
                    }`}
                  onMouseEnter={() => handleHover(index)}
                  onMouseLeave={() => setHoveredMessage(null)}
                >
                  {message.content && message.content.text && (
                    <p className="font-bold">{message.content.text}</p>
                  )}
                  {message.content && message.content.image && (
                    <img src={message.content.image} alt="Image" className="max-w-xs" />
                  )}
                  {message.content && message.content.document && (
                    <a
                      href={message.content.document}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      <IoIosDocument className="text-9xl" />
                    </a>
                  )}
                  {message.content && message.content.video && (
                    <video controls className="max-w-xs">
                      <source src={message.content.video} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  )}
                  <span className="text-xs text-gray-500">
                    {new Date(message.createdAt).toLocaleString()}
                  </span>
                  {hoveredMessage === index && (
                    <AiOutlineDown
                      className="absolute top-2 right-2 cursor-pointer"
                      onClick={() => handleDropdownClick(index)}
                    />
                  )}
                  {showDropdown === index && (
                    <div className="absolute top-8 right-2 bg-white border rounded shadow-lg z-10">
                      <button
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => handleReply(message)}
                      >
                        Reply
                      </button>
                      <button
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => handleForward(message)}
                      >
                        Forward
                      </button>
                    </div>
                  )}

                  
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="flex items-center p-4 bg-white border-t border-gray-200 w-full">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message"
                className="flex-grow p-2 border rounded-lg mr-2"
              />
              <FileUploadModel sender={sender} recipient={recipient} />
              <button
                onClick={handleSendMessage}
                className="bg-blue-500 text-white p-2 rounded-lg"
              >
                Send
              </button>
            </div>
          </div>

          {showPopSms && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div
                className={`bg-white relative p-6 rounded-lg shadow-lg w-[80vw] md:w-[50vw] lg:w-[30vw]`}
              >
                {showPopSms && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div
                      className={`bg-white relative p-4 rounded-lg shadow-lg w-[80vw] md:w-[50vw] lg:w-[30vw] animate-pop-up`}
                    >
                      {popSms.length > 0 &&
                        popSms
                          .filter((sms) => sms.sender === selectedSender)
                          .map((sms) => (
                            <div
                              key={sms.id}
                              className="relative border border-gray-200 rounded-lg p-2 mb-2 shadow-sm"
                            >
                              <div className="flex items-center justify-center mb-1">
                                <i className="fas fa-bell text-yellow-500 text-sm mr-2"></i>
                                <h1 className="text-xl font-bold text-green-600 text-center">
                                  {selectedSenderName}
                                </h1>
                              </div>
                              <p className="text-base font-bold mb-1">
                                {sms.content.text}
                              </p>
                              <p className="text-sm text-gray-500 mb-2">
                                {new Date(sms.createdAt).toLocaleDateString()}{" "}
                                {new Date(sms.createdAt).toLocaleTimeString()}
                              </p>
                              <button
                                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                                onClick={() => handleModalClose(sms.sender)}
                              >
                                Close
                              </button>
                            </div>
                          ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

        </>
      )}
      {showForwardModal && (
        <ForwardMessageModalEmp
          users={users}
          forwardMessage={forwardMessage}
          onForward={handleForwardMessage}
          onCancel={handleCancelForward}
        />
      )}
    </div>
  );
}

export default ChatPage;




