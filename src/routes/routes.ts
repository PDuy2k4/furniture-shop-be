import express from 'express';
import { signup } from '~/middleware/signup';
import { authenticate } from '~/middleware/authentication';
import { verifyToken } from '~/middleware/verifyToken';
import { resetPass } from '~/middleware/resetPass';
import { requestChaning } from '~/middleware/requestChangingPassword';
import { googleSignIn } from '~/middleware/googleSignIn';
const router = express.Router();

router.post('/signup', signup);
router.post('/login', authenticate);
router.post('/verifyToken', verifyToken);
router.post('/resetPassword', resetPass);
router.post('/changePassword', requestChaning);
router.post('/gglogin', googleSignIn);
export default router;