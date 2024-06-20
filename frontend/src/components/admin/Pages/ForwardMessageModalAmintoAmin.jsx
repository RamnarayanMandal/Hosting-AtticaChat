
import axios from "axios";
import React, { useState } from "react";
import { BASE_URL } from "../../../constants";


const ForwardMessageModalAmintoAmin = ({
  users,
  onForward,
  onCancel,
  forwardMessage,
}) => {
  console.log(users[0].email);
  // console.log(" forwardMessage", forwardMessage._id);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const handleUserSelection = (userId) => {
    setSelectedUsers((prevSelectedUsers) =>
      prevSelectedUsers.includes(userId)
        ? prevSelectedUsers.filter((id) => id !== userId)
        : [...prevSelectedUsers, userId]
    );
  };

  const handleForward = () => {
    onForward(selectedUsers);
    axios
      .post(`${BASE_URL}/api/empadminsender/forward`, {
        messageId: forwardMessage._id,
        newRecipients: selectedUsers,
      })
      .then((response) => {
        // Handle success response if needed
        console.log("Message forwarded successfully!", response.data);
      })
      .catch((error) => {
        // Handle error if any
        console.error("Error forwarding message:", error);
      });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-4 rounded shadow-lg w-full max-w-md">
        <h2 className="text-xl mb-4">Forward Message To:</h2>
        <div className="mb-4 max-h-60 overflow-y-auto">
          {users.map((user) => (
            <div key={user._id} className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={selectedUsers.includes(user._id)}
                onChange={() => handleUserSelection(user._id)}
              />
              <span className="ml-2">{user.email
              }</span>
            </div>
          ))}
        </div>
        <div className="flex justify-end">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded mr-2"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleForward}
          >
            Forward
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForwardMessageModalAmintoAmin;
