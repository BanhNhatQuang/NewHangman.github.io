import { wordList } from './word-list.js';
const keyboardDiv = document.querySelector(".keyboard");
const guessesText = document.querySelector(".guesses-text b");
const wordDisplay = document.querySelector(".word-display");
const hangmanImage = document.querySelector(".hangman-box img");
const gameModal = document.querySelector(".game-modal");
const playAgainBtn = document.querySelector(".play-again");
const ansText = document.querySelector(".answer")

let currentWord, correctLetters, WrongGuessedCount;
const maxWrongGuessed = 6;
const resetGame = () => {
    usedLetters.clear();
    const buttons = document.querySelectorAll("button[data-key]");
    buttons.forEach(button => {
        button.disabled = false;
    });
    correctLetters = [];
    WrongGuessedCount = 0;
    guessesText.innerText = `${WrongGuessedCount} / ${maxWrongGuessed}`;
    hangmanImage.src = `images/hangman-${WrongGuessedCount}.svg`;
    keyboardDiv.querySelectorAll("button").forEach(btn => btn.disabled = false);
    wordDisplay.innerHTML = currentWord.split("").map(letter => {
        if (letter === " ") {
            correctLetters.push(" ");
            return `<li class="letter guessed"> </li>`;
        } else {
            return `<li class="letter"></li>`;
        }
    }).join("");
    
    gameModal.classList.remove("show");
};

const getRandomWord = () => {
    const {word, hint} = wordList[Math.floor(Math.random() * wordList.length)];
    currentWord = word;
    console.log(word);
    ansText.innerText = currentWord
    const hintContainer = document.querySelector(".hint-text");
    if (hint.startsWith("<img")) {
        hintContainer.innerHTML = hint;
    } else {
        hintContainer.innerText = hint;
    }
    resetGame();
};

const gameOver = (isVictory) => {
    setTimeout(()=>{
        const modalText = isVictory?`You found the word: `:`the correct word was: `;
        gameModal.querySelector("img").src =  `images/${isVictory?'victory':'lost'}.gif`;
        gameModal.querySelector("h4").innerText =  `${isVictory?'Congrats!':'Game Over!'}`;
        gameModal.querySelector("p").innerHTML =  `${modalText} <b>${currentWord}</b>`;
        gameModal.classList.add("show");
    }, 300)
}

const initGame = (button, clickedLetter) => {
    if(currentWord.includes(clickedLetter)){
        [...currentWord].forEach((letter, index) => {
            if(letter === clickedLetter){
                correctLetters.push(letter);
                wordDisplay.querySelectorAll("li")[index].innerText = letter;
                wordDisplay.querySelectorAll("li")[index].classList.add("guessed");
            }
        })
    }else{
        WrongGuessedCount++;
        hangmanImage.src = `images/hangman-${WrongGuessedCount}.svg`;
    }
    button.disabled = true;
    guessesText.innerText = `${WrongGuessedCount} / ${maxWrongGuessed}`;
    if(WrongGuessedCount === maxWrongGuessed) return gameOver(false);
    if(correctLetters.length === currentWord.length) return gameOver(true);
}
const usedLetters = new Set();

document.addEventListener("keydown", event => {
    const key = event.key.toLowerCase();
    if (key >= 'a' && key <= 'z' && !usedLetters.has(key)) { // Check if valid and not used
        const button = document.querySelector(`button[data-key="${key}"]`);
        if (button) {
            initGame(button, key);
            button.classList.add("active");
            setTimeout(() => button.classList.remove("active"), 200);
        }
        usedLetters.add(key);
    }
});

for (let i = 97; i <= 122; i++) {
    const button = document.createElement("button");
    const letter = String.fromCharCode(i);
    button.innerText = letter;
    button.setAttribute("data-key", letter);
    button.disabled = false;
    keyboardDiv.appendChild(button);

    button.addEventListener("click", () => {
        if (!usedLetters.has(letter)) {
            initGame(button, letter);
            button.classList.add("active");
            setTimeout(() => button.classList.remove("active"), 200);
            usedLetters.add(letter);
            button.disabled = true;
        }
    });
}

getRandomWord();
playAgainBtn.addEventListener("click", getRandomWord)