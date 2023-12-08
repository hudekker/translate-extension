// Get the modal and gear icon
const modal = document.getElementById("font-modal");
const gearIcon = document.getElementById("gear-icon");
const starModal = document.getElementById('star-modal');
const btnCloseGearModal = document.getElementById("btn-close-gear-modal");
const btnCloseStarModal = document.getElementById("btn-close-star-modal");

// When the user clicks the gear icon, display the modal
gearIcon.onclick = function () {
  modal.style.display = "block";
};

// When the user clicks on the close button, close the modal
btnCloseGearModal.onclick = function () {
  modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  switch (event.target) {
    case modal:
      modal.style.display = "none";
      break;
    case starModal:
      closeStarModal();
      break;
    // Add more cases if needed
    default:
      // Default case if the target is not modal or starModal
      break;
  }

};



// Function to apply the selected font colors
function applyFontColors() {
  applyColor('titleColor', 'titleColorDropdown', '.article-title');
  applyColor('paragraphColor', 'paragraphColorDropdown', '.p');

  // Close the modal
  modal.style.display = "none";
}

// Function to apply color to elements
function applyColor(colorPickerId, dropdownId, elementSelector) {
  var colorPicker = document.getElementById(colorPickerId);
  var dropdown = document.getElementById(dropdownId);

  // Get the selected color from either the color picker or the dropdown
  var selectedColor = (dropdown.selectedIndex !== -1 ? dropdown.options[dropdown.selectedIndex].value : null) || colorPicker.value;

  // Determine the chosen method
  var chosenMethod = (dropdown.selectedIndex !== -1 ? 'dropdown' : 'colorPicker');

  if (selectedColor) {
    // Apply the selected color to the relevant elements (modify this based on your structure)
    var elements = document.querySelectorAll(elementSelector);
    elements.forEach(function (element) {
      element.style.color = selectedColor;
    });

    // Save the selected color and chosen method to local storage
    localStorage.setItem(colorPickerId, selectedColor);
    localStorage.setItem(dropdownId, selectedColor);
    localStorage.setItem(colorPickerId + '_method', chosenMethod);
  }
}

// Function to load saved values from local storage
function loadSavedValues() {
  // Load saved title color
  var savedTitleColor = localStorage.getItem('titleColorDropdown');

  // Check if there's a saved color; if not, set the default to purple
  if (!savedTitleColor) {
    savedTitleColor = '#bd93f9'; // Set your default color here
    document.getElementById('titleColorDropdown').value = savedTitleColor;
    applyColor('titleColor', 'titleColorDropdown', '.article-title');
  } else {
    // If there's a saved color, set the dropdown value and apply the color
    document.getElementById('titleColorDropdown').value = savedTitleColor;
    applyColor('titleColor', 'titleColorDropdown', '.article-title');
  }

  // if (savedTitleColor) {
  //   document.getElementById('titleColorDropdown').value = savedTitleColor;
  //   applyColor('titleColor', 'titleColorDropdown', '.article-title');
  // }

  // Load saved paragraph color
  var savedParagraphColor = localStorage.getItem('paragraphColorDropdown');
  if (savedParagraphColor) {
    document.getElementById('paragraphColorDropdown').value = savedParagraphColor;
    applyColor('paragraphColor', 'paragraphColorDropdown', '.p');
  }

  // Load saved chosen method for title color
  var savedTitleMethod = localStorage.getItem('titleColorDropdown_method') || 'colorPicker';
  // Add logic to handle the chosen method for the title color as needed

  // Load saved chosen method for paragraph color
  var savedParagraphMethod = localStorage.getItem('paragraphColorDropdown_method') || 'colorPicker';
  // Add logic to handle the chosen method for the paragraph color as needed
}

// Call the function to load saved values on page load
loadSavedValues();

