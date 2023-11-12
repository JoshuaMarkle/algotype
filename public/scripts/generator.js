// Function to randomly select array of words to type
export async function getRandomFunction(gamemode, language) {
  const response = await fetch('../data/data.json');
  const data = await response.json();
  let textList = [];
  if (gamemode == "words") {
    if (language == "python") {
      textList = data.python.words;;
    } else if (language == "javascript") {
      textList = data.javascript.words;
    }

    let result = "";
    for (let i = 0; i < 30; i++) {
      const randomIndex = Math.floor(Math.random() * textList.length);
      result += textList[randomIndex] + " ";
    }
    return result.trim();
  } else if (gamemode == "algorithms") {
    if (language == "python") {
      textList = data.python.algorithms;
    } else if (language == "javascript") {
      textList = data.javascript.algorithms;
    }

    // Select a random function from the array
    const randomIndex = Math.floor(Math.random() * textList.length);
    return textList[randomIndex];
  }
}
