// Open the star icon modal
const openStarModal = () => {
  starModal.style.display = 'block';
  loadTextLines(); // Load text lines from local storage when modal opens
};

// Close the star icon modal
const closeStarModal = () => {
  saveTextLines();
  starModal.style.display = 'none';
};

// Copy selected text line and close the star icon modal
const copyStarModal = () => {
  // Save text lines to local storage when copying
  saveTextLines();

  // Get the selected radio button
  const selectedRadioButton = document.querySelector('input[name="textLines"]:checked');

  // Get the associated textarea value
  const associatedTextareaId = selectedRadioButton.id + 'TextArea';
  const associatedTextarea = document.getElementById(associatedTextareaId);
  const textareaValue = associatedTextarea ? associatedTextarea.value : '';

  // Call copyToClipboard with the textarea value and prependText set to true
  copyToClipboard(true, textareaValue);

  // Close the modal
  closeStarModal();
};

// Function to save text lines and selected radio button to local storage
const saveTextLines = () => {
  const textLines = document.querySelectorAll('.text-line-textarea');
  const linesData = Array.from(textLines).map((textarea) => textarea.value);
  const selectedRadio = document.querySelector('input[name="textLines"]:checked');
  const selectedRadioValue = selectedRadio ? selectedRadio.value : null;

  localStorage.setItem('textLines', JSON.stringify(linesData));
  localStorage.setItem('selectedRadio', selectedRadioValue);
};

// Function to load text lines and selected radio button from local storage
const loadTextLines = () => {
  const textLines = JSON.parse(localStorage.getItem('textLines')) || [];
  const textAreas = document.querySelectorAll('.text-line-textarea');

  // default
  defaultLines = [];
  defaultLines[0] = 'Summarize the top 10 points of this article in both english and chinese';
  defaultLines[1] = 'For this article, describe 10 difficult grammar phrases or usages';
  defaultLines[2] = 'Give me explanation of 10 vocabulary difficulties in this article in both english and chinese';
  defaultLines[3] = 'Summarize 10 points in chinese';
  defaultLines[4] = 'Explain 15 vocabulary chinese words and explain it in chinese';

  // Populate text areas with data from local storage
  textAreas.forEach((textarea, index) => {
    textarea.value = textLines[index] || defaultLines[index];
  });

  // Set the selected radio button based on the stored value, or default to the first one
  const selectedRadioValue = localStorage.getItem('selectedRadio');
  const selectedRadio = document.querySelector(`input[name="textLines"][value="${selectedRadioValue}"]`);

  if (!selectedRadio) {
    // If there is no saved radio button, default to the first one
    const defaultRadio = document.querySelector('input[name="textLines"]:first-child');
    if (defaultRadio) {
      defaultRadio.checked = true;
    }
  } else {
    // Set the saved radio button, whether it's already checked or not
    selectedRadio.checked = true;
  }
};

// Attach event listener to the close (X) button

btnCloseStarModal.addEventListener('click', (event) => {
  event.stopPropagation();
  closeStarModal();
});