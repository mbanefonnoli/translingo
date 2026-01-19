// DOM Elements
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const langASelect = document.getElementById('lang-a');
const langBSelect = document.getElementById('lang-b');
const volumeControl = document.getElementById('volume');
const speedSelect = document.getElementById('speed');
const originalA = document.getElementById('original-a');
const translatedA = document.getElementById('translated-a');
const originalB = document.getElementById('original-b');
const translatedB = document.getElementById('translated-b');
const panelA = document.getElementById('panel-a');
const panelB = document.getElementById('panel-b');
const swapBtn = document.querySelector('.swap-icon');

// Global State
let activeSpeaker = 'A'; // Start with Person A
let isListening = false;

// Speech Configuration
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;

if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
} else {
    originalA.innerHTML = '<p class="error">Speech Recognition API not supported.</p>';
}

const synthesis = window.speechSynthesis;

// Functions
function updateUIState(listening) {
    if (listening) {
        startBtn.style.display = 'none';
        stopBtn.style.display = 'flex';
        // Highlight active panel
        if (activeSpeaker === 'A') {
            panelA.classList.add('active');
            panelB.classList.remove('active');
        } else {
            panelB.classList.add('active');
            panelA.classList.remove('active');
        }
    } else {
        stopBtn.style.display = 'none';
        startBtn.style.display = 'flex';
        panelA.classList.remove('active');
        panelB.classList.remove('active');
    }
}

async function translateText(text, from, to) {
    try {
        // Use Google Translate (GTX) endpoint for significantly better quality
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(text)}`;
        const response = await fetch(url);
        const data = await response.json();

        // Google GTX response structure is nested arrays: [[["translated", "source", ...]]]
        if (data && data[0] && data[0][0] && data[0][0][0]) {
            return data[0][0][0];
        }
        return 'Translation unavailable.';
    } catch (error) {
        console.error('Translation error:', error);
        return 'Translation failed.';
    }
}

function speakText(text, lang) {
    if (synthesis.speaking) synthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.volume = parseFloat(volumeControl.value);
    utterance.rate = parseFloat(speedSelect.value);

    // Resume background listening after speaking finishes if needed
    synthesis.speak(utterance);
}

// Event Listeners
if (recognition) {
    recognition.onstart = () => {
        isListening = true;
        updateUIState(true);
        console.log('Recognition started for:', recognition.lang);
    };

    recognition.onresult = async (event) => {
        const originalDisplay = activeSpeaker === 'A' ? originalA : originalB;
        const translatedDisplay = activeSpeaker === 'A' ? translatedA : translatedB;
        const fromLang = activeSpeaker === 'A' ? langASelect.value : langBSelect.value;
        const toLang = activeSpeaker === 'A' ? langBSelect.value : langASelect.value;

        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                finalTranscript += transcript;
            } else {
                interimTranscript += transcript;
            }
        }

        // Handle LIVE visual feedback
        if (finalTranscript) {
            originalDisplay.textContent = finalTranscript;
            originalDisplay.classList.remove('interim');
            translatedDisplay.textContent = '...'; // Thinking indicator

            const fromCode = fromLang.split('-')[0];
            const toCode = toLang.split('-')[0];

            const translation = await translateText(finalTranscript, fromCode, toCode);
            translatedDisplay.textContent = translation;

            speakText(translation, toLang);
        } else if (interimTranscript) {
            // Keep the previous final text visible while adding interim
            originalDisplay.textContent = interimTranscript;
            originalDisplay.classList.add('interim');
        }
    };

    recognition.onend = () => {
        if (isListening) recognition.start();
    };

    recognition.onerror = (event) => {
        console.error('Recognition error:', event.error);
        if (event.error === 'not-allowed') {
            alert('Microphone access denied.');
            isListening = false;
            updateUIState(false);
        }
    };
}

startBtn.addEventListener('click', () => {
    if (recognition) {
        recognition.lang = activeSpeaker === 'A' ? langASelect.value : langBSelect.value;
        recognition.start();
    }
});

stopBtn.addEventListener('click', () => {
    if (recognition) {
        isListening = false;
        recognition.stop();
        updateUIState(false);
    }
});

// Fix Swap Logic
swapBtn.style.cursor = 'pointer';
swapBtn.addEventListener('click', () => {
    const tempValue = langASelect.value;
    langASelect.value = langBSelect.value;
    langBSelect.value = tempValue;

    // Visual feedback for swap
    swapBtn.style.transform = 'rotate(180deg)';
    setTimeout(() => {
        swapBtn.style.transform = 'rotate(0deg)';
    }, 300);

    // If already listening, restart with new language if necessary
    if (isListening) {
        recognition.stop();
        recognition.lang = activeSpeaker === 'A' ? langASelect.value : langBSelect.value;
        recognition.start();
    }
});

// Allow switching active speaker by clicking on their card
panelA.addEventListener('click', () => {
    if (activeSpeaker !== 'A') {
        activeSpeaker = 'A';
        if (isListening) {
            recognition.stop();
            recognition.lang = langASelect.value;
            recognition.start();
        }
        updateUIState(isListening);
    }
});

panelB.addEventListener('click', () => {
    if (activeSpeaker !== 'B') {
        activeSpeaker = 'B';
        if (isListening) {
            recognition.stop();
            recognition.lang = langBSelect.value;
            recognition.start();
        }
        updateUIState(isListening);
    }
});
