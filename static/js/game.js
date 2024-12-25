let attempts = 0;
let gameOver = false;
const MAX_ATTEMPTS = 5;
const emojis = {
    thinking: "🤔",
    high: "⬆️",
    low: "⬇️",
    correct: "🎉",
    wrong: "😢"
};

function updateEmoji(type) {
    const emojiElement = document.getElementById('emoji');
    emojiElement.textContent = emojis[type];
    emojiElement.classList.add('bounce');
    setTimeout(() => emojiElement.classList.remove('bounce'), 500);
}

function makeGuess() {
    const guessInput = document.getElementById('guessInput');
    const guess = parseInt(guessInput.value);
    
    if (isNaN(guess) || guess < 1 || guess > 100) {
        showMessage('Please enter a valid number between 1 and 100!', 'bg-red-100 text-red-700');
        return;
    }

    fetch('/guess', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ guess: guess })
    })
    .then(response => response.json())
    .then(data => {
        attempts = data.attempts;
        updateAttempts(attempts);
        
        const hintContainer = document.getElementById('hintContainer');
        const hint = document.getElementById('hint');
        hintContainer.classList.remove('hidden');
        hintContainer.classList.add('scale-100');

        if (data.gameOver) {
            updateEmoji('wrong');
            showMessage('💔 Game Over! You ran out of attempts!', 'bg-red-100 text-red-700');
            hint.textContent = `The number was ${data.number}`;
            endGame(false);
        } else if (data.result === 'high') {
            updateEmoji('high');
            showMessage('Too High!', 'bg-red-100 text-red-700');
            hint.textContent = `Try a number lower than ${guess}`;
        } else if (data.result === 'low') {
            updateEmoji('low');
            showMessage('Too Low!', 'bg-blue-100 text-blue-700');
            hint.textContent = `Try a number higher than ${guess}`;
        } else {
            updateEmoji('correct');
            showMessage('🎉 Congratulations! You got it! 🎉', 'bg-green-100 text-green-700');
            hint.textContent = `You found the number in ${attempts} attempts!`;
            celebrateWin();
        }

        guessInput.value = '';
        guessInput.focus();
    });
}

function updateAttempts(currentAttempts) {
    document.getElementById('attempts').textContent = currentAttempts;
    const remaining = MAX_ATTEMPTS - currentAttempts;
    document.querySelector('.remaining-attempts').textContent = remaining;
    
    // Update progress bar
    const progressBar = document.getElementById('progress-bar');
    const progressWidth = (remaining / MAX_ATTEMPTS) * 100;
    progressBar.style.width = `${progressWidth}%`;
}

function showMessage(text, colorClass) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = text;
    messageDiv.className = `text-center text-xl font-bold p-4 rounded-xl ${colorClass}`;
    messageDiv.classList.remove('hidden');
}

function celebrateWin() {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, { 
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
            colors: ['#9C27B0', '#E91E63', '#FF9800']
        }));
        confetti(Object.assign({}, defaults, { 
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
            colors: ['#9C27B0', '#E91E63', '#FF9800']
        }));
    }, 250);

    endGame(true);

    // Create extra floating numbers for celebration
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const number = createFloatingNumber();
            number.style.color = 'rgba(255, 215, 0, 0.4)'; // Golden numbers
        }, i * 100);
    }
}

function endGame(won) {
    gameOver = true;
    const guessInput = document.getElementById('guessInput');
    const button = document.querySelector('button');
    
    guessInput.disabled = true;
    guessInput.classList.add('opacity-50');
    
    button.textContent = '🔄 Play Again!';
    button.classList.add('animate-bounce');
    button.onclick = () => window.location.reload();
}

// Add keyboard support
document.getElementById('guessInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && !gameOver) {
        makeGuess();
    }
});

// Floating numbers animation
function createFloatingNumber() {
    const container = document.getElementById('floating-numbers');
    const number = document.createElement('div');
    number.className = 'floating-number';
    
    // Random number between 0 and 100
    number.textContent = Math.floor(Math.random() * 100);
    
    // Random starting position
    const startPos = Math.random() * window.innerWidth;
    number.style.left = `${startPos}px`;
    
    // Random animation duration between 10 and 20 seconds
    const duration = 10 + Math.random() * 10;
    number.style.animationDuration = `${duration}s`;
    
    container.appendChild(number);
    
    // Remove the number after animation completes
    setTimeout(() => {
        number.remove();
    }, duration * 1000);
}

// Create floating numbers periodically
function startFloatingNumbers() {
    // Create initial set of numbers
    for (let i = 0; i < 10; i++) {
        setTimeout(createFloatingNumber, i * 1000);
    }
    
    // Continue creating new numbers
    setInterval(createFloatingNumber, 2000);
}

// Initialize emoji
updateEmoji('thinking');

// Start floating numbers animation
startFloatingNumbers(); 