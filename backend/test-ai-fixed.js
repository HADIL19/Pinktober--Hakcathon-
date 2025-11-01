import axios from 'axios';

const API_KEY = 'AIzaSyBW-a...'; // Your actual key
const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

const testData = {
  contents: [{
    parts: [{
      text: "Explain breast cancer screening in simple French terms in 2 sentences"
    }]
  }]
};

console.log('🔑 Testing Gemini API...');
console.log('Using model: gemini-1.5-flash');

axios.post(url, testData)
  .then(response => {
    console.log('✅ SUCCESS! API is working!');
    console.log('📝 Response:');
    console.log(response.data.candidates[0].content.parts[0].text);
  })
  .catch(error => {
    console.error('❌ API Error:');
    if (error.response?.data?.error) {
      console.log('Status:', error.response.data.error.status);
      console.log('Message:', error.response.data.error.message);
      
      // Try alternative models
      console.log('\n🔄 Trying alternative models...');
      testAlternativeModels(API_KEY);
    } else {
      console.log('Unknown error:', error.message);
    }
  });

// Function to test different model versions
async function testAlternativeModels(apiKey) {
  const models = [
    'gemini-1.5-flash',
    'gemini-1.5-pro',
    'gemini-pro',
    'gemini-pro-vision'
  ];
  
  for (const model of models) {
    try {
      const testUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const response = await axios.post(testUrl, {
        contents: [{
          parts: [{
            text: "Say 'Hello' in French"
          }]
        }]
      }, { timeout: 5000 });
      
      console.log(`✅ Model ${model} WORKS!`);
      console.log('Response:', response.data.candidates[0].content.parts[0].text);
      return; // Stop if one works
    } catch (error) {
      console.log(`❌ Model ${model} failed:`, error.response?.data?.error?.message || error.message);
    }
  }
}