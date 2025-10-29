import express from 'express';
import { 
    getUserProfile, 
    getAllUsers, 
    getUserById, 
    updateUserProfile, 
    promoteUserToAdmin, 
    deleteUser, 
    updateUserByAdmin 
} from '../controllers/userController';
import auth from '../Middlewares/authMiddleware';
import isAdmin from '../Middlewares/adminMiddleware';
import { validateRequest } from '../utils/validation';

const router = express.Router();

// User profile routes (authenticated users)
router.get('/profile', auth, getUserProfile);

// Update profile validation
router.put('/profile', auth, validateRequest({
  minLength: { firstname: 2, surname: 2 },
  maxLength: { firstname: 50, surname: 50, middlename: 50, phone: 20, department: 100 }
}), updateUserProfile);

// Admin-only user management routes
router.get('/', auth, isAdmin, getAllUsers);
router.get('/:userId', auth, isAdmin, getUserById);

// Update user by admin validation
router.put('/:userId', auth, isAdmin, validateRequest({
  minLength: { firstname: 2, surname: 2 },
  maxLength: { firstname: 50, surname: 50, middlename: 50, phone: 20, department: 100 }
}), updateUserByAdmin);

router.delete('/:userId', auth, isAdmin, deleteUser);

// Promote to admin validation
router.post('/promote-to-admin', auth, isAdmin, validateRequest({
  required: ['userId']
}), promoteUserToAdmin);

export default router;
