import { calculateWPM } from "./utils.js";

export function startTimer(elapsedTime, timeDisplay) {
  return setInterval(() => {
    elapsedTime.value++; // Increment the elapsed time by 1 each second

    // Update the stats display
    timeDisplay.textContent = elapsedTime.value;
    calculateWPM();

    // Optionally, you can add a condition to stop the timer after a certain period
    // if (elapsedTime.value >= SOME_TIME_LIMIT) {
    //   clearInterval(updateCallback.interval);
    //   typingArea.contentEditable = 'false'; // Disable editing when time is up
    // }
  }, 1000);
}
