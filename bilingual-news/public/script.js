const BASE_URL = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', async function () {
  const urlInput = document.getElementById('urlInput');
  const btnReadUrl = document.getElementById('btn-read-url');


  btnReadUrl.addEventListener('click', async () => {
    const url = urlInput.value;
    await fetch(`${BASE_URL}/read-url`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

  });
});
