import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { AiOutlineSearch, AiOutlineDown } from "react-icons/ai";
import { BiLogOut } from "react-icons/bi";
import { Link } from "react-router-dom";
import { IoIosDocument } from "react-icons/io";
import AdminFileUploadModel from "./AdminFileUploadModel";
import { FaVideo, FaImage } from "react-icons/fa";
import { useSound } from "use-sound";
import notificationSound from "../../../assests/sound.wav";
import { BASE_URL } from "../../../constants";
import ForwardMessageModalAmintoAmin from "./ForwardMessageModalAmintoAmin";

function AdmintoAdmin() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [users, setUsers] = useState([]);
  const loggedInUserId = localStorage.getItem("CurrentUserId");
  const [recipient, setRecipient] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [adminSearchQuery, setAdminSearchQuery] = useState("");
  const messagesEndRef = useRef(null);
  const [admins, setAdmins] = useState([]);
  const [unreadUsers, setUnreadUsers] = useState([]);
  const [unreadUsersAdmin, setUnreadUsersAdmin] = useState([]);
  const [showMessages, setShowMessages] = useState({});
  const [showPopSms, setShowPopSms] = useState(false);
  const [popSms, setPopSms] = useState([]);
  const [selectedSender, setSelectedSender] = useState("");
  const [selectedSenderEmail, setSelectedSenderEmail] = useState("");
  const [playNotificationSound] = useSound(notificationSound);
  const [showDropdown, setShowDropdown] = useState(null);
  const [forwardMessage, setForwardMessage] = useState(null);
  const [showForwardModal, setShowForwardModal] = useState(false);
  const [hoveredMessage, setHoveredMessage] = useState(null);

  // Function to handle click on admin or employee to initiate chat
  const handleClick = (id, name) => {
    setRecipient(id);
    setRecipientName(name);
    fetchMessages(loggedInUserId, id);
  };

  // Function to fetch messages between two users
  const fetchMessages = (sender, recipient) => {
    axios
      .get(`${BASE_URL}/api/empadminsender/getadminmessages/${recipient}/${sender}`)
      .then((response) => {
        setMessages(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // Fetch all admins except the logged-in user
  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/admin/getAllAdmin`)
      .then((response) => {
        const filteredAdmins = response.data.filter(
          (admin) => admin._id !== loggedInUserId
        );
        setAdmins(filteredAdmins);
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
    if (newMessage.trim() === "") return;

    const messageData = {
      sender: loggedInUserId,
      recipient,
      text: newMessage,
      image: attachment?.type?.startsWith("image/") ? attachment.url : null,
      video: attachment?.type?.startsWith("video/") ? attachment.url : null,
      document: attachment?.type === "application/pdf" ? attachment.url : null,
    };

    axios
      .post(`${BASE_URL}/api/empadminsender/createMessage`, messageData)
      .then((response) => {
        setMessages([...messages, response.data]);
        setNewMessage("");
        setAttachment(null);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // Function to handle file attachment change
  const handleAttachmentChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAttachment({
          url: reader.result,
          type: file.type,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Filtered list of admins based on search query
  const filteredAdmins = admins.filter((admin) =>
    admin.email.toLowerCase().includes(adminSearchQuery.toLowerCase())
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

  // Fetch unread messages for all admins at regular intervals
  useEffect(() => {
    if (admins.length > 0) {
      const fetchUnreadMessages = async () => {
        try {
          const unreadUsersData = await Promise.all(
            admins.map(async (admin) => {
              const response = await axios.get(
                `${BASE_URL}/api/empadminsender/mark-messages-read/${admin._id}`
              );
              return { userId: admin._id, data: response.data };
            })
          );
          setUnreadUsersAdmin(unreadUsersData);
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
  }, [admins]);

  // Toggle display of messages for each user or admin
  const handleShowMessage = (userId) => {
    setShowMessages((prevShowMessages) => ({
      ...prevShowMessages,
      [userId]: !prevShowMessages[userId],
    }));
  };

  // Fetch pop-up SMS notifications for logged-in user
  const fetchPopSms = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/getNotification/${loggedInUserId}`);
      const data = response.data;
      setPopSms(data);
      if (data.length > 0) {
        const senderId = data[0].sender;
        setSelectedSender(senderId);
        setShowPopSms(true);
        const adminDetails = await axios.get(`${BASE_URL}/api/admin/admin/${senderId}`)
        setSelectedSenderEmail(adminDetails.data.email);
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
    setShowDropdown(null);
  };

  const handleCancelForward = () => {
    setShowForwardModal(false);
    setForwardMessage(null);
    setShowDropdown(null);
  };

  const handleConfirmForward = () => {
    // Perform forward action here, then close modal
    setShowForwardModal(false);
    setForwardMessage(null);
    setShowDropdown(null);
  };


  return (
    <div className="flex h-screen">
      <div className="w-1/5 bg-gray-100 p-4">
      
        <h1 className="text-2xl font-bold mb-4">All Admins</h1>
        <div className="relative mb-4">
          <input
            type="text"
            value={adminSearchQuery}
            onChange={(e) => setAdminSearchQuery(e.target.value)}
            className="w-full p-2 text-sm text-gray-700 bg-gray-200 rounded pl-10"
            placeholder="Search by email..."
          />
          <AiOutlineSearch className="absolute top-3 left-3 text-gray-500" />
        </div>
        <div className="h-1/2 overflow-y-auto">
          {filteredAdmins.map((admin) => (
            <div key={admin._id}>
              <div
                className="w-full h-auto font-medium rounded-md bg-red-200 mb-4 text-2xl block items-center
                p-4 cursor-pointer"
                onClick={() => handleClick(admin._id, admin.email)}
              >
                <h1>{admin.email}</h1>
                {unreadUsersAdmin
                  .filter((unreadUser) => unreadUser.userId === admin._id)
                  .flatMap((unreadUser) =>
                    unreadUser.data.map((message) => (
                      <div
                        key={message._id}
                        className="text-green-400 flex justify-between items-center mt-2 content-center gap-5"
                        onClick={() => handleShowMessage(admin._id)}
                      >
                        {!showMessages[admin._id] ? (
                          <>
                            {message.content && message.content.text && (
                              <p className="pe-2 text-base">{message.content.text}</p>
                            )}
                            {message.content && message.content.image && <FaImage />}
                            {message.content && message.content.video && <FaVideo />}
                            {message.content && message.content.document && (
                              <IoIosDocument className="text-xl" />
                            )}
                            <p className="text-xs text-black">
                              {new Date(message.createdAt).toLocaleDateString()}{" "}
                              {new Date(message.createdAt).toLocaleTimeString()}
                            </p>
                          </>
                        ) : (
                          <p></p>
                        )}
                      </div>
                    ))
                  )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="w-4/5 p-4">
        <div className="flex justify-between items-center content-center mb-4">
          <h1 className="text-2xl font-bold">Chat with {recipientName}</h1>
          <Link
            to={"/"}
            className="group relative flex items-center justify-end font-extrabold text-2xl rounded-full p-3 md:p-5"
          >
            <BiLogOut />
          </Link>
        </div>
        <div className="flex flex-col h-4/5 overflow-y-auto mb-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.sender === loggedInUserId ? 'justify-end' : 'justify-start'} mb-2 relative`}
              onMouseEnter={() => handleHover(index)}
              onMouseLeave={() => handleLeave()}
            >
              <div
                className={`w-1/3 p-2 rounded-md relative ${message.sender === loggedInUserId ? "bg-blue-100 self-end" : "bg-gray-200 self-start"
                  }`}
              >
                {message.content && message.content.text && (
                  <p className="text-sm">{message.content.text}</p>
                )}
                {message.content && message.content.image && (
                  <>
                    <img src={message.content.image} alt="Image" className="max-w-xs rounded" />
                  </>
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
                {
                  hoveredMessage === index &&
                  <>
                    <AiOutlineDown
                      className="absolute top-2 right-2 cursor-pointer"
                      onClick={() => handleDropdownClick(index)}
                    />
                    {showDropdown === index && (
                      <div className="absolute top-2 right-2 bg-white border rounded shadow-lg z-10">
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
                  </>
                }
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="flex justify-center items-center w-3/4 fixed bottom-0 mb-0 pb-0">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="w-full p-2 text-sm text-gray-700 bg-gray-200"
            placeholder="Type a message..."
          />
          <input
            type="file"
            onChange={handleAttachmentChange}
            className="hidden"
            id="file-upload"
          />
         
          <button
            onClick={handleSendMessage}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2"
          >
            Send
          </button>
          <AdminFileUploadModel sender={loggedInUserId} recipient={recipient} />
        </div>
      </div>
      {showPopSms && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white relative p-6 rounded-lg shadow-lg w-[80vw] md:w-[50vw] lg:w-[30vw]">
            {popSms.length > 0 &&
              popSms
                .filter((sms) => sms.sender === selectedSender)
                .map((sms) => (
                  <div key={sms.id} className="relative border border-gray-200 rounded-lg p-2 mb-2 shadow-sm">
                    <div className="flex items-center gap-5 mb-1">
                      <i className="fas fa-bell text-yellow-500 text-sm mr-2"></i>
                      <h1 className="text-xl font-bold text-green-600 text-center">{selectedSenderEmail}</h1>
                    </div>
                    <p className="text-base font-bold mb-1">{sms.content.text}</p>
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
      {showForwardModal && (
        <ForwardMessageModalAmintoAmin
          users={admins}
          forwardMessage={forwardMessage}
          onForward={handleConfirmForward}
          onCancel={handleCancelForward}
        />
      )}
    </div>
  );
}

export default AdmintoAdmin;
