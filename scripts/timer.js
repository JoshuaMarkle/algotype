// timer.js 

export function startTimer(elapsedTime, timeDisplay, typingArea, updateCallback) {
  return setInterval(() => {
    elapsedTime.value++; // Increment the elapsed time by 1 each second
    timeDisplay.textContent = elapsedTime.value; // Update the display

    // Optionally, you can add a condition to stop the timer after a certain period
    // if (elapsedTime.value >= SOME_TIME_LIMIT) {
    //   clearInterval(updateCallback.interval);
    //   typingArea.contentEditable = 'false'; // Disable editing when time is up
    // }

  }, 1000);
}
  