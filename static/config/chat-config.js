// Chat Configuration
const CHAT_CONFIG = {
  tokenEndpoint: '<YOUR_TOKEN_ENDPOINT>', // Replace with your token endpoint
  speechKey: '<YOUR SPEECH KEY>', // Replace with your Azure Speech Service key
  speechRegion: '<YOUR SPEECH REGION>', // Replace with your Azure Speech Service region
  defaultVoice: 'en-US-AvaNeural',
  ttsTimeout: 3000, // 3 seconds
  speechQueueDelay: 200, // 200ms between messages
  
  // TTS Voice Styling Configuration
  tts: {
    // Speech rate: x-slow, slow, medium, fast, x-fast, or percentage like "80%" or "120%"
    rate: '10%',
    
    // Pitch: x-low, low, medium, high, x-high, or relative changes like "+5%", "-10%"
    pitch: '+5%',
    
    // Volume: silent, x-soft, soft, medium, loud, x-loud, or percentage like "80%"
    volume: 'medium',
    
    // Speaking style (only works with Neural voices that support it)
    // Options: neutral, cheerful, sad, angry, excited, friendly, hopeful, shouting, terrified, unfriendly, whispering
    style: 'cheerful',
    
    // Style degree: how strong the emotion/style should be (0.01 to 2.0)
    styleDegree: '1.0',
    
    // Role (character/persona): Girl, Boy, YoungAdultFemale, YoungAdultMale, OlderAdultFemale, OlderAdultMale, SeniorFemale, SeniorMale
    role: "YoungAdultFemale", // Set to null to disable role
    
    // Audio output format
    outputFormat: 'audio-16khz-32kbitrate-mono-mp3'
  }
};

// Global Variables
let currentVoice = CHAT_CONFIG.defaultVoice;
let directLineClient = null;
let webChatStore = null;
let webChatSubscription = null;
let lastProcessedActivityId = null;
let lastInputWasVoice = false;
let dictationStarted = false;

// TTS Queue Management
let speechQueue = [];
let isSpeaking = false;

// Drag functionality variables
let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;
let chatStartX = 0;
let chatStartY = 0;