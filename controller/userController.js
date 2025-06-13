import User from '../model/User.js';

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-__v'); 
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

export const disconnectGoogleAccount = async (req, res) => {
  const { userId } = req.params;

  if (!userId) return res.status(400).json({ message: 'userId is required' });

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.accessToken = '';
    user.refreshToken = '';
    await user.save();

    res.status(200).json({ message: ' Google account disconnected successfully' });
  } catch (error) {
    console.error('Disconnect Error:', error);
    res.status(500).json({ message: ' Failed to disconnect Google account' });
  }
};

// ✅ Delete User By ID
export const deleteUserById = async (req, res) => {
  const { userId } = req.params;

  if (!userId) return res.status(400).json({ message: 'userId is required' });

  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete Error:', error);
    res.status(500).json({ message: 'Failed to delete user' });
  }
};
