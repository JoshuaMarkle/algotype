import { getCurrentText, timerInterval } from './main.js';
import { calculateWPM } from './utils.js';

const typingArea = document.getElementById('input-area');
const wpmDisplay = document.getElementById('wpm');
const accuracyDisplay = document.getElementById('accuracy');
const textDisplay = document.getElementById('text-display');

export function updateTextDisplay() {
  const currentText = getCurrentText();
  const words = currentText.split(/\s+/);
  let textEntered = typingArea.innerText.replace(/\n\n/g, '\n');
  let wordsEntered = textEntered.trim().split(/\s+/);
  
  let enteredIndex = 0;
  let updatedHTML = '';

  enteredIndex = 0;

  // Iterate through words and find incorrect letters within incorrect words
  let incorrectIndices = [];
  for (let i = 0; i < wordsEntered.length - 1; i++) {
    if (wordsEntered[i] !== words[i]) {
      let startIndexOfWord = currentText.indexOf(words[i], enteredIndex);
      for (let j = startIndexOfWord; j < startIndexOfWord + words[i].length; j++) {
        incorrectIndices.push(j);
      }
    }
  }

  enteredIndex = 0; // Reset for next loop

  let skipNums = 0;
  let correctChars = 0;
  for (let i = 0; i < currentText.length; i++) {
    const currentChar = currentText[i];
    const enteredChar = textEntered[enteredIndex] || '';

    // ! If we've reached the end of a word in currentText, check for extra characters in enteredText
    // if (currentChar === ' ' || i === currentText.length - 1) {
    //   let extraChars = '';
    //   while (enteredIndex < textEntered.length && textEntered[enteredIndex] !== ' ' && textEntered[enteredIndex] !== '\n') {
    //     extraChars += `<span class="incorrect">${textEntered[enteredIndex]}</span>`;
    //     enteredIndex++;
    //     skipNums--;
    //   }
    //   updatedHTML += extraChars; // Append any extra characters that were typed
    // }

    // Display characters
    let displayedChar = currentChar;
    if (currentChar === '\n') {
      displayedChar = '↵\n';
    } else if (currentChar === '\t') {
      updatedHTML += `<span>    </span>`;
      skipNums++;
      continue;
    }

    // Check if character is correct
    let charCorrect = "neutral";
    if (enteredChar === currentChar || currentChar === ' ') {
      charCorrect = "correct";
      enteredIndex++;
      correctChars++;
    } else if (enteredChar) {
      charCorrect = "incorrect";
      enteredIndex++;
    } // Else, we haven't typed this character yet

    // Check if within incorrect word
    if (incorrectIndices.includes(i)) {
      charCorrect += "-word";
    }

    // Style this character
    if (textEntered.length === currentText.replace(/\t/g, '').slice(0, i-skipNums).length) { // Current cursor position
      updatedHTML += `<span class="current">${displayedChar}</span>`;
    } else 
    if (charCorrect === "neutral") {
      updatedHTML += `<span>${displayedChar}</span>`;
    } else {
      updatedHTML += `<span class="${charCorrect}">${displayedChar}</span>`;
    }
  }

  textDisplay.innerHTML = updatedHTML;
  const diff = enteredIndex - textEntered.length;
  calculateWPM(correctChars - diff, enteredIndex - diff);

  // Stop the test if the text is fully and correctly entered
  if (textEntered.length >= currentText.replace(/\t/g, '').slice(0, currentText.length-skipNums).length) {
    clearInterval(timerInterval);
    typingArea.contentEditable = 'false'; // Disable further typing
    console.log("Test finished")
  }
}

export function setTextDisplay() {
  const currentText = getCurrentText();
  textDisplay.innerHTML = '';
  currentText.split('').forEach(character => {
    const charSpan = document.createElement('span');

    if (character === '\n') {
      charSpan.innerHTML = '↵\n';
    } else if (character === '\t') {
      charSpan.innerHTML = '    '; // or '→'
      charSpan.classList.add('tab');
    } else {
      charSpan.innerText = character;
    }

    textDisplay.appendChild(charSpan);
  });
}

export function initDisplays() {
  wpmDisplay.textContent = '0';
  accuracyDisplay.textContent = '100';
}
