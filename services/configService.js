const fs = require('fs').promises;
const path = require('path');

class ConfigService {
  constructor() {
    this.scenariosPath = path.join(__dirname, '../data/scenarios.json');
    this.cache = null;
  }

  async loadScenarios() {
    if (this.cache) {
      return this.cache;
    }

    try {
      const data = await fs.readFile(this.scenariosPath, 'utf8');
      this.cache = JSON.parse(data);
      return this.cache;
    } catch (error) {
      console.error('Error loading scenarios:', error);
      // Return default scenarios if file doesn't exist
      return this.getDefaultScenarios();
    }
  }

  async saveScenarios(scenarios) {
    try {
      await fs.writeFile(this.scenariosPath, JSON.stringify(scenarios, null, 2));
      this.cache = scenarios;
      return true;
    } catch (error) {
      console.error('Error saving scenarios:', error);
      return false;
    }
  }

  async getPersonalities() {
    const scenarios = await this.loadScenarios();
    return scenarios.personalities || [];
  }

  async getScenarios() {
    const scenarios = await this.loadScenarios();
    return scenarios.scenarios || [];
  }

  async addPersonality(personality) {
    const scenarios = await this.loadScenarios();
    personality.id = personality.id || this.generateId();
    scenarios.personalities.push(personality);
    return await this.saveScenarios(scenarios);
  }

  async updatePersonality(id, updatedPersonality) {
    const scenarios = await this.loadScenarios();
    const index = scenarios.personalities.findIndex(p => p.id === id);
    if (index !== -1) {
      scenarios.personalities[index] = { ...scenarios.personalities[index], ...updatedPersonality };
      return await this.saveScenarios(scenarios);
    }
    return false;
  }

  async deletePersonality(id) {
    const scenarios = await this.loadScenarios();
    scenarios.personalities = scenarios.personalities.filter(p => p.id !== id);
    return await this.saveScenarios(scenarios);
  }

  async addScenario(scenario) {
    const scenarios = await this.loadScenarios();
    scenario.id = scenario.id || this.generateId();
    scenarios.scenarios.push(scenario);
    return await this.saveScenarios(scenarios);
  }

  async updateScenario(id, updatedScenario) {
    const scenarios = await this.loadScenarios();
    const index = scenarios.scenarios.findIndex(s => s.id === id);
    if (index !== -1) {
      scenarios.scenarios[index] = { ...scenarios.scenarios[index], ...updatedScenario };
      return await this.saveScenarios(scenarios);
    }
    return false;
  }

  async deleteScenario(id) {
    const scenarios = await this.loadScenarios();
    scenarios.scenarios = scenarios.scenarios.filter(s => s.id !== id);
    return await this.saveScenarios(scenarios);
  }

  generateId() {
    return Math.random().toString(36).substr(2, 9);
  }

  getDefaultScenarios() {
    return {
      personalities: [
        {
          id: "normal",
          name: "Normal Customer",
          description: "Calm and reasonable, asking for help with a standard issue.",
          traits: ["Patient and understanding", "Clearly explains the problem"]
        },
        {
          id: "unhappy", 
          name: "Unhappy Customer",
          description: "Disappointed but still cooperative, hoping for a resolution.",
          traits: ["Expresses disappointment", "Still willing to work together"]
        }
      ],
      scenarios: [
        {
          id: "brake_repair",
          name: "Brake Repair Issue",
          description: "Customer's car brakes are making noise after recent repair",
          context: "Customer had brake pads replaced last week, now hearing grinding noise"
        }
      ]
    };
  }
}

module.exports = new ConfigService();
