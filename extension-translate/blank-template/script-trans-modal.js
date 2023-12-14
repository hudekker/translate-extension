// Get the modal and gear icon
const modal = document.getElementById("font-modal");
const gearIcon = document.getElementById("gear-icon");
const starModal = document.getElementById("star-modal");
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
  applyColor("lang1Color", "lang1ColorDropdown", ".p.lang1");
  applyColor("lang2Color", "lang2ColorDropdown", ".p.lang2");

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
  var chosenMethod = dropdown.selectedIndex !== -1 ? "dropdown" : "colorPicker";

  if (selectedColor) {
    // Apply the selected color to the relevant elements (modify this based on your structure)
    var elements = document.querySelectorAll(elementSelector);
    elements.forEach(function (element) {
      element.style.color = selectedColor;
    });

    // Save the selected color and chosen method to local storage
    localStorage.setItem(colorPickerId, selectedColor);
    localStorage.setItem(dropdownId, selectedColor);
    localStorage.setItem(colorPickerId + "_method", chosenMethod);
  }
}

// Function to load saved values from local storage
function loadSavedValues() {
  // Load saved title color
  let savedLang1Color = localStorage.getItem("lang1ColorDropdown");

  // Check if there's a saved color; if not, set the default to purple
  if (!savedLang1Color) {
    savedLang1Color = "#bd93f9"; // Set your default color here
  }

  // If there's a saved color, set the dropdown value and apply the color
  document.getElementById("lang1ColorDropdown").value = savedLang1Color;
  applyColor("lang1Color", "lang1ColorDropdown", ".p.lang1");

  // Load saved paragraph color
  let savedLang2Color = localStorage.getItem("lang2ColorDropdown");

  if (!savedLang2Color) {
    savedLang2Color = "#f8f8f2"; // Set your default color here
  }

  document.getElementById("lang2ColorDropdown").value = savedLang2Color;
  applyColor("lang2Color", "lang2ColorDropdown", ".p.lang2");

  // Load saved chosen method for title color
  let savedLang1Method = localStorage.getItem("lang1ColorDropdown_method") || "colorPicker";
  // Add logic to handle the chosen method for the title color as needed

  // Load saved chosen method for paragraph color
  let savedLang2Method = localStorage.getItem("lang2ColorDropdown_method") || "colorPicker";
  // Add logic to handle the chosen method for the paragraph color as needed
}

// Call the function to load saved values on page load
document.addEventListener("DOMContentLoaded", function () {
  // Your code or function call here
  // loadSavedValues();
});

// ...

// Add a reference to the swap colors button
const swapColorsBtn = document.getElementById("swapColorsBtn");

// When the user clicks the swap colors button, swap the colors between "A" and "B" content
swapColorsBtn.onclick = function () {
  // Get the colors of "A" section
  const lang1ColorPicker = document.getElementById("lang1Color");
  const lang1Dropdown = document.getElementById("lang1ColorDropdown");
  const lang1Color = lang1Dropdown.value || lang1ColorPicker.value;

  // Get the colors of "B" section
  const lang2ColorPicker = document.getElementById("lang2Color");
  const lang2Dropdown = document.getElementById("lang2ColorDropdown");
  const lang2Color = lang2Dropdown.value || lang2ColorPicker.value;

  // Swap the colors
  lang1Dropdown.value = lang2Color;
  lang1ColorPicker.value = lang2Color;
  applyColor("lang1Color", "lang1ColorDropdown", ".p.lang1");

  lang2Dropdown.value = lang1Color;
  lang2ColorPicker.value = lang1Color;
  applyColor("lang2Color", "lang2ColorDropdown", ".p.lang2");
};

// ...
