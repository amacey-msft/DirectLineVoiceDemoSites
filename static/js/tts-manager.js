// Text-to-Speech Management

function addToSpeechQueue(text) {
  console.log('Adding to speech queue:', text);
  speechQueue.push(text);
  processNextInQueue();
}

function processNextInQueue() {
  if (isSpeaking || speechQueue.length === 0) {
    return;
  }

  const nextText = speechQueue.shift();
  isSpeaking = true;

  console.log('Speaking next in queue with voice:', getCurrentVoice());
  speakText(nextText);
}

function onSpeechComplete() {
  isSpeaking = false;
  // Process next item in queue after a short pause
  setTimeout(() => {
    processNextInQueue();
  }, CHAT_CONFIG.speechQueueDelay);
}

function getCurrentVoice() {
  const voiceSelect = document.getElementById('voiceSelect');
  return voiceSelect?.value || currentVoice || CHAT_CONFIG.defaultVoice;
}

function generateSSML(text, voice) {
  // Escape XML special characters in text
  const escapedText = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

  const ttsConfig = CHAT_CONFIG.tts;
  
  // Build the SSML with configurable parameters
  let ssml = `<speak version='1.0' xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="http://www.w3.org/2001/mstts" xml:lang='en-US'>`;
  
  // Start voice element
  ssml += `<voice name='${voice}'>`;
  
  // Add prosody (rate, pitch, volume)
  ssml += `<prosody rate="${ttsConfig.rate}" pitch="${ttsConfig.pitch}" volume="${ttsConfig.volume}">`;
  
  // Add expression style if specified (for Neural voices)
  if (ttsConfig.style && ttsConfig.style !== 'neutral') {
    ssml += `<mstts:express-as style="${ttsConfig.style}"`;
    
    // Add style degree if specified
    if (ttsConfig.styleDegree) {
      ssml += ` styledegree="${ttsConfig.styleDegree}"`;
    }
    
    // Add role if specified
    if (ttsConfig.role) {
      ssml += ` role="${ttsConfig.role}"`;
    }
    
    ssml += `>`;
    ssml += escapedText;
    ssml += `</mstts:express-as>`;
  } else {
    // No special styling, just the text
    ssml += escapedText;
  }
  
  // Close prosody and voice elements
  ssml += `</prosody>`;
  ssml += `</voice>`;
  ssml += `</speak>`;
  
  return ssml;
}

function speakText(text) {
  const voice = getCurrentVoice();
  console.log('Speaking text with voice:', voice, 'Text:', text);
  console.log('Using TTS config:', CHAT_CONFIG.tts);

  const ssml = generateSSML(text, voice);
  console.log('Generated SSML:', ssml);

  fetch(`https://${CHAT_CONFIG.speechRegion}.tts.speech.microsoft.com/cognitiveservices/v1`, {
    method: 'POST',
    headers: {
      'Ocp-Apim-Subscription-Key': CHAT_CONFIG.speechKey,
      'Content-Type': 'application/ssml+xml',
      'X-Microsoft-OutputFormat': CHAT_CONFIG.tts.outputFormat
    },
    body: ssml
  })
    .then(res => {
      console.log('TTS Response status:', res.status);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      return res.blob();
    })
    .then(blob => {
      console.log('Audio blob received, size:', blob.size);
      const audio = new Audio(URL.createObjectURL(blob));

      // Add event listener to know when speech is complete
      audio.addEventListener('ended', onSpeechComplete);
      audio.addEventListener('error', onSpeechComplete);

      audio.play().catch(err => {
        console.error('Audio play error:', err);
        onSpeechComplete();
      });
    })
    .catch(err => {
      console.error('TTS Error:', err);
      console.error('Failed SSML:', ssml);
      onSpeechComplete();
    });
}

function handleVoiceChange(e) {
  currentVoice = e.target.value;
  console.log('Voice changed to:', currentVoice);

  // Don't automatically speak here - let the settings panel handle it
}

// Utility function to test TTS settings
function testTTSSettings() {
  console.log('Testing current TTS settings...');
  addToSpeechQueue("Testing the current text to speech configuration with the selected voice and style settings.");
}

// Make test function available globally for debugging
window.testTTSSettings = testTTSSettings;