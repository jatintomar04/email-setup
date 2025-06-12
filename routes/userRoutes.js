import express from 'express';
import  {getAllUsers, disconnectGoogleAccount}  from '../controller/userController.js';
import {getSentEmails,getSingleEmail} from '../controller/mailController.js'

const  router = express.Router();

router.get('/all', getAllUsers);
router.get('/sent/:userId', getSentEmails);
router.put('/disconnect/:userId', disconnectGoogleAccount); 

router.get('/email/:id', getSingleEmail); 

export default router;
