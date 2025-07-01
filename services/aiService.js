const OpenAI = require('openai');
const configService = require('./configService');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Default client personality templates (fallback if config service fails)
const DEFAULT_CLIENT_PERSONALITIES = {
  normal: {
    tone: "polite and friendly",
    concerns: ["pricing", "timeline", "warranty", "quality"],
    phrases: [
      "I'd like to know about",
      "Could you please tell me", 
      "I'm wondering if",
      "What would be the cost for"
    ]
  },
  unhappy: {
    tone: "disappointed and concerned",
    concerns: ["previous bad experience", "delays", "poor service", "overcharging"],
    phrases: [
      "I'm not happy with",
      "Last time you guys",
      "I'm concerned about",
      "I hope this time"
    ]
  },
  angry: {
    tone: "frustrated and demanding",
    concerns: ["repeated problems", "wasted time", "money lost", "incompetence"],
    phrases: [
      "This is ridiculous",
      "I've had enough of",
      "You people need to",
      "I demand to know"
    ]
  },
  aggressive: {
    tone: "hostile and confrontational",
    concerns: ["feeling cheated", "poor treatment", "incompetent staff", "false promises"],
    phrases: [
      "This is unacceptable",
      "I want to speak to the manager",
      "You're trying to rip me off",
      "I'll take my business elsewhere"
    ]
  }
};

// Car repair scenarios
const CAR_SCENARIOS = [
  {
    issue: "brake repair",
    details: "squeaking brakes, needs pad replacement",
    price_range: "$200-400"
  },
  {
    issue: "engine diagnostic",
    details: "check engine light on, possible sensor issue",
    price_range: "$100-300"
  },
  {
    issue: "transmission service",
    details: "rough shifting, fluid change needed",
    price_range: "$150-500"
  },
  {
    issue: "AC repair",
    details: "not cooling properly, refrigerant leak",
    price_range: "$200-600"
  },
  {
    issue: "tire replacement",
    details: "worn tires, alignment needed",
    price_range: "$400-800"
  }
];

class AIService {
  async generateClientMessage(clientType, messageType, agentResponse = null, conversationHistory = [], customPersonality = null, customScenario = null) {
    // Get personalities and scenarios from config service
    let personalities, scenarios;
    try {
      personalities = await configService.getPersonalities();
      scenarios = await configService.getScenarios();
    } catch (error) {
      console.error('Error loading config, using defaults:', error);
      personalities = Object.keys(DEFAULT_CLIENT_PERSONALITIES).map(key => ({
        id: key,
        name: key.charAt(0).toUpperCase() + key.slice(1),
        traits: DEFAULT_CLIENT_PERSONALITIES[key].phrases
      }));
      scenarios = CAR_SCENARIOS.map((s, i) => ({
        id: s.issue.replace(/\s+/g, '_'),
        name: s.issue,
        context: s.details
      }));
    }

    // Use custom personality or find by clientType
    const personality = customPersonality || personalities.find(p => p.id === clientType) || DEFAULT_CLIENT_PERSONALITIES[clientType];
    const scenario = customScenario || scenarios[Math.floor(Math.random() * scenarios.length)] || CAR_SCENARIOS[0];
    
    let systemPrompt = `You are a ${personality.name || clientType} customer calling a car repair shop. `;
    systemPrompt += `Your personality traits: ${(personality.traits || []).join(', ')}. `;
    
    if (messageType === 'greeting') {
      systemPrompt += `Start the conversation by greeting and mentioning your car issue: ${scenario.name} - ${scenario.context || scenario.description}. `;
    } else {
      systemPrompt += `Respond to the agent's message: "${agentResponse}". `;
    }
    
    systemPrompt += `Keep responses natural, under 2 sentences, and match your personality. `;
    if (personality.traits) {
      systemPrompt += `Stay true to these traits: ${personality.traits.join(', ')}.`;
    }

    try {
      const completion = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: messageType === 'greeting' ? "Start the conversation" : agentResponse
          }
        ],
        max_tokens: 100,
        temperature: 0.8
      });

      return completion.choices[0].message.content.trim();
    } catch (error) {
      console.error('OpenAI API Error:', error);
      return this.getFallbackMessage(clientType, messageType);
    }
  }

  getFallbackMessage(clientType, messageType) {
    const fallbacks = {
      normal: {
        greeting: "Hi, I'm calling about my car. I've been having some brake issues and wondering if you could help me with a quote for brake pad replacement?",
        response: "I see. Could you tell me more about the pricing and how long this would take?"
      },
      unhappy: {
        greeting: "Hello, I'm calling because I'm not very happy with the service I received last time. I need more work done but I'm concerned about the quality.",
        response: "Well, I hope you can do better this time. What's your plan to make sure this doesn't happen again?"
      },
      angry: {
        greeting: "Listen, I've had it with you people. My car was supposed to be fixed last week and it's still having problems. What are you going to do about it?",
        response: "That's not good enough! I've already wasted too much time and money on this. You need to fix this properly!"
      },
      aggressive: {
        greeting: "I want to speak to someone in charge right now! Your shop has been giving me the runaround and I'm sick of it. Fix my car or I'm taking my business elsewhere!",
        response: "Don't give me excuses! I want results and I want them now. You people are trying to rip me off!"
      }
    };

    return fallbacks[clientType]?.[messageType] || "I have a question about my car repair.";
  }
}

module.exports = new AIService();
