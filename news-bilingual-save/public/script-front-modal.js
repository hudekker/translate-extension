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
  // Add any additional logout logic here (e.g., redirecting to the logout route)
  window.location.href = '/logout';
}

// Close the modal when clicking outside of it
window.onclick = function (event) {
  var modal = document.getElementById('settings-modal');
  if (event.target === modal) {
    closeSettingsModal();
  }
};
