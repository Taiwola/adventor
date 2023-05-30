document.addEventListener('DOMContentLoaded', () => {
  const access_token = localStorage.getItem('access_token');
  const exploreBtn = document.getElementById('explore-btn');
  const composeBtn = document.getElementById('compose-btn');
  const dropDown = document.getElementById('drop-down');
  const logOut = document.getElementById('log-out');
  const dropMenu = document.getElementById('drop-menu')

  if (!access_token) {
    return window.location.href = 'https://adventor.onrender.com/';
  } else {
    dropMenu.classList.add('visible');
  }

  // get all the user that logged in
  fetch('/api/user/user', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'authorization': `Bearer ${access_token}`
    }
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        const role = data.data.role;
        if (role === 'ADMIN') {
          composeBtn.classList.remove('visible');
          dropDown.classList.add('visible');
          logOut.classList.remove('visible');
        } else if (role === 'USER') {
          exploreBtn.classList.remove('visible');
          dropDown.classList.add('visible');
          logOut.classList.remove('visible');
        } else {
          exploreBtn.classList.remove('visible');
          dropDown.classList.add('visible');
          logOut.classList.remove('visible');
        }
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });

  //post form
  const postForms = document.querySelectorAll('#post-form');
  postForms.forEach((form) => {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const button = form.querySelector('button');
      const postId = form.querySelector('#hidden').value;
      button.textContent = '';

      try {
        const accessToken = localStorage.getItem('access_token');
        const response = await fetch(`/api/post/${postId}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            const status = data.data.status;
            button.textContent = status;
          } else {
            console.log(data.error);
          }
        } else {
          throw new Error('Network response was not ok.');
        }
      } catch (error) {
        console.log('Error:', error);
      }
    });
  });


  // add adventure 
  composeBtn.addEventListener('click', async (event) => {
    fetch('/create-post', {
      method: 'GET',
      headers: {
        'authorization': `Bearer ${access_token}`
      }
    }).then((response) => {
      if (response.ok) {
        window.location.href = 'https://adventor.onrender.com/create-post'
      }
    }).catch(error => console.log('Error', error))
  });

  // log out button
  logOut.addEventListener('click', async (event) => {
    event.preventDefault();

    fetch('/api/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${access_token}`
      }
    }).then((response) => {
      if (response.ok) {
        localStorage.removeItem('access_token');
        window.location.href = 'https://adventor.onrender.com/';
      }
    }).catch(error => console.log('Error', error));
  })

});
