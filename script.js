const wordsearch = document.getElementById('wordsearch');
const searchbtn = document.getElementById('searchbtn');
const resultContainer = document.getElementById('resultContainer');
const wordTtitle = document.getElementById('wordTitle');
const wordDescription = document.getElementById('wordDescription');
const audioButton = document.getElementById('audioButton');

// Search on click
searchbtn.addEventListener('click', () => {
    search();
});

// Search on Enter
wordsearch.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        search();
    }
});

function search() {
    const word = wordsearch.value.trim();
    if (word === '') {
        alert('Please enter a word to search.');
        return;
    }
    fetchDictionaryData(word);
}

async function fetchDictionaryData(word) {
    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        if (!response.ok) {
            throw new Error('Word not found');
        }
        const data = await response.json();
        displayData(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        alert('An error occurred while fetching data.');
    }
}

function displayData(data) {
    resultContainer.style.display = 'block';
    const wordData = data[0];

    wordTtitle.textContent = wordData.word;

    wordDescription.innerHTML = `
        <ul>
            ${wordData.meanings.map(meaning => `
                <li>
                    <p><strong>Part of Speech:</strong> ${meaning.partOfSpeech}</p>

                    <ol>
                        ${meaning.definitions.map(def => `
                            <li>
                                <p><strong>Definition:</strong> ${def.definition}</p>

                                ${def.example ? `<p><strong>Example:</strong> ${def.example}</p>` : ''}

                                ${def.synonyms && def.synonyms.length > 0 
                                    ? `<p><strong>Synonyms:</strong> ${def.synonyms.join(', ')}</p>` 
                                    : ''
                                }
                            </li>
                        `).join('')}
                    </ol>
                </li>
            `).join('')}
        </ul>
    `;
}


// ==================== AUDIO BUTTON FIX ====================
audioButton.addEventListener('click', async () => {
    const word = wordsearch.value.trim();
    if (word === '') {
        alert('Please enter a word first.');
        return;
    }

    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        if (!response.ok) {
            throw new Error("Word not found");
        }

        const data = await response.json();
        const audioURL = data[0].phonetics?.find(p => p.audio)?.audio;

        if (!audioURL) {
            alert("No audio available for this word.");
            return;
        }

        const audio = new Audio(audioURL);
        audio.play();

    } catch (error) {
        console.error("Audio fetch error:", error);
        alert("Error fetching audio. Try again later.");
    }
});
