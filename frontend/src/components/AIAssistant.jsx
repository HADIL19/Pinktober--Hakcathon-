import React, { useState } from 'react';
import axios from 'axios';
import './AIAssistant.css';

const AIAssistant = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('simplify');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setError('');
    setOutput('');

    try {
      const endpoint = mode === 'simplify' ? '/api/ai/simplify' : '/api/ai/info';
      
      const response = await axios.post(endpoint, {
        text: mode === 'simplify' ? input : undefined,
        topic: mode === 'info' ? input : undefined
      });

      if (response.data.success) {
        setOutput(response.data.simplified || response.data.information);
      } else {
        setError('Erreur: ' + response.data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Erreur de connexion. Vérifiez que le serveur est démarré.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-assistant">
      <h2>🤖 Assistant Santé IA</h2>
      <p>Obtenez des explications simples sur le cancer du sein</p>
      
      <div className="mode-selector">
        <button 
          className={mode === 'simplify' ? 'active' : ''}
          onClick={() => setMode('simplify')}
          type="button"
        >
          Simplifier un terme médical
        </button>
        <button 
          className={mode === 'info' ? 'active' : ''}
          onClick={() => setMode('info')}
          type="button"
        >
          Informations sur un sujet
        </button>
      </div>

      <form onSubmit={handleSubmit} className="ai-form">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            mode === 'simplify' 
              ? "Collez ici le texte médical complexe à simplifier..."
              : "Posez une question sur le cancer du sein (ex: mammographie, chimiothérapie, prévention...)"
          }
          rows="4"
          disabled={loading}
        />
        
        <button type="submit" disabled={loading || !input.trim()}>
          {loading ? 'Traitement...' : 'Obtenir une explication'}
        </button>
      </form>

      {error && (
        <div className="error">
          <strong>Erreur:</strong> {error}
        </div>
      )}

      {output && (
        <div className="output">
          <h3>Réponse :</h3>
          <div className="output-content">
            {output}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;