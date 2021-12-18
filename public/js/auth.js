const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

signUpButton.addEventListener('click', () => {
    container.classList.add("right-panel-active");
    const allinputs=document.getElementsByTagName("input");
    for (let i=0;i<allinputs.length;i++){
        allinputs[i].classList.remove('invalid')
    }
});


signInButton.addEventListener('click', () => {
    container.classList.remove("right-panel-active");
    const allinputs=document.getElementsByTagName("input");
    for (let i=0;i<allinputs.length;i++){
        allinputs[i].classList.remove('invalid')
    }
});