import {Router} from 'express';
import { register, login ,updatePassword } from '../controllers/auth.controller';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/update_password',updatePassword);

export default router;

