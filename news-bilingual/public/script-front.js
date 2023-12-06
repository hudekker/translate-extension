let inputElement = document.getElementById("url");
let urlTextarea = document.getElementById("urlTextarea");


document.getElementById("submit-textarea").addEventListener("click", function (event) {
  debugger;
  if (urlTextarea.value === '') {
    event.preventDefault();
    alert('Please enter a URL')
    return;
  }
});

document.getElementById("deleteButton").addEventListener("click", function (event) {
  event.preventDefault();
  // console.log(document.getElementById("urlTextarea").value);
});
document.getElementById("clear").addEventListener("click", function (event) {
  urlTextarea.value = '';
  event.preventDefault();
  // console.log(document.getElementById("urlTextarea").value);
});


document.getElementById('deleteButton').addEventListener('click', function () {
  // Remove an item from local storage

  var titleColorDropdown = localStorage.getItem('titleColorDropdown');
  var paragraphColorDropdown = localStorage.getItem('paragraphColorDropdown');

  localStorage.removeItem('titleColorDropdown');
  localStorage.removeItem('paragraphColorDropdown');
  alert(`deleted titleColorDropdown: ${titleColorDropdown}, paragraphColorDropdown: ${paragraphColorDropdown}`);
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
    return url;
    console.log("URL does not match the expected pattern");
  }
}

inputElement.addEventListener("change", function () {
  let inputValue = inputElement.value;
  // Check if inputValue is not null or undefined

  // try {
  //   let url = new URL(inputValue);
  //   let fullUrl = url.href;
  //   inputElement.value = fullUrl;
  //   console.log(fullUrl);
  // } catch (error) {
  //   console.error("Invalid URL format");
  // }

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
