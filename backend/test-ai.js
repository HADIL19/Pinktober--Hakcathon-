import axios from 'axios';

// Your actual API key
const API_KEY = 'AIzaSyBW-alNjcvnDAsVtAS79dlwn3j9eznjHdY';
const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

const testData = {
  contents: [{
    parts: [{
      text: "Explain breast cancer screening in simple French terms in 2 sentences"
    }]
  }]
};

console.log('🔑 Testing Gemini API with your key...');
console.log('Key starts with:', API_KEY.substring(0, 10) + '...');

axios.post(url, testData)
  .then(response => {
    console.log('✅ SUCCESS! Your API key is working!');
    console.log('📝 Response:');
    console.log(response.data.candidates[0].content.parts[0].text);
  })
  .catch(error => {
    console.error('❌ API Error:');
    if (error.response?.data?.error) {
      console.log('Status:', error.response.data.error.status);
      console.log('Message:', error.response.data.error.message);
    } else {
      console.log('Error:', error.message);
    }
  });