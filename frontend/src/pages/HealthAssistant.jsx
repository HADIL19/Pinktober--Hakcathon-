import React from 'react';
import AIAssistant from '../components/AIAssistant';

function HealthAssistant() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-pink-600 mb-4">
            🤖 Assistant Santé PinkHope
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Obtenez des explications simples et claires sur le cancer du sein. 
            Notre IA vous aide à comprendre les termes médicaux et les traitements.
          </p>
        </div>
        
        <AIAssistant />
        
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-semibold text-pink-600 mb-2">💊 Termes Médicaux</h3>
            <p className="text-gray-600">Simplifiez le jargon médical complexe en langage clair et accessible</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-semibold text-pink-600 mb-2">🩺 Traitements</h3>
            <p className="text-gray-600">Comprenez les différents traitements et leurs effets</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-semibold text-pink-600 mb-2">📚 Prévention</h3>
            <p className="text-gray-600">Informez-vous sur la prévention et le dépistage précoce</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HealthAssistant;