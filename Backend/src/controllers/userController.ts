import { Request, Response } from 'express';
import User from '../model/user.model';
import { ApiResponse, AuthenticatedUser } from '../types';
import { sendResponse } from '../utils/validation';

// Get user profile logic
export const getUserProfile = async (req: Request & { user?: AuthenticatedUser }, res: Response<ApiResponse>): Promise<void> => {
    try {
        const userId = req.user?._id
        
        const user = await User.findById(userId).select("-password")
        if(!user) {
            sendResponse(res, 404, false, undefined, undefined, "User not found");
            return
        }
        sendResponse(res, 200, true, user, "User profile retrieved successfully");
    }
    catch(error) {
        console.error(error)
        sendResponse(res, 500, false, undefined, undefined, "Internal server error");
    }
}

// Get all users
export const getAllUsers = async (req: Request, res: Response<ApiResponse>): Promise<void> => {
    try {
        const allUsers = await User.find().select("-password -verificationToken")
        sendResponse(res, 200, true, allUsers, "Users retrieved successfully");
    }
    catch (error) {
        console.error("Error fetching all users:", error);
        sendResponse(res, 500, false, undefined, undefined, "Internal server error");
    }
}

// Get user by ID
export const getUserById = async (req: Request, res: Response<ApiResponse>): Promise<void> => {
    try {
        const { userId } = req.params;
        
        if (!userId) {
            sendResponse(res, 400, false, undefined, undefined, "User ID is required");
            return;
        }

        const user = await User.findById(userId).select("-password -verificationToken");
        
        if (!user) {
            sendResponse(res, 404, false, undefined, undefined, "User not found");
            return;
        }

        sendResponse(res, 200, true, user, "User retrieved successfully");
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        sendResponse(res, 500, false, undefined, undefined, "Internal server error");
    }
}

// Update user profile
export const updateUserProfile = async (req: Request & { user?: AuthenticatedUser }, res: Response<ApiResponse>): Promise<void> => {
    try {
        const userId = req.user?._id;
        const updateData = req.body;

        // Remove sensitive fields that shouldn't be updated directly
        delete updateData.password;
        delete updateData.role;
        delete updateData.verified;
        delete updateData.verificationToken;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, runValidators: true }
        ).select("-password -verificationToken");

        if (!updatedUser) {
            sendResponse(res, 404, false, undefined, undefined, "User not found");
            return;
        }

        sendResponse(res, 200, true, updatedUser, "Profile updated successfully");
    } catch (error) {
        console.error("Error updating user profile:", error);
        sendResponse(res, 500, false, undefined, undefined, "Internal server error");
    }
}

// Create admin logic
export const promoteUserToAdmin = async (req: Request & { user?: AuthenticatedUser }, res: Response<ApiResponse>): Promise<void> => {
    try {
        const { userId } = req.body;
        
        if (!userId) {
            sendResponse(res, 400, false, undefined, undefined, "User ID is required");
            return;
        }

        if (!req.user?._id) {
            sendResponse(res, 401, false, undefined, undefined, "Authentication required");
            return;
        }

        const updatedUser = await User.promoteToAdmin(userId, req.user._id);
        
        // Remove sensitive data before sending response
        const { password: _, adminSecretKey: __, ...userWithoutSensitiveData } = updatedUser as any;

        sendResponse(res, 200, true, userWithoutSensitiveData, "User successfully promoted to admin");
    } catch (error) {
        console.error("Error promoting user to admin:", error);
        sendResponse(res, 400, false, undefined, undefined, (error as Error).message || "Failed to promote user to admin");
    }
};

// Delete user
export const deleteUser = async (req: Request & { user?: AuthenticatedUser }, res: Response<ApiResponse>): Promise<void> => {
    try {
        const { userId } = req.params;
        
        if (!userId) {
            sendResponse(res, 400, false, undefined, undefined, "User ID is required");
            return;
        }

        // Prevent users from deleting themselves
        if (req.user?._id === userId) {
            sendResponse(res, 400, false, undefined, undefined, "Cannot delete your own account");
            return;
        }

        const deletedUser = await User.findByIdAndDelete(userId);
        
        if (!deletedUser) {
            sendResponse(res, 404, false, undefined, undefined, "User not found");
            return;
        }

        sendResponse(res, 200, true, { userId: deletedUser._id }, "User deleted successfully");
    } catch (error) {
        console.error("Error deleting user:", error);
        sendResponse(res, 500, false, undefined, undefined, "Internal server error");
    }
};

// Update user by admin
export const updateUserByAdmin = async (req: Request & { user?: AuthenticatedUser }, res: Response<ApiResponse>): Promise<void> => {
    try {
        const { userId } = req.params;
        const updateData = req.body;

        if (!userId) {
            sendResponse(res, 400, false, undefined, undefined, "User ID is required");
            return;
        }

        // Remove sensitive fields that require special handling
        delete updateData.password;
        delete updateData.verificationToken;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, runValidators: true }
        ).select("-password -verificationToken");

        if (!updatedUser) {
            sendResponse(res, 404, false, undefined, undefined, "User not found");
            return;
        }

        sendResponse(res, 200, true, updatedUser, "User updated successfully");
    } catch (error) {
        console.error("Error updating user by admin:", error);
        sendResponse(res, 500, false, undefined, undefined, "Internal server error");
    }
};