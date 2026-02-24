const loginForm = document.getElementById("login");
const registerForm = document.getElementById("register");
const loginButton = document.getElementById("loginButton");
const registerButton = document.getElementById("registerButton");

function login(){
    loginForm.style.left = "4px";
    registerForm.style.right = "-510px";
    loginButton.className = "button";
    registerButton.className += "button";
    loginForm.style.opacity = 1;
    registerForm.style.opacity = 0;
}

function register(){
    loginForm.style. left = "-510px";
    registerForm.style.right = "5px";
    loginButton.className = "button";
    registerButton.className += "whitebutton";
    loginForm.style.opacity = 0;
    registerForm.style.opacity = 1;
}

function myMenuFunction(){
    const navMenu = document.getElementById("navMenu")
    if(navMenu.className === "nav-Menu") {
        navMenu.className += " responsive"
    } else{
        navMenu.className = "nav-Menu"
    }
}