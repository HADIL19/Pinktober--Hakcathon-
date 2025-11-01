import axios from 'axios';

const API_KEY = 'AIzaSyBW-alNjcvnDAsVtAS79dlwn3j9eznjHdY';
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

console.log('🔍 Discovering available models...');

axios.get(url)
  .then(response => {
    console.log('✅ Available models:');
    response.data.models.forEach(model => {
      console.log(`📦 ${model.name} - ${model.displayName}`);
      console.log(`   Supported methods: ${model.supportedGenerationMethods?.join(', ') || 'None'}`);
      console.log('---');
    });
  })
  .catch(error => {
    console.error('❌ Error listing models:');
    console.log(error.response?.data || error.message);
  });