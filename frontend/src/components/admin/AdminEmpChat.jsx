import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { AiOutlineSearch, AiOutlineDown } from "react-icons/ai";
import { BiLogOut } from "react-icons/bi";
import { Link } from "react-router-dom";
import { IoIosDocument } from "react-icons/io";
import AdminFileUploadModel from "./Pages/AdminFileUploadModel";
import { FaVideo, FaImage } from "react-icons/fa";
import { useSound } from "use-sound";
import notificationSound from "../../assests/sound.wav";
import { BASE_URL } from "../../constants";
import ForwardMessageModalAdminToEmp from "../admin/Pages/ForwardMessageModalAdminToEmp";

function AdminEmpChat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [users, setUsers] = useState([]);
  const loggedInUserId = localStorage.getItem("CurrentUserId");
  const [recipient, setRecipient] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const messagesEndRef = useRef(null);
  const [unreadUsers, setUnreadUsers] = useState([]);
  const [showMessages, setShowMessages] = useState({});
  const [showPopSms, setShowPopSms] = useState(false);
  const [popSms, setPopSms] = useState([]);
  const [selectedSender, setSelectedSender] = useState("");
  const [selectedSenderName, setSelectedSenderName] = useState("");
  const [selectedSenderEmail, setSelectedSenderEmail] = useState("");
  const [playNotificationSound] = useSound(notificationSound);
  const [showDropdown, setShowDropdown] = useState(null);
  const [forwardMessage, setForwardMessage] = useState(null);
  const [showForwardModal, setShowForwardModal] = useState(false);
  const [hoveredMessage, setHoveredMessage] = useState(null);

  // Function to handle click on employee to initiate chat
  const handleClick = (id, name) => {
    setRecipient(id);
    setRecipientName(name);
    fetchMessages(loggedInUserId, id);
  };

  // Function to fetch messages between two users
  const fetchMessages = (sender, recipient) => {
    axios
      .get(
        `${BASE_URL}/api/empadminsender/getadminmessages/${recipient}/${sender}`
      )
      .then((response) => {
        setMessages(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // Fetch all employees except the logged-in user
  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/employeeRegistration/`)
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

  // Fetch initial messages between logged-in user and selected recipient
  useEffect(() => {
    if (loggedInUserId && recipient) {
      fetchMessages(loggedInUserId, recipient);
    }
  }, [loggedInUserId, recipient]);

  // Automatically scroll to bottom when new messages are received
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Function to send a new message
  const handleSendMessage = () => {
    if (!newMessage.trim() && !attachment) return;

    const messageData = {
      sender: loggedInUserId,
      recipient: recipient,
      text: newMessage,
      image: attachment?.type.startsWith("image/") ? attachment.url : null,
      document: attachment?.type.startsWith("application/")
        ? attachment.url
        : null,
      video: attachment?.type.startsWith("video/") ? attachment.url : null,
    };

    axios
      .post(`${BASE_URL}/api/empadminsender/createMessage`, messageData)
      .then((response) => {
        setMessages([...messages, response.data.data]);
        setNewMessage("");
        setAttachment(null);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // Function to handle file attachment change

  // Filtered list of users based on search query
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(userSearchQuery.toLowerCase())
  );

  // Fetch unread messages for all users at regular intervals
  useEffect(() => {
    if (users.length > 0) {
      const fetchUnreadMessages = async () => {
        try {
          const unreadUsersData = await Promise.all(
            users.map(async (user) => {
              const response = await axios.get(
                `${BASE_URL}/api/empadminsender/mark-messages-read/${user._id}`
              );
              return { userId: user._id, data: response.data };
            })
          );
          setUnreadUsers(unreadUsersData);
        } catch (error) {
          console.error(error);
        }
      };

      // Initial fetch and set interval to fetch every 3 seconds
      fetchUnreadMessages();
      const intervalId = setInterval(fetchUnreadMessages, 3000);

      // Clear interval on component unmount
      return () => clearInterval(intervalId);
    }
  }, [users]);

  

  // Fetch pop-up SMS notifications for logged-in user
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
        playNotificationSound();
      }
    } catch (error) {
      console.error("Error fetching pop SMS:", error);
    }
  };

  // Fetch pop-up SMS notifications at regular intervals
  useEffect(() => {
    const interval = setInterval(fetchPopSms, 5000);
    return () => clearInterval(interval);
  }, [loggedInUserId, playNotificationSound]);

  // Function to handle closure of pop-up SMS modal
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

  const handleHover = (index) => {
    setHoveredMessage(index);
  };

  const handleLeave = () => {
    setHoveredMessage(null);
  };

  const handleDropdownClick = (index) => {
    setShowDropdown(showDropdown === index ? null : index);
  };

  const handleReply = (message) => {
    setNewMessage(`Replying to: ${message.content.text} `);
    setShowDropdown(null);
  };

  const handleForward = (message) => {
    setForwardMessage(message);
    setShowForwardModal(true);
    setShowDropdown(null)
  };

  const handleCancelForward = () => {
    setShowForwardModal(false);
    setForwardMessage(null);
  };

  const handleConfirmForward = () => {
    // Perform forward action here, then close modal
    setShowForwardModal(false);
    setForwardMessage(null);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between bg-gray-200 px-4 py-2 shadow">
        <div className="flex items-center">
          <Link to="/AdminDashboard" className="text-lg font-bold">
            <IoIosDocument size={25} />
          </Link>
          <span className="text-lg font-bold ml-2">Admin Chat</span>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="border rounded px-2 py-1"
            value={userSearchQuery}
            onChange={(e) => setUserSearchQuery(e.target.value)}
          />
          <AiOutlineSearch
            size={20}
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
          />
        </div>
        <div className="flex items-center">
          <Link
            to="/login"
            className="text-lg font
.bold ml-2"
          >
            <BiLogOut size={25} />
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* User List */}
        <div className="w-1/4 bg-gray-100 overflow-y-auto">
          <ul>
            {filteredUsers.map((user, index) => (
              <li key={user._id} className="border-b">
                <div
                  className="p-2 cursor-pointer hover:bg-gray-200"
                  onClick={() => handleClick(user._id, user.name)}
                >
                  <div className="flex justify-between">
                    <span className="font-bold">{user.name}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col justify-between bg-white">
          {/* Messages */}
          <div className="overflow-y-auto flex-1 p-4">
            {messages.map((message, index) => (
              <div key={index} className="mb-2">
                <div
                  className={`flex ${
                    message.sender === loggedInUserId
                      ? "justify-end"
                      : "justify-start"
                  }`}
                  onMouseEnter={() => handleHover(index)}
                  onMouseLeave={() => handleLeave()}
                >
                  <div
                    className={`bg-${
                      message.sender === loggedInUserId ? "blue" : "gray"
                    }-200 p-2 rounded-lg relative`}
                  >
                    <p>{message.content.text}</p>
                    {message.image && (
                      <img
                        src={message.image}
                        alt="attachment"
                        className="max-w-xs mt-2"
                      />
                    )}
                    {message.document && (
                      <a
                        href={message.document}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500"
                      >
                        View Document
                      </a>
                    )}
                    {message.video && (
                      <video controls className="max-w-xs mt-2">
                        <source src={message.video} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    )}
                    <span className="text-xs text-gray-500">
                  {new Date(message.createdAt).toLocaleString()}
                </span>
                {
                  hoveredMessage === index &&
                
                    <AiOutlineDown
                      className="absolute top-2 right-2 cursor-pointer"
                      onClick={() => handleDropdownClick(index)}
                    />
                  }

                    {showDropdown === index &&  (
                      <div className="absolute top-2 right-2  bg-white border rounded shadow-lg z-10">
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
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t flex  justify-center content-center items-center">
            <input
              type="text"
              placeholder="Type your message..."
              className="border rounded w-[80%] p-2"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <div className="flex items-center ">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded ml-2"
                onClick={handleSendMessage}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Pop SMS Modal */}
      {showPopSms && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">
              New Message from {selectedSenderName}
            </h2>
            <ul>
              {popSms.map((sms, index) => (
                <li key={index} className="mb-2">
                  <p>{sms.content.text}</p>
                  {sms.content.image && (
                    <img
                      src={sms.content.image}
                      alt="attachment"
                      className="max-w-xs mt-2"
                    />
                  )}
                  {sms.content.document && (
                    <a
                      href={sms.content.document}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500"
                    >
                      View Document
                    </a>
                  )}
                  {sms.content.video && (
                    <video controls className="max-w-xs mt-2">
                      <source src={sms.content.video} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  )}
                </li>
              ))}
            </ul>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
              onClick={() => handleModalClose(selectedSender)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Forward Modal */}
      {showForwardModal && (
        <ForwardMessageModalAdminToEmp
          users={users}
          forwardMessage={forwardMessage}
          onForward={handleConfirmForward}
          onCancel={handleCancelForward}
        />
      )}
    </div>
  );
}

export default AdminEmpChat;
