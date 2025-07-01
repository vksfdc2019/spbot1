const fs = require('fs').promises;
const path = require('path');

class SessionService {
  constructor() {
    this.sessionsPath = path.join(__dirname, '../data/sessions.json');
    this.sessions = new Map();
  }

  async loadSessions() {
    try {
      const data = await fs.readFile(this.sessionsPath, 'utf8');
      const sessionsArray = JSON.parse(data);
      this.sessions = new Map(sessionsArray.map(s => [s.id, s]));
    } catch (error) {
      console.log('No existing sessions file, starting fresh');
      this.sessions = new Map();
    }
  }

  async saveSessions() {
    try {
      const sessionsArray = Array.from(this.sessions.values());
      await fs.writeFile(this.sessionsPath, JSON.stringify(sessionsArray, null, 2));
    } catch (error) {
      console.error('Error saving sessions:', error);
    }
  }

  createSession(agentName, personality, scenario) {
    const session = {
      id: this.generateSessionId(),
      agentName: agentName || 'Anonymous Agent',
      personality,
      scenario,
      startTime: new Date().toISOString(),
      endTime: null,
      exchanges: [],
      finalScore: null,
      status: 'active',
      hasRecording: false,
      recordingUrl: null
    };

    this.sessions.set(session.id, session);
    return session;
  }

  getSession(sessionId) {
    return this.sessions.get(sessionId);
  }

  addExchange(sessionId, exchange) {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.exchanges.push({
        ...exchange,
        timestamp: new Date().toISOString()
      });
      this.saveSessions(); // Save after each exchange
      return true;
    }
    return false;
  }

  endSession(sessionId, finalScore) {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.endTime = new Date().toISOString();
      session.finalScore = finalScore;
      session.status = 'completed';
      
      // Calculate session duration
      session.duration = new Date(session.endTime) - new Date(session.startTime);
      
      this.saveSessions();
      return session;
    }
    return null;
  }

  getSessionHistory(limit = 50) {
    const allSessions = Array.from(this.sessions.values());
    return allSessions
      .sort((a, b) => new Date(b.startTime) - new Date(a.startTime))
      .slice(0, limit);
  }

  getSessionStats() {
    const allSessions = Array.from(this.sessions.values());
    const completedSessions = allSessions.filter(s => s.status === 'completed');
    
    if (completedSessions.length === 0) {
      return {
        totalSessions: 0,
        averageScore: 0,
        averageDuration: 0,
        personalityBreakdown: {},
        scenarioBreakdown: {}
      };
    }

    const totalScore = completedSessions.reduce((sum, s) => sum + (s.finalScore || 0), 0);
    const totalDuration = completedSessions.reduce((sum, s) => sum + (s.duration || 0), 0);
    
    const personalityBreakdown = {};
    const scenarioBreakdown = {};
    
    completedSessions.forEach(session => {
      // Personality breakdown
      const personality = session.personality?.name || 'Unknown';
      if (!personalityBreakdown[personality]) {
        personalityBreakdown[personality] = { count: 0, totalScore: 0 };
      }
      personalityBreakdown[personality].count++;
      personalityBreakdown[personality].totalScore += session.finalScore || 0;
      
      // Scenario breakdown
      const scenario = session.scenario?.name || 'Unknown';
      if (!scenarioBreakdown[scenario]) {
        scenarioBreakdown[scenario] = { count: 0, totalScore: 0 };
      }
      scenarioBreakdown[scenario].count++;
      scenarioBreakdown[scenario].totalScore += session.finalScore || 0;
    });

    // Calculate averages for breakdowns
    Object.keys(personalityBreakdown).forEach(key => {
      personalityBreakdown[key].averageScore = 
        personalityBreakdown[key].totalScore / personalityBreakdown[key].count;
    });
    
    Object.keys(scenarioBreakdown).forEach(key => {
      scenarioBreakdown[key].averageScore = 
        scenarioBreakdown[key].totalScore / scenarioBreakdown[key].count;
    });

    return {
      totalSessions: completedSessions.length,
      averageScore: totalScore / completedSessions.length,
      averageDuration: totalDuration / completedSessions.length,
      personalityBreakdown,
      scenarioBreakdown
    };
  }

  // Get sessions for a specific user
  getUserSessions(agentName) {
    const userSessions = Array.from(this.sessions.values())
      .filter(session => session.agentName === agentName)
      .sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
    
    return userSessions;
  }

  // Get all sessions (admin view)
  getAllSessions() {
    return Array.from(this.sessions.values())
      .sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
  }

  // Get detailed analytics for a user
  getUserAnalytics(agentName) {
    const userSessions = this.getUserSessions(agentName);
    const completedSessions = userSessions.filter(s => s.status === 'completed' && s.finalScore !== null);
    
    if (completedSessions.length === 0) {
      return {
        totalSessions: 0,
        averageScore: 0,
        averageDuration: 0,
        personalityBreakdown: {},
        scenarioBreakdown: {},
        progressData: [],
        recentSessions: []
      };
    }

    const totalScore = completedSessions.reduce((sum, s) => sum + (s.finalScore || 0), 0);
    const totalDuration = completedSessions.reduce((sum, s) => sum + (s.duration || 0), 0);
    
    const personalityBreakdown = {};
    const scenarioBreakdown = {};
    const progressData = [];
    
    completedSessions.forEach((session, index) => {
      // Personality breakdown
      const personality = session.personality?.name || 'Unknown';
      if (!personalityBreakdown[personality]) {
        personalityBreakdown[personality] = { count: 0, totalScore: 0, sessions: [] };
      }
      personalityBreakdown[personality].count++;
      personalityBreakdown[personality].totalScore += session.finalScore || 0;
      personalityBreakdown[personality].sessions.push({
        date: session.startTime,
        score: session.finalScore
      });
      
      // Scenario breakdown
      const scenario = session.scenario?.name || 'Unknown';
      if (!scenarioBreakdown[scenario]) {
        scenarioBreakdown[scenario] = { count: 0, totalScore: 0, sessions: [] };
      }
      scenarioBreakdown[scenario].count++;
      scenarioBreakdown[scenario].totalScore += session.finalScore || 0;
      scenarioBreakdown[scenario].sessions.push({
        date: session.startTime,
        score: session.finalScore
      });

      // Progress data for charts
      progressData.push({
        sessionNumber: completedSessions.length - index,
        date: session.startTime,
        score: session.finalScore,
        personality: personality,
        scenario: scenario,
        duration: session.duration || 0
      });
    });

    // Calculate averages for breakdowns
    Object.keys(personalityBreakdown).forEach(key => {
      personalityBreakdown[key].averageScore = 
        personalityBreakdown[key].totalScore / personalityBreakdown[key].count;
    });
    
    Object.keys(scenarioBreakdown).forEach(key => {
      scenarioBreakdown[key].averageScore = 
        scenarioBreakdown[key].totalScore / scenarioBreakdown[key].count;
    });

    return {
      totalSessions: completedSessions.length,
      averageScore: totalScore / completedSessions.length,
      averageDuration: totalDuration / completedSessions.length,
      personalityBreakdown,
      scenarioBreakdown,
      progressData: progressData.reverse(), // Show chronological order
      recentSessions: userSessions.slice(0, 10) // Last 10 sessions
    };
  }

  // Get admin analytics for all users
  getAdminAnalytics() {
    const allSessions = this.getAllSessions();
    const completedSessions = allSessions.filter(s => s.status === 'completed' && s.finalScore !== null);
    
    // User performance breakdown
    const userPerformance = {};
    completedSessions.forEach(session => {
      const agentName = session.agentName || 'Anonymous';
      if (!userPerformance[agentName]) {
        userPerformance[agentName] = {
          totalSessions: 0,
          totalScore: 0,
          sessions: []
        };
      }
      userPerformance[agentName].totalSessions++;
      userPerformance[agentName].totalScore += session.finalScore || 0;
      userPerformance[agentName].sessions.push(session);
    });

    // Calculate averages
    Object.keys(userPerformance).forEach(user => {
      userPerformance[user].averageScore = 
        userPerformance[user].totalScore / userPerformance[user].totalSessions;
    });

    // Overall statistics
    const overallStats = this.getSessionStats();

    return {
      totalUsers: Object.keys(userPerformance).length,
      totalSessions: completedSessions.length,
      userPerformance,
      overallStats,
      recentSessions: allSessions.slice(0, 20)
    };
  }

  generateSessionId() {
    return 'sess_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }

  deleteSession(sessionId) {
    const deleted = this.sessions.delete(sessionId);
    if (deleted) {
      this.saveSessions();
    }
    return deleted;
  }

  setRecordingStatus(sessionId, hasRecording, recordingUrl = null) {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.hasRecording = hasRecording;
      session.recordingUrl = recordingUrl;
      this.saveSessions();
      return true;
    }
    return false;
  }
}

module.exports = new SessionService();
