import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Message from "./Message";
import { RiDeleteBinLine } from "react-icons/ri";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL } from "../../constants";

const GroupsList = () => {
  const [groups, setGroups] = useState([]);
  const [selectedGroupName, setSelectedGroupName] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [grade, setGrade] = useState("A");
  const [unreadMessages, setUnreadMessages] = useState([]);
  const [showMessages, setShowMessages] = useState({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/groups`);
        if (response.ok) {
          const data = await response.json();
          setGroups(data);
        } else {
          console.error("Failed to fetch groups");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchGroups();
  }, []);

  const handleGroupClick = (groupName, groupGrade) => {
    setSelectedGroupName(groupName);
    setSelectedGrade(groupGrade);

    if (window.innerWidth < 1024) {
      navigate(
        `/message/${encodeURIComponent(groupName)}/${encodeURIComponent(
          groupGrade
        )}`
      );
    }
  };

  const handleAddGroup = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleInputChange = (e) => {
    setNewGroupName(e.target.value);
  };

  const handleGradeChange = (e) => {
    setGrade(e.target.value);
  };

  const handleSubmit = async () => {
    if (newGroupName.trim() !== "") {
      try {
        const response = await fetch(`${BASE_URL}/api/groups`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ groupName: newGroupName, grade }),
        });

        if (response.ok) {
          const result = await response.json();
          console.log(result.message);

          setGroups([...groups, { group: newGroupName, grade }]);
          setShowModal(false);
          setNewGroupName("");
          toast.success("Group added successfully!");
        } else {
          console.error("Failed to create group");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const handleShowDeleteConfirmation = (group) => {
    setGroupToDelete(group);
    setShowConfirmation(true);
  };

  const handleConfirmDelete = async () => {
    if (groupToDelete) {
      try {
        const { group, grade } = groupToDelete;
        const response = await fetch(
          `${BASE_URL}/api/groups/${group}/${grade}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const result = await response.json();
          console.log(result.message);

          setGroups(
            groups.filter((g) => !(g.group === group && g.grade === grade))
          );
          setSelectedGroupName("");
          setSelectedGrade("");
          toast.success("Group deleted successfully!");
        } else {
          console.error("Failed to delete group");
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setShowConfirmation(false);
        setGroupToDelete(null);
      }
    }
  };

  useEffect(() => {
    if (groups.length > 0) {
      const fetchUnreadMessages = async () => {
        try {
          const unreadMessagesData = await Promise.all(
            groups.map(async (group) => {
              const response = await axios.get(
                `${BASE_URL}/api/empadminsender/mark-messages-read/${group._id}`
              );
              return { groupId: group._id, data: response.data };
            })
          );
          setUnreadMessages(unreadMessagesData);
        } catch (error) {
          console.error(error);
        }
      };

      fetchUnreadMessages();

      const intervalId = setInterval(fetchUnreadMessages, 30 * 1000);

      return () => clearInterval(intervalId);
    }
  }, [groups]);

  const handleShowMessage = (userId) => {
    setShowMessages((prevShowMessages) => ({
      ...prevShowMessages,
      [userId]: !prevShowMessages[userId],
    }));
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      <ToastContainer />
      <div className="flex flex-col w-full lg:w-[24vw] bg-[#ffffff] text-[#5443c3] border shadow shadow-blue-500/65">
        <div className="p-4 flex justify-between items-center">
          <h1 className="text-2xl lg:text-3xl font-bold">Groups</h1>
          <button
            className="bg-[#5443c3] hover:bg-blue-400 text-white font-bold py-2 px-4 rounded"
            onClick={handleAddGroup}
          >
            +
          </button>
        </div>
        <div className="overflow-y-auto mt-8">
          {groups.map((group) => (
            <div
              key={group._id}
              className="p-4 cursor-pointer text-[#5443c3] hover:bg-[#eef2fa] flex justify-between items-center"
              onClick={() => handleGroupClick(group.group, group.grade)}
            >
              <div>
                <h1 className="text-lg font-bold text-[#5443c3]">
                  {group.group}
                </h1>
                <p className="text-[#8b7ed5]">Grade: {group.grade}</p>
                {unreadMessages
                  .filter((unreadGroup) => unreadGroup.groupId === group._id)
                  .flatMap((unreadGroup) =>
                    unreadGroup.data.map((message) => (
                      <div
                        key={message._id}
                        className="text-green-400 flex justify-between items-center content-center gap-5"
                        onClick={() => handleShowMessage(message._id)}
                      >
                        {!showMessages[message._id] ? (
                          <>
                            <p className="pe-2 text-base">{message.message}</p>
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
              <button
                className="text-red-400 hover:text-red-600 text-2xl"
                onClick={(e) => {
                  e.stopPropagation();
                  handleShowDeleteConfirmation(group);
                }}
              >
                <RiDeleteBinLine />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="lg:flex-1 hidden lg:block">
        {selectedGroupName && selectedGrade && (
          <Message
            selectedGroupName={selectedGroupName}
            selectedGrade={selectedGrade}
          />
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 lg:p-8 rounded-lg w-11/12 lg:w-auto">
            <h2 className="text-2xl font-bold mb-4 text-[#5443c3]">
              Add Group
            </h2>
            <input
              type="text"
              className="w-full p-2 mb-4 border rounded"
              placeholder="Group Name"
              value={newGroupName}
              onChange={handleInputChange}
            />
            <select
              className="w-full p-2 mb-4 border rounded"
              value={grade}
              onChange={handleGradeChange}
            >
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
            </select>
            <div className="flex justify-end">
              <button
                className="bg-[#5443c3] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                onClick={handleSubmit}
              >
                Add
              </button>
              <button
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleCloseModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 lg:p-8 rounded-lg w-11/12 lg:w-auto">
            <h2 className="text-2xl font-bold mb-4 text-[#5443c3]">
              Confirm Delete
            </h2>
            <p className="mb-4">Are you sure you want to delete this group?</p>
            <div className="flex justify-end">
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2"
                onClick={handleConfirmDelete}
              >
                Delete
              </button>
              <button
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => setShowConfirmation(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupsList;
