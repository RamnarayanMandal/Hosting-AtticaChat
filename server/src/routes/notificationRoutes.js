const express = require("express");
const router = express.Router();

const { getNotificationId,deleteNotification } = require("../controllers/notificationController");

router.get("/getNotification/:recipient", getNotificationId);
router.delete("/deleteNotification/:id", deleteNotification);

module.exports = router;
