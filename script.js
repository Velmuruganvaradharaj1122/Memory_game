const gameBoard = document.getElementById('game-board');
const restartButton = document.getElementById('restart-button');

// Card values for the game (pairs of emojis)
const cardsArray = ['🌟', '🌟', '🌈', '🌈', '🚀', '🚀', '🐱', '🐱', '🍕', '🍕', '🎉', '🎉', '💡', '💡', '❤️', '❤️'];

// Game state variables
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let matchedPairs = 0;

// create and render the cards on the board
function createCards() {
    // Shuffle the cards
    const shuffledCards = shuffleArray(cardsArray);

    // Clear the board for a new game
    gameBoard.innerHTML = '';

    shuffledCards.forEach(cardValue => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.cardValue = cardValue;

        // Create the front and back faces of the card
        const cardFront = document.createElement('div');
        cardFront.classList.add('card-face', 'card-front');
        cardFront.textContent = cardValue;

        const cardBack = document.createElement('div');
        cardBack.classList.add('card-face', 'card-back');
        cardBack.textContent = '?';

        card.appendChild(cardFront);
        card.appendChild(cardBack);

        // Add click event listener to each card
        card.addEventListener('click', flipCard);

        // Add the card to the game board
        gameBoard.appendChild(card);
    });
}

// Fisher-Yates shuffle algorithm to randomize the array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Function to handle card flipping
function flipCard() {
    // If the board is locked or the clicked card is the same as the first card, do nothing
    if (lockBoard || this === firstCard) {
        return;
    }

    // Add the 'flip' 
    this.classList.add('flip');

    // Set the first or second card based on the game state
    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
    } else {
        hasFlippedCard = false;
        secondCard = this;

        // Check for a match
        checkForMatch();
    }
}

// check if the two flipped cards are a match
function checkForMatch() {
    const isMatch = firstCard.dataset.cardValue === secondCard.dataset.cardValue;

    //  disable the cards; otherwise, unflip them
    isMatch ? disableCards() : unflipCards();
}

//  handle a matching pair
function disableCards() {
    matchedPairs++;
    // Remove the event listeners to prevent further clicks on these cards
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    
    // indicate a match
    firstCard.classList.add('match');
    secondCard.classList.add('match');

    // Reset for the next turn
    resetBoard();

    // Check if all pairs have been found
    if (matchedPairs === cardsArray.length / 2) {
        setTimeout(() => {
            // Replace with a custom modal or message
            const messageEl = document.getElementById('message');
            if (messageEl) {
                messageEl.textContent = 'You won! Click Restart to play again.';
            }
        }, 500);
    }
}

//  handle a non-matching pair
function unflipCards() {
    lockBoard = true;

    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');

        // Reset the board state and unlock the board
        resetBoard();
    }, 1000);
}

// reset the game state variables
function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

// restart the entire game
function restartGame() {
    matchedPairs = 0;
    const messageEl = document.getElementById('message');
    if (messageEl) {
        messageEl.textContent = '';
    }
    resetBoard();
    createCards();
}

//  the restart button
restartButton.addEventListener('click', restartGame);

//  cards to start the game
createCards();
