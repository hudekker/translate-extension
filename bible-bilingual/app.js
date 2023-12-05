// app.js

document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Sample data for illustration purposes
    const englishData = await fetch('eng-net.json').then(response => response.json());
    const chineseData = await fetch('zhTW-union.json').then(response => response.json());

    // Create the book mapping using the function from helperFunctions
    const bookMapping = createBookMapping(englishData.verses, chineseData.verses);

    // Get user input (you can customize this part)
    const selectedBook = prompt('Enter the book name:', 'Genesis');
    const selectedChapter = parseInt(prompt('Enter the chapter number:', '1'), 10);

    // Validate user input
    if (!selectedBook || isNaN(selectedChapter)) {
      throw new Error('Invalid input. Please enter valid book name and chapter number.');
    }

    const bookNumber = findBookNumberFromName(selectedBook, bookMapping);

    // Retrieve verses based on user input
    const englishVerses = getVerses(englishData.verses, bookNumber, selectedChapter);
    const chineseVerses = getVerses(chineseData.verses, bookNumber, selectedChapter);
    const bookRow = findBookName(bookNumber, bookMapping)
    // Display verses on the front end
    displayVerses(bookRow, selectedChapter, englishVerses, chineseVerses);

  } catch (error) {
    console.error('Error:', error.message);
  }
});

// Helper function to display verses on the front end
function displayVerses(bookRow, chapter, englishVerses, chineseVerses) {
  const container = document.getElementById('main-container');

  // Clear previous content
  container.innerHTML = '';

  // Add title for the book and chapter
  const title = document.createElement('h2');
  title.textContent = `${bookRow.english} - ${bookRow.chinese} | Chapter ${chapter}`;
  container.appendChild(title);

  // Create a div for the verses
  const versesContainer = document.createElement('div');
  versesContainer.classList.add('results-container');

  // Display verses in the format: Verse number - English - Chinese
  for (let i = 0; i < englishVerses.length; i++) {
    const verseContainer = document.createElement('div');
    verseContainer.classList.add('verse-container'); // Add the 'verse-container' class

    const englishVerseLine = document.createElement('p');
    const chineseVerseLine = document.createElement('p');

    const englishVerse = englishVerses[i].text;
    const chineseVerse = chineseVerses[i].text.replace(/\s/g, ''); // Remove spaces

    englishVerseLine.textContent = `Verse ${i + 1}: ${englishVerse}`;
    chineseVerseLine.textContent = `${chineseVerse}`;

    // Add CSS classes
    englishVerseLine.classList.add('verse', 'english');
    chineseVerseLine.classList.add('chinese');

    // Append English and Chinese lines to the container
    verseContainer.appendChild(englishVerseLine);
    verseContainer.appendChild(chineseVerseLine);

    // Add the container to the main container
    versesContainer.appendChild(verseContainer);
  }

  // Add verses container to the main container
  container.appendChild(versesContainer);
}


// Helper function to get verses for a specific book and chapter
function getVerses(data, bookNumber, chapter) {
  return data.filter(
    verse => verse.book === bookNumber && verse.chapter === chapter
  );
}
