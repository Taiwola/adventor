const  axios = "https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js";

const createPost = document.getElementById('createPost');
const accessToken = localStorage.getItem('access_token')


createPost.addEventListener('submit', async (event) => {
    event.preventDefault();
  
    const title = document.getElementById('title').value;
    const fileInput = document.getElementById('file');
    const file = fileInput.files[0];
    const description = document.getElementById('description').value;
    const message = document.getElementById('message');

    console.log(file);
    console.log(description);
    console.log(title);
  
    // Reset message content
    message.textContent = '';
  
    // Check if a file was selected
    if (!file) {
      message.textContent = 'Please select a file.';
      return;
    }
  
    // Create a FormData object and append the file data
    const formData = new FormData();
    formData.append('title', title);
    formData.append('file', file);
    formData.append('description', description);
    console.log(formData);
//     // Convert the FormData object to a string
// const formDataString = Array.from(formData).map(([key, value]) => `${key}=${value}`).join('&');

// // Calculate the size of the FormData string in bytes
// const formDataSizeInBytes = new Blob([formDataString]).size;

// console.log(formDataSizeInBytes);
  
    fetch('/api/post', {
      method: 'POST',
      credentials: 'include',
      body: formData,
      headers: {
        'authorization': `Bearer ${accessToken}`
      }
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          message.textContent = data.message;
        } else {
          message.textContent = data.message;
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  });
  
  
       