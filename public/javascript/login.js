// const axios = "https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"
const loginForm = document.getElementById('login-form');
const accessToken = localStorage.getItem('access_token');

if (accessToken) {
  window.location.href = "https://adventor.onrender.com/user-page";
}


loginForm.addEventListener('submit', async (event) => {
  event.preventDefault(); // Prevent form submission


  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const emailError = document.getElementById('email-error');
  const passwordError = document.getElementById('password-error');

  // Reset error messages
  emailError.textContent = '';
  passwordError.textContent = '';

  const email = emailInput.value;
  const password = passwordInput.value;

  fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      if (data.success) {
        const accessToken = data.accessToken;
        localStorage.setItem('access_token', accessToken);
        const redirectUrl = data.redirectUrl;
        console.log(redirectUrl);
        console.log('in the if block');
        window.location.href = redirectUrl;
      } else {
        // Display error message
        emailError.textContent = data.message;
      }
    })
    .catch(error => {
      console.error('Error:', error);
      // Display error message
      emailError.textContent = 'An error occurred. Please try again.';
    });
});




