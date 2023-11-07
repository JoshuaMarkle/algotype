import { getCurrentText, timerInterval } from './main.js';

const typingArea = document.getElementById('input-area');
const wpmDisplay = document.getElementById('wpm');
const accuracyDisplay = document.getElementById('accuracy');
const textDisplay = document.getElementById('text-display');

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
    } else if (currentText.slice(0, i).replace(/\t/g, '').length === textEntered.length) { // Is the current character the current cursor position?
      // console.log(currentText.slice(0, i).replace(/\t/g, '').replace(/\n/g, '/n'), "\n\n", textEntered.replace(/\n/g, '/n'), "\n\n", i);
      console.log(enteredIndex, i);
      updatedHTML += `<span class="current">${displayedChar}</span>`;
    } else if (charCorrect === "neutral") {
      updatedHTML += `<span>${displayedChar}</span>`;
    } else {
      updatedHTML += `<span class="${charCorrect}${incorrectWord}">${displayedChar}</span>`;
    }
    newLine ? updatedHTML += `<br>` : "";

    // Skip duplicate newline character in entered text
    while (enteredChar === '\n' && textEntered[enteredIndex] === '\n') {
      console.log("skipping duplicate newline");
      enteredIndex++;
    }
  }

  textDisplay.innerHTML = updatedHTML;

  // Stop the test if the text is fully and correctly entered
  if (wordsEntered.length === words.length && wordsEntered[wordsEntered.length - 1] === words[words.length - 1]) {
    clearInterval(timerInterval);
    typingArea.contentEditable = 'false'; // Disable further typing
  }
}

export function setTextDisplay() {
  const currentText = getCurrentText();
  textDisplay.innerHTML = '';
  let isFirstCharacter = true; // Flag to check if it's the first character

  currentText.split('').forEach(character => {
    const charSpan = document.createElement('span');

    if (isFirstCharacter) {
      charSpan.classList.add('current'); // Apply the cursor style to the first character
      isFirstCharacter = false; // Unset the flag after the first character
    }

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
