import React, { useState, useEffect } from 'react';
import './SettingsModal.css';

const PROVIDER_MODELS = {
  groq: [
    { id: 'llama3-70b-8192', name: 'Llama 3 70B', tier: 'Free' },
    { id: 'llama3-8b-8192', name: 'Llama 3 8B', tier: 'Free' },
    { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7B', tier: 'Free' },
    { id: 'gemma-7b-it', name: 'Gemma 7B', tier: 'Free' }
  ],
  gemini: [
    { id: 'gemini-1.5-pro-latest', name: 'Gemini 1.5 Pro', tier: 'Freemium' },
    { id: 'gemini-1.5-flash-latest', name: 'Gemini 1.5 Flash', tier: 'Freemium' }
  ],
  huggingface: [
    { id: 'mistralai/Mixtral-8x7B-Instruct-v0.1', name: 'Mixtral 8x7B (HF)', tier: 'Free' },
    { id: 'meta-llama/Meta-Llama-3-8B-Instruct', name: 'Llama 3 8B (HF)', tier: 'Free' },
    { id: 'HuggingFaceH4/zephyr-7b-beta', name: 'Zephyr 7B (HF)', tier: 'Free' }
  ]
};

export default function SettingsModal({ isOpen, onClose, onSave, initialConfig }) {
  const [keys, setKeys] = useState({ groq: '', gemini: '', huggingface: '' });
  const [showKeys, setShowKeys] = useState({ groq: false, gemini: false, huggingface: false });
  const [selectedModels, setSelectedModels] = useState([]);
  const [masterModel, setMasterModel] = useState(null);

  const toggleShowKey = (provider) => {
    setShowKeys(prev => ({ ...prev, [provider]: !prev[provider] }));
  };

  useEffect(() => {
    if (isOpen && initialConfig) {
      setKeys(initialConfig.keys || { groq: '', gemini: '', huggingface: '' });
      setSelectedModels(initialConfig.council_models || []);
      setMasterModel(initialConfig.master_model || null);
    }
  }, [isOpen, initialConfig]);

  if (!isOpen) return null;

  const handleKeyChange = (provider, value) => {
    setKeys((prev) => ({ ...prev, [provider]: value }));
  };

  const handleModelToggle = (provider, modelId) => {
    const isSelected = selectedModels.some(m => m.id === modelId);
    if (isSelected) {
      setSelectedModels(selectedModels.filter(m => m.id !== modelId));
      if (masterModel?.id === modelId) {
        setMasterModel(null);
      }
    } else {
      setSelectedModels([...selectedModels, { id: modelId, provider }]);
    }
  };

  const handleSave = () => {
    onSave({
      keys,
      council_models: selectedModels,
      master_model: masterModel
    });
    onClose();
  };

  // Determine which providers have keys entered
  const availableProviders = Object.keys(keys).filter(p => keys[p].trim() !== '');

  return (
    <div className="settings-modal-overlay">
      <div className="settings-modal">
        <div className="settings-header">
          <h2>Configuration</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="settings-content">
          <div className="section">
            <h3>1. API Keys</h3>
            <p className="help-text">Enter keys for the providers you want to use. Keys are stored locally in your browser.</p>
            
            <div className="input-group">
              <label>Groq API Key</label>
              <div className="password-input-wrapper">
                <input 
                  type={showKeys.groq ? "text" : "password"} 
                  value={keys.groq} 
                  onChange={(e) => handleKeyChange('groq', e.target.value)}
                  placeholder="gsk_..."
                />
                <button 
                  type="button" 
                  className="eye-btn" 
                  onClick={() => toggleShowKey('groq')}
                  title={showKeys.groq ? "Hide key" : "Show key"}
                >
                  {showKeys.groq ? "🙈" : "👁️"}
                </button>
              </div>
            </div>
            
            <div className="input-group">
              <label>Google Gemini API Key</label>
              <div className="password-input-wrapper">
                <input 
                  type={showKeys.gemini ? "text" : "password"} 
                  value={keys.gemini} 
                  onChange={(e) => handleKeyChange('gemini', e.target.value)}
                  placeholder="AIza..."
                />
                <button 
                  type="button" 
                  className="eye-btn" 
                  onClick={() => toggleShowKey('gemini')}
                  title={showKeys.gemini ? "Hide key" : "Show key"}
                >
                  {showKeys.gemini ? "🙈" : "👁️"}
                </button>
              </div>
            </div>
            
            <div className="input-group">
              <label>Hugging Face Token</label>
              <div className="password-input-wrapper">
                <input 
                  type={showKeys.huggingface ? "text" : "password"} 
                  value={keys.huggingface} 
                  onChange={(e) => handleKeyChange('huggingface', e.target.value)}
                  placeholder="hf_..."
                />
                <button 
                  type="button" 
                  className="eye-btn" 
                  onClick={() => toggleShowKey('huggingface')}
                  title={showKeys.huggingface ? "Hide key" : "Show key"}
                >
                  {showKeys.huggingface ? "🙈" : "👁️"}
                </button>
              </div>
            </div>
          </div>

          <div className="section">
            <h3>2. Council Models</h3>
            <p className="help-text">Select the models that will form your council. Only models for configured providers are shown.</p>
            
            {availableProviders.length === 0 && (
              <div className="warning-box">Please enter at least one API key above to see available models.</div>
            )}
            
            {availableProviders.map(provider => (
              <div key={provider} className="provider-models">
                <h4>{provider.charAt(0).toUpperCase() + provider.slice(1)} Models</h4>
                <div className="model-grid">
                  {PROVIDER_MODELS[provider].map(model => (
                    <label key={model.id} className="model-checkbox">
                      <input 
                        type="checkbox" 
                        checked={selectedModels.some(m => m.id === model.id)}
                        onChange={() => handleModelToggle(provider, model.id)}
                      />
                      <span className="model-name-label">{model.name}</span>
                      <span className={`model-tier tier-${model.tier.toLowerCase()}`}>{model.tier}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="section">
            <h3>3. Master Model</h3>
            <p className="help-text">Select the Chairman model that will synthesize the final answer.</p>
            <select 
              value={masterModel ? masterModel.id : ''} 
              onChange={(e) => {
                const selected = selectedModels.find(m => m.id === e.target.value);
                setMasterModel(selected || null);
              }}
              disabled={selectedModels.length === 0}
            >
              <option value="" disabled>-- Select a Master Model --</option>
              {selectedModels.map(model => {
                const name = PROVIDER_MODELS[model.provider].find(m => m.id === model.id)?.name || model.id;
                return (
                  <option key={model.id} value={model.id}>{name} ({model.provider})</option>
                );
              })}
            </select>
          </div>
        </div>

        <div className="settings-footer">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button 
            className="save-btn" 
            onClick={handleSave}
            disabled={selectedModels.length === 0 || !masterModel}
          >
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
}
