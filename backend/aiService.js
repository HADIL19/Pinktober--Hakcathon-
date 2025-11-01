import axios from 'axios';

const API_KEY = 'AIzaSyBW-a...'; // Your key
const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

// Very simple test
const testData = {
  contents: [{
    parts: [{
      text: "Hello, respond with 'OK' if you can read this"
    }]
  }]
};

console.log('Testing basic API connection...');

axios.post(url, testData, { timeout: 10000 })
  .then(response => {
    console.log('✅ Basic test PASSED!');
    console.log('Response:', response.data);
  })
  .catch(error => {
    console.log('❌ Basic test failed');
    console.log('Error details:', error.response?.data || error.message);
  });