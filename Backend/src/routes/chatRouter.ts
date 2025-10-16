import express from 'express';
import auth from '../Middlewares/authMiddleware';
import { generalChat, generalTest } from '../controllers/chat';

const router = express.Router();

router.post('/general-chat', auth, generalChat);
router.post('/general-test', auth, generalTest);

export default router;