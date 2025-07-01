const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? [process.env.FRONTEND_URL, /\.railway\.app$/]
      : "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Import routes and services
const aiService = require('./services/aiService');
const scoringService = require('./services/scoringService');
const configService = require('./services/configService');
const sessionService = require('./services/sessionService');
const userService = require('./services/userService');
const recordingService = require('./services/recordingService');
const multer = require('multer');

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit for recordings
  }
});

app.use(cors());
app.use(express.json());

// Serve static files from client build directory if it exists
const clientBuildPath = path.join(__dirname, 'client/build');
const fs = require('fs');

if (fs.existsSync(clientBuildPath)) {
  app.use(express.static(clientBuildPath));
} else {
  console.log('⚠️ Client build directory not found, serving API only');
}

// API Routes

// Authentication endpoints
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await userService.authenticateUser(username, password);
    
    if (result) {
      res.json(result);
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/auth/register', userService.authMiddleware('admin'), async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
});

app.post('/api/auth/change-password', userService.authMiddleware(), async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const success = await userService.changePassword(req.user.userId, currentPassword, newPassword);
    
    if (success) {
      res.json({ message: 'Password changed successfully' });
    } else {
      res.status(400).json({ error: 'Current password is incorrect' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// User management endpoints (admin only)
app.get('/api/users', userService.authMiddleware('admin'), async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.get('/api/users/:id', userService.authMiddleware(), async (req, res) => {
  try {
    // Users can view their own profile, admins can view any profile
    if (req.user.role !== 'admin' && req.user.userId !== req.params.id) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const user = await userService.getUserById(req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/users/:id', userService.authMiddleware(), async (req, res) => {
  try {
    // Users can update their own profile, admins can update any profile
    if (req.user.role !== 'admin' && req.user.userId !== req.params.id) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // Only admins can change roles
    if (req.body.role && req.user.role !== 'admin') {
      delete req.body.role;
    }
    
    const user = await userService.updateUser(req.params.id, req.body);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/users/:id', userService.authMiddleware('admin'), async (req, res) => {
  try {
    const success = await userService.deleteUser(req.params.id);
    if (success) {
      res.json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get current user profile
app.get('/api/auth/me', userService.authMiddleware(), async (req, res) => {
  try {
    const user = await userService.getUserById(req.user.userId);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Configuration endpoints
app.get('/api/personalities', async (req, res) => {
  try {
    const personalities = await configService.getPersonalities();
    res.json(personalities);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch personalities' });
  }
});

app.get('/api/scenarios', async (req, res) => {
  try {
    const scenarios = await configService.getScenarios();
    res.json(scenarios);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch scenarios' });
  }
});

app.post('/api/personalities', userService.authMiddleware('admin'), async (req, res) => {
  try {
    const success = await configService.addPersonality(req.body);
    if (success) {
      res.json({ message: 'Personality added successfully' });
    } else {
      res.status(400).json({ error: 'Failed to add personality' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/personalities/:id', userService.authMiddleware('admin'), async (req, res) => {
  try {
    const success = await configService.updatePersonality(req.params.id, req.body);
    if (success) {
      res.json({ message: 'Personality updated successfully' });
    } else {
      res.status(404).json({ error: 'Personality not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/personalities/:id', userService.authMiddleware('admin'), async (req, res) => {
  try {
    const success = await configService.deletePersonality(req.params.id);
    if (success) {
      res.json({ message: 'Personality deleted successfully' });
    } else {
      res.status(404).json({ error: 'Personality not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/scenarios', userService.authMiddleware('admin'), async (req, res) => {
  try {
    const success = await configService.addScenario(req.body);
    if (success) {
      res.json({ message: 'Scenario added successfully' });
    } else {
      res.status(400).json({ error: 'Failed to add scenario' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/scenarios/:id', userService.authMiddleware('admin'), async (req, res) => {
  try {
    const success = await configService.updateScenario(req.params.id, req.body);
    if (success) {
      res.json({ message: 'Scenario updated successfully' });
    } else {
      res.status(404).json({ error: 'Scenario not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/scenarios/:id', userService.authMiddleware('admin'), async (req, res) => {
  try {
    const success = await configService.deleteScenario(req.params.id);
    if (success) {
      res.json({ message: 'Scenario deleted successfully' });
    } else {
      res.status(404).json({ error: 'Scenario not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Session management endpoints
app.get('/api/sessions/history', userService.authMiddleware(), async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const history = sessionService.getSessionHistory(limit);
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch session history' });
  }
});

app.get('/api/sessions/stats', userService.authMiddleware(), async (req, res) => {
  try {
    const stats = sessionService.getSessionStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch session stats' });
  }
});

app.get('/api/sessions/:id', userService.authMiddleware(), async (req, res) => {
  try {
    const session = sessionService.getSession(req.params.id);
    if (session) {
      res.json(session);
    } else {
      res.status(404).json({ error: 'Session not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/sessions/:id', userService.authMiddleware('admin'), async (req, res) => {
  try {
    const success = sessionService.deleteSession(req.params.id);
    if (success) {
      res.json({ message: 'Session deleted successfully' });
    } else {
      res.status(404).json({ error: 'Session not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// User session tracking endpoints
app.get('/api/sessions/user/my-sessions', userService.authMiddleware(), async (req, res) => {
  try {
    const agentName = req.user.username;
    const sessions = sessionService.getUserSessions(agentName);
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user sessions' });
  }
});

app.get('/api/sessions/user/analytics', userService.authMiddleware(), async (req, res) => {
  try {
    const agentName = req.user.username;
    const analytics = sessionService.getUserAnalytics(agentName);
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user analytics' });
  }
});

// Admin session tracking endpoints
app.get('/api/sessions/admin/all-sessions', userService.authMiddleware('admin'), async (req, res) => {
  try {
    const sessions = sessionService.getAllSessions();
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch all sessions' });
  }
});

app.get('/api/sessions/admin/analytics', userService.authMiddleware('admin'), async (req, res) => {
  try {
    const analytics = sessionService.getAdminAnalytics();
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch admin analytics' });
  }
});

app.get('/api/sessions/user/:username', userService.authMiddleware('admin'), async (req, res) => {
  try {
    const sessions = sessionService.getUserSessions(req.params.username);
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user sessions' });
  }
});

// Store active sessions
const activeSessions = new Map();

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Start training session
  socket.on('startSession', async (data) => {
    const { clientType, agentName, personalityId, scenarioId } = data;
    const sessionId = socket.id;
    
    try {
      // Get personality and scenario from config service
      const personalities = await configService.getPersonalities();
      const scenarios = await configService.getScenarios();
      
      const personality = personalities.find(p => p.id === (personalityId || clientType));
      const scenario = scenarios.find(s => s.id === scenarioId) || scenarios[0];
      
      // Create session in session service
      const session = sessionService.createSession(agentName, personality, scenario);
      
      // Store in active sessions for socket handling
      activeSessions.set(sessionId, {
        sessionId: session.id,
        clientType: personality?.id || clientType,
        agentName,
        personality,
        scenario,
        startTime: new Date(),
        interactions: [],
        currentScore: 0,
        totalInteractions: 0
      });

      // Notify frontend that session has started with session ID
      socket.emit('sessionStarted', {
        sessionId: session.id,
        personality,
        scenario
      });

      // Generate initial client greeting based on personality and scenario
      const initialMessage = await aiService.generateClientMessage(
        personality?.id || clientType, 
        'greeting', 
        null, 
        [], 
        personality, 
        scenario
      );
      
      socket.emit('clientSpeaking', {
        message: initialMessage,
        clientType: personality?.id || clientType,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Error starting session:', error);
      socket.emit('error', { message: 'Failed to start session' });
    }
  });

  // Handle agent response
  socket.on('agentResponse', async (data) => {
    const { audioData, transcript, sessionId } = data;
    const activeSession = activeSessions.get(socket.id);
    
    if (!activeSession) return;

    try {
      // Score the agent's response
      const score = await scoringService.scoreAgentResponse(
        transcript,
        activeSession.clientType,
        activeSession.interactions
      );

      // Create exchange object for session service
      const exchange = {
        agentMessage: transcript,
        agentScore: score,
        feedback: scoringService.getFeedback(score),
        clientMessage: null // Will be filled after client response
      };

      // Update active session
      activeSession.interactions.push({
        type: 'agent',
        transcript,
        score,
        timestamp: new Date()
      });

      activeSession.totalInteractions++;
      activeSession.currentScore = ((activeSession.currentScore * (activeSession.totalInteractions - 1)) + score) / activeSession.totalInteractions;

      // Generate client response using personality and scenario
      const clientResponse = await aiService.generateClientMessage(
        activeSession.clientType, 
        'response', 
        transcript,
        activeSession.interactions,
        activeSession.personality,
        activeSession.scenario
      );

      // Complete the exchange
      exchange.clientMessage = clientResponse;
      
      // Add exchange to persistent session
      sessionService.addExchange(activeSession.sessionId, exchange);

      activeSession.interactions.push({
        type: 'client',
        message: clientResponse,
        timestamp: new Date()
      });

      // Send feedback to client
      socket.emit('scoreUpdate', {
        interactionScore: score,
        overallScore: activeSession.currentScore,
        feedback: scoringService.getFeedback(score),
        totalInteractions: activeSession.totalInteractions
      });

      // Send client response
      socket.emit('clientSpeaking', {
        message: clientResponse,
        clientType: activeSession.clientType,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Error handling agent response:', error);
      socket.emit('error', { message: 'Failed to process response' });
    }
  });

  // End session
  socket.on('endSession', () => {
    const activeSession = activeSessions.get(socket.id);
    if (activeSession) {
      try {
        // End session in session service
        const completedSession = sessionService.endSession(
          activeSession.sessionId, 
          activeSession.currentScore
        );
        
        const sessionReport = {
          agentName: activeSession.agentName,
          clientType: activeSession.clientType,
          duration: new Date() - activeSession.startTime,
          finalScore: activeSession.currentScore,
          totalInteractions: activeSession.totalInteractions,
          interactions: activeSession.interactions,
          sessionId: activeSession.sessionId
        };
        
        socket.emit('sessionReport', sessionReport);
        activeSessions.delete(socket.id);
      } catch (error) {
        console.error('Error ending session:', error);
      }
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    // End session if it exists
    const activeSession = activeSessions.get(socket.id);
    if (activeSession) {
      sessionService.endSession(activeSession.sessionId, activeSession.currentScore);
    }
    activeSessions.delete(socket.id);
  });
});

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

app.get('/api/session-types', async (req, res) => {
  try {
    const personalities = await configService.getPersonalities();
    res.json(personalities.map(p => ({
      id: p.id,
      name: p.name,
      description: p.description
    })));
  } catch (error) {
    // Fallback to default personalities
    res.json([
      { 
        id: 'normal', 
        name: 'Normal Customer',
        description: 'Polite customer asking standard questions about car repair'
      },
      { 
        id: 'unhappy', 
        name: 'Unhappy Customer',
        description: 'Customer dissatisfied with previous service'
      },
      { 
        id: 'angry', 
        name: 'Angry Customer',
        description: 'Frustrated customer with service complaints'
      },
      { 
        id: 'aggressive', 
        name: 'Aggressive Customer',
        description: 'Very demanding and potentially hostile customer'
      }
    ]);
  }
});

// Recording endpoints
app.post('/api/recordings/:sessionId', userService.authMiddleware(), upload.single('recording'), async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { type = 'full' } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: 'No recording file provided' });
    }
    
    const recordingInfo = await recordingService.saveRecording(
      sessionId, 
      req.file.buffer, 
      type
    );
    
    // Update session to mark it as having a recording
    sessionService.setRecordingStatus(sessionId, true, recordingInfo.filename);
    
    res.json({
      message: 'Recording saved successfully',
      recording: recordingInfo
    });
  } catch (error) {
    console.error('Error saving recording:', error);
    res.status(500).json({ error: 'Failed to save recording' });
  }
});

app.get('/api/recordings/:sessionId/:type?', userService.authMiddleware(), async (req, res) => {
  try {
    const { sessionId, type = 'full' } = req.params;
    
    const recording = await recordingService.getRecording(sessionId, type);
    
    if (!recording) {
      return res.status(404).json({ error: 'Recording not found' });
    }
    
    res.set({
      'Content-Type': recording.contentType,
      'Content-Disposition': `inline; filename="${recording.filename}"`
    });
    
    res.send(recording.data);
  } catch (error) {
    console.error('Error retrieving recording:', error);
    res.status(500).json({ error: 'Failed to retrieve recording' });
  }
});

app.get('/api/recordings/:sessionId/list', userService.authMiddleware(), async (req, res) => {
  try {
    const { sessionId } = req.params;
    const recordings = await recordingService.listRecordings(sessionId);
    res.json(recordings);
  } catch (error) {
    console.error('Error listing recordings:', error);
    res.status(500).json({ error: 'Failed to list recordings' });
  }
});

app.delete('/api/recordings/:sessionId/:type?', userService.authMiddleware('admin'), async (req, res) => {
  try {
    const { sessionId, type = 'full' } = req.params;
    
    const success = await recordingService.deleteRecording(sessionId, type);
    
    if (success) {
      // Update session to mark it as not having a recording
      sessionService.setRecordingStatus(sessionId, false, null);
      res.json({ message: 'Recording deleted successfully' });
    } else {
      res.status(404).json({ error: 'Recording not found' });
    }
  } catch (error) {
    console.error('Error deleting recording:', error);
    res.status(500).json({ error: 'Failed to delete recording' });
  }
});

// Serve React app
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, 'client/build', 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.json({ 
      message: 'Sparring Bot API Server', 
      status: 'API running - Frontend build not available',
      endpoints: ['/api/health', '/api/session-types', '/api/auth/login']
    });
  }
});

const PORT = process.env.PORT || 8080;

// Initialize services
async function initializeServices() {
  try {
    await sessionService.loadSessions();
    console.log('✅ Session service initialized');
    
    await userService.loadUsers();
    console.log('✅ User service initialized');
  } catch (error) {
    console.error('⚠️ Error initializing services:', error);
  }
}

server.listen(PORT, async () => {
  await initializeServices();
  console.log(`🚀 Sparring Bot Server running on port ${PORT}`);
  console.log(`📱 Open http://localhost:${PORT} to start training`);
  console.log(`🔧 API endpoints available at http://localhost:${PORT}/api/`);
});