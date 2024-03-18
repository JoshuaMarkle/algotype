document.addEventListener('DOMContentLoaded', function () {
    const displayArea = document.getElementById('display');
    const debuggingArea = document.getElementById('debugging');
    const timeDisplay = document.getElementById('time');
    const wpmDisplay = document.getElementById('wpm');
    const accuracyDisplay = document.getElementById('accuracy');
    const restartButton = document.getElementById('restart');

    let timer = 60;
    let interval;
    let textToType = "This is a sample text for typing test. Type this text as you see it.";
    let words = textToType.split(' ');
    let currentWordIndex = 0;
    let typedText = '';
	let totalCharacterCount = 0;
	let totalCorrectCharacterCount = 0;

    function updateDisplayArea() {
        displayArea.innerHTML = '';
        words.forEach((word, wordIndex) => {
            let wordSpan = document.createElement('span');
            let characters = word.split('');
            characters.forEach((char, charIndex) => {
                let charSpan = document.createElement('span');
                charSpan.textContent = char;

                if (wordIndex < currentWordIndex) {
                    charSpan.style.color = 'black'; // Correctly typed in previous words
                } else if (wordIndex === currentWordIndex) {
                    if (charIndex < typedText.length) {
                        charSpan.style.color = typedText[charIndex] === char ? 'black' : 'red';
                    } else {
                        charSpan.style.color = 'gray'; // Not yet typed
                    }
                } else {
                    charSpan.style.color = 'gray'; // Future words
                }

                wordSpan.appendChild(charSpan);
            });

            // Handle extra characters
            if (wordIndex === currentWordIndex && typedText.length > word.length) {
                for (let i = word.length; i < typedText.length; i++) {
                    let extraCharSpan = document.createElement('span');
                    extraCharSpan.textContent = typedText[i];
                    extraCharSpan.style.color = 'lightcoral'; // Lighter red for extra characters
                    wordSpan.appendChild(extraCharSpan);
                }
            }

            if (wordIndex !== 0) {
                displayArea.appendChild(document.createTextNode(' ')); // Add spaces between words
            }
            displayArea.appendChild(wordSpan);
        });
    }

    function updateDebuggingArea() {
        debuggingArea.innerHTML = totalCorrectCharacterCount.toString() + " / " + totalCharacterCount.toString() + " / " + textToType.length;
    }

    function updateStats() {
        const elapsedTime = 60 - timer;
        const wpm = (totalCorrectCharacterCount / 5) / (elapsedTime / 60);
        const accuracy = (totalCorrectCharacterCount / totalCharacterCount) * 100;

        wpmDisplay.textContent = Math.round(wpm);
        accuracyDisplay.textContent = Math.round(accuracy);
    }

    function startTest() {
        typedText = '';
        currentWordIndex = 0;
		totalCharacterCount = 0;
		totalCorrectCharacterCount = 0;
        timer = 60;
        timeDisplay.textContent = timer;
        wpmDisplay.textContent = 0;
        accuracyDisplay.textContent = 100;

		document.getElementById('input').textContent = ''

        updateDisplayArea();
        updateDebuggingArea();
		updateStats();

        document.addEventListener('keydown', handleTyping);

        interval = setInterval(function () {
            timer--;
            timeDisplay.textContent = timer;

            if (timer === 0) {
                clearInterval(interval);
                document.removeEventListener('keydown', handleTyping);
            }
        }, 1000);
    }

	function handleTyping(event) {
		const key = event.key;
		const currentWord = words[currentWordIndex];
		let preventDefault = false;

		if (key === 'Backspace' && typedText.length > 0) {
			// Remove the last character from the typed text
			typedText = typedText.slice(0, -1);
		} else if (key.length === 1) {
			// Add the typed character to the typed text, including spaces as incorrect characters
			typedText += key;
			if (key === ' ' && typedText.trim() !== currentWord) {
				// Space is considered incorrect if it does not follow the correctly typed word
				preventDefault = true;
			}
		}

		// Move to the next word only if the current word is correctly typed followed by a space
		if (typedText.trim() === currentWord && key === ' ') {
			currentWordIndex++;
			typedText = '';
			// preventDefault = true; // Prevent the space from being added to the new word
		}

		if (preventDefault) {
			event.preventDefault();
		}

		// Update the display and debugging areas
		updateDisplayArea();
		updateDebuggingArea();
		updateStats();

		// Add to allTypedCharacters for accuracy calculation, including spaces as incorrect
		if (key !== 'Backspace' && key !== 'Control' && key !== 'Enter' && key != 'Shift' && key != ' ') {
			totalCharacterCount += 1;

			// If the current character is correct, increment
			if (currentWord.length >= typedText.length && currentWord[typedText.length - 1] === key) {
				totalCorrectCharacterCount += 1;
			}
		}
	}


    restartButton.addEventListener('click', function () {
        clearInterval(interval);
        document.removeEventListener('keydown', handleTyping);
        startTest();
    });

	// Always focus onto the input box
	document.addEventListener('keydown', function(event) {
		// Quick restarts with TAB
		if (event.key === 'Tab') {
			event.preventDefault();
			clearInterval(interval);
			document.removeEventListener('keydown', handleTyping);
			startTest();
		}

		// Focus onto the input box
		if (event.target.tagName !== 'INPUT' && event.target.tagName !== 'TEXTAREA') {
			const inputArea = document.getElementById('input');
			inputArea.focus();
		}
	});

    startTest();
});

