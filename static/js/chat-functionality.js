// Main Chat Widget Functionality

function toggleChat() {
  const widget = document.getElementById('chatWidget');
  const minimizedBtn = document.getElementById('chatMinimizedBtn');

  console.log('Toggle clicked, widget has minimized class:', widget.classList.contains('minimized'));

  if (widget.classList.contains('minimized')) {
    // Open the chat
    widget.classList.remove('minimized');
    minimizedBtn.style.display = 'none';

    // Initialize drag functionality when chat opens
    setTimeout(() => {
      initializeDragFunctionality();
    }, 100);

    console.log('Chat opened');
  } else {
    // Close the chat
    widget.classList.add('minimized');
    minimizedBtn.style.display = 'flex';

    // Reset position when closing
    resetChatPosition();

    console.log('Chat minimized');
  }
}

function restartChat() {
  // Reset voice selection to default
  currentVoice = CHAT_CONFIG.defaultVoice;
  const voiceSelect = document.getElementById('voiceSelect');
  if (voiceSelect) {
    voiceSelect.value = currentVoice;
  }

  // Clear the processed activity ID and speech queue
  lastProcessedActivityId = null;
  speechQueue = [];
  isSpeaking = false;
  lastInputWasVoice = false;
  dictationStarted = false;

  // Unsubscribe from the old store before clearing it
  if (webChatSubscription) {
    webChatSubscription();
    webChatSubscription = null;
    console.log('Unsubscribed from old WebChat store');
  }

  // Disconnect existing DirectLine connection
  if (directLineClient) {
    try {
      directLineClient.end();
    } catch (err) {
      console.log('Error ending DirectLine connection:', err);
    }
    directLineClient = null;
  }

  // Clear the web chat store
  if (webChatStore) {
    webChatStore = null;
  }

  // Remove the webchat container and re-add it to force a full re-render
  const chatContent = document.querySelector('.chat-content');
  const oldWebchat = document.getElementById('webchat');
  if (oldWebchat) {
    oldWebchat.remove();
  }
  const newWebchat = document.createElement('div');
  newWebchat.id = 'webchat';
  chatContent.appendChild(newWebchat);

  // Reinitialize the chat
  initializeChat();
}

async function initializeChat() {
  console.log('Starting chat initialization...');

  const voiceSelect = document.getElementById('voiceSelect');

  // Fetch available voices
  try {
    const response = await fetch(`https://${CHAT_CONFIG.speechRegion}.tts.speech.microsoft.com/cognitiveservices/voices/list`, {
      headers: { 'Ocp-Apim-Subscription-Key': CHAT_CONFIG.speechKey }
    });
    const voices = await response.json();

    // Filter for English Neural voices only
    const englishVoices = voices.filter(voice =>
      voice.Locale.startsWith('en-') && voice.VoiceType === 'Neural'
    );

    // Only populate voices if the select is empty
    if (voiceSelect.children.length === 0) {
      englishVoices.forEach(voice => {
        const option = document.createElement('option');
        option.value = voice.ShortName;
        option.textContent = `${voice.LocalName} (${voice.Locale})`;
        voiceSelect.appendChild(option);
      });

      // Set default to Aria and update currentVoice
      voiceSelect.value = currentVoice;

      // Add event listener for voice changes
      voiceSelect.removeEventListener('change', handleVoiceChange);
      voiceSelect.addEventListener('change', handleVoiceChange);
    }

    console.log('Available voices loaded, current voice:', currentVoice);
  } catch (err) {
    console.error('Error loading voices:', err);
  }

  // Get Direct Line token and start chat
  try {
    console.log('Fetching DirectLine token...');
    const tokenResponse = await fetch(CHAT_CONFIG.tokenEndpoint, { method: 'GET' });
    if (!tokenResponse.ok) {
      throw new Error(`Failed to fetch Direct Line token: ${tokenResponse.status}`);
    }
    const { token } = await tokenResponse.json();
    console.log('DirectLine token received');

    // Create new DirectLine client
    directLineClient = window.WebChat.createDirectLine({ token });
    console.log('DirectLine client created');

    // Create new Web Chat store
    webChatStore = createVoiceAwareStore();
    console.log('Web Chat store created');

    // Listen to store changes to detect bot messages
    setupStoreSubscription();

    // Get the webchat container
    const webchatElement = document.getElementById('webchat');

    // Clear any existing content
    webchatElement.innerHTML = '';

    console.log('Rendering Web Chat...');

    // Render Web Chat with speech recognition enabled but TTS disabled
    window.WebChat.renderWebChat(
      {
        directLine: directLineClient,
        store: webChatStore,
        locale: 'en-US',
        styleOptions: {
          hideUploadButton: false,
          backgroundColor: "#fff",
          bubbleBackground: "#fff",
          bubbleTextColor: "#181818",
          bubbleBorderColor: "#667eea",
          bubbleBorderWidth: 1,
          bubbleBorderRadius: 8,
          fontFamily: "'Montserrat', Arial, sans-serif",
          botAvatarBackgroundColor: "#667eea",
          userAvatarBackgroundColor: "#764ba2",
          suggestedActionBackgroundColor: "#667eea",
          suggestedActionBorderColor: "#667eea",
          microphoneButtonColorOnDictate: "#667eea"
        },
        webSpeechPonyfillFactory: createSpeechPonyfill
      },
      webchatElement
    );

    // Send startConversation event
    if (directLineClient) {
      directLineClient.postActivity({
        type: 'event',
        name: 'startConversation',
        from: { id: 'user', name: 'User' }
      }).subscribe(
        id => console.log('startConversation event sent:', id),
        err => console.error('Failed to send startConversation event:', err)
      );
    }

    console.log('Web Chat rendered successfully');
    console.log('DirectLine connected successfully');
  } catch (err) {
    console.error('Error connecting to DirectLine:', err);
    const webchatElement = document.getElementById('webchat');
    webchatElement.innerHTML = `<div style="color:red; padding: 20px; text-align: center; font-size: 12px;">
      ❌ Error connecting to chat service<br>
      <small>${err.message}</small><br>
      <button onclick="initializeChat()" style="margin-top: 10px; padding: 5px 10px; background: #667eea; color: white; border: none; border-radius: 5px; cursor: pointer;">
        🔄 Try Again
      </button>
    </div>`;
  }

  // Add this at the end of the successful initialization
  setTimeout(() => {
    initializeDragFunctionality();
  }, 500);
}

function setupStoreSubscription() {
  let previousDictateState = null;

  webChatSubscription = webChatStore.subscribe(() => {
    // Add null check at the beginning
    if (!webChatStore) {
      console.log('Store is null, skipping subscription callback');
      return;
    }

    const state = webChatStore.getState();

    // Dictate state is a number: 0 = not dictating, 3 = dictating
    const currentDictateState = state.dictateState;

    // Log the dictate state to see what we're working with
    if (currentDictateState !== previousDictateState) {
      console.log('Dictate state changed:', currentDictateState);

      // Detect when dictation starts (state changes to 3)
      if (currentDictateState === 3 && previousDictateState !== 3) {
        console.log('🎤 Voice input STARTED - setting voice flag');
        lastInputWasVoice = true;
      }

      // Detect when dictation stops (state changes from 3 to something else)
      if (previousDictateState === 3 && currentDictateState !== 3) {
        console.log('🎤 Voice input STOPPED - voice flag remains true for TTS');
        // Keep lastInputWasVoice = true until user starts a new interaction
      }

      previousDictateState = currentDictateState;
    }

    const activities = state.activities || [];
    const latestActivity = activities[activities.length - 1];

    // Check for user messages and reset voice flag for text input
    if (
      latestActivity &&
      latestActivity.type === 'message' &&
      latestActivity.from &&
      latestActivity.from.role === 'user' &&
      latestActivity.id !== lastProcessedActivityId
    ) {
      // Check if this was a text message (not voice)
      if (currentDictateState !== 3 && !lastInputWasVoice) {
        console.log('👤 User TEXT message received - TTS remains disabled');
        lastInputWasVoice = false;
      } else if (currentDictateState !== 3 && lastInputWasVoice) {
        console.log('👤 Checking if this is voice completion or new text input...');
        console.log('👤 User VOICE message received - TTS will be enabled for bot response');
      } else if (lastInputWasVoice) {
        console.log('👤 User VOICE message received - TTS will be enabled for bot response');
      } else {
        console.log('👤 User TEXT message received - TTS remains disabled');
      }
    }

    // Process bot messages for TTS
    if (
      latestActivity &&
      latestActivity.type === 'message' &&
      latestActivity.text &&
      latestActivity.from &&
      latestActivity.from.role === 'bot' &&
      latestActivity.id !== lastProcessedActivityId
    ) {
      console.log('🤖 Bot message detected. lastInputWasVoice:', lastInputWasVoice);

      if (lastInputWasVoice) {
        console.log('🔊 TRIGGERING TTS for bot message:', latestActivity.text);
        addToSpeechQueue(latestActivity.text);
        console.log('🔄 Voice flag kept true for multi-message responses');

        // Reset voice flag after a delay to allow user to switch back to text
        setTimeout(() => {
          if (lastInputWasVoice) {
            lastInputWasVoice = false;
            console.log('🔄 Voice flag auto-reset after bot response sequence');
          }
        }, CHAT_CONFIG.ttsTimeout);

      } else {
        console.log('🔇 TTS skipped - last input was text');
      }

      lastProcessedActivityId = latestActivity.id;
    }
  });
}

function createSpeechPonyfill() {
  try {
    // Use Azure Speech Services for speech recognition but disable TTS
    const ponyfill = window.WebChat.createCognitiveServicesSpeechServicesPonyfillFactory({
      credentials: {
        region: CHAT_CONFIG.speechRegion,
        subscriptionKey: CHAT_CONFIG.speechKey
      }
    })();

    // Override the speak function to disable default TTS
    if (ponyfill.speechSynthesis) {
      ponyfill.speechSynthesis.speak = function(utterance) {
        console.log('Blocked default TTS for:', utterance.text);
        // Don't actually speak - just log it
      };
    }

    return ponyfill;
  } catch (err) {
    console.error('Azure Speech Services ponyfill failed, falling back to browser:', err);

    // Fallback to browser speech with TTS disabled
    const browserPonyfill = window.WebChat.createBrowserWebSpeechPonyfillFactory()();

    if (browserPonyfill.speechSynthesis) {
      browserPonyfill.speechSynthesis.speak = function(utterance) {
        console.log('Blocked browser TTS for:', utterance.text);
        // Don't actually speak - just log it
      };
    }

    return browserPonyfill;
  }
}

function createVoiceAwareStore() {
  return window.WebChat.createStore();
}

// Initialize when page loads
window.addEventListener('load', initializeChat);