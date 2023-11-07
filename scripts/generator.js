import { words, python, cpp } from '/data/data.js';

// Function to randomly select a function to type
export function getRandomFunction() {
  let textList = python;
  const randomIndex = Math.floor(Math.random() * textList.length);
  return textList[randomIndex];
}
  