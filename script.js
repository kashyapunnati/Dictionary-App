const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

const message = document.getElementById("message");
const result = document.getElementById("result");

const wordElement = document.getElementById("word");
const phoneticElement = document.getElementById("phonetic");
const definitionsElement = document.getElementById("definitions");

const audioBtn = document.getElementById("audioBtn");

let currentWord = "";

searchBtn.addEventListener("click", searchWord);

searchInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        searchWord();
    }
});

async function searchWord() {

    const word = searchInput.value.trim();

    if (word === "") {
        message.textContent = "Please enter a word.";
        result.style.display = "none";
        return;
    }

    message.textContent = "Searching...";
    result.style.display = "none";

    try {

        const apiUrl =
            "https://en.wiktionary.org/api/rest_v1/page/definition/" +
            encodeURIComponent(word);

        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error("Word not found");
        }

        const data = await response.json();

        currentWord = word;

        displayWord(data.en);

        message.textContent = "";
        result.style.display = "block";

    } catch (error) {

        console.error("API Error:", error);

        message.textContent =
            "Word not found. Please check the spelling and try again.";

        result.style.display = "none";
    }
}


function displayWord(entries) {

    wordElement.textContent = currentWord;

    phoneticElement.textContent =
        "Pronunciation: " + currentWord;

    definitionsElement.innerHTML = "";


    entries.forEach(function (entry) {
        const partOfSpeech =
            document.createElement("h3");

        partOfSpeech.className =
            "part-of-speech";

        partOfSpeech.textContent =
            entry.partOfSpeech || "Meaning";

        definitionsElement.appendChild(
            partOfSpeech
        );

        entry.definitions.forEach(function (item) {

            const definitionBox =
                document.createElement("div");

            definitionBox.className =
                "definition";


            const definitionText =
                document.createElement("p");

            definitionText.textContent =
                "• " + removeHTML(item.definition);

            definitionBox.appendChild(
                definitionText
            );

            if (item.examples && item.examples.length > 0) {

                item.examples.forEach(function (exampleItem) {

                    const example =
                        document.createElement("p");

                    example.className =
                        "example";

                    example.textContent =
                        "Example: " +
                       
                    definitionBox.appendChild(
                        example
                    );

                });
            }


            definitionsElement.appendChild(
                definitionBox
            );

        });

    });
}
function removeHTML(text) {

    const temp = document.createElement("div");

    temp.innerHTML = text;

    return temp.textContent || temp.innerText || "";
}


audioBtn.addEventListener("click", function () {

    if (!currentWord) {
        return;
    }

    const speech =
        new SpeechSynthesisUtterance(currentWord);

    speech.lang = "en-US";
    speech.rate = 0.8;

    window.speechSynthesis.cancel();

    window.speechSynthesis.speak(speech);

});