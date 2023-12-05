// helper/helperFunctions.js

// Function to create a mapping between book numbers and names
function createBookMapping(englishData, chineseData) {
  const bookMapping = [];

  englishData.forEach((verse) => {
    const { book, book_name } = verse;
    bookMapping.push({
      book,
      english: book_name,
      chinese: findChineseBookName(chineseData, book),
    });
  });

  return bookMapping;
}

// Function to find Chinese book name by book number
function findChineseBookName(chineseData, bookNumber) {
  const chineseVerse = chineseData.find((verse) => verse.book === bookNumber);
  return chineseVerse ? chineseVerse.book_name : 'Not Found';
}

function findBookName(bookNumber, bookMapping) {
  const row = bookMapping.find(el => el.book === bookNumber);

  // If a matching book is found, return its book number
  // Otherwise, return a default value or handle the case as needed
  return row ? row : null;
}

function findBookNumberFromName(bookName, bookMapping) {
  const matchingBook = bookMapping.find(book => book.english === bookName);

  // If a matching book is found, return its book number
  // Otherwise, return a default value or handle the case as needed
  return matchingBook ? matchingBook.book : null;
}


