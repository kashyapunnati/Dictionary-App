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
            `https://en.wiktionary.org/api/rest_v1/page/definition/${encodeURIComponent(word)}`;

        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error("Word not found");
        }

        const data = await response.json();

        if (!data.en) {
            throw new Error("English definition not found");
        }

        currentWord = word;

        displayWord(data.en);

        message.textContent = "";
        result.style.display = "block";

    } catch (error) {

        console.error(error);

        message.textContent =
            "Word not found. Please check the spelling and try again.";

        result.style.display = "none";
    }
}


function displayWord(entries) {

    wordElement.textContent = currentWord;

    phoneticElement.textContent =
        "Pronunciation available with 🔊";

    definitionsElement.innerHTML = "";


    entries.forEach(function (entry) {

        const partOfSpeech =
            document.createElement("h3");

        partOfSpeech.className = "part-of-speech";

        partOfSpeech.textContent =
            entry.partOfSpeech || "Meaning";

        definitionsElement.appendChild(
            partOfSpeech
        );


        entry.senses.forEach(function (sense) {

            const definitionBox =
                document.createElement("div");

            definitionBox.className = "definition";


            if (sense.glosses) {

                sense.glosses.forEach(function (gloss) {

                    const definitionText =
                        document.createElement("p");

                    definitionText.textContent =
                        "• " + gloss;

                    definitionBox.appendChild(
                        definitionText
                    );

                });
            }


            if (sense.examples) {

                sense.examples.forEach(function (item) {

                    const example =
                        document.createElement("p");

                    example.className = "example";

                    example.textContent =
                        "Example: " +
                        (item.text || item);

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
