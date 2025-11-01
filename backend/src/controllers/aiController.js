import aiService from '../services/aiService.js';

const aiController = {
  async simplifyMedicalText(req, res) {
    try {
      const { text } = req.body;
      
      if (!text) {
        return res.status(400).json({
          success: false,
          message: 'Text is required'
        });
      }

      const simplifiedText = await aiService.simplifyMedicalText(text);
      
      res.json({
        success: true,
        original: text,
        simplified: simplifiedText
      });
    } catch (error) {
      console.error('Simplify Medical Text Error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  async getBreastCancerInfo(req, res) {
    try {
      const { topic } = req.body;
      
      if (!topic) {
        return res.status(400).json({
          success: false,
          message: 'Topic is required'
        });
      }

      const information = await aiService.getBreastCancerInfo(topic);
      
      res.json({
        success: true,
        topic,
        information
      });
    } catch (error) {
      console.error('Get Breast Cancer Info Error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
};

export default aiController;