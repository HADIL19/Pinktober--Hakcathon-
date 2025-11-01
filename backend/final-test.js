import axios from 'axios';

const API_KEY = 'AIzaSyBW-alNjcvnDAsVtAS79dlwn3j9eznjHdY';
const MODEL = 'gemini-2.0-flash-001';
const url = `https://generativelanguage.googleapis.com/v1/models/${MODEL}:generateContent?key=${API_KEY}`;

console.log('🎯 Final test with Gemini 2.0 Flash...\n');

// Test medical simplification
const medicalTest = {
  contents: [{
    parts: [{
      text: `Simplifie cette phrase médicale en français: "La mammographie est un examen radiologique utilisant des rayons X à faible dose permettant la détection précoce des lésions mammaires potentiellement néoplasiques."`
    }]
  }]
};

axios.post(url, medicalTest)
  .then(response => {
    console.log('✅ TEST 1 - Simplification médicale:');
    console.log('Réponse:', response.data.candidates[0].content.parts[0].text);
    
    // Test breast cancer info
    const infoTest = {
      contents: [{
        parts: [{
          text: `Explique ce qu'est une chimiothérapie en 3 phrases simples en français, pour une patiente atteinte de cancer du sein.`
        }]
      }]
    };
    
    return axios.post(url, infoTest);
  })
  .then(response => {
    console.log('\n✅ TEST 2 - Information cancer du sein:');
    console.log('Réponse:', response.data.candidates[0].content.parts[0].text);
    console.log('\n🎉 Tous les tests sont réussis! Votre IA fonctionne parfaitement!');
  })
  .catch(error => {
    console.error('❌ Erreur:', error.response?.data || error.message);
  });