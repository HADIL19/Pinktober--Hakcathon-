import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api'; // Change to your backend URL

async function testAIFeatures() {
  console.log('🧪 Testing AI Backend API...\n');

  // Test 1: Medical Text Simplification
  try {
    console.log('1. Testing Medical Text Simplification...');
    const response1 = await axios.post(`${BASE_URL}/ai/simplify`, {
      text: "La mammographie est un examen radiologique utilisant des rayons X à faible dose permettant la détection précoce des lésions mammaires potentiellement néoplasiques."
    });
    console.log('✅ SUCCESS - Medical Simplification:');
    console.log('Original: La mammographie est un examen radiologique...');
    console.log('Simplified:', response1.data.simplified);
    console.log('---');
  } catch (error) {
    console.log('❌ FAILED - Medical Simplification:', error.response?.data || error.message);
  }

  // Test 2: Breast Cancer Information
  try {
    console.log('2. Testing Breast Cancer Information...');
    const response2 = await axios.post(`${BASE_URL}/ai/info`, {
      topic: "chimiothérapie"
    });
    console.log('✅ SUCCESS - Cancer Info:');
    console.log('Topic: chimiothérapie');
    console.log('Information:', response2.data.information);
    console.log('---');
  } catch (error) {
    console.log('❌ FAILED - Cancer Info:', error.response?.data || error.message);
  }

  // Test 3: Another topic
  try {
    console.log('3. Testing Prevention Information...');
    const response3 = await axios.post(`${BASE_URL}/ai/info`, {
      topic: "prévention"
    });
    console.log('✅ SUCCESS - Prevention Info:');
    console.log('Information:', response3.data.information);
  } catch (error) {
    console.log('❌ FAILED - Prevention Info:', error.response?.data || error.message);
  }
}

testAIFeatures();