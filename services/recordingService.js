const fs = require('fs').promises;
const path = require('path');

class RecordingService {
  constructor() {
    this.recordingsPath = path.join(__dirname, '../data/recordings');
    this.ensureRecordingsDirectory();
  }

  async ensureRecordingsDirectory() {
    try {
      await fs.access(this.recordingsPath);
    } catch (error) {
      // Directory doesn't exist, create it
      await fs.mkdir(this.recordingsPath, { recursive: true });
    }
  }

  async saveRecording(sessionId, audioBlob, type = 'full') {
    try {
      await this.ensureRecordingsDirectory();
      
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `${sessionId}_${type}_${timestamp}.webm`;
      const filepath = path.join(this.recordingsPath, filename);
      
      // Convert blob to buffer (in real implementation, this would be handled by multer)
      await fs.writeFile(filepath, audioBlob);
      
      return {
        filename,
        filepath,
        sessionId,
        type,
        timestamp: new Date().toISOString(),
        size: audioBlob.length
      };
    } catch (error) {
      console.error('Error saving recording:', error);
      throw error;
    }
  }

  async getRecording(sessionId, type = 'full') {
    try {
      const files = await fs.readdir(this.recordingsPath);
      const recordingFile = files.find(file => 
        file.startsWith(`${sessionId}_${type}`) && file.endsWith('.webm')
      );
      
      if (!recordingFile) {
        return null;
      }
      
      const filepath = path.join(this.recordingsPath, recordingFile);
      const recording = await fs.readFile(filepath);
      
      return {
        filename: recordingFile,
        data: recording,
        contentType: 'audio/webm'
      };
    } catch (error) {
      console.error('Error retrieving recording:', error);
      return null;
    }
  }

  async listRecordings(sessionId) {
    try {
      const files = await fs.readdir(this.recordingsPath);
      const sessionRecordings = files
        .filter(file => file.startsWith(sessionId) && file.endsWith('.webm'))
        .map(file => {
          const parts = file.replace('.webm', '').split('_');
          return {
            filename: file,
            sessionId: parts[0],
            type: parts[1] || 'full',
            timestamp: parts.slice(2).join('_')
          };
        });
      
      return sessionRecordings;
    } catch (error) {
      console.error('Error listing recordings:', error);
      return [];
    }
  }

  async deleteRecording(sessionId, type = 'full') {
    try {
      const files = await fs.readdir(this.recordingsPath);
      const recordingFile = files.find(file => 
        file.startsWith(`${sessionId}_${type}`) && file.endsWith('.webm')
      );
      
      if (recordingFile) {
        const filepath = path.join(this.recordingsPath, recordingFile);
        await fs.unlink(filepath);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error deleting recording:', error);
      return false;
    }
  }

  getRecordingUrl(sessionId, type = 'full') {
    return `/api/recordings/${sessionId}/${type}`;
  }
}

module.exports = new RecordingService();
