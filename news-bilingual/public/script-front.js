document.addEventListener("DOMContentLoaded", function () {
  let inputElement = document.getElementById("urlInput");
  let messagePopup = document.getElementById("messagePopup");

  inputElement.addEventListener("change", function () {
    let inputValue = inputElement.value;
    let urlRegex = /https:\/\/(.+)/;
    let match = inputValue.match(urlRegex);

    if (match) {
      let extractedURL = match[1];
      console.log(extractedURL);
      // You can use extractedURL as needed, for example, update another field or send it to the server.
    } else {
      displayMessage("Invalid URL format");
    }
  });

  function displayMessage(message) {
    messagePopup.innerText = message;
    messagePopup.style.display = "block";

    // Hide the message after 3 seconds (adjust as needed)
    setTimeout(function () {
      messagePopup.style.display = "none";
    }, 3000);
  }
});
