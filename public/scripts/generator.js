// Function to randomly select array of words to type
export async function getRandomFunction(gamemode, language, numOfWords) {
    const response = await fetch("../data/data.json");
    const data = await response.json();
    let textList = [];
    if (gamemode == "words") {
        if (language == "python") {
            textList = data.python.words;
        } else if (language == "javascript") {
            textList = data.javascript.words;
        } else if (language == "csharp") {
            textList = data.csharp.words;
        } else if (language == "java") {
            textList = data.java.words;
        } else if (language == "cpp") {
            textList = data.cpp.words;
        }

        let result = "";
        for (let i = 0; i < numOfWords - 1; i++) {
            const randomIndex = Math.floor(Math.random() * textList.length);
            result += textList[randomIndex] + " ";
        }
        return result.trim();
    } else if (gamemode == "algorithms") {
        if (language == "python") {
            textList = data.python.algorithms;
        } else if (language == "javascript") {
            textList = data.javascript.algorithms;
        } else if (language == "csharp") {
            textList = data.csharp.algorithms;
        } else if (language == "java") {
            textList = data.java.algorithms;
        } else if (language == "cpp") {
            textList = data.cpp.algorithms;
        }

        // Select a random function from the array
        const randomIndex = Math.floor(Math.random() * textList.length);
        return textList[randomIndex];
    }
}
