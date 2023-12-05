let inputElement = document.getElementById("url");

inputElement.addEventListener("change", function () {
  let inputValue = inputElement.value;
  let urlRegex = /https:\/\/(.+)/;
  let match = inputValue.match(urlRegex);

  if (match) {
    let extractedURL = match[1]; // Use index 1 to get the matched part after "https://"
    inputElement.value = "https://" + extractedURL; // Set the corrected URL back to the input element
    console.log("Corrected URL:", inputElement.value);
  } else {
    console.log("Invalid URL format");
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
