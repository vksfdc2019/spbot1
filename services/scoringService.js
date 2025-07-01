const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

class ScoringService {
  async scoreAgentResponse(agentTranscript, clientType, conversationHistory) {
    if (!agentTranscript || agentTranscript.trim().length === 0) {
      return 0;
    }

    const systemPrompt = `You are an expert customer service trainer evaluating an agent's response to a ${clientType} customer.

SCORING CRITERIA (0-3 scale):
0 = Very poor behavior - Rude, unprofessional, dismissive, or harmful. Needs strict action.
1 = Below moderate - Lacks empathy, poor communication, doesn't address concerns. Needs thorough training.
2 = Moderate - Professional but could improve empathy, problem-solving, or communication. Needs further training.
3 = Good/Excellent - Empathetic, professional, addresses concerns effectively, demonstrates excellent customer service.

EVALUATION FACTORS:
- Tone and professionalism
- Empathy and understanding
- Problem-solving approach
- Addressing customer concerns
- De-escalation skills (especially for angry/aggressive customers)
- Clear communication
- Offering solutions

Agent's response: "${agentTranscript}"

Respond with ONLY a number (0, 1, 2, or 3) representing the score.`;    try {
        const completion = await openai.chat.completions.create({
            model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: agentTranscript
          }
        ],
        max_tokens: 10,
        temperature: 0.3
      });

      const score = parseInt(completion.choices[0].message.content.trim());
      return isNaN(score) ? this.fallbackScore(agentTranscript, clientType) : Math.max(0, Math.min(3, score));
    } catch (error) {
      console.error('Scoring API Error:', error);
      return this.fallbackScore(agentTranscript, clientType);
    }
  }

  fallbackScore(agentTranscript, clientType) {
    const text = agentTranscript.toLowerCase();
    let score = 1; // Base score

    // Positive indicators
    const positiveWords = ['sorry', 'understand', 'help', 'resolve', 'solution', 'apologize', 'appreciate', 'thank'];
    const negativeWords = ['no', "can't", 'impossible', 'not my problem', 'deal with it'];
    
    const positiveCount = positiveWords.filter(word => text.includes(word)).length;
    const negativeCount = negativeWords.filter(word => text.includes(word)).length;

    if (positiveCount > negativeCount) {
      score += 1;
    } else if (negativeCount > positiveCount) {
      score -= 1;
    }

    // Check for professional language
    if (text.includes('sir') || text.includes('ma\'am') || text.includes('please')) {
      score += 0.5;
    }

    // Check for solution-oriented language
    if (text.includes('let me') || text.includes('i can') || text.includes('we will')) {
      score += 0.5;
    }

    return Math.max(0, Math.min(3, Math.round(score)));
  }

  getFeedback(score) {
    const feedbackMap = {
      0: {
        level: "CRITICAL",
        message: "Immediate intervention required. Response was unprofessional or harmful.",
        suggestions: [
          "Review company customer service policies",
          "Practice active listening techniques",
          "Learn de-escalation strategies",
          "Improve professional communication"
        ],
        color: "#dc3545"
      },
      1: {
        level: "NEEDS IMPROVEMENT",
        message: "Below standard performance. Requires thorough training.",
        suggestions: [
          "Show more empathy and understanding",
          "Address customer concerns directly",
          "Improve problem-solving approach",
          "Practice professional language"
        ],
        color: "#fd7e14"
      },
      2: {
        level: "SATISFACTORY",
        message: "Adequate performance with room for improvement.",
        suggestions: [
          "Enhance empathy in responses",
          "Provide more detailed solutions",
          "Improve proactive communication",
          "Strengthen relationship building"
        ],
        color: "#ffc107"
      },
      3: {
        level: "EXCELLENT",
        message: "Outstanding customer service performance!",
        suggestions: [
          "Continue excellent work",
          "Mentor other team members",
          "Share best practices",
          "Maintain this high standard"
        ],
        color: "#28a745"
      }
    };

    return feedbackMap[score] || feedbackMap[1];
  }

  generateDetailedFeedback(agentTranscript, score, clientType) {
    const feedback = this.getFeedback(score);
    
    return {
      score,
      level: feedback.level,
      message: feedback.message,
      suggestions: feedback.suggestions,
      color: feedback.color,
      analysis: {
        clientType,
        responseLength: agentTranscript.length,
        timestamp: new Date()
      }
    };
  }
}

module.exports = new ScoringService();
