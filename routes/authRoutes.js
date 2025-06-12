import express from 'express';
import passport from 'passport';
import { sendMail } from '../controller/mailController.js';
import { upload } from '../controller/upload.js';

const router = express.Router();

router.get('/google',
  passport.authenticate('google', {
    scope: ['profile', 'email', 'https://www.googleapis.com/auth/gmail.send'],
    accessType: 'offline',
    prompt: 'consent'
  })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.send('Successfully logged in with Google');
  }
);

router.post('/send', upload.single('file'), sendMail);

export default router;
