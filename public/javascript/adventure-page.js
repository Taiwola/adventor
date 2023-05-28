document.addEventListener('DOMContentLoaded', ()=> {
    const access_token = localStorage.getItem('access_token');
    const button = document.querySelectorAll('#button');
    const postForms = document.querySelectorAll('#post-form');

    button.forEach(function(button){
        if(!access_token){
            button.classList.add('visible');
        }
    })
})