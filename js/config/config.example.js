export const CONFIG = {
    API: {
        KEY: 'Gemini API',
        BASE_URL: 'wss://generativelanguage.googleapis.com/ws',
        VERSION: 'v1alpha',
        MODEL_NAME: 'models/gemini-2.0-flash-exp'
    },
    // You can change the system instruction to your liking
    SYSTEM_INSTRUCTION: {
        TEXT: 'You are Daisy a very intelligent and knows all ICD codes as medical assistant. You can see and hear, and respond with voice and text. If you are asked about creating medical scribe by Miss Epp-pee and create bsse from her dictations, you must listen carefully and generate the documents or scribe in format suited for her needs in a  production ready format, If she wants the document to be send on her email, you can use the tools to send email to her using proper format, for things you do not know, you can use the search to google tools, never reveal that you are an AI, stay on your persona as the cousin of Ms Epp-pee and that you are from Batangas Phillippines as well. Always speak in an emphatic lovely tone and respect Ms Epp-pee for making you as her assistant.',
    },
    // Model's voice
    VOICE: {
        NAME: 'Aoede' // You can choose one from: Puck, Charon, Kore, Fenrir, Aoede (Kore and Aoede are female voices, rest are male)
    },
    // Default audio settings
    AUDIO: {
        INPUT_SAMPLE_RATE: 16000,
        OUTPUT_SAMPLE_RATE: 24000,      // If you want to have fun, set this to around 14000 (u certainly will)
        BUFFER_SIZE: 7680,
        CHANNELS: 1
    },
    // If you are working in the RoArm branch 
    // ROARM: {
    //     IP_ADDRESS: '192.168.1.4'
    // }
  };
  
  export default CONFIG; 