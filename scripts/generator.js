import { words as pythonWords, algorithms as pythonAlgorithms } from '../data/python.js';
import { words as cppWords, algorithms as cppAlgorithms } from '../data/cpp.js';
import { words as javascriptWords, algorithms as javascriptAlgorithms } from '../data/javascript.js';
import { words as csharpWords, algorithms as csharpAlgorithms } from '../data/csharp.js';


// Function to randomly select a function to type
export function getRandomFunction(gamemode, language) {
  console.log("gamemode:", gamemode, "language:", language)
  let textList = [];
  if (gamemode == "words") {
    if (language == "python") {
      textList = pythonWords;
    } else if (language == "cpp" || language == "c") {
      textList = cppWords;
    } else if (language == "javascript") {
      textList = javascriptWords;
    } else if (language == "csharp") {
      textList = csharpWords;
    }

    let result = "";
    for (let i = 0; i < 30; i++) {
      const randomIndex = Math.floor(Math.random() * textList.length);
      result += textList[randomIndex] + " ";
    }
    return result.trim();
  } else if (gamemode == "algorithms") {
    if (language == "python") {
      textList = pythonAlgorithms;
    } else if (language == "cpp" || language == "c") {
      textList = cppAlgorithms;
    } else if (language == "javascript") {
      textList = javascriptAlgorithms;
    } else if (language == "csharp") {
      textList = csharpAlgorithms;
    }

    // Select a random function from the array
    const randomIndex = Math.floor(Math.random() * textList.length);
    return textList[randomIndex];
  }
}
