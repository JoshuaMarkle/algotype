import { getCurrentText } from './main.js';

const typingArea = document.getElementById('input-area');
const wpmDisplay = document.getElementById('wpm');
const accuracyDisplay = document.getElementById('accuracy');
const textDisplay = document.getElementById('text-display');

export function calculateWPM(timeRemaining) {
  const textEntered = typingArea.innerText;
  const wordCount = textEntered.trim().split(/\s+/).length;
  const timeSpent = (testDuration - timeRemaining) / 60;
  const wpm = timeSpent > 0 ? (wordCount / timeSpent).toFixed(2) : "0.00";
  wpmDisplay.textContent = wpm;

  // Update accuracy
  const errors = textDisplay.querySelectorAll('.incorrect').length;
  const accuracy = ((textEntered.length - errors) / textEntered.length) * 100;
  accuracyDisplay.textContent = isNaN(accuracy) ? '0.00' : accuracy.toFixed(2);
}

const temp = 1;

export function updateTextDisplay() {
  const currentText = getCurrentText();
  const words = currentText.split(/\s+/);
  let textEntered = typingArea.innerText;
  let wordsEntered = textEntered.trim().split(/\s+/);
  let updatedHTML = '';
  let incorrectIndices = [];

  let enteredIndex = 0;

  // Logic to underline incorrect words
  for (let i = 0; i < wordsEntered.length - 1; i++) {
    if (wordsEntered[i] !== words[i]) {
      let startIndexOfWord = currentText.indexOf(words[i], enteredIndex);
      for (let j = startIndexOfWord; j < startIndexOfWord + words[i].length; j++) {
        incorrectIndices.push(j);
      }
    }
    enteredIndex += wordsEntered[i].length + 1; // Advance enteredIndex by the word length and a space
  }

  enteredIndex = 0; // Reset for next loop

  for (let i = 0; i < currentText.length; i++) {
    const currentChar = currentText[i];
    const enteredChar = textEntered[enteredIndex] || '';

    let displayedChar = currentChar;
    let charCorrect = "neutral"; // "correct", "incorrect", or "neutral
    let newLine = false;

    if (currentChar === ' ' && enteredChar) { // Handle spaces
      enteredIndex++;
    } else if (currentChar === '\n') { // Handle newlines
      displayedChar = '↵';
      newLine = true;
      if (enteredChar === '\n') {
        charCorrect = "correct";
        enteredIndex++;
      } else if (enteredChar) {
        charCorrect = "incorrect";
        enteredIndex++;
      }
    } else if (currentChar === '\t') { // Handle tabs
      displayedChar = '    ';
      // Render tabs but don't allow typing them
      if (textEntered.substr(enteredIndex, 4) === "    ") {
        enteredIndex += 4; // Skip all pasted tabs
      }
    } else { // Handle normal characters
      if (enteredChar === currentChar) {
        charCorrect = "correct";
        enteredIndex++;
      } else if (enteredChar) {
        charCorrect = "incorrect";
        enteredIndex++;
      }
    }

    // Check if within incorrect word
    let incorrectWord = "";
    if (incorrectIndices.includes(i)) {
      incorrectWord = "-word";
    }

    // Display the character
    if ((i - (currentText.slice(0, i).match(/\t/g)?.length || 0)) === textEntered.length) { // Is the current character the current cursor position?
      updatedHTML += `<span class="current">${displayedChar}</span>`;
    } else if (charCorrect === "neutral") {
      updatedHTML += `<span>${displayedChar}</span>`;
    } else {
      updatedHTML += `<span class="${charCorrect}${incorrectWord}">${displayedChar}</span>`;
    }
    newLine ? updatedHTML += `<br>` : "";

    // Skip duplicate newline character in entered text
    while (enteredChar === '\n' && textEntered[enteredIndex] === '\n') {
      enteredIndex++;
    }
  }

  textDisplay.innerHTML = updatedHTML;

  // Stop the test if the text is fully and correctly entered
  if (wordsEntered.length === words.length) {
    clearInterval(timerInterval);
    typingArea.contentEditable = 'false'; // Disable further typing
  }
}

export function setTextDisplay() {
  const currentText = getCurrentText();
  textDisplay.innerHTML = '';
  currentText.split('').forEach(character => {
    const charSpan = document.createElement('span');
    if (character === '\n') {
      charSpan.innerHTML = '↵\n';
    } else
    if (character === '\t') {
      charSpan.innerHTML = '&nbsp;&nbsp;&nbsp;&nbsp;'; // or '→'
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
