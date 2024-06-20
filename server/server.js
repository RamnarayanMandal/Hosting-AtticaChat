const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const connectDb = require("./src/config/dbConnection");
const dotenv = require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer"); // Import multer for handling file uploads
const { uploadOnCloudinary } = require("../server/src/utils/cloudinary.js");
const liveChat = require("./src/model/liveChatModel.js");
const messageRouter = require("./src/routes/messageRoutes.js");
const empAdminsenderRoutes = require("./src/routes/empadminsenderRouter.js");
const adminRoutes = require("./src/routes/adminRegRoutes.js");
const superAdminRoutes = require("./src/routes/superAdminRoutes.js");
const billingTeamRoutes = require("./src/routes/billingTeamUserRoutes.js");
const branchRoutes = require("./src/routes/branchRoutes.js");
const managerRoute = require("./src/routes/managerRoutes.js");
const locationRoutes = require("./src/routes/locationRoute.js");
const employeeRoute = require("./src/routes/employeeRegRoutes.js");
const notificationRouter = require("./src/routes/notificationRoutes.js");
connectDb(); // Call the function to connect to the database

const app = express();

app.use(cors()); // Allow Cross-Origin Resource Sharing (CORS)

const port = process.env.PORT || 5002;

app.use(express.json()); // Parse JSON bodies of incoming requests

// Define Mongoose Schema for the chat
const chatSchema = new mongoose.Schema({
  group: String, // Group name
  grade: String,
  messages: [
    {
      employeeId: String,
      message: String,
      Image: String,
      Document: String,
      video: String,
    },
  ], // Array containing employeeId, message, Image, and Document
});

// Create Mongoose Model based on the schema
const ChatModel = mongoose.model("Chat", chatSchema);

// Set up multer storage configuration for file uploads

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

// Set up multer upload configuration
const upload = multer({ storage: storage });

// API endpoint to send a new message with image and document uploads
// API endpoint to send a new message with optional image and document uploads
app.post(
  "/api/messages",
  upload.fields([{ name: "image" }, { name: "document" }, { name: "video" }]),
  async (req, res) => {
    try {
      const { employeeId, message, group, grade } = req.body;

      // Find the chat room by group name and grade
      let chatRoom = await ChatModel.findOne({ group, grade });

      if (!chatRoom) {
        return res.status(400).json({
          error: `Chat room with group "${group}" and grade "${grade}" does not exist`,
        });
      }

      // Check if image, document, and video files are provided
      const hasImage = req.files && req.files.image;
      const hasDocument = req.files && req.files.document;
      const hasVideo = req.files && req.files.video;

      let imageUploadResult;
      if (hasImage) {
        const imageLocalPath = req.files.image[0].path;
        imageUploadResult = await uploadOnCloudinary(imageLocalPath);
        if (!imageUploadResult || !imageUploadResult.url) {
          console.error(
            "Image upload failed:",
            imageUploadResult?.error || "Unknown error"
          );
          return res
            .status(400)
            .json({ error: "Image upload failed. Please try again." });
        }
      }

      let documentUploadResult;
      if (hasDocument) {
        const documentLocalPath = req.files.document[0].path;
        documentUploadResult = await uploadOnCloudinary(documentLocalPath);
        if (!documentUploadResult || !documentUploadResult.url) {
          console.error(
            "Document upload failed:",
            documentUploadResult?.error || "Unknown error"
          );
          return res
            .status(400)
            .json({ error: "Document upload failed. Please try again." });
        }
      }

      let videoUploadResult;
      if (hasVideo) {
        const videoLocalPath = req.files.video[0].path;
        videoUploadResult = await uploadOnCloudinary(videoLocalPath);
        if (!videoUploadResult || !videoUploadResult.url) {
          console.error(
            "Video upload failed:",
            videoUploadResult?.error || "Unknown error"
          );
          return res
            .status(400)
            .json({ error: "Video upload failed. Please try again." });
        }
      }

      // console.log("11222222222221vidourl:",videoUploadResult.url);

      // Add the new message to the chat room
      const messageData = { employeeId, message };
      if (hasImage) {
        messageData.Image = imageUploadResult.url;
      }
      //  console.log(messageData.Image);
      //  console.log(hasImage)
      const imageUrl = messageData.Image;
      if (hasDocument) {
        messageData.Document = documentUploadResult.url;
      }
      const documentUrl = messageData.Document;
      if (hasVideo) {
        messageData.video = videoUploadResult.url;
      }
      const videoUrl = messageData.video;
      // console.log(videoUrl);
      chatRoom.messages.push(messageData);

      const liveChats = new liveChat({
        group: chatRoom.group,
        grade: chatRoom.grade,
        employeeId: employeeId,
        messages: message,
        image: imageUrl,
        video: videoUrl,
        document: documentUrl,
      });
      // console.log(liveChats);
      await liveChats.save();

      // Save the updated chat room
      await chatRoom.save();
      // console.log(chatRoom);

      res.status(201).json({ message: "Message sent successfully" });
    } catch (error) {
      console.error("Error sending message:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// API endpoint to fetch chat messages for a specific group
app.get("/api/messages", async (req, res) => {
  try {
    const { group, grade } = req.query;

    // Fetch messages only for the specified group and grade
    const messages = await ChatModel.findOne({ group, grade });

    if (!messages) {
      return res
        .status(404)
        .json({ error: "Messages not found for the specified group" });
    }

    res.json(messages); // Send the messages as JSON response
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Internal server error" }); // Send 500 status code in case of error
  }
});

// API endpoint to create a new group
app.post("/api/groups", async (req, res) => {
  try {
    const { groupName, grade } = req.body;

    // Check if the group name and grade are provided
    if (!groupName || !grade) {
      return res
        .status(400)
        .json({ error: "Group name and grade are required" });
    }

    // Check if the group with the same name and grade already exists
    const existingGroup = await ChatModel.findOne({ group: groupName, grade });
    if (existingGroup) {
      return res.status(400).json({
        error: `Group with name "${group}" and grade "${grade}" already exists`,
      });
    }

    // Create a new group with the provided group name and grade
    const newGroup = new ChatModel({ group: groupName, grade, messages: [] });

    // Save the new group to the database
    await newGroup.save();

    res.status(201).json({ message: "Group created successfully" });
  } catch (error) {
    console.error("Error creating group:", error);
    res.status(500).json({ error: "Internal server error" }); // Send 500 status code in case of error
  }
});

app.delete("/api/groups/:groupName/:grade", async (req, res) => {
  const { groupName, grade } = req.params;
  try {
    // Find and delete the group
    const result = await ChatModel.deleteOne({
      group: groupName,
      grade: grade,
    });
    if (result.deletedCount === 1) {
      res.json({ message: "Group deleted successfully" });
    } else {
      res.status(404).json({ error: "Group not found" });
    }
  } catch (error) {
    console.error("Error deleting group:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// API endpoint to fetch distinct group names and grades
app.get("/api/groups", async (req, res) => {
  try {
    const groups = await ChatModel.aggregate([
      {
        $group: {
          _id: { group: "$group", grade: "$grade" },
          group: { $first: "$group" },
          grade: { $first: "$grade" },
          documentId: { $first: "$_id" },
        },
      },
      {
        $project: {
          _id: "$documentId",
          group: 1,
          grade: 1,
        },
      },
    ]);
    res.json(groups); // Send the distinct group names and grades as JSON response
  } catch (error) {
    console.error("Error fetching groups:", error);
    res.status(500).json({ error: "Internal server error" }); // Send 500 status code in case of error
  }
});
app.get("/api/employeeDetails/:employeeId", async (req, res) => {
  const { employeeId } = req.params;
  try {
    const employee = await EmployeeRegistration.findOne({ employeeId });
    if (employee) {
      res.json(employee);
    } else {
      res.status(404).json({ error: "Employee details not found" });
    }
  } catch (error) {
    console.error("Error fetching employee details:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint to fetch messages based on group and grade
app.get("/api/Emessages", async (req, res) => {
  let { teamName, grade } = req.query;
  //   console.log("Received query:", teamName, grade);
  try {
    teamName = teamName.trim().toLowerCase();
    grade = grade.trim().toLowerCase();
    // console.log("Formatted query:", teamName, grade);

    const result = await ChatModel.findOne({
      group: { $regex: new RegExp("^" + teamName + "$", "i") },
      grade: { $regex: new RegExp("^" + grade + "$", "i") },
    });

    // console.log("Query result:", result);
    res.json(result ? result.messages : []);
  } catch (error) {
    console.error("Error fetching messages:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.get("/api/messages/last-24-hours", async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const pipeline = [
      {
        $match: {
          createdAt: {
            $gte: today,
            $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
          },
        },
      },
    ];

    const messages = await liveChat.aggregate(pipeline);
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error retrieving messages:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/groups/mark-messages-read/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await ChatModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id), // Match by group _id
        },
      },
      {
        $unwind: "$messages", // Unwind the messages array
      },
      {
        $sort: {
          "messages._id": -1, // Sort messages by their _id in descending order
        },
      },
      {
        $limit: 1, // Limit the result to one message
      },
      {
        $project: {
          _id: 0,
          lastMessage: "$messages", // Project the last message
        },
      },
    ]);

    if (result.length === 0) {
      res.status(404).json({ message: "No messages found for this group." });
    } else {
      res.json(result[0].lastMessage);
    }
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Mounting routes for admin and employee registration
app.use("/api/employeeRegistration", require("./src/routes/employeeRegRoutes"));

// one tp one chat
app.use("/api", messageRouter);
app.use("/api", notificationRouter);

//empadmin sender routes

app.use("/api/empadminsender", empAdminsenderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/superAdmin", superAdminRoutes);
app.use("/api/serverControl", require("./src/routes/serverControlRoutes.js"));
app.use("/api/billingTeam", billingTeamRoutes);
app.use("/api/branch", branchRoutes);
app.use("/api/manager", managerRoute);
app.use("/api/location", locationRoutes);
app.use("/api/employee", employeeRoute);

// Start the server
app.listen(port, () => {
  console.log(`Server running on port no ${port}`);
});
