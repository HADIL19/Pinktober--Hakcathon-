import axios from 'axios';

class AIService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    this.model = 'gemini-2.0-flash-001';
    this.baseURL = `https://generativelanguage.googleapis.com/v1/models/${this.model}:generateContent`;
  }

  async makeAIRequest(prompt) {
    try {
      const response = await axios.post(
        `${this.baseURL}?key=${this.apiKey}`,
        {
          contents: [{
            parts: [{ text: prompt }]
          }]
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 15000
        }
      );
      return response.data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('AI Service Error:', error.response?.data || error.message);
      throw new Error('AI service temporarily unavailable');
    }
  }

  async simplifyMedicalText(medicalText) {
    try {
      const prompt = `Simplifie ce texte médical sur le cancer du sein en français, rends-le facile à comprendre pour les patients. Sois clair et rassurant:

"${medicalText}"

Réponds uniquement avec la version simplifiée:`;
      return await this.makeAIRequest(prompt);
    } catch (error) {
      return `Explication simplifiée: ${medicalText} - Pour plus de détails, consultez un professionnel de santé.`;
    }
  }

  async getBreastCancerInfo(topic) {
    try {
      const prompt = `Explique "${topic}" lié au cancer du sein en français, de manière simple et rassurante, en 3-4 phrases maximum.`;
      return await this.makeAIRequest(prompt);
    } catch (error) {
      const fallbacks = {
        'mammographie': 'La mammographie est une radiographie des seins qui permet de détecter précocement le cancer. C\'est un examen rapide et important pour la prévention.',
        'chimiothérapie': 'La chimiothérapie utilise des médicaments pour éliminer les cellules cancéreuses. Votre équipe médicale vous accompagne pendant le traitement.',
        'prévention': 'La prévention inclut examens réguliers, mode de vie sain et connaissance des antécédents familiaux.'
      };
      return fallbacks[topic.toLowerCase()] || `Informations sur ${topic}: Consultez votre médecin.`;
    }
  }
}

export default new AIService();