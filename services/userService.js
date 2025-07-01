const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class UserService {
  constructor() {
    this.usersPath = path.join(__dirname, '../data/users.json');
    this.users = new Map();
    this.jwtSecret = process.env.JWT_SECRET || 'sparring_bot_secret_key_change_in_production';
  }

  async loadUsers() {
    try {
      const data = await fs.readFile(this.usersPath, 'utf8');
      const usersArray = JSON.parse(data);
      this.users = new Map(usersArray.map(u => [u.id, u]));
    } catch (error) {
      console.log('No existing users file, creating default admin user');
      await this.createDefaultAdmin();
    }
  }

  async saveUsers() {
    try {
      const usersArray = Array.from(this.users.values());
      // Don't save passwords in plain text (they're already hashed)
      await fs.writeFile(this.usersPath, JSON.stringify(usersArray, null, 2));
    } catch (error) {
      console.error('Error saving users:', error);
    }
  }

  async createDefaultAdmin() {
    const adminUser = {
      id: 'admin_001',
      username: 'admin',
      email: 'admin@sparringbot.com',
      password: await bcrypt.hash('admin123', 10), // Change this!
      role: 'admin',
      createdAt: new Date().toISOString(),
      isActive: true,
      profile: {
        firstName: 'System',
        lastName: 'Administrator',
        department: 'IT'
      }
    };

    this.users.set(adminUser.id, adminUser);
    await this.saveUsers();
    console.log('✅ Default admin user created (username: admin, password: admin123)');
    console.log('⚠️ Please change the default password immediately!');
  }

  async createUser(userData) {
    const user = {
      id: this.generateUserId(),
      username: userData.username,
      email: userData.email,
      password: await bcrypt.hash(userData.password, 10),
      role: userData.role || 'user',
      createdAt: new Date().toISOString(),
      isActive: true,
      profile: {
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        department: userData.department || ''
      }
    };

    this.users.set(user.id, user);
    await this.saveUsers();
    
    // Return user without password
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async authenticateUser(username, password) {
    const user = Array.from(this.users.values()).find(u => 
      u.username === username && u.isActive
    );

    if (!user) {
      return null;
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return null;
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, username: user.username, role: user.role },
      this.jwtSecret,
      { expiresIn: '24h' }
    );

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, this.jwtSecret);
    } catch (error) {
      return null;
    }
  }

  async getUserById(userId) {
    const user = this.users.get(userId);
    if (user) {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return null;
  }

  async getAllUsers() {
    const usersArray = Array.from(this.users.values());
    return usersArray.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }

  async updateUser(userId, updateData) {
    const user = this.users.get(userId);
    if (!user) {
      return null;
    }

    // Update allowed fields
    const allowedUpdates = ['email', 'role', 'isActive', 'profile'];
    const updates = {};
    
    allowedUpdates.forEach(field => {
      if (updateData[field] !== undefined) {
        updates[field] = updateData[field];
      }
    });

    // Handle password update separately
    if (updateData.password) {
      updates.password = await bcrypt.hash(updateData.password, 10);
    }

    const updatedUser = { ...user, ...updates, updatedAt: new Date().toISOString() };
    this.users.set(userId, updatedUser);
    await this.saveUsers();

    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  async deleteUser(userId) {
    const deleted = this.users.delete(userId);
    if (deleted) {
      await this.saveUsers();
    }
    return deleted;
  }

  async changePassword(userId, currentPassword, newPassword) {
    const user = this.users.get(userId);
    if (!user) {
      return false;
    }

    const isValidCurrentPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidCurrentPassword) {
      return false;
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.updatedAt = new Date().toISOString();
    this.users.set(userId, user);
    await this.saveUsers();
    return true;
  }

  getUsersByRole(role) {
    const usersArray = Array.from(this.users.values());
    return usersArray
      .filter(user => user.role === role && user.isActive)
      .map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
  }

  generateUserId() {
    return 'user_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }

  // Middleware for authentication
  authMiddleware(requiredRole = null) {
    return (req, res, next) => {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
      }

      try {
        const decoded = this.verifyToken(token);
        if (!decoded) {
          return res.status(401).json({ error: 'Invalid token.' });
        }

        req.user = decoded;

        // Check role if required
        if (requiredRole && req.user.role !== requiredRole && req.user.role !== 'admin') {
          return res.status(403).json({ error: 'Access denied. Insufficient permissions.' });
        }

        next();
      } catch (error) {
        res.status(401).json({ error: 'Invalid token.' });
      }
    };
  }
}

module.exports = new UserService();
