// TTS Settings Panel Management

function toggleTTSSettings() {
  const tab = document.getElementById('ttsSettingsTab');
  const panel = document.getElementById('ttsSettingsPanel');
  
  tab.classList.toggle('open');
  
  // Initialize settings when opening for the first time
  if (tab.classList.contains('open') && !panel.hasAttribute('data-initialized')) {
    initializeTTSSettings();
    panel.setAttribute('data-initialized', 'true');
  }
}

// Close panel when clicking outside
document.addEventListener('click', function(event) {
  const tab = document.getElementById('ttsSettingsTab');
  
  if (tab && 
      !tab.contains(event.target) && 
      tab.classList.contains('open')) {
    tab.classList.remove('open');
  }
});

// Close panel with Escape key
document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    const tab = document.getElementById('ttsSettingsTab');
    if (tab && tab.classList.contains('open')) {
      tab.classList.remove('open');
    }
  }
});

// Update the initializeTTSSettings function to include voice selection

function initializeTTSSettings() {
  // Set current values from config
  const config = CHAT_CONFIG.tts;
  
  // Initialize voice selection (this will be populated by chat-functionality.js)
  const voiceSelect = document.getElementById('voiceSelect');
  if (voiceSelect && voiceSelect.value) {
    // Voice select is already populated, just set the current value
    voiceSelect.value = currentVoice || CHAT_CONFIG.defaultVoice;
  }
  
  document.getElementById('ttsRate').value = config.rate;
  document.getElementById('ttsPitch').value = config.pitch;
  document.getElementById('ttsVolume').value = config.volume;
  document.getElementById('ttsStyle').value = config.style;
  document.getElementById('ttsStyleDegree').value = config.styleDegree;
  document.getElementById('ttsRole').value = config.role || '';
  
  console.log('TTS Settings initialized with current config:', config);
}

function updateVoiceSetting(value) {
  // Update the current voice
  currentVoice = value;
  console.log('Voice updated to:', value);
  
  // Provide single audio feedback
  addToSpeechQueue("Voice changed successfully.");
}

function updateTTSSetting(setting, value) {
  // Update the config object
  if (setting === 'role' && value === '') {
    CHAT_CONFIG.tts[setting] = null;
  } else {
    CHAT_CONFIG.tts[setting] = value;
  }
  
  console.log(`TTS ${setting} updated to:`, value);
  console.log('Current TTS config:', CHAT_CONFIG.tts);
  
  // Provide audio feedback for immediate testing
  if (setting === 'rate') {
    addToSpeechQueue("Speech rate updated.");
  } else if (setting === 'pitch') {
    addToSpeechQueue("Pitch setting changed.");
  } else if (setting === 'volume') {
    addToSpeechQueue("Volume level adjusted.");
  } else if (setting === 'style') {
    addToSpeechQueue("Speaking style updated.");
  } else if (setting === 'styleDegree') {
    addToSpeechQueue("Style intensity changed.");
  } else if (setting === 'role') {
    addToSpeechQueue("Character role updated.");
  }
  // Note: voice feedback is now handled by updateVoiceSetting
}

function testCurrentTTSSettings() {
  const testMessage = "This is a test of the current voice settings. The quick brown fox jumps over the lazy dog.";
  console.log('Testing TTS with current settings:', CHAT_CONFIG.tts);
  addToSpeechQueue(testMessage);
}

function resetTTSSettings() {
  // Reset to default values
  const defaults = {
    rate: 'medium',
    pitch: '+5%',
    volume: 'medium',
    style: 'cheerful',
    styleDegree: '1.0',
    role: 'YoungAdultFemale',
    outputFormat: 'audio-16khz-32kbitrate-mono-mp3'
  };
  
  // Update config
  CHAT_CONFIG.tts = { ...defaults };
  
  // Reset voice to default
  const voiceSelect = document.getElementById('voiceSelect');
  if (voiceSelect) {
    voiceSelect.value = CHAT_CONFIG.defaultVoice;
    currentVoice = CHAT_CONFIG.defaultVoice;
  }
  
  // Update UI
  document.getElementById('ttsRate').value = defaults.rate;
  document.getElementById('ttsPitch').value = defaults.pitch;
  document.getElementById('ttsVolume').value = defaults.volume;
  document.getElementById('ttsStyle').value = defaults.style;
  document.getElementById('ttsStyleDegree').value = defaults.styleDegree;
  document.getElementById('ttsRole').value = defaults.role;
  
  console.log('TTS Settings reset to defaults:', defaults);
  addToSpeechQueue("Voice settings have been reset to default values.");
}