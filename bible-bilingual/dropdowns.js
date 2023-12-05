// JavaScript
const bookDropdown = document.getElementById('bookDropdown');

// Assuming bookMapping is an array of objects with 'english' and 'chinese' properties
bookMapping.forEach(book => {
  const option = document.createElement('option');
  option.value = book.book; // You might want to use the book number as the value
  option.textContent = `${book.english} - ${book.chinese}`;
  bookDropdown.appendChild(option);
});
