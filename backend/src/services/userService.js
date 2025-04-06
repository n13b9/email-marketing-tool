import User from "../models/userModel.js";

class UserService {
  /**
   * Create a new user
   * @param {Object} userData
   * @param {string} userData.email - User's email
   * @param {string} userData.password - User's password
   * @returns {Promise<Object>} Created user object
   */
  async createUser({ email, password }) {
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error("User with this email already exists");
      }

      // Create new user
      const user = new User({
        email,
        password,
      });

      await user.save();

      // Return user without password
      const userResponse = user.toObject();
      delete userResponse.password;
      return userResponse;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  /**
   * Get user by email
   * @param {string} email - User's email
   * @returns {Promise<Object|null>} User object or null if not found
   */
  async getUser(email) {
    try {
      const user = await User.findOne({ email });
      if (!user) return null;

      // Return user without password
      const userResponse = user.toObject();
      delete userResponse.password;
      return userResponse;
    } catch (error) {
      console.error("Error getting user:", error);
      throw error;
    }
  }

  /**
   * Get user by ID
   * @param {string} userId - User's ID
   * @returns {Promise<Object|null>} User object or null if not found
   */
  async getUserById(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) return null;

      // Return user without password
      const userResponse = user.toObject();
      delete userResponse.password;
      return userResponse;
    } catch (error) {
      console.error("Error getting user by ID:", error);
      throw error;
    }
  }

  /**
   * Verify user password
   * @param {string} email - User's email
   * @param {string} password - Password to verify
   * @returns {Promise<boolean>} Whether the password is valid
   */
  async verifyPassword(email, password) {
    try {
      const user = await User.findOne({ email });
      if (!user) return false;

      return await user.comparePassword(password);
    } catch (error) {
      console.error("Error verifying password:", error);
      throw error;
    }
  }
}

export default new UserService();
