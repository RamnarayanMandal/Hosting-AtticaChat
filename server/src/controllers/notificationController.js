const Notification = require("../model/notificationModel.js");
const mongoose = require("mongoose");

        

const getNotificationId = async (req, res) => {
  const recipient = req.params.recipient;
  
  // Check if recipient is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(recipient)) {
    return res.status(400).json({ error: "Invalid recipient ID" });
  }

  try {
    // Convert recipient to ObjectId
    const recipientObjectId = new mongoose.Types.ObjectId(recipient);

    // Fetch all notifications for the recipient
    const allMessages = await Notification.find({ recipient: recipientObjectId });

    if (allMessages.length === 0) {
      return res.status(404).json({ message: "No notifications found" });
    }

    res.status(200).json(allMessages);
  } catch (error) {
    console.error("Error fetching the notifications:", error);
    res.status(400).json({ error: error.message });
  }
};



const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Notification id is required" });
    }
    await Notification.deleteMany({ sender: id });
    res.status(200).json({ message: "Notifications deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


module.exports = { getNotificationId, deleteNotification };