import { Router } from 'express';
import { handleMessage } from '../controllers/message.controller';

const router = Router();

router.post('/message', handleMessage);

export default router;