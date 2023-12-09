// Function to open the settings modal
function openSettingsModal() {
  document.getElementById('settings-modal').style.display = 'block';
}

// Function to close the settings modal
function closeSettingsModal() {
  document.getElementById('settings-modal').style.display = 'none';
}

// Function to handle logout
function logout() {
  window.location.href = '/logout';
}

function handleImageInputChange() {
  const fileInput = document.getElementById('imageInput');
  const imageUrlInput = document.getElementById('imageUrl');
  const uploadPreview = document.getElementById('backgroundPreview');
  const urlPreview = document.getElementById('urlBackgroundPreview');

  if (fileInput.files && fileInput.files[0]) {
    const reader = new FileReader();

    reader.onload = function (e) {
      uploadPreview.src = e.target.result;
      uploadPreview.style.display = 'block';
    };

    reader.readAsDataURL(fileInput.files[0]);
  }
}

function handleUrlInputChange() {
  const imageUrlInput = document.getElementById('imageUrl');
  const urlPreview = document.getElementById('urlBackgroundPreview');

  if (imageUrlInput.value.trim() !== "") {
    urlPreview.src = imageUrlInput.value;
    urlPreview.style.display = 'block';
  }
}
// Function to handle changes in the radio buttons
function handleRadioChange() {
  const uploadOption = document.getElementById('uploadOption');
  const urlOption = document.getElementById('urlOption');

  // Update the border style for the upload preview
  const uploadPreview = document.getElementById('backgroundPreview');
  uploadPreview.style.border = uploadOption.checked ? '2px solid #00bcd4' : '2px solid transparent';

  // Update the border style for the URL preview
  const urlPreview = document.getElementById('urlBackgroundPreview');
  urlPreview.style.border = urlOption.checked ? '2px solid #00bcd4' : '2px solid transparent';

  // Check which option is selected and update the previews accordingly
  if (uploadOption.checked) {
    handleImageInputChange();
  } else if (urlOption.checked) {
    handleUrlInputChange();
  }
}

function applyBackground() {
  const uploadOption = document.getElementById('uploadOption');
  const backgroundPreviewUpload = document.getElementById('backgroundPreview');
  const backgroundPreviewUrl = document.getElementById('urlBackgroundPreview');

  // Determine the active background preview based on the selected radio button
  const activePreview = uploadOption.checked ? backgroundPreviewUpload : backgroundPreviewUrl;

  // Apply the selected background image as the body background
  const backgroundUrl = activePreview.src;
  document.body.style.backgroundImage = `url('${backgroundUrl}')`;

  // Save preferences to local storage
  savePreferences();
}

function updatePreview() {
  var uploadOption = document.getElementById("uploadOption");
  var imageUrlOption = document.getElementById("urlOption");
  var imageInput = document.getElementById("imageInput");
  var imageUrl = document.getElementById("imageUrl");
  var backgroundPreview = document.getElementById("backgroundPreview");

  // Check which option is selected and update the preview accordingly
  if (uploadOption.checked) {
    const chosenFile = imageInput.files[0];
    if (chosenFile) {
      backgroundPreview.src = URL.createObjectURL(chosenFile);
    }
  } else if (imageUrlOption.checked && imageUrl.value.trim() !== "") {
    backgroundPreview.src = imageUrl.value;
  } else {
    backgroundPreview.src = ""; // Reset preview if no valid option is selected
  }
}

// Save values to local storage
function savePreferences() {
  const backgroundOption = document.getElementById('uploadOption').checked ? 'upload' : 'url';
  const backgroundImage = document.getElementById('backgroundPreview').src
  const backgroundUrl = document.getElementById('imageUrl').value;

  localStorage.setItem('backgroundOption', backgroundOption);
  localStorage.setItem('backgroundImage', backgroundImage);
  localStorage.setItem('backgroundUrl', backgroundUrl);
}

// Load values from local storage
function loadPreferences() {
  // Retrieve background option, value, and file from localStorage
  const backgroundOption = localStorage.getItem('backgroundOption');
  const backgroundImage = localStorage.getItem('backgroundImage');
  const backgroundUrl = localStorage.getItem('backgroundUrl');

  // Set the radio button and preview based on the saved preferences
  if (backgroundOption === 'upload') {
    document.getElementById('uploadOption').checked = true;
  } else if (backgroundOption === 'url') {
    document.getElementById('urlOption').checked = true;
  }

  document.getElementById('backgroundPreview').src = backgroundImage;
  document.getElementById('urlBackgroundPreview').src = backgroundUrl;
  document.getElementById('imageUrl').value = backgroundUrl;

  if (backgroundImage == '') {
    document.getElementById('backgroundPreview').src = `images/front-11.png`
  }

  // Check if the string ends with 'null'
  if (backgroundImage.endsWith('null')) {
    document.getElementById('backgroundPreview').src = `images/front-11.png`
  }

  debugger;

  if (backgroundUrl == '') {
    document.getElementById('urlBackgroundPreview').src = '/images/front-12.png'
  }
}

// Function to create a black placeholder image
function createBlackPlaceholderImage() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = 300; // Set the width as needed
  canvas.height = 300; // Set the height as needed
  ctx.fillStyle = '#000000'; // Set the color to black
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  return canvas.toDataURL();
}

// Add event listeners
// Close the modal when clicking outside of it
window.onclick = function (event) {
  var modal = document.getElementById('settings-modal');
  if (event.target === modal) {
    closeSettingsModal();
  }
};

document.getElementById('uploadOption').addEventListener('change', handleRadioChange);
document.getElementById('urlOption').addEventListener('change', handleRadioChange);

document.getElementById('imageInput').addEventListener('change', handleImageInputChange);
document.getElementById('imageUrl').addEventListener('input', handleUrlInputChange);

document.getElementById('imageInput').addEventListener('change', handleImageInputChange);
document.getElementById('imageUrl').addEventListener('input', handleImageInputChange);

document.addEventListener('DOMContentLoaded', function () {
  // Create and set the placeholder image for upload and URL previews
  const blackPlaceholder = createBlackPlaceholderImage();
  document.getElementById('backgroundPreview').src = blackPlaceholder;
  document.getElementById('urlBackgroundPreview').src = blackPlaceholder;

  loadPreferences();
  applyBackground();
  handleRadioChange();
});

document.getElementById('backgroundPreview').addEventListener('click', function () {
  document.getElementById('uploadOption').checked = true;
  handleRadioChange();
  applyBackground();
});

document.getElementById('urlBackgroundPreview').addEventListener('click', function () {
  document.getElementById('urlOption').checked = true;
  handleRadioChange();
  applyBackground();
});

// Close the modal when clicking outside of it (including touch events)
function closeOnOutsideClick(event) {
  var modal = document.getElementById('settings-modal');
  if (event.target === modal) {
    closeSettingsModal();
  }
}

// Attach both click and touch events to close the modal on outside click
window.addEventListener('click', closeOnOutsideClick);
window.addEventListener('touchend', closeOnOutsideClick);


/////////////////////// Not used ///////////////
// Add this JavaScript code
function uploadServerImage() {
  var fileInput = document.getElementById('imageInput');
  var file = fileInput.files[0];

  if (file) {
    document.getElementById("uploadOption").checked = true;
    var formData = new FormData();
    formData.append('image', file);

    console.log(`sending file ${file} to server`);
    // Send the image to the server using fetch or XMLHttpRequest
    fetch('/upload-image', {
      method: 'POST',
      body: formData,
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          console.log('Image uploaded successfully!');
          console.log(`${data.imageUrl}`);
          // Optionally, update the background image on the front end
          document.body.style.backgroundImage = `url(${data.imageUrl})`;
        } else {
          console.log('Error uploading image.');
        }
      })
      .catch(error => console.error('Error:', error));
  } else {
    alert('Please select an image to upload.');
  }
}


