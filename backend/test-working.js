import axios from 'axios';

const API_KEY = 'AIzaSyBW-alNjcvnDAsVtAS79dlwn3j9eznjHdY';

// Use the latest Gemini 2.0 Flash model (fast and free)
const MODEL = 'gemini-2.0-flash-001';
const url = `https://generativelanguage.googleapis.com/v1/models/${MODEL}:generateContent?key=${API_KEY}`;

const testData = {
  contents: [{
    parts: [{
      text: "Explain breast cancer screening in simple French terms in 2 sentences. Be clear and reassuring."
    }]
  }]
};

console.log('🚀 Testing with model:', MODEL);

axios.post(url, testData)
  .then(response => {
    console.log('✅ SUCCESS! API is working perfectly!');
    console.log('📝 Response:');
    console.log(response.data.candidates[0].content.parts[0].text);
    console.log('\n🎯 Your AI feature is ready to implement!');
  })
  .catch(error => {
    console.error('❌ Error:');
    console.log(error.response?.data || error.message);
  });