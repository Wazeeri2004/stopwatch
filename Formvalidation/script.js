let a = document.getElementById("loginButton");
let b = document.getElementById("registerButton");
let x = document.getElementById("login");
let y = document.getElementById("register");

function login(){
    x.style.left = "4px";
    y.style.right = "-510px";
    a.className += "whitebutton";
    b.className = "button";
    x.style.opacity = 1;
    y.style.opacity = 0;
}

function register(){
    x.style. left = "-510px";
    y.style.right = "5px";
    a.className = "button";
    b.className += "whitebutton";
    x.style.opacity = 0;
    y.style.opacity = 1;
}

function myMenuFunction(){
    let i = document.getElementById("navMenu")
    if(i.className === "nav-Menu") {
        i.className += " responsive"
    } else{
        i.className = "nav-Menu"
    }
}