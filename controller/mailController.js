import { google } from 'googleapis';
import  {sendGmail}  from '../service/gmailService.js';
import User from '../model/User.js';
import Email from '../model/emailSchema.js'; 

export const sendMail = async (req, res) => {
  const { to, subject, message, userId } = req.body;
  const filePath = req.file?.path;

  if (!userId) return res.status(400).send("userId is required");

  try {
    const user = await User.findById(userId);
    if (!user?.refreshToken) return res.status(401).send("Unauthorized");

    const oAuth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_CALLBACK_URL
    );

    oAuth2Client.setCredentials({ refresh_token: user.refreshToken });
    const { token } = await oAuth2Client.getAccessToken();
    //  Normalize file path
     const normalizedPath = req.file ? req.file.path.replace(/\\/g, '/') : null;
    // Send Gmail
    await sendGmail(token, to, subject, message, normalizedPath);

   
    //  Save email to DB
    const emailDoc = new Email({
      userId,
      to,
      subject,
      message,
      filePath : normalizedPath || null,
      sentAt: new Date()
    });

    await emailDoc.save();

    res.send(" Email sent & saved successfully!");
  } catch (err) {
    console.error(" SendMail Error:", err);
    res.status(500).send("Failed to send email");
  }
};


// get sent emails 

export const getSentEmails = async (req, res) => {
  const { userId } = req.params;

  if (!userId) return res.status(400).json({ message: 'userId is required' });

  try {
    const emails = await Email.find({ userId }).sort({ sentAt: -1 });
    res.status(200).json(emails);
  } catch (error) {
    console.error('Error fetching sent emails:', error);
    res.status(500).json({ message: 'Failed to fetch sent emails' });
  }
};

// get single email 

export const getSingleEmail = async (req, res) => {
  const { id } = req.params;

  try {
    const email = await Email.findById(id);

    if (!email) {
      return res.status(404).json({ message: "Email not found" });
    }

    res.status(200).json(email);
  } catch (error) {
    console.error("Get Single Email Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
