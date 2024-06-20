const Message = require("../model/messageModel.js");
const { ObjectId } = require("mongodb");
const fs = require("fs");
const { uploadOnCloudinary } = require("../utils/cloudinary.js");
const Notification = require("../model/notificationModel.js");

const createMessage = async (req, res) => {
  const { sender, recipient, text } = req.body;

  if (!sender || !recipient) {
    return res
      .status(400)
      .json({ message: "Sender and recipient are required." });
  }

  try {
    let content = { text };

    // Check for files and upload if they exist
    const hasImage = req.files && req.files.image;
    const hasDocument = req.files && req.files.document;
    const hasVideo = req.files && req.files.video;

    if (hasImage) {
      const imageLocalPath = req.files.image[0].path;
      if (fs.existsSync(imageLocalPath)) {
        const imageUploadResult = await uploadOnCloudinary(imageLocalPath);
        if (imageUploadResult?.url) {
          content.image = imageUploadResult.url;
        } else {
          return res
            .status(400)
            .json({ error: "Image upload failed. Please try again." });
        }
      } else {
        return res
          .status(400)
          .json({ error: `Image file not found at path: ${imageLocalPath}` });
      }
    }

    if (hasDocument) {
      const documentLocalPath = req.files.document[0].path;
      if (fs.existsSync(documentLocalPath)) {
        const documentUploadResult = await uploadOnCloudinary(
          documentLocalPath
        );
        if (documentUploadResult?.url) {
          content.document = documentUploadResult.url;
        } else {
          return res
            .status(400)
            .json({ error: "Document upload failed. Please try again." });
        }
      } else {
        return res.status(400).json({
          error: `Document file not found at path: ${documentLocalPath}`,
        });
      }
    }

    if (hasVideo) {
      const videoLocalPath = req.files.video[0].path;
      if (fs.existsSync(videoLocalPath)) {
        const videoUploadResult = await uploadOnCloudinary(videoLocalPath);
        if (videoUploadResult?.url) {
          content.video = videoUploadResult.url;
        } else {
          return res
            .status(400)
            .json({ error: "Video upload failed. Please try again." });
        }
      } else {
        return res
          .status(400)
          .json({ error: `Video file not found at path: ${videoLocalPath}` });
      }
    }

    const message = new Message({
      sender,
      recipient,
      content,
    });


    await message.save();
    

    const notification = new Notification({
      sender,
      recipient,
      content,
    });
    
   const result =await notification.save();
  //  console.log(result);
    res.status(201).json({ message: "Message sent", data: message });
  } catch (error) {
    console.error("Error creating message:", error);
    res.status(400).json({ message: error.message });
  }
};

const getMessages = async (req, res) => {
  const { userId1, userId2 } = req.params;

  if (!ObjectId.isValid(userId1) || !ObjectId.isValid(userId2)) {
    return res.status(400).json({ message: "Invalid user IDs" });
  }

  try {
    const messages = await Message.find({
      $or: [
        { sender: userId1, recipient: userId2 },
        { sender: userId2, recipient: userId1 },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteMessage = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedMessage = await Message.findByIdAndDelete(id);
    res.status(200).json({ message: "Message deleted", deletedMessage });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const unreadMessages = async (req, res) => {
  const { userId } = req.params;
  try {
    const unreadMessagesCount = await Message.countDocuments({
      recipient: userId,
      read: false,
    });
    res.status(200).json({ count: unreadMessagesCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const markMessagesRead = async (req, res) => {
  const { userId } = req.params;
  try {
    const recipientObjectId = new ObjectId(userId);

    const result = await Message.aggregate([
      {
        $match: {
          recipient: recipientObjectId,
        },
      },
      {
        $sort: {
          updatedAt: -1,
        },
      },
      {
        $limit: 1,
      },
    ]);

    res.json(result);
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


// Fetch the latest message and delete it after 10 seconds
const getNotificationId = async (req, res) => {
  try {
    // Find the latest message
    const lastMessage = await Message.findOne().sort({ createdAt: -1 }).exec();

    if (!lastMessage) {
      return res.status(404).json({ message: "No message found" });
    }

    // Send the message to the client
    res.status(200).json(lastMessage);

    // Schedule the message deletion after 10 seconds
    setTimeout(async () => {
      try {
        await Message.findByIdAndDelete(lastMessage._id);
        console.log(
          `Message with ID ${lastMessage._id} deleted after 10 seconds`
        );
      } catch (deleteError) {
        console.error(
          `Failed to delete message with ID ${lastMessage._id}:`,
          deleteError
        );
      }
    }, 10000); // 10000 milliseconds = 10 seconds
  } catch (error) {
    console.error("Error fetching the latest message:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const forwardMessage = async (req, res) => {
  try {
    const { messageId, newRecipients } = req.body;
    console.log(newRecipients)
    const originalMessage = await Message.findById(messageId);

    if (!originalMessage) {
      return res.status(404).json({ error: "Message not found" });
    }

    const forwardedMessages = await Promise.all(
      newRecipients.map(async (recipient) => {
        const forwardedMessage = new Message({
          sender: originalMessage.sender,
          recipient: [recipient], // Store recipients as an array
          content: originalMessage.content,
        });
        await forwardedMessage.save();
        return forwardedMessage;
      })
    );

    res.status(201).json(forwardedMessages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const replyToMessage = async (req, res) => {
  try {
    const { parentMessageId, sender, recipient, content } = req.body;
    const parentMessage = await Message.findById(parentMessageId);

    if (!parentMessage) {
      return res.status(404).json({ error: "Parent message not found" });
    }

    const replyMessage = new Message({
      sender,
      recipient,
      content,
      parentMessage: parentMessageId,
    });

    await replyMessage.save();
    res.status(201).json(replyMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = {
  createMessage,
  getMessages,
  deleteMessage,
  unreadMessages,
  markMessagesRead,
  getNotificationId,
  forwardMessage,
  replyToMessage
};
