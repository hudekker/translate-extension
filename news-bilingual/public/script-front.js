let inputElement = document.getElementById("url");
let urlTextarea = document.getElementById("urlTextarea");

let btnDelete = document.getElementById('btn-delete');
let btnClear = document.getElementById('btn-clear');
let btnPaste = document.getElementById('btn-paste');
let btnSubmit = document.getElementById('btn-submit');


// function isMobileDevice() {
//   return /Mobi|Android/i.test(navigator.userAgent);
// }
function isMobileDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

console.log(navigator.userAgent);
console.log(isMobileDevice());

// Check if the user is on a mobile device
// if (isMobileDevice()) {
//   btnPaste.classList.add('no-display');
//   alert('mobile device so add no-display for paste button')
// }


btnDelete.addEventListener('click', function () {
  var titleColorDropdown = localStorage.getItem('titleColorDropdown');
  var paragraphColorDropdown = localStorage.getItem('paragraphColorDropdown');

  localStorage.removeItem('titleColorDropdown');
  localStorage.removeItem('paragraphColorDropdown');

  alert(`deleted titleColorDropdown: ${titleColorDropdown}, paragraphColorDropdown: ${paragraphColorDropdown}`);
});

btnClear.addEventListener("click", function (event) {
  urlTextarea.value = '';
  event.preventDefault();
});

btnPaste.addEventListener("click", async function (event) {
  // debugger;
  // urlTextarea.focus();
  // const clipboardText = event.clipboardData.getData('text/plain');
  // urlTextarea.value = clipboardText.trim();

  try {
    debugger;
    const clipboardText = await navigator.clipboard.readText();
    urlTextarea.value = clipboardText.trim();
    urlTextarea.value = extractUrl(urlTextarea.value)
    urlTextarea.value = getLineUrl(urlTextarea.value)

    const checkUrlContainsHttps = (urlValue) => urlValue.includes("https://");
    const isValidUrl = checkUrlContainsHttps(urlTextarea.value);

    if (!isValidUrl) {
      throw new Error("Invalid URL");
    }

  } catch (error) {
    console.error('Error:', error.message);
  }

});



btnSubmit.addEventListener("click", function (event) {

  if (urlTextarea.value === '') {
    event.preventDefault();
    alert('Please enter a URL')
    return;
  }
});

// urlTextarea.addEventListener('paste', (event) => {
//   const clipboardData = (event.clipboardData || window.clipboardData).getData('text/plain');
//   debugger;
//   alert(clipboardData);
//   event.preventDefault();
// });

let extractUrl = (textValue) => {
  if (textValue != null) {
    let urlRegex = /https:\/\/(.+)/;
    let match = textValue.match(urlRegex);

    if (match) {
      let extractedText = decodeURIComponent(match[0]);
      console.log("Corrected URL:", extractedText);
      return extractedText;
    } else {
      console.log("Invalid URL format");
    }
  } else {
    console.log("Input is empty");
  }
}

let getLineUrl = (url) => {
  let regex = /^https:\/\/liff\.line\.me\/[^/]+\/[^/]+\/[^/]+\/([^?]+)/;
  let match = url.match(regex);

  if (match && match[1]) {
    let newLink = `https://today.line.me/tw/v2/article/${match[1]}?utm_source=copyshare`;

    console.log(newLink);
    return newLink;
  } else {
    console.log("URL does not match the expected pattern");
    return url;
  }
}

inputElement.addEventListener("change", function () {
  let inputValue = inputElement.value;

  if (inputValue != null) {
    let urlRegex = /https:\/\/(.+)/;
    let match = inputValue.match(urlRegex);

    if (match) {
      let extractedURL = decodeURIComponent(match[0]);
      inputElement.value = extractedURL;
      console.log("Corrected URL:", inputElement.value);
    } else {
      console.log("Invalid URL format");
    }
  } else {
    console.log("Input is empty");
  }
});

urlTextarea.addEventListener("change", function (event) {

  urlTextarea.value = extractUrl(urlTextarea.value)
  urlTextarea.value = getLineUrl(urlTextarea.value)

  if (urlTextarea.value === '') {
    event.preventDefault();
    alert('Please enter a URL')
    return;
  }
});

// not implemented yet
document.addEventListener("DOMContentLoaded", function () {

  let messagePopup = document.getElementById("messagePopup");

  function displayMessage(message) {
    messagePopup.innerText = message;
    messagePopup.style.display = "block";

    // Hide the message after 3 seconds (adjust as needed)
    setTimeout(function () {
      messagePopup.style.display = "none";
    }, 3000);
  }
});

// Get the radio buttons
const radioButtons = document.querySelectorAll('input[name="translationDirection"]');

// Load saved preference from Local Storage on page load
const savedPreference = localStorage.getItem('translationDirection');
if (savedPreference) {
  // Set the radio button based on the saved preference
  const radioToCheck = document.querySelector(`input[value="${savedPreference}"]`);
  if (radioToCheck) {
    radioToCheck.checked = true;
  }
}

// Add event listeners to radio buttons
radioButtons.forEach((radioButton) => {
  radioButton.addEventListener('change', function () {
    // Save the selected preference to Local Storage
    localStorage.setItem('translationDirection', this.value);
  });
});
