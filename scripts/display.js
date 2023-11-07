import { getCurrentText, timerInterval } from './main.js';

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

  enteredIndex = 0; // Reset for next loop

  // For each display update output textEntered and currentText
  //console.log(textEntered.replace(/\n/g, '/n'), "\n\n", currentText.slice(0, 30).replace(/\t/g, '').replace(/\n/g, '/n'));d

  let skipNums = 0;
  for (let i = 0; i < currentText.length; i++) {
    const currentChar = currentText[i];
    const enteredChar = textEntered[enteredIndex] || '';

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
    if (enteredChar === currentChar) {
      charCorrect = "correct";
      enteredIndex++;
    } else if (enteredChar) {
      charCorrect = "incorrect";
      enteredIndex++;
    } // Else, we haven't typed this character yet

    // Style this character
    if (textEntered.length === currentText.replace(/\t/g, '').slice(0, i-skipNums).length) { // Current cursor position
      //console.log("cursor at", i);
      updatedHTML += `<span class="current">${displayedChar}</span>`;
    } else 
    if (charCorrect === "neutral") {
      updatedHTML += `<span>${displayedChar}</span>`;
    } else {
      updatedHTML += `<span class="${charCorrect}">${displayedChar}</span>`;
    }

    // Skip duplicate newline character in entered text
    // while (enteredChar === '\n' && textEntered[enteredIndex] === '\n') {
    //   console.log("skipping at", enteredIndex, "in entered text");
    //   enteredIndex++;
    // }
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
