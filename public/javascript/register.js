const registerForm = document.getElementById('register-form');

registerForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const usernameInput = document.getElementById('username');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');

  const error = document.getElementById('error_message');


  // Reset error messages
  error.textContent = '';

  const username = usernameInput.value;
  const email = emailInput.value;
  const password = passwordInput.value;

  fetch('/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, email, password })
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        // Display success message
        error.textContent = data.message;
        const redirectUrl = data.redirectUrl;
        setTimeout(() => {
          window.location.href = redirectUrl
        }, 3000);
      } else {
        // Display error message
        error.textContent = data.message
      }
    });
});
