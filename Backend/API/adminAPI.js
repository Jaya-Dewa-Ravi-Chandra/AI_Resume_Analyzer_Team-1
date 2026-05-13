import exp from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import { UserModel } from "../Models/UserSchema.js";

export const adminApp = exp.Router();

/* =========================
   GET ALL USERS
========================= */
adminApp.get("/emails", verifyToken("ADMIN"), async (req, res) => {
  try {
    const usersDetails = await UserModel.find(
      { role: "USER" },
      {
        email: 1,
        _id: 1,
        firstName: 1, 
        lastName: 1,
        profileImageUrl: 1,
        role: 1,
        isUserActive: 1,
      },
    );

    res.status(200).json({
      message: "Users fetched successfully",
      USERS: usersDetails,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch users",
      error: error.message,
    });
  }
});

/* =========================
   BLOCK / UNBLOCK USER
========================= */
adminApp.put("/userStatus", verifyToken("ADMIN"), async (req, res) => {
  try {
    const { email, isUserActive } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.isUserActive = isUserActive;

    await user.save();

    res.status(200).json({
      message: `User ${isUserActive ? "unblocked" : "blocked"} successfully`,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update user status",
      error: error.message,
    });
  }
});

export default adminApp;
