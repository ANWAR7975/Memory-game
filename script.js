const board = document.getElementById('game-board');
const timerEl = document.getElementById('timer');
const bestTimeEl = document.getElementById('best-time');
const restartBtn = document.getElementById('restart-btn');
const winMessage = document.getElementById('win-message');

let symbols = ['🍎', '🍌', '🍇', '🍓', '🍉', '🍒', '🍍', '🥝'];
let cards = [];
let flippedCards = [];
let lockBoard = false;
let matchedCount = 0;

let startTime;
let timerInterval;
let bestTime = localStorage.getItem('bestTime') || null;

function initGame() {
  board.innerHTML = '';
  cards = [...symbols, ...symbols];
  shuffle(cards);
  flippedCards = [];
  lockBoard = false;
  matchedCount = 0;
  winMessage.classList.add('hidden');

  cards.forEach(symbol => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.symbol = symbol;
    card.textContent = '';
    card.addEventListener('click', flipCard);
    board.appendChild(card);
  });

  updateBestTime();
  resetTimer();
  startTimer();
}

function flipCard() {
  if (lockBoard || this.classList.contains('flipped') || this.classList.contains('matched')) return;

  this.textContent = this.dataset.symbol;
  this.classList.add('flipped');
  flippedCards.push(this);

  if (flippedCards.length === 2) {
    checkMatch();
  }
}

function checkMatch() {
  const [card1, card2] = flippedCards;
  const isMatch = card1.dataset.symbol === card2.dataset.symbol;

  if (isMatch) {
    card1.classList.add('matched');
    card2.classList.add('matched');
    flippedCards = [];
    matchedCount++;

    if (matchedCount === symbols.length) {
      stopTimer();
      showWinMessage();
      saveBestTime();
    }
  } else {
    lockBoard = true;
    setTimeout(() => {
      card1.classList.remove('flipped');
      card2.classList.remove('flipped');
      card1.textContent = '';
      card2.textContent = '';
      flippedCards = [];
      lockBoard = false;
    }, 1000);
  }
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function startTimer() {
  startTime = Date.now();
  timerInterval = setInterval(() => {
    const seconds = Math.floor((Date.now() - startTime) / 1000);
    timerEl.textContent = `Time: ${seconds}s`;
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function resetTimer() {
  clearInterval(timerInterval);
  timerEl.textContent = 'Time: 0s';
}

function saveBestTime() {
  const finalTime = Math.floor((Date.now() - startTime) / 1000);
  if (!bestTime || finalTime < bestTime) {
    bestTime = finalTime;
    localStorage.setItem('bestTime', bestTime);
    updateBestTime();
  }
}

function updateBestTime() {
  bestTimeEl.textContent = bestTime ? `Best: ${bestTime}s` : 'Best: --';
}

function showWinMessage() {
  winMessage.classList.remove('hidden');
}

restartBtn.addEventListener('click', initGame);

// Start the game
initGame();
