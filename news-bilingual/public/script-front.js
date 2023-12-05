let inputElement = document.getElementById("url");

inputElement.addEventListener("change", function () {
  let inputValue = inputElement.value;
  // Check if inputValue is not null or undefined
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
