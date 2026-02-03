document.addEventListener('DOMContentLoaded', () => {

    // Diagnosis Form Handler
    const diagnosisForm = document.getElementById('diagnosis-form');
    if (diagnosisForm) {
        const symptomsInput = document.getElementById('symptoms-input');
        const chatHistory = document.getElementById('chat-history');
        const resultPanel = document.getElementById('result-panel');
        const waitingPanel = document.getElementById('waiting-panel');

        // Results Elements
        const resDiagnosis = document.getElementById('res-diagnosis');
        const resSeverity = document.getElementById('res-severity');
        const resRemedy = document.getElementById('res-remedy');

        diagnosisForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const symptoms = symptomsInput.value.trim();
            if (!symptoms) return;

            // 1. Add User Message
            addMessage(symptoms, 'user');
            symptomsInput.value = '';

            // 2. Add Loading State
            const loadingId = addMessage('Analyzing symptoms...', 'bot', true);

            try {
                // 3. Call API
                const response = await fetch('/api/diagnose', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ symptoms })
                });
                const data = await response.json();

                // 4. Update Chat with Result
                removeMessage(loadingId);
                addMessage(`Based on your symptoms ("${symptoms}"), here is my analysis.<br><br><strong>Diagnosis:</strong> ${data.diagnosis}`, 'bot');

                // 5. Update Sidebar Panel
                waitingPanel.classList.add('hidden');
                resultPanel.classList.remove('hidden');

                resDiagnosis.innerText = data.diagnosis;

                // Use innerHTML for remedy to render bullet points
                resRemedy.innerHTML = data.remedy;

                resSeverity.innerText = data.severity;

                // Color coding for severity
                resSeverity.className = 'inline-block px-2 py-1 rounded text-xs font-bold mt-1';
                if (data.severity === 'Low') resSeverity.classList.add('bg-green-500/20', 'text-green-400', 'border', 'border-green-500/30');
                else if (data.severity === 'Medium') resSeverity.classList.add('bg-yellow-500/20', 'text-yellow-400', 'border', 'border-yellow-500/30');
                else resSeverity.classList.add('bg-red-500/20', 'text-red-400', 'border', 'border-red-500/30', 'animate-pulse');

            } catch (error) {
                console.error(error);
                removeMessage(loadingId);
                addMessage('Sorry, I encountered an error analyzing your symptoms. Please try again.', 'bot');
            }
        });

        function addMessage(text, sender, isLoading = false) {
            const div = document.createElement('div');
            div.className = 'flex items-start gap-3 fade-in';
            div.id = isLoading ? 'loading-msg' : `msg-${Date.now()}`;

            const isUser = sender === 'user';

            div.innerHTML = `
                <div class="w-10 h-10 rounded-full ${isUser ? 'bg-gray-700 order-2' : 'bg-blue-600'} flex items-center justify-center flex-shrink-0">
                    <i class="fa-solid ${isUser ? 'fa-user' : 'fa-robot text-white'}"></i>
                </div>
                <div class="${isUser ? 'bg-blue-600 order-1 ml-auto' : 'bg-white/10'} p-3 rounded-lg ${isUser ? 'rounded-tr-none' : 'rounded-tl-none'} max-w-[80%]">
                    <p class="text-sm ${isLoading ? 'animate-pulse' : ''}">${text}</p>
                </div>
            `;

            chatHistory.appendChild(div);
            chatHistory.scrollTop = chatHistory.scrollHeight;
            return div.id;
        }

        function removeMessage(id) {
            const el = document.getElementById(id);
            if (el) el.remove();
        }
    }
});

// Global Notification System
function playSuccessSound() {
    // Generate a pleasant "Ding" using Web Audio API
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.type = 'sine';
            osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
            osc.frequency.exponentialRampToValueAtTime(1046.5, ctx.currentTime + 0.1); // C6

            gain.gain.setValueAtTime(0.5, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

            osc.start();
            osc.stop(ctx.currentTime + 0.5);
        }
    } catch (e) { console.warn("Audio not supported"); }
}

function showNotification(title, message) {
    playSuccessSound();

    // Create Modal HTML
    const modalHtml = `
        <div id="success-modal" class="fixed inset-0 z-[150] flex items-center justify-center bg-black/90 backdrop-blur-md">
            <div class="glass-card max-w-sm w-full text-center p-8 transform scale-100 transition-all">
                <div class="checkmark-circle">
                    <div class="background"></div>
                    <div class="checkmark"></div>
                </div>
                <h3 class="text-2xl font-bold text-white mb-2">${title}</h3>
                <p class="text-gray-300 mb-6">${message}</p>
                <button onclick="document.getElementById('success-modal').remove()" 
                    class="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 px-8 rounded-lg hover:shadow-lg hover:shadow-green-500/30 transition transform hover:-translate-y-1">
                    Done
                </button>
            </div>
        </div>
    `;

    // Append to body
    const div = document.createElement('div');
    div.innerHTML = modalHtml;
    document.body.appendChild(div.firstElementChild);
}
